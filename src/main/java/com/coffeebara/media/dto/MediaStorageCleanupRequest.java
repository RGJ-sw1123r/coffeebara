package com.coffeebara.media.dto;

import java.util.List;

public record MediaStorageCleanupRequest(
	List<String> storageKeys
) {
}
