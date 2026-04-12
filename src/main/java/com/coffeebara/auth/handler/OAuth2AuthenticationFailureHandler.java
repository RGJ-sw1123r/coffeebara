package com.coffeebara.auth.handler;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.coffeebara.config.AuthProperties;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

	private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);

	private final AuthProperties authProperties;

	public OAuth2AuthenticationFailureHandler(AuthProperties authProperties) {
		this.authProperties = authProperties;
	}

	@Override
	public void onAuthenticationFailure(
		HttpServletRequest request,
		HttpServletResponse response,
		AuthenticationException exception
	) throws IOException, ServletException {
		log.error(
			"Kakao OAuth2 login failed. uri={}, message={}",
			request.getRequestURI(),
			exception.getMessage(),
			exception
		);
		response.sendRedirect(normalizeBaseUrl(authProperties.frontendBaseUrl()) + "/login?error=kakao");
	}

	private String normalizeBaseUrl(String value) {
		if (value.endsWith("/")) {
			return value.substring(0, value.length() - 1);
		}

		return value;
	}
}
