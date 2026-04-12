package com.coffeebara.auth.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coffeebara.auth.mapper.UserAccountMapper;

@Service
public class KakaoOAuth2UserService extends DefaultOAuth2UserService {

	private static final String AUTH_PROVIDER = "KAKAO";

	private final UserAccountMapper userAccountMapper;

	public KakaoOAuth2UserService(UserAccountMapper userAccountMapper) {
		this.userAccountMapper = userAccountMapper;
	}

	@Override
	@Transactional
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oauth2User = super.loadUser(userRequest);
		Map<String, Object> attributes = oauth2User.getAttributes();
		String providerUserId = asString(attributes.get("id"));

		if (providerUserId.isBlank()) {
			throw new OAuth2AuthenticationException(
				new OAuth2Error("kakao_user_id_missing"),
				"Kakao user id is missing."
			);
		}

		Map<String, Object> properties = asMap(attributes.get("properties"));
		Map<String, Object> kakaoAccount = asMap(attributes.get("kakao_account"));
		Map<String, Object> kakaoProfile = asMap(kakaoAccount.get("profile"));

		String nickname = firstNonBlank(
			asString(properties.get("nickname")),
			asString(kakaoProfile.get("nickname")),
			"kakao_" + providerUserId
		);
		String email = firstNonBlank(
			asString(kakaoAccount.get("email")),
			null
		);
		String profileImageUrl = firstNonBlank(
			asString(kakaoProfile.get("profile_image_url")),
			asString(properties.get("profile_image")),
			asString(properties.get("thumbnail_image")),
			null
		);

		Map<String, Object> userAccount = upsertUserAccount(providerUserId, email, nickname, profileImageUrl);
		String role = firstNonBlank(asString(userAccount.get("role")), "ROLE_USER");

		Map<String, Object> principalAttributes = new LinkedHashMap<>(attributes);
		principalAttributes.put("coffeebaraUserId", userAccount.get("id"));
		principalAttributes.put("authProvider", AUTH_PROVIDER);
		principalAttributes.put("providerUserId", providerUserId);
		principalAttributes.put("nickname", nickname);
		principalAttributes.put("email", email);
		principalAttributes.put("profileImageUrl", profileImageUrl);

		return new DefaultOAuth2User(
			List.of(new SimpleGrantedAuthority(role)),
			principalAttributes,
			"id"
		);
	}

	private Map<String, Object> upsertUserAccount(
		String providerUserId,
		String email,
		String nickname,
		String profileImageUrl
	) {
		Map<String, Object> existing = userAccountMapper.findByProviderUserId(AUTH_PROVIDER, providerUserId);

		if (existing == null) {
			Map<String, Object> insertPayload = new HashMap<>();
			insertPayload.put("authProvider", AUTH_PROVIDER);
			insertPayload.put("providerUserId", providerUserId);
			insertPayload.put("email", nullableIfBlank(email));
			insertPayload.put("nickname", nickname);
			insertPayload.put("displayName", nickname);
			insertPayload.put("profileImageUrl", nullableIfBlank(profileImageUrl));
			insertPayload.put("role", "ROLE_USER");
			userAccountMapper.insert(insertPayload);
		} else {
			Map<String, Object> updatePayload = new HashMap<>();
			updatePayload.put("authProvider", AUTH_PROVIDER);
			updatePayload.put("providerUserId", providerUserId);
			updatePayload.put("email", nullableIfBlank(email));
			updatePayload.put("nickname", nickname);
			updatePayload.put("profileImageUrl", nullableIfBlank(profileImageUrl));
			userAccountMapper.updateProfileAndLastLogin(updatePayload);
		}

		return userAccountMapper.findByProviderUserId(AUTH_PROVIDER, providerUserId);
	}

	@SuppressWarnings("unchecked")
	private Map<String, Object> asMap(Object value) {
		if (value instanceof Map<?, ?> mapValue) {
			return (Map<String, Object>) mapValue;
		}

		return Map.of();
	}

	private String asString(Object value) {
		return value == null ? "" : String.valueOf(value).trim();
	}

	private String firstNonBlank(String... values) {
		for (String value : values) {
			if (value != null && !value.isBlank()) {
				return value;
			}
		}

		return "";
	}

	private String nullableIfBlank(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}

		return value;
	}
}
