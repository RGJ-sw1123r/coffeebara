package com.coffeebara.cafe.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.coffeebara.cafe.mapper.UserSavedCafeMapper;
import com.coffeebara.cafe.vo.CafeUpsertRequest;
import com.coffeebara.cafe.vo.UserSavedCafeResponse;
import com.coffeebara.cafe.vo.UserSavedCafeSaveRequest;
import com.coffeebara.common.error.ApiException;
import com.coffeebara.kakao.service.KakaoCafeSearchService;

@Service
public class UserSavedCafeService {

	private final UserSavedCafeMapper userSavedCafeMapper;
	private final KakaoCafeSearchService kakaoCafeSearchService;

	public UserSavedCafeService(
		UserSavedCafeMapper userSavedCafeMapper,
		KakaoCafeSearchService kakaoCafeSearchService
	) {
		this.userSavedCafeMapper = userSavedCafeMapper;
		this.kakaoCafeSearchService = kakaoCafeSearchService;
	}

	public List<UserSavedCafeResponse> getSavedCafes(Authentication authentication) {
		Long appUserId = requireMemberUserId(authentication);

		try {
			return userSavedCafeMapper.findSavedCafesByUserId(appUserId).stream()
				.map(this::toResponse)
				.toList();
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "저장한 카페를 불러오지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "USER_SAVED_CAFE_LOOKUP_FAILED", "저장한 카페를 불러오는 중 문제가 발생했습니다.");
		}
	}

	public UserSavedCafeResponse save(Authentication authentication, UserSavedCafeSaveRequest request) {
		Long appUserId = requireMemberUserId(authentication);
		validateRequest(request);

		kakaoCafeSearchService.saveCafe(new CafeUpsertRequest(
			request.kakaoPlaceId(),
			request.name(),
			request.categoryName(),
			request.phone(),
			request.addressName(),
			request.roadAddressName(),
			request.latitude(),
			request.longitude(),
			request.placeUrl()
		));

		String savedType = normalizeSavedType(request.savedType());

		try {
			Map<String, Object> payload = new HashMap<>();
			payload.put("appUserId", appUserId);
			payload.put("kakaoPlaceId", request.kakaoPlaceId());
			payload.put("savedType", savedType);

			try {
				userSavedCafeMapper.insert(payload);
			} catch (DuplicateKeyException exception) {
				userSavedCafeMapper.updateSavedType(appUserId, request.kakaoPlaceId(), savedType);
			}

			return userSavedCafeMapper.findSavedCafesByUserId(appUserId).stream()
				.filter(savedCafe -> request.kakaoPlaceId().equals(String.valueOf(savedCafe.get("kakaoPlaceId"))))
				.findFirst()
				.map(this::toResponse)
				.orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "USER_SAVED_CAFE_NOT_FOUND", "저장한 카페를 확인하지 못했습니다."));
		} catch (CannotAcquireLockException | CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "카페를 저장하지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "USER_SAVED_CAFE_SAVE_FAILED", "카페를 저장하는 중 문제가 발생했습니다.");
		}
	}

	public void delete(Authentication authentication, String placeId) {
		Long appUserId = requireMemberUserId(authentication);
		if (!StringUtils.hasText(placeId)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "PLACE_ID_REQUIRED", "삭제할 카페 ID가 필요합니다.");
		}

		try {
			userSavedCafeMapper.deleteByUserIdAndPlaceId(appUserId, placeId);
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "카페를 삭제하지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "USER_SAVED_CAFE_DELETE_FAILED", "카페를 삭제하는 중 문제가 발생했습니다.");
		}
	}

	private Long requireMemberUserId(Authentication authentication) {
		if (
			authentication == null ||
			authentication instanceof AnonymousAuthenticationToken ||
			!authentication.isAuthenticated()
		) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "로그인이 필요합니다.");
		}

		if (
			!(authentication instanceof OAuth2AuthenticationToken) ||
			!(authentication.getPrincipal() instanceof OAuth2User oAuth2User)
		) {
			throw new ApiException(HttpStatus.FORBIDDEN, "MEMBER_ONLY", "게스트 계정은 서버에 카페를 저장할 수 없습니다.");
		}

		Object userIdValue = oAuth2User.getAttributes().get("coffeebaraUserId");
		if (userIdValue == null) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_USER", "사용자 정보를 확인하지 못했습니다.");
		}

		try {
			return Long.parseLong(String.valueOf(userIdValue));
		} catch (NumberFormatException exception) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_USER", "사용자 정보를 확인하지 못했습니다.");
		}
	}

	private void validateRequest(UserSavedCafeSaveRequest request) {
		if (request == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "REQUEST_REQUIRED", "저장할 카페 정보가 필요합니다.");
		}

		if (!StringUtils.hasText(request.kakaoPlaceId())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "KAKAO_PLACE_ID_REQUIRED", "카페 ID가 필요합니다.");
		}

		if (!StringUtils.hasText(request.name())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "CAFE_NAME_REQUIRED", "카페 이름이 필요합니다.");
		}
	}

	private String normalizeSavedType(String value) {
		String normalized = value == null ? "" : value.trim().toUpperCase();
		return StringUtils.hasText(normalized) ? normalized : "GENERAL";
	}

	private UserSavedCafeResponse toResponse(Map<String, Object> savedCafe) {
		return new UserSavedCafeResponse(
			toLong(savedCafe.get("id")),
			toLong(savedCafe.get("appUserId")),
			toStringValue(savedCafe.get("kakaoPlaceId")),
			toStringValue(savedCafe.get("savedType")),
			toStringValue(savedCafe.get("placeName")),
			toStringValue(savedCafe.get("categoryName")),
			toStringValue(savedCafe.get("phone")),
			toStringValue(savedCafe.get("addressName")),
			toStringValue(savedCafe.get("roadAddressName")),
			toStringValue(savedCafe.get("latitude")),
			toStringValue(savedCafe.get("longitude")),
			toStringValue(savedCafe.get("placeUrl")),
			toDateTimeString(savedCafe.get("createdAt")),
			toDateTimeString(savedCafe.get("updatedAt"))
		);
	}

	private Long toLong(Object value) {
		if (value == null) {
			return null;
		}

		if (value instanceof Number number) {
			return number.longValue();
		}

		return Long.parseLong(String.valueOf(value));
	}

	private String toStringValue(Object value) {
		return value == null ? "" : String.valueOf(value);
	}

	private String toDateTimeString(Object value) {
		if (value == null) {
			return "";
		}

		if (value instanceof LocalDateTime localDateTime) {
			return localDateTime.toString();
		}

		if (value instanceof Timestamp timestamp) {
			return timestamp.toLocalDateTime().toString();
		}

		return String.valueOf(value);
	}
}
