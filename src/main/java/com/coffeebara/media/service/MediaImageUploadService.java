package com.coffeebara.media.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.imageio.ImageIO;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.coffeebara.config.MediaUploadPolicyProperties;
import com.coffeebara.media.domain.MediaOwnerType;
import com.coffeebara.media.dto.MediaImageUploadItemResponse;

@Service
public class MediaImageUploadService {

	private static final Set<String> ALLOWED_IMAGE_CONTENT_TYPES = Set.of(
		"image/jpeg",
		"image/png",
		"image/webp"
	);

	private final MediaUploadPolicyProperties mediaUploadPolicyProperties;
	private final LocalMediaStoragePathService localMediaStoragePathService;
	private final Tika tika = new Tika();

	public MediaImageUploadService(
		MediaUploadPolicyProperties mediaUploadPolicyProperties,
		LocalMediaStoragePathService localMediaStoragePathService
	) {
		this.mediaUploadPolicyProperties = mediaUploadPolicyProperties;
		this.localMediaStoragePathService = localMediaStoragePathService;
	}

	public MediaImageUploadItemResponse storeImage(MultipartFile file) throws IOException {
		byte[] bytes = file.getBytes();
		String originalFileName = StringUtils.hasText(file.getOriginalFilename())
			? file.getOriginalFilename().trim()
			: "upload.bin";
		String detectedContentType = normalizeContentType(tika.detect(bytes, originalFileName));
		if (!ALLOWED_IMAGE_CONTENT_TYPES.contains(detectedContentType)) {
			throw new UnsupportedImageTypeException();
		}

		String storageKey = localMediaStoragePathService.createStorageKey(
			MediaOwnerType.CAFE_RECORD,
			originalFileName
		);
		Path storagePath = localMediaStoragePathService.resolveStoragePath(storageKey);
		Files.createDirectories(storagePath.getParent());
		Files.write(storagePath, bytes);

		ImageDimensions dimensions = extractDimensions(bytes);
		return new MediaImageUploadItemResponse(
			storageKey,
			originalFileName,
			detectedContentType,
			bytes.length,
			dimensions.width(),
			dimensions.height(),
			calculateChecksum(bytes)
		);
	}

	public void validateUploadRequest(List<MultipartFile> files) {
		if (files == null || files.isEmpty()) {
			throw new InvalidUploadRequestException(
				"FILES_REQUIRED",
				"At least one image file is required."
			);
		}

		if (files.size() > mediaUploadPolicyProperties.maxFilesPerRequest()) {
			throw new InvalidUploadRequestException(
				"TOO_MANY_FILES_IN_REQUEST",
				"Too many files were uploaded at once."
			);
		}

		long totalSize = 0L;
		for (MultipartFile file : files) {
			if (file == null || file.isEmpty()) {
				throw new InvalidUploadRequestException(
					"EMPTY_FILE_NOT_ALLOWED",
					"Empty files are not allowed."
				);
			}

			totalSize += file.getSize();
			if (file.getSize() > mediaUploadPolicyProperties.maxFileSizeBytes()) {
				throw new InvalidUploadRequestException(
					"FILE_SIZE_LIMIT_EXCEEDED",
					"Each file must be 15MB or smaller."
				);
			}
		}

		if (totalSize > mediaUploadPolicyProperties.maxRequestSizeBytes()) {
			throw new InvalidUploadRequestException(
				"REQUEST_SIZE_LIMIT_EXCEEDED",
				"The upload request is too large."
			);
		}
	}

	public void cleanupStoredFiles(List<String> storageKeys) {
		if (storageKeys == null) {
			return;
		}

		for (String storageKey : storageKeys) {
			if (!StringUtils.hasText(storageKey)) {
				continue;
			}

			try {
				Files.deleteIfExists(localMediaStoragePathService.resolveStoragePath(storageKey));
			} catch (IOException | IllegalArgumentException ignored) {
				// Best-effort cleanup.
			}
		}
	}

	public MediaContent readStoredImage(String storageKey) throws IOException {
		Path storagePath = localMediaStoragePathService.resolveStoragePath(storageKey);
		byte[] bytes = Files.readAllBytes(storagePath);
		String detectedContentType = normalizeContentType(tika.detect(bytes, storagePath.getFileName().toString()));
		if (!ALLOWED_IMAGE_CONTENT_TYPES.contains(detectedContentType)) {
			throw new UnsupportedImageTypeException();
		}

		return new MediaContent(bytes, detectedContentType);
	}

	private ImageDimensions extractDimensions(byte[] bytes) throws IOException {
		try (ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes)) {
			BufferedImage image = ImageIO.read(inputStream);
			if (image == null) {
				return new ImageDimensions(null, null);
			}

			return new ImageDimensions(image.getWidth(), image.getHeight());
		}
	}

	private String calculateChecksum(byte[] bytes) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			return HexFormat.of().formatHex(digest.digest(bytes));
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException("SHA-256 is not available", exception);
		}
	}

	private String normalizeContentType(String value) {
		return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
	}

	private record ImageDimensions(Integer width, Integer height) {
	}

	public record MediaContent(byte[] bytes, String contentType) {
	}

	public static class InvalidUploadRequestException extends RuntimeException {

		private final String code;

		public InvalidUploadRequestException(String code, String message) {
			super(message);
			this.code = code;
		}

		public String code() {
			return code;
		}
	}

	public static class UnsupportedImageTypeException extends RuntimeException {
		public UnsupportedImageTypeException() {
			super("Only JPEG, PNG, and WEBP images are supported.");
		}
	}
}
