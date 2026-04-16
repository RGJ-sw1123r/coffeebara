package com.coffeebara.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties(prefix = "app.media")
public record MediaStorageProperties(
	String storageRoot
) {

	public MediaStorageProperties {
		if (!StringUtils.hasText(storageRoot)) {
			throw new IllegalStateException("app.media.storage-root must be configured");
		}
	}

	public Path storageRootPath() {
		return Paths.get(storageRoot).toAbsolutePath().normalize();
	}
}
