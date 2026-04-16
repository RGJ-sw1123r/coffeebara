package com.coffeebara.config;

import java.util.List;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties(CorsProperties.class)
public class WebConfig implements WebMvcConfigurer {

	private static final String COFFEEBARA_WARNING_HEADER = "X-Coffeebara-Warning";
	private final CorsProperties corsProperties;

	public WebConfig(CorsProperties corsProperties) {
		this.corsProperties = corsProperties;
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		List<String> allowedOrigins = corsProperties.allowedOrigins();

		if (allowedOrigins == null || allowedOrigins.isEmpty()) {
			return;
		}

		registry.addMapping("/api/**")
			.allowedOrigins(allowedOrigins.toArray(String[]::new))
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
			.exposedHeaders(COFFEEBARA_WARNING_HEADER)
			.allowCredentials(true);
	}
}
