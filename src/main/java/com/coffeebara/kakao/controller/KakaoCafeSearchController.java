package com.coffeebara.kakao.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.coffeebara.cafe.vo.CafeUpsertRequest;
import com.coffeebara.kakao.service.KakaoCafeSearchService;
import com.coffeebara.kakao.vo.KakaoPlaceDocumentsResponseVo;
import com.coffeebara.kakao.vo.KakaoKeywordSearchResponseVo;
import com.coffeebara.kakao.vo.KakaoKeywordSearchResponseVo.KakaoPlaceDocumentVo;

@RestController
@RequestMapping("/api/cafes")
public class KakaoCafeSearchController {

	private static final Logger log = LoggerFactory.getLogger(KakaoCafeSearchController.class);

	private final KakaoCafeSearchService kakaoCafeSearchService;

	public KakaoCafeSearchController(KakaoCafeSearchService kakaoCafeSearchService) {
		this.kakaoCafeSearchService = kakaoCafeSearchService;
	}

	@GetMapping("/search")
	public ResponseEntity<KakaoKeywordSearchResponseVo> searchCafes(
		@RequestParam("query") String query,
		@RequestParam(value = "page", required = false) Integer page,
		@RequestParam(value = "size", required = false) Integer size
	) {
		log.info("GET /api/cafes/search query='{}', page={}, size={}", query, page, size);
		return ResponseEntity.ok(kakaoCafeSearchService.searchCafes(query, page, size));
	}

	@GetMapping("/{placeId}")
	public ResponseEntity<KakaoPlaceDocumentVo> getCafe(
		@PathVariable("placeId") String placeId,
		@RequestParam("query") String query
	) {
		return kakaoCafeSearchService.findCafeById(placeId, query)
			.map(ResponseEntity::ok)
			.orElseThrow(() -> new ResponseStatusException(
				HttpStatus.NOT_FOUND,
				"Cafe not found for placeId=" + placeId
			));
	}

	@PostMapping
	public ResponseEntity<Void> saveCafe(@RequestBody CafeUpsertRequest request) {
		log.info("POST /api/cafes kakaoPlaceId='{}', name='{}'", request.kakaoPlaceId(), request.name());
		kakaoCafeSearchService.saveCafe(request);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping("/map")
	public ResponseEntity<KakaoPlaceDocumentsResponseVo> getVisibleCafes(
		@RequestParam("swLat") double swLat,
		@RequestParam("swLng") double swLng,
		@RequestParam("neLat") double neLat,
		@RequestParam("neLng") double neLng
	) {
		return ResponseEntity.ok(kakaoCafeSearchService.searchCafesInBounds(swLat, swLng, neLat, neLng));
	}

	@GetMapping("/map/search")
	public ResponseEntity<KakaoPlaceDocumentsResponseVo> searchVisibleCafes(
		@RequestParam("query") String query,
		@RequestParam("swLat") double swLat,
		@RequestParam("swLng") double swLng,
		@RequestParam("neLat") double neLat,
		@RequestParam("neLng") double neLng
	) {
		return ResponseEntity.ok(
			kakaoCafeSearchService.searchCafesByKeywordInBounds(query, swLat, swLng, neLat, neLng)
		);
	}
}
