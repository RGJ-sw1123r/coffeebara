package com.coffeebara.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.media.upload")
public record MediaUploadPolicyProperties(
	int maxFilesPerRequest,
	int maxAttachmentsPerRecord,
	int maxAttachmentsPerViewSpotRecord,
	long maxFileSizeBytes,
	long maxRequestSizeBytes
) {
}
