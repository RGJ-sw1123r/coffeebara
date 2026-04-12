package com.coffeebara.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.coffeebara.auth.handler.OAuth2AuthenticationFailureHandler;
import com.coffeebara.auth.handler.OAuth2AuthenticationSuccessHandler;
import com.coffeebara.auth.service.KakaoOAuth2UserService;

@Configuration
@EnableConfigurationProperties(AuthProperties.class)
public class SecurityConfig {

	private final KakaoOAuth2UserService kakaoOAuth2UserService;
	private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
	private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

	public SecurityConfig(
		KakaoOAuth2UserService kakaoOAuth2UserService,
		OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
		OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler
	) {
		this.kakaoOAuth2UserService = kakaoOAuth2UserService;
		this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
		this.oAuth2AuthenticationFailureHandler = oAuth2AuthenticationFailureHandler;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(Customizer.withDefaults())
			.formLogin(form -> form.disable())
			.httpBasic(basic -> basic.disable())
			.logout(logout -> logout.disable())
			.oauth2Login(oauth2 -> oauth2
				.userInfoEndpoint(userInfo -> userInfo.userService(kakaoOAuth2UserService))
				.successHandler(oAuth2AuthenticationSuccessHandler)
				.failureHandler(oAuth2AuthenticationFailureHandler)
			)
			.authorizeHttpRequests(authorize -> authorize
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/api/auth/**").permitAll()
				.requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
				.requestMatchers("/api/cafes/**").authenticated()
				.anyRequest().permitAll()
			);

		return http.build();
	}
}
