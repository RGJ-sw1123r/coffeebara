package com.coffeebara.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebara.auth.mapper.UserAccountMapper;
import com.coffeebara.cafe.mapper.UserSavedCafeMapper;
import com.coffeebara.common.error.ApiException;
import com.coffeebara.config.AuthProperties;
import com.coffeebara.config.KakaoLocalProperties;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserAccountMapper userAccountMapper;
	private final UserSavedCafeMapper userSavedCafeMapper;
	private final AuthProperties authProperties;
	private final KakaoLocalProperties kakaoLocalProperties;

	public AuthController(
		UserAccountMapper userAccountMapper,
		UserSavedCafeMapper userSavedCafeMapper,
		AuthProperties authProperties,
		KakaoLocalProperties kakaoLocalProperties
	) {
		this.userAccountMapper = userAccountMapper;
		this.userSavedCafeMapper = userSavedCafeMapper;
		this.authProperties = authProperties;
		this.kakaoLocalProperties = kakaoLocalProperties;
	}

	@PostMapping("/guest")
	public ResponseEntity<AuthStatusResponse> enterAsGuest(HttpServletRequest request) {
		Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
			"guest",
			"N/A",
			List.of(new SimpleGrantedAuthority("ROLE_GUEST"))
		);

		SecurityContext context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authentication);
		SecurityContextHolder.setContext(context);

		HttpSession session = request.getSession(true);
		session.setAttribute(
			HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
			context
		);

		return ResponseEntity.ok(new AuthStatusResponse(true, "guest", "", "guest", "guest", "", "", 0));
	}

	@PostMapping("/logout")
	public ResponseEntity<AuthStatusResponse> logout(HttpServletRequest request) {
		clearSession(request);

		return ResponseEntity.ok(new AuthStatusResponse(false, "", "", "", "", "", "", 0));
	}

	@GetMapping("/logout/kakao-account")
	public void logoutWithKakaoAccount(
		HttpServletRequest request,
		HttpServletResponse response
	) throws IOException {
		clearSession(request);

		String restApiKey = kakaoLocalProperties.restApiKey();
		if (restApiKey == null || restApiKey.isBlank()) {
			response.sendRedirect(normalizeBaseUrl(authProperties.frontendBaseUrl()) + "/login");
			return;
		}

		String logoutRedirectUri = normalizeBaseUrl(authProperties.frontendBaseUrl()) + "/login";
		String encodedRedirectUri = URLEncoder.encode(logoutRedirectUri, StandardCharsets.UTF_8);
		String kakaoLogoutUrl =
			"https://kauth.kakao.com/oauth/logout?client_id=" +
			restApiKey +
			"&logout_redirect_uri=" +
			encodedRedirectUri;

		response.sendRedirect(kakaoLogoutUrl);
	}

	@GetMapping("/status")
	public ResponseEntity<AuthStatusResponse> getAuthStatus(Authentication authentication) {
		if (
			authentication == null ||
			authentication instanceof AnonymousAuthenticationToken ||
			!authentication.isAuthenticated()
		) {
			return ResponseEntity.ok(new AuthStatusResponse(false, "", "", "", "", "", "", 0));
		}

		if (
			authentication instanceof OAuth2AuthenticationToken oAuth2AuthenticationToken &&
			authentication.getPrincipal() instanceof OAuth2User oAuth2User
		) {
			Map<String, Object> attributes = oAuth2User.getAttributes();
			String providerUserId = asString(attributes.get("providerUserId"));
			Map<String, Object> userAccount = userAccountMapper.findByProviderUserId("KAKAO", providerUserId);
			String nickname = asString(attributes.get("nickname"));
			String displayName = userAccount == null
				? nickname
				: firstNonBlank(asString(userAccount.get("displayName")), nickname);
			String profileImageUrl = userAccount == null
				? asString(attributes.get("profileImageUrl"))
				: firstNonBlank(asString(userAccount.get("profileImageUrl")), asString(attributes.get("profileImageUrl")));
			String userId = userAccount == null
				? asString(attributes.get("coffeebaraUserId"))
				: asString(userAccount.get("id"));
			int recordCount = parseUserId(userId) == null
				? 0
				: userSavedCafeMapper.countAllCafeRecordsByUserId(parseUserId(userId));

			return ResponseEntity.ok(
				new AuthStatusResponse(
					true,
					"kakao",
					userId,
					nickname,
					displayName,
					oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(),
					profileImageUrl,
					recordCount
				)
			);
		}

		return ResponseEntity.ok(
			new AuthStatusResponse(
				true,
				String.valueOf(authentication.getName()),
				"",
				String.valueOf(authentication.getName()),
				String.valueOf(authentication.getName()),
				"",
				"",
				0
			)
		);
	}

	@PatchMapping("/profile/display-name")
	public ResponseEntity<AuthStatusResponse> updateDisplayName(
		Authentication authentication,
		@RequestBody UpdateDisplayNameRequest request
	) {
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
			throw new ApiException(
				HttpStatus.FORBIDDEN,
				"PROFILE_EDIT_UNAVAILABLE",
				"게스트 계정은 프로필 이름을 수정할 수 없습니다."
			);
		}

		Long userId = parseUserId(asString(oAuth2User.getAttributes().get("coffeebaraUserId")));
		if (userId == null) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_USER", "사용자 정보를 확인할 수 없습니다.");
		}

		String displayName = normalizeDisplayName(request.displayName());
		int updated = userAccountMapper.updateDisplayNameById(userId, displayName);
		if (updated < 1) {
			throw new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자 정보를 찾을 수 없습니다.");
		}

		Map<String, Object> userAccount = userAccountMapper.findById(userId);
		if (userAccount == null) {
			throw new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자 정보를 찾을 수 없습니다.");
		}

		return ResponseEntity.ok(
			new AuthStatusResponse(
				true,
				"kakao",
				asString(userAccount.get("id")),
				asString(userAccount.get("nickname")),
				firstNonBlank(asString(userAccount.get("displayName")), asString(userAccount.get("nickname"))),
				"kakao",
				asString(userAccount.get("profileImageUrl")),
				userSavedCafeMapper.countAllCafeRecordsByUserId(userId)
			)
		);
	}

	private String asString(Object value) {
		return value == null ? "" : String.valueOf(value);
	}

	private void clearSession(HttpServletRequest request) {
		SecurityContextHolder.clearContext();

		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
		}
	}

	private String normalizeBaseUrl(String value) {
		if (value == null || value.isBlank()) {
			return "http://localhost:3000";
		}

		if (value.endsWith("/")) {
			return value.substring(0, value.length() - 1);
		}

		return value;
	}

	private Long parseUserId(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}

		try {
			return Long.parseLong(value);
		} catch (NumberFormatException exception) {
			return null;
		}
	}

	private String normalizeDisplayName(String value) {
		String normalized = value == null ? "" : value.trim();

		if (normalized.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "DISPLAY_NAME_REQUIRED", "표시 이름을 입력해 주세요.");
		}

		if (normalized.length() > 100) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "DISPLAY_NAME_TOO_LONG", "표시 이름은 100자 이하로 입력해 주세요.");
		}

		return normalized;
	}

	private String firstNonBlank(String... values) {
		for (String value : values) {
			if (value != null && !value.isBlank()) {
				return value;
			}
		}

		return "";
	}

	private record AuthStatusResponse(
		boolean authenticated,
		String mode,
		String userId,
		String nickname,
		String displayName,
		String provider,
		String profileImageUrl,
		int recordCount
	) {
	}

	private record UpdateDisplayNameRequest(
		String displayName
	) {
	}
}
