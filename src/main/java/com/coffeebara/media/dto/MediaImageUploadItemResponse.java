package com.coffeebara.media.dto;

public record MediaImageUploadItemResponse(
	String storageKey,
	String originalFileName,
	String contentType,
	long fileSize,
	Integer width,
	Integer height,
	String checksum
) {
}
