package com.coffeebara.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public record AuthProperties(
	String frontendBaseUrl
) {

	public AuthProperties {
		if (frontendBaseUrl == null || frontendBaseUrl.isBlank()) {
			frontendBaseUrl = "http://localhost:3000";
		}
	}
}
