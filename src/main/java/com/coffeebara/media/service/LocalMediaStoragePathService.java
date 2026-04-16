package com.coffeebara.media.service;

import java.nio.file.Path;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.coffeebara.config.MediaStorageProperties;
import com.coffeebara.media.domain.MediaOwnerType;

@Service
public class LocalMediaStoragePathService {

	private final MediaStorageProperties mediaStorageProperties;
	private final Clock clock;

	public LocalMediaStoragePathService(MediaStorageProperties mediaStorageProperties, Clock clock) {
		this.mediaStorageProperties = mediaStorageProperties;
		this.clock = clock;
	}

	public String createStorageKey(String ownerType, String originalFileName) {
		return createStorageKey(ownerType, originalFileName, LocalDate.now(clock), UUID.randomUUID());
	}

	String createStorageKey(
		String ownerType,
		String originalFileName,
		LocalDate today,
		UUID uuid
	) {
		String ownerPrefix = ownerPrefix(ownerType);
		String extension = extractExtension(originalFileName);

		return Path.of(
			ownerPrefix,
			String.format("%04d", today.getYear()),
			String.format("%02d", today.getMonthValue()),
			String.format("%02d", today.getDayOfMonth()),
			uuid + "." + extension
		).toString().replace('\\', '/');
	}

	public Path resolveStoragePath(String storageKey) {
		if (!StringUtils.hasText(storageKey)) {
			throw new IllegalArgumentException("storageKey must not be blank");
		}

		Path root = mediaStorageProperties.storageRootPath().toAbsolutePath().normalize();
		Path resolved = root.resolve(Path.of(storageKey)).normalize();
		if (!resolved.startsWith(root)) {
			throw new IllegalArgumentException("Resolved storage path escapes the configured storage root");
		}

		return resolved;
	}

	public Path resolveStorageDirectory(String storageKey) {
		Path storagePath = resolveStoragePath(storageKey);
		Path parent = storagePath.getParent();
		if (parent == null) {
			throw new IllegalArgumentException("storageKey must include a parent directory");
		}

		return parent;
	}

	private String ownerPrefix(String ownerType) {
		return switch (ownerType) {
			case MediaOwnerType.CAFE_RECORD -> "cafe-record";
			case MediaOwnerType.BEAN_PRODUCT -> "bean-product";
			default -> throw new IllegalArgumentException("Unsupported media owner type: " + ownerType);
		};
	}

	private String extractExtension(String originalFileName) {
		if (!StringUtils.hasText(originalFileName)) {
			return "bin";
		}

		int dotIndex = originalFileName.lastIndexOf('.');
		if (dotIndex < 0 || dotIndex == originalFileName.length() - 1) {
			return "bin";
		}

		String extension = originalFileName.substring(dotIndex + 1)
			.trim()
			.toLowerCase(Locale.ROOT)
			.replaceAll("[^a-z0-9]", "");

		return StringUtils.hasText(extension) ? extension : "bin";
	}
}
