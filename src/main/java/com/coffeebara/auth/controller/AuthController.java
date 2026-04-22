package com.coffeebara.auth.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebara.config.AuthProperties;
import com.coffeebara.config.KakaoLocalProperties;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthProperties authProperties;
	private final KakaoLocalProperties kakaoLocalProperties;

	public AuthController(
		AuthProperties authProperties,
		KakaoLocalProperties kakaoLocalProperties
	) {
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
			String nickname = asString(oAuth2User.getAttribute("nickname"));
			String userId = asString(oAuth2User.getAttribute("coffeebaraUserId"));
			String provider = firstNonBlank(
				oAuth2AuthenticationToken.getAuthorizedClientRegistrationId(),
				asString(oAuth2User.getAttribute("authProvider"))
			);
			String profileImageUrl = asString(oAuth2User.getAttribute("profileImageUrl"));

			return ResponseEntity.ok(
				new AuthStatusResponse(
					true,
					"kakao",
					userId,
					nickname,
					nickname,
					provider,
					profileImageUrl,
					0
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
}
