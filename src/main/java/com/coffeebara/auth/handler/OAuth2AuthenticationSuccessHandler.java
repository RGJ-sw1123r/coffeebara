package com.coffeebara.auth.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.coffeebara.config.AuthProperties;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	private final AuthProperties authProperties;

	public OAuth2AuthenticationSuccessHandler(AuthProperties authProperties) {
		this.authProperties = authProperties;
	}

	@Override
	public void onAuthenticationSuccess(
		HttpServletRequest request,
		HttpServletResponse response,
		Authentication authentication
	) throws IOException, ServletException {
		response.sendRedirect(normalizeBaseUrl(authProperties.frontendBaseUrl()) + "/");
	}

	private String normalizeBaseUrl(String value) {
		if (value.endsWith("/")) {
			return value.substring(0, value.length() - 1);
		}

		return value;
	}
}
