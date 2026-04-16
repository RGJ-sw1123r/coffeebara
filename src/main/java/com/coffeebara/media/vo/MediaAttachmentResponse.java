package com.coffeebara.media.vo;

public record MediaAttachmentResponse(
	Long attachmentId,
	Long mediaAssetId,
	String ownerType,
	Long ownerId,
	String attachmentRole,
	Integer sortOrder,
	boolean isCover,
	String storageKey,
	String originalFileName,
	String contentType,
	Long fileSize,
	Integer width,
	Integer height,
	String checksum,
	String createdAt
) {
}
