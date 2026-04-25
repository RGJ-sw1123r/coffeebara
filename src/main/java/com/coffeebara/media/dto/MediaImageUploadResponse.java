package com.coffeebara.media.dto;

import java.util.List;

public record MediaImageUploadResponse(
	List<MediaImageUploadItemResponse> files
) {
}
