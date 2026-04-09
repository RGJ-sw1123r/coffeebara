package com.coffeebara.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.search-cache")
public record SearchCacheProperties(
	long ttlSeconds
) {
}
