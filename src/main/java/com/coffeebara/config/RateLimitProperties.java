package com.coffeebara.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(
	long windowSeconds,
	int searchMaxRequests,
	int mapMaxRequests,
	int saveMaxRequests,
	int detailMaxRequests,
	int maxTrackedKeys
) {
}
