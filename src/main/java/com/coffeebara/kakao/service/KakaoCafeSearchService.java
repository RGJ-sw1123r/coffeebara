package com.coffeebara.kakao.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.coffeebara.cafe.domain.CafeCategoryConstants;
import com.coffeebara.cafe.mapper.CafeMapper;
import com.coffeebara.cafe.vo.CafeUpsertRequest;
import com.coffeebara.common.error.ApiException;
import com.coffeebara.common.web.RequestRateLimiter;
import com.coffeebara.config.RateLimitProperties;
import com.coffeebara.config.SearchCacheProperties;
import com.coffeebara.kakao.client.KakaoLocalClient;
import com.coffeebara.kakao.vo.KakaoPlaceDocumentsResponseVo;
import com.coffeebara.kakao.vo.KakaoKeywordSearchResponseVo;
import com.coffeebara.kakao.vo.KakaoKeywordSearchResponseVo.KakaoPlaceDocumentVo;

@Service
public class KakaoCafeSearchService {

	private static final Logger log = LoggerFactory.getLogger(KakaoCafeSearchService.class);

	private static final String CAFE_CATEGORY_GROUP_CODE = CafeCategoryConstants.KAKAO_CAFE_CATEGORY_GROUP_CODE;
	private static final String CAFE_CATEGORY_GROUP_NAME = CafeCategoryConstants.KAKAO_CAFE_CATEGORY_GROUP_NAME;
	private static final int CAFE_DATA_FRESHNESS_DAYS = 30;
	private static final int KAKAO_PAGE_SIZE = 15;
	private static final int MAX_SEARCH_FETCH_PAGE_COUNT = 3;
	private static final int MAX_MAP_FETCH_PAGE_COUNT = 3;
	private static final int MAX_NEARBY_FETCH_PAGE_COUNT = 3;
	private static final int MAX_FIND_BY_ID_FETCH_PAGE_COUNT = 3;
	private static final int MAX_SEARCH_SAVE_COUNT = KAKAO_PAGE_SIZE * MAX_SEARCH_FETCH_PAGE_COUNT;
	private static final double NEARBY_RECT_LAT_DELTA = 0.01d;
	private static final double NEARBY_RECT_LNG_DELTA = 0.01d;
	private static final Pattern NON_LETTER_OR_DIGIT_PATTERN = Pattern.compile("[^\\p{L}\\p{N}]");

	private final KakaoLocalClient kakaoLocalClient;
	private final CafeMapper cafeMapper;
	private final SearchCacheProperties searchCacheProperties;
	private final RateLimitProperties rateLimitProperties;
	private final RequestRateLimiter requestRateLimiter;
	private final Map<String, CachedSearchResponse> searchResponseCache = new ConcurrentHashMap<>();
	private final Map<String, CachedPlaceDocumentsResponse> mapResponseCache = new ConcurrentHashMap<>();
	private final Map<String, CompletableFuture<KakaoKeywordSearchResponseVo>> inFlightSearchResponses = new ConcurrentHashMap<>();

	public KakaoCafeSearchService(
		KakaoLocalClient kakaoLocalClient,
		CafeMapper cafeMapper,
		SearchCacheProperties searchCacheProperties,
		RateLimitProperties rateLimitProperties,
		RequestRateLimiter requestRateLimiter
	) {
		this.kakaoLocalClient = kakaoLocalClient;
		this.cafeMapper = cafeMapper;
		this.searchCacheProperties = searchCacheProperties;
		this.rateLimitProperties = rateLimitProperties;
		this.requestRateLimiter = requestRateLimiter;
	}

	public KakaoKeywordSearchResponseVo searchCafes(String query, Integer page, Integer size) {
		requestRateLimiter.checkLimit(
			"cafes-search",
			rateLimitProperties.searchMaxRequests(),
			"검색 요청이 많습니다. 잠시 후 다시 시도해 주세요."
		);

		Integer sanitizedPage = sanitizePage(page);
		Integer sanitizedSize = sanitizeSize(size);
		if (sanitizedPage == null && sanitizedSize != null) {
			sanitizedPage = 1;
		}

		if (sanitizedSize == null && sanitizedPage != null) {
			sanitizedSize = KAKAO_PAGE_SIZE;
		}

		final Integer resolvedPage = sanitizedPage;
		final Integer resolvedSize = sanitizedSize;
		String cacheKey = buildSearchCacheKey(query, resolvedPage, resolvedSize);
		KakaoKeywordSearchResponseVo cachedResponse = getCachedSearchResponse(cacheKey);
		if (cachedResponse != null) {
			log.info("searchCafes cache hit query='{}' page={} size={}", query, page, size);
			return cachedResponse;
		}

		CompletableFuture<KakaoKeywordSearchResponseVo> inFlightRequest = inFlightSearchResponses.computeIfAbsent(
			cacheKey,
			ignored -> createSearchFuture(query, resolvedPage, resolvedSize)
		);

		try {
			KakaoKeywordSearchResponseVo response = inFlightRequest.join();
			cacheSearchResponse(cacheKey, response);
			return response;
		} catch (CompletionException exception) {
			Throwable cause = exception.getCause();
			if (cause instanceof RuntimeException runtimeException) {
				throw runtimeException;
			}
			throw exception;
		} finally {
			inFlightSearchResponses.remove(cacheKey, inFlightRequest);
		}
	}

	public KakaoPlaceDocumentsResponseVo searchCafesInBounds(
		double swLat,
		double swLng,
		double neLat,
		double neLng
	) {
		requestRateLimiter.checkLimit(
			"cafes-map",
			rateLimitProperties.mapMaxRequests(),
			"지도 검색 요청이 많습니다. 잠시 후 다시 시도해 주세요."
		);

		String cacheKey = buildMapCacheKey(null, swLat, swLng, neLat, neLng);
		KakaoPlaceDocumentsResponseVo cachedResponse = getCachedMapResponse(cacheKey);
		if (cachedResponse != null) {
			log.info("searchCafesInBounds cache hit swLat={} swLng={} neLat={} neLng={}", swLat, swLng, neLat, neLng);
			return cachedResponse;
		}

		String rect = toRect(swLat, swLng, neLat, neLng);
		Map<String, KakaoPlaceDocumentVo> deduplicated = new LinkedHashMap<>();
		int page = 1;

		while (true) {
			KakaoKeywordSearchResponseVo response = kakaoLocalClient.searchByCategory(
				CAFE_CATEGORY_GROUP_CODE,
				page,
				KAKAO_PAGE_SIZE,
				rect
			);

			response.documents().forEach(document -> deduplicated.putIfAbsent(document.id(), document));

			if (response.meta().isEnd() || page >= MAX_MAP_FETCH_PAGE_COUNT) {
				List<KakaoPlaceDocumentVo> cafes = List.copyOf(deduplicated.values());
				saveCafeBatch(cafes);
				KakaoPlaceDocumentsResponseVo result = new KakaoPlaceDocumentsResponseVo(cafes);
				cacheMapResponse(cacheKey, result);
				return result;
			}

			page += 1;
		}
	}

	public KakaoPlaceDocumentsResponseVo searchCafesByKeywordInBounds(
		String query,
		double swLat,
		double swLng,
		double neLat,
		double neLng
	) {
		if (!StringUtils.hasText(query)) {
			throw new IllegalArgumentException("query must not be blank");
		}

		requestRateLimiter.checkLimit(
			"cafes-map-search",
			rateLimitProperties.mapMaxRequests(),
			"지도 검색 요청이 많습니다. 잠시 후 다시 시도해 주세요."
		);

		String cacheKey = buildMapCacheKey(query, swLat, swLng, neLat, neLng);
		KakaoPlaceDocumentsResponseVo cachedResponse = getCachedMapResponse(cacheKey);
		if (cachedResponse != null) {
			log.info(
				"searchCafesByKeywordInBounds cache hit query='{}' swLat={} swLng={} neLat={} neLng={}",
				query,
				swLat,
				swLng,
				neLat,
				neLng
			);
			return cachedResponse;
		}

		String rect = toRect(swLat, swLng, neLat, neLng);
		Map<String, KakaoPlaceDocumentVo> deduplicated = new LinkedHashMap<>();
		int page = 1;

		while (true) {
			KakaoKeywordSearchResponseVo response = kakaoLocalClient.searchByKeyword(
				query,
				page,
				KAKAO_PAGE_SIZE,
				rect,
				CAFE_CATEGORY_GROUP_CODE
			);

			response.documents().forEach(document -> {
				if (CAFE_CATEGORY_GROUP_CODE.equals(document.categoryGroupCode())) {
					deduplicated.putIfAbsent(document.id(), document);
				}
			});

			if (response.meta().isEnd() || page >= MAX_MAP_FETCH_PAGE_COUNT) {
				List<KakaoPlaceDocumentVo> cafes = List.copyOf(deduplicated.values());
				saveCafeBatch(cafes);
				KakaoPlaceDocumentsResponseVo result = new KakaoPlaceDocumentsResponseVo(cafes);
				cacheMapResponse(cacheKey, result);
				return result;
			}

			page += 1;
		}
	}

	public Optional<KakaoPlaceDocumentVo> findCafeById(String placeId, String query) {
		if (!StringUtils.hasText(placeId)) {
			throw new IllegalArgumentException("placeId must not be blank");
		}

		if (!StringUtils.hasText(query)) {
			throw new IllegalArgumentException("query must not be blank");
		}

		requestRateLimiter.checkLimit(
			"cafes-detail",
			rateLimitProperties.detailMaxRequests(),
			"카페 조회 요청이 많습니다. 잠시 후 다시 시도해 주세요."
		);

		Map<String, Object> persistedCafe = findPersistedCafe(placeId);
		if (persistedCafe != null && !isStale(persistedCafe)) {
			return Optional.of(toKakaoPlaceDocument(persistedCafe));
		}

		int page = 1;

		while (true) {
			KakaoKeywordSearchResponseVo response = kakaoLocalClient.searchByKeyword(query, page, 15);
			Optional<KakaoPlaceDocumentVo> matchedCafe = response.documents()
				.stream()
				.filter(document -> CAFE_CATEGORY_GROUP_CODE.equals(document.categoryGroupCode()))
				.filter(document -> Objects.equals(document.id(), placeId))
				.findFirst();

			if (matchedCafe.isPresent()) {
				upsertCafe(matchedCafe.get());
				return matchedCafe;
			}

			if (response.meta().isEnd() || page >= MAX_FIND_BY_ID_FETCH_PAGE_COUNT) {
				return Optional.ofNullable(persistedCafe)
					.map(this::toKakaoPlaceDocument);
			}

			page += 1;
		}
	}

	public void saveCafe(CafeUpsertRequest request) {
		requestRateLimiter.checkLimit(
			"cafes-save",
			rateLimitProperties.saveMaxRequests(),
			"카페 저장 요청이 많습니다. 잠시 후 다시 시도해 주세요."
		);
		validateCafeUpsertRequest(request);
		upsertCafe(toCafeMap(request));
		collectNearbyCandidates(request);
	}

	private boolean isRelevantSearchResult(KakaoPlaceDocumentVo document, String query) {
		String normalizedQuery = normalizeSearchText(query);
		if (!StringUtils.hasText(normalizedQuery)) {
			return true;
		}

		String placeName = normalizeSearchText(document.placeName());
		if (!StringUtils.hasText(placeName)) {
			return false;
		}

		if (placeName.equals(normalizedQuery)) {
			return true;
		}

		if (placeName.startsWith(normalizedQuery)) {
			return true;
		}

		List<String> queryTokens = getSearchTokens(query);
		return queryTokens.size() > 1 && queryTokens.stream().allMatch(placeName::contains);
	}

	private List<KakaoPlaceDocumentVo> filterSearchResultsByPriority(List<KakaoPlaceDocumentVo> cafes, String query) {
		String normalizedQuery = normalizeSearchText(query);
		if (!StringUtils.hasText(normalizedQuery)) {
			return cafes;
		}

		List<KakaoPlaceDocumentVo> exactMatches = cafes.stream()
			.filter(cafe -> normalizeSearchText(cafe.placeName()).equals(normalizedQuery))
			.toList();
		if (!exactMatches.isEmpty()) {
			log.info("filterSearchResultsByPriority query='{}' mode=exact resultCount={}", query, exactMatches.size());
			return exactMatches;
		}

		List<KakaoPlaceDocumentVo> prefixMatches = cafes.stream()
			.filter(cafe -> normalizeSearchText(cafe.placeName()).startsWith(normalizedQuery))
			.toList();
		if (!prefixMatches.isEmpty()) {
			log.info("filterSearchResultsByPriority query='{}' mode=prefix resultCount={}", query, prefixMatches.size());
			return prefixMatches;
		}

		List<KakaoPlaceDocumentVo> tokenMatches = cafes.stream()
			.filter(cafe -> isRelevantSearchResult(cafe, query))
			.toList();
		if (!tokenMatches.isEmpty()) {
			log.info("filterSearchResultsByPriority query='{}' mode=token resultCount={}", query, tokenMatches.size());
			return tokenMatches;
		}

		log.info("filterSearchResultsByPriority query='{}' mode=fallback resultCount={}", query, cafes.size());
		return cafes;
	}

	private CompletableFuture<KakaoKeywordSearchResponseVo> createSearchFuture(
		String query,
		Integer page,
		Integer size
	) {
		try {
			return CompletableFuture.completedFuture(executeSearchCafes(query, page, size));
		} catch (RuntimeException exception) {
			CompletableFuture<KakaoKeywordSearchResponseVo> failedFuture = new CompletableFuture<>();
			failedFuture.completeExceptionally(exception);
			return failedFuture;
		}
	}

	private KakaoKeywordSearchResponseVo executeSearchCafes(String query, Integer page, Integer size) {
		if (page != null || size != null) {
			KakaoKeywordSearchResponseVo response = kakaoLocalClient.searchByKeyword(query, page, size);
			List<KakaoPlaceDocumentVo> cafeDocuments = response.documents()
				.stream()
				.filter(document -> CAFE_CATEGORY_GROUP_CODE.equals(document.categoryGroupCode()))
				.filter(document -> isRelevantSearchResult(document, query))
				.toList();
			log.info("searchCafes paged query='{}' page={} size={} filteredCount={}", query, page, size, cafeDocuments.size());
			saveCafeBatch(cafeDocuments);
			return new KakaoKeywordSearchResponseVo(cafeDocuments, response.meta());
		}

		Map<String, KakaoPlaceDocumentVo> deduplicated = new LinkedHashMap<>();
		int currentPage = 1;
		KakaoKeywordSearchResponseVo lastResponse;

		while (true) {
			lastResponse = kakaoLocalClient.searchByKeyword(query, currentPage, KAKAO_PAGE_SIZE);
			int beforeCount = deduplicated.size();
			lastResponse.documents().stream()
				.filter(document -> CAFE_CATEGORY_GROUP_CODE.equals(document.categoryGroupCode()))
				.forEach(document -> deduplicated.putIfAbsent(document.id(), document));
			int addedCount = deduplicated.size() - beforeCount;
			log.info(
				"searchCafes query='{}' fetchedPage={} addedCount={} accumulatedCount={} isEnd={}",
				query,
				currentPage,
				addedCount,
				deduplicated.size(),
				lastResponse.meta().isEnd()
			);

			if (lastResponse.meta().isEnd() || currentPage >= MAX_SEARCH_FETCH_PAGE_COUNT) {
				List<KakaoPlaceDocumentVo> cafes = filterSearchResultsByPriority(
					List.copyOf(deduplicated.values()),
					query
				);
				saveCafeBatch(cafes);
				return new KakaoKeywordSearchResponseVo(cafes, lastResponse.meta());
			}

			currentPage += 1;
		}
	}

	private void saveCafeBatch(List<KakaoPlaceDocumentVo> cafes) {
		List<KakaoPlaceDocumentVo> selectedCafes = selectCafesForSave(cafes);
		List<Map<String, Object>> cafeMaps = selectedCafes.stream()
			.filter(Objects::nonNull)
			.map(this::toCafeMap)
			.toList();

		if (cafeMaps.isEmpty()) {
			log.info("saveCafeBatch skipped because no cafes were selected for persistence.");
			return;
		}

		log.info("saveCafeBatch totalCandidates={} selectedCount={}", cafes.size(), cafeMaps.size());
		processCafeBatchUpsert(cafeMaps);
	}

	private List<KakaoPlaceDocumentVo> selectCafesForSave(List<KakaoPlaceDocumentVo> cafes) {
		if (cafes.size() <= MAX_SEARCH_SAVE_COUNT) {
			return cafes;
		}

		log.info("selectCafesForSave totalCandidates={} selectedCount={}", cafes.size(), MAX_SEARCH_SAVE_COUNT);
		return cafes.subList(0, MAX_SEARCH_SAVE_COUNT);
	}

	private List<String> getSearchTokens(String value) {
		String normalizedQuery = StringUtils.hasText(value) ? value.trim().toLowerCase() : "";
		if (!StringUtils.hasText(normalizedQuery)) {
			return List.of();
		}

		return Arrays.stream(normalizedQuery.split("\\s+"))
			.map(this::normalizeSearchText)
			.filter(StringUtils::hasText)
			.toList();
	}

	private String buildSearchCacheKey(String query, Integer page, Integer size) {
		return normalizeSearchText(query) + "|" + String.valueOf(page) + "|" + String.valueOf(size);
	}

	private String buildMapCacheKey(
		String query,
		double swLat,
		double swLng,
		double neLat,
		double neLng
	) {
		return "map|"
			+ normalizeSearchText(query)
			+ "|"
			+ roundBoundValue(swLat)
			+ "|"
			+ roundBoundValue(swLng)
			+ "|"
			+ roundBoundValue(neLat)
			+ "|"
			+ roundBoundValue(neLng);
	}

	private KakaoKeywordSearchResponseVo getCachedSearchResponse(String cacheKey) {
		CachedSearchResponse cached = searchResponseCache.get(cacheKey);
		if (cached == null) {
			return null;
		}

		long ttlMillis = Math.max(searchCacheProperties.ttlSeconds(), 0L) * 1000L;
		if (ttlMillis == 0L) {
			searchResponseCache.remove(cacheKey);
			return null;
		}

		if (System.currentTimeMillis() - cached.cachedAtMillis() >= ttlMillis) {
			searchResponseCache.remove(cacheKey);
			return null;
		}

		return cached.response();
	}

	private void cacheSearchResponse(String cacheKey, KakaoKeywordSearchResponseVo response) {
		if (searchCacheProperties.ttlSeconds() <= 0L) {
			return;
		}

		evictSearchCacheEntriesIfNeeded();
		searchResponseCache.put(cacheKey, new CachedSearchResponse(response, System.currentTimeMillis()));
	}

	private KakaoPlaceDocumentsResponseVo getCachedMapResponse(String cacheKey) {
		CachedPlaceDocumentsResponse cached = mapResponseCache.get(cacheKey);
		if (cached == null) {
			return null;
		}

		long ttlMillis = Math.max(searchCacheProperties.ttlSeconds(), 0L) * 1000L;
		if (ttlMillis == 0L) {
			mapResponseCache.remove(cacheKey);
			return null;
		}

		if (System.currentTimeMillis() - cached.cachedAtMillis() >= ttlMillis) {
			mapResponseCache.remove(cacheKey);
			return null;
		}

		return cached.response();
	}

	private void cacheMapResponse(String cacheKey, KakaoPlaceDocumentsResponseVo response) {
		if (searchCacheProperties.ttlSeconds() <= 0L) {
			return;
		}

		evictMapCacheEntriesIfNeeded();
		mapResponseCache.put(cacheKey, new CachedPlaceDocumentsResponse(response, System.currentTimeMillis()));
	}

	private void evictSearchCacheEntriesIfNeeded() {
		int maxEntries = searchCacheProperties.maxEntries();
		if (maxEntries <= 0 || searchResponseCache.size() < maxEntries) {
			return;
		}

		long now = System.currentTimeMillis();
		long ttlMillis = Math.max(searchCacheProperties.ttlSeconds(), 0L) * 1000L;
		searchResponseCache.entrySet().removeIf(entry -> {
			CachedSearchResponse cached = entry.getValue();
			return ttlMillis == 0L || now - cached.cachedAtMillis() >= ttlMillis;
		});

		if (searchResponseCache.size() < maxEntries) {
			return;
		}

		searchResponseCache.entrySet().stream()
			.min(Comparator.comparingLong(entry -> entry.getValue().cachedAtMillis()))
			.map(Map.Entry::getKey)
			.ifPresent(searchResponseCache::remove);
	}

	private void evictMapCacheEntriesIfNeeded() {
		int maxEntries = searchCacheProperties.maxEntries();
		if (maxEntries <= 0 || mapResponseCache.size() < maxEntries) {
			return;
		}

		long now = System.currentTimeMillis();
		long ttlMillis = Math.max(searchCacheProperties.ttlSeconds(), 0L) * 1000L;
		mapResponseCache.entrySet().removeIf(entry -> {
			CachedPlaceDocumentsResponse cached = entry.getValue();
			return ttlMillis == 0L || now - cached.cachedAtMillis() >= ttlMillis;
		});

		if (mapResponseCache.size() < maxEntries) {
			return;
		}

		mapResponseCache.entrySet().stream()
			.min(Comparator.comparingLong(entry -> entry.getValue().cachedAtMillis()))
			.map(Map.Entry::getKey)
			.ifPresent(mapResponseCache::remove);
	}

	private Integer sanitizePage(Integer page) {
		if (page == null) {
			return null;
		}

		return Math.min(Math.max(page, 1), MAX_SEARCH_FETCH_PAGE_COUNT);
	}

	private Integer sanitizeSize(Integer size) {
		if (size == null) {
			return null;
		}

		return Math.min(Math.max(size, 1), KAKAO_PAGE_SIZE);
	}

	private String roundBoundValue(double value) {
		return String.format(java.util.Locale.ROOT, "%.4f", value);
	}

	private void collectNearbyCandidates(CafeUpsertRequest request) {
		Double latitude = parseCoordinate(request.latitude());
		Double longitude = parseCoordinate(request.longitude());

		if (latitude == null || longitude == null) {
			log.info(
				"collectNearbyCandidates skipped because coordinates are missing. kakaoPlaceId={}",
				request.kakaoPlaceId()
			);
			return;
		}

		String rect = toRect(
			latitude - NEARBY_RECT_LAT_DELTA,
			longitude - NEARBY_RECT_LNG_DELTA,
			latitude + NEARBY_RECT_LAT_DELTA,
			longitude + NEARBY_RECT_LNG_DELTA
		);

		Map<String, KakaoPlaceDocumentVo> deduplicated = new LinkedHashMap<>();
		int page = 1;

		while (true) {
			KakaoKeywordSearchResponseVo response = kakaoLocalClient.searchByCategory(
				CAFE_CATEGORY_GROUP_CODE,
				page,
				KAKAO_PAGE_SIZE,
				rect
			);

			response.documents().stream()
				.filter(document -> !Objects.equals(document.id(), request.kakaoPlaceId()))
				.forEach(document -> deduplicated.putIfAbsent(document.id(), document));

			if (response.meta().isEnd() || page >= MAX_NEARBY_FETCH_PAGE_COUNT) {
				List<KakaoPlaceDocumentVo> nearbyCafes = List.copyOf(deduplicated.values());
				saveNearbyCandidateCafes(request.kakaoPlaceId(), nearbyCafes);
				return;
			}

			page += 1;
		}
	}

	private void saveNearbyCandidateCafes(String sourceKakaoPlaceId, List<KakaoPlaceDocumentVo> nearbyCafes) {
		if (nearbyCafes.isEmpty()) {
			log.info("saveNearbyCandidateCafes skipped because no nearby cafes were collected. source={}", sourceKakaoPlaceId);
			return;
		}

		List<Map<String, Object>> cafeMaps = nearbyCafes.stream()
			.map(this::toCafeMap)
			.toList();
		processCafeBatchUpsert(cafeMaps);

		log.info(
			"saveNearbyCandidateCafes source={} nearbyCafeCount={}",
			sourceKakaoPlaceId,
			cafeMaps.size()
		);
	}

	private Double parseCoordinate(String value) {
		if (!StringUtils.hasText(value)) {
			return null;
		}

		try {
			return Double.valueOf(value);
		} catch (NumberFormatException exception) {
			log.warn("Failed to parse coordinate value='{}'", value, exception);
			return null;
		}
	}

	private String normalizeSearchText(String value) {
		if (!StringUtils.hasText(value)) {
			return "";
		}

		String normalized = value.toLowerCase().replaceAll("\\s+", "");
		return NON_LETTER_OR_DIGIT_PATTERN.matcher(normalized).replaceAll("");
	}

	private Map<String, Object> findPersistedCafe(String placeId) {
		try {
			return cafeMapper.findByKakaoPlaceId(placeId);
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(
				HttpStatus.SERVICE_UNAVAILABLE,
				"DB_CONNECTION_FAILED",
				"카페 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
			);
		} catch (DataAccessException exception) {
			throw new ApiException(
				HttpStatus.INTERNAL_SERVER_ERROR,
				"CAFE_LOOKUP_FAILED",
				"카페 정보를 조회하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
			);
		}
	}

	private void upsertCafe(KakaoPlaceDocumentVo document) {
		upsertCafe(toCafeMap(document));
	}

	private void upsertCafe(Map<String, Object> cafe) {
		try {
			int updatedRows = cafeMapper.updateByKakaoPlaceId(cafe);
			if (updatedRows > 0) {
				return;
			}

			try {
				cafeMapper.insert(cafe);
			} catch (DuplicateKeyException exception) {
				cafeMapper.updateByKakaoPlaceId(cafe);
			}
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(
				HttpStatus.SERVICE_UNAVAILABLE,
				"DB_CONNECTION_FAILED",
				"카페 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요."
			);
		} catch (DataAccessException exception) {
			throw new ApiException(
				HttpStatus.INTERNAL_SERVER_ERROR,
				"CAFE_UPSERT_FAILED",
				"카페 정보를 저장하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
			);
		}
	}

	private void processCafeBatchUpsert(List<Map<String, Object>> cafes) {
		for (Map<String, Object> cafe : cafes) {
			try {
				upsertCafe(cafe);
			} catch (ApiException exception) {
				throw exception;
			} catch (RuntimeException exception) {
				log.error("Cafe single-row upsert failed. kakaoPlaceId={}", cafe.get("kakaoPlaceId"), exception);
			}
		}
	}

	private void validateCafeUpsertRequest(CafeUpsertRequest request) {
		if (request == null) {
			throw new IllegalArgumentException("request must not be null");
		}

		if (!StringUtils.hasText(request.kakaoPlaceId())) {
			throw new IllegalArgumentException("kakaoPlaceId must not be blank");
		}

		if (!StringUtils.hasText(request.name())) {
			throw new IllegalArgumentException("name must not be blank");
		}

		if (StringUtils.hasText(request.latitude()) && parseCoordinate(request.latitude()) == null) {
			throw new IllegalArgumentException("latitude must be a valid decimal value");
		}

		if (StringUtils.hasText(request.longitude()) && parseCoordinate(request.longitude()) == null) {
			throw new IllegalArgumentException("longitude must be a valid decimal value");
		}
	}

	private boolean isStale(Map<String, Object> cafe) {
		LocalDateTime nextRefreshAt = toLocalDateTime(cafe.get("nextRefreshAt"));
		if (nextRefreshAt != null) {
			return !nextRefreshAt.isAfter(LocalDateTime.now());
		}

		LocalDateTime lastFetchedAt = toLocalDateTime(cafe.get("lastFetchedAt"));
		return lastFetchedAt == null
			|| !lastFetchedAt.plusDays(CAFE_DATA_FRESHNESS_DAYS).isAfter(LocalDateTime.now());
	}

	private LocalDateTime toLocalDateTime(Object value) {
		if (value == null) {
			return null;
		}

		if (value instanceof LocalDateTime localDateTime) {
			return localDateTime;
		}

		if (value instanceof Timestamp timestamp) {
			return timestamp.toLocalDateTime();
		}

		if (value instanceof java.util.Date date) {
			return Timestamp.from(date.toInstant()).toLocalDateTime();
		}

		if (value instanceof CharSequence text && StringUtils.hasText(text)) {
			return LocalDateTime.parse(text);
		}

		throw new IllegalArgumentException("Unsupported datetime value type: " + value.getClass().getName());
	}

	private Map<String, Object> toCafeMap(KakaoPlaceDocumentVo document) {
		LocalDateTime fetchedAt = LocalDateTime.now();
		Double longitude = parseCoordinate(document.x());
		Double latitude = parseCoordinate(document.y());

		Map<String, Object> cafe = new HashMap<>();
		cafe.put("kakaoPlaceId", document.id());
		cafe.put("placeName", document.placeName());
		cafe.put("categoryName", document.categoryName());
		cafe.put("phone", document.phone());
		cafe.put("addressName", document.addressName());
		cafe.put("roadAddressName", document.roadAddressName());
		cafe.put("longitude", longitude);
		cafe.put("latitude", latitude);
		cafe.put("placeUrl", document.placeUrl());
		cafe.put("lastFetchedAt", fetchedAt);
		cafe.put("nextRefreshAt", fetchedAt.plusDays(CAFE_DATA_FRESHNESS_DAYS));
		return cafe;
	}

	private Map<String, Object> toCafeMap(CafeUpsertRequest request) {
		LocalDateTime fetchedAt = LocalDateTime.now();
		Double longitude = parseCoordinate(request.longitude());
		Double latitude = parseCoordinate(request.latitude());

		Map<String, Object> cafe = new HashMap<>();
		cafe.put("kakaoPlaceId", request.kakaoPlaceId());
		cafe.put("placeName", request.name());
		cafe.put("categoryName", request.categoryName());
		cafe.put("phone", request.phone());
		cafe.put("addressName", request.addressName());
		cafe.put("roadAddressName", request.roadAddressName());
		cafe.put("longitude", longitude);
		cafe.put("latitude", latitude);
		cafe.put("placeUrl", request.placeUrl());
		cafe.put("lastFetchedAt", fetchedAt);
		cafe.put("nextRefreshAt", fetchedAt.plusDays(CAFE_DATA_FRESHNESS_DAYS));
		return cafe;
	}

	private KakaoPlaceDocumentVo toKakaoPlaceDocument(Map<String, Object> cafe) {
		return new KakaoPlaceDocumentVo(
			toStringValue(cafe.get("kakaoPlaceId")),
			toStringValue(cafe.get("addressName")),
			toStringValueOrDefault(cafe.get("categoryGroupCode"), CAFE_CATEGORY_GROUP_CODE),
			toStringValueOrDefault(cafe.get("categoryGroupName"), CAFE_CATEGORY_GROUP_NAME),
			toStringValue(cafe.get("categoryName")),
			null,
			toStringValue(cafe.get("phone")),
			toStringValue(cafe.get("placeName")),
			toStringValue(cafe.get("placeUrl")),
			toStringValue(cafe.get("roadAddressName")),
			toStringValue(cafe.get("longitude")),
			toStringValue(cafe.get("latitude"))
		);
	}

	private String toStringValue(Object value) {
		return value == null ? null : String.valueOf(value);
	}

	private String toStringValueOrDefault(Object value, String defaultValue) {
		String stringValue = toStringValue(value);
		return StringUtils.hasText(stringValue) ? stringValue : defaultValue;
	}

	private String toRect(double swLat, double swLng, double neLat, double neLng) {
		if (swLat > neLat || swLng > neLng) {
			throw new IllegalArgumentException("Invalid map bounds");
		}

		return swLng + "," + swLat + "," + neLng + "," + neLat;
	}

	private record CachedSearchResponse(
		KakaoKeywordSearchResponseVo response,
		long cachedAtMillis
	) {
	}

	private record CachedPlaceDocumentsResponse(
		KakaoPlaceDocumentsResponseVo response,
		long cachedAtMillis
	) {
	}
}
