package com.coffeebara.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties({
	KakaoLocalProperties.class,
	SearchCacheProperties.class,
	RateLimitProperties.class
})
public class KakaoLocalConfig {

	private static final String PLACEHOLDER_API_KEY = "YOUR_KAKAO_REST_API_KEY";

	@Bean
	RestClient.Builder restClientBuilder() {
		return RestClient.builder();
	}

	@Bean
	RestClient kakaoLocalRestClient(
		RestClient.Builder restClientBuilder,
		KakaoLocalProperties kakaoLocalProperties
	) {
		if (!StringUtils.hasText(kakaoLocalProperties.baseUrl())) {
			throw new IllegalStateException("kakao.local.base-url must be configured");
		}

		if (!StringUtils.hasText(kakaoLocalProperties.restApiKey())
			|| PLACEHOLDER_API_KEY.equals(kakaoLocalProperties.restApiKey())) {
			throw new IllegalStateException("kakao.local.rest-api-key must be configured");
		}

		return restClientBuilder
			.baseUrl(kakaoLocalProperties.baseUrl())
			.defaultHeader(
				HttpHeaders.AUTHORIZATION,
				"KakaoAK " + kakaoLocalProperties.restApiKey()
			)
			.build();
	}
}
