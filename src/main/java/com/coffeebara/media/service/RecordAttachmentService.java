package com.coffeebara.media.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.coffeebara.cafe.mapper.CafeNoteMapper;
import com.coffeebara.cafe.service.CafeNoteService;
import com.coffeebara.cafe.vo.CafeNoteResponse;
import com.coffeebara.common.error.ApiException;
import com.coffeebara.config.MediaUploadPolicyProperties;
import com.coffeebara.media.domain.MediaAttachmentRole;
import com.coffeebara.media.domain.CafeRecordType;
import com.coffeebara.media.domain.MediaOwnerType;
import com.coffeebara.media.mapper.MediaAttachmentMapper;

@Service
public class RecordAttachmentService {

	private static final Set<String> ALLOWED_IMAGE_CONTENT_TYPES = Set.of(
		"image/jpeg",
		"image/png",
		"image/webp"
	);

	private final CafeNoteMapper cafeNoteMapper;
	private final CafeNoteService cafeNoteService;
	private final MediaAttachmentMapper mediaAttachmentMapper;
	private final LocalMediaStoragePathService localMediaStoragePathService;
	private final MediaUploadPolicyProperties mediaUploadPolicyProperties;

	public RecordAttachmentService(
		CafeNoteMapper cafeNoteMapper,
		CafeNoteService cafeNoteService,
		MediaAttachmentMapper mediaAttachmentMapper,
		LocalMediaStoragePathService localMediaStoragePathService,
		MediaUploadPolicyProperties mediaUploadPolicyProperties
	) {
		this.cafeNoteMapper = cafeNoteMapper;
		this.cafeNoteService = cafeNoteService;
		this.mediaAttachmentMapper = mediaAttachmentMapper;
		this.localMediaStoragePathService = localMediaStoragePathService;
		this.mediaUploadPolicyProperties = mediaUploadPolicyProperties;
	}

	@Transactional
	public CafeNoteResponse uploadRecordAttachments(
		Authentication authentication,
		Long recordId,
		List<MultipartFile> files
	) {
		Long appUserId = requireMemberUserId(authentication);
		validateRecordId(recordId);
		validateFiles(files);
		List<Path> savedPaths = new ArrayList<>();

		try {
			Map<String, Object> ownedRecord = cafeNoteMapper.findOwnedRecordById(appUserId, recordId);
			if (ownedRecord == null) {
				throw new ApiException(HttpStatus.NOT_FOUND, "CAFE_RECORD_NOT_FOUND", "기록을 찾지 못했습니다.");
			}

			validateUploadPolicy(ownedRecord, recordId, files);

			int existingAttachmentCount = mediaAttachmentMapper.countActiveByOwnerTypeAndOwnerId(
				MediaOwnerType.CAFE_RECORD,
				recordId
			);
			int nextSortOrder = nextSortOrder(recordId);
			boolean shouldMarkFirstAsCover = existingAttachmentCount == 0;

			try {
				for (int index = 0; index < files.size(); index++) {
					MultipartFile file = files.get(index);
					StoredImage storedImage = storeImageFile(file);
					savedPaths.add(storedImage.storagePath());

					Map<String, Object> mediaAssetPayload = new HashMap<>();
					mediaAssetPayload.put("storageKey", storedImage.storageKey());
					mediaAssetPayload.put("originalFileName", originalFileName(file));
					mediaAssetPayload.put("contentType", file.getContentType());
					mediaAssetPayload.put("fileSize", storedImage.fileSize());
					mediaAssetPayload.put("width", storedImage.width());
					mediaAssetPayload.put("height", storedImage.height());
					mediaAssetPayload.put("checksum", storedImage.checksum());
					mediaAttachmentMapper.insertMediaAsset(mediaAssetPayload);

					Long mediaAssetId = toLong(mediaAssetPayload.get("id"));
					Map<String, Object> mediaAttachmentPayload = new HashMap<>();
					mediaAttachmentPayload.put("mediaAssetId", mediaAssetId);
					mediaAttachmentPayload.put("ownerType", MediaOwnerType.CAFE_RECORD);
					mediaAttachmentPayload.put("ownerId", recordId);
					mediaAttachmentPayload.put("attachmentRole", MediaAttachmentRole.RECORD_GALLERY);
					mediaAttachmentPayload.put("sortOrder", nextSortOrder++);
					mediaAttachmentPayload.put("isCover", shouldMarkFirstAsCover && index == 0);
					mediaAttachmentMapper.insertMediaAttachment(mediaAttachmentPayload);
				}
			} catch (IOException exception) {
				cleanupSavedFiles(savedPaths);
				throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_FAILED", "이미지 파일을 저장하지 못했습니다.");
			} catch (RuntimeException exception) {
				cleanupSavedFiles(savedPaths);
				throw exception;
			}

			return cafeNoteService.getRecord(authentication, recordId);
		} catch (CannotGetJdbcConnectionException exception) {
			cleanupSavedFiles(savedPaths);
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "이미지를 저장하지 못했습니다.");
		} catch (DataAccessException exception) {
			cleanupSavedFiles(savedPaths);
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "RECORD_ATTACHMENT_SAVE_FAILED", "이미지를 저장하는 중 문제가 발생했습니다.");
		}
	}

	private StoredImage storeImageFile(MultipartFile file) throws IOException {
		validateImageFile(file);

		byte[] bytes = file.getBytes();
		ImageInfo imageInfo = readImageInfo(bytes, file.getContentType());
		String storageKey = localMediaStoragePathService.createStorageKey(
			MediaOwnerType.CAFE_RECORD,
			originalFileName(file)
		);
		Path storagePath = localMediaStoragePathService.resolveStoragePath(storageKey);
		Files.createDirectories(localMediaStoragePathService.resolveStorageDirectory(storageKey));
		Files.write(storagePath, bytes);

		return new StoredImage(
			storageKey,
			storagePath,
			(long) bytes.length,
			imageInfo.width(),
			imageInfo.height(),
			sha256(bytes)
		);
	}

	private void validateRecordId(Long recordId) {
		if (recordId == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "RECORD_ID_REQUIRED", "기록 ID가 필요합니다.");
		}
	}

	private void validateFiles(List<MultipartFile> files) {
		if (files == null || files.isEmpty()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "FILES_REQUIRED", "업로드할 이미지 파일이 필요합니다.");
		}
	}

	private void validateUploadPolicy(Map<String, Object> ownedRecord, Long recordId, List<MultipartFile> files) {
		if (files.size() > mediaUploadPolicyProperties.maxFilesPerRequest()) {
			throw new ApiException(
				HttpStatus.BAD_REQUEST,
				"TOO_MANY_FILES_IN_REQUEST",
				"한 번에 최대 " + mediaUploadPolicyProperties.maxFilesPerRequest() + "장까지 업로드할 수 있습니다."
			);
		}

		long totalRequestSize = files.stream()
			.filter(file -> file != null)
			.mapToLong(MultipartFile::getSize)
			.sum();
		if (totalRequestSize > mediaUploadPolicyProperties.maxRequestSizeBytes()) {
			throw new ApiException(
				HttpStatus.BAD_REQUEST,
				"REQUEST_SIZE_LIMIT_EXCEEDED",
				"한 번의 업로드 요청은 최대 100MB까지 허용됩니다."
			);
		}

		int existingAttachmentCount = mediaAttachmentMapper.countActiveByOwnerTypeAndOwnerId(
			MediaOwnerType.CAFE_RECORD,
			recordId
		);
		int maxAttachmentsPerRecord = maxAttachmentsPerRecord(ownedRecord);
		if (existingAttachmentCount + files.size() > maxAttachmentsPerRecord) {
			throw new ApiException(
				HttpStatus.BAD_REQUEST,
				"RECORD_ATTACHMENT_LIMIT_EXCEEDED",
				"이 기록에는 최대 " + maxAttachmentsPerRecord + "장까지 이미지를 보관할 수 있습니다."
			);
		}
	}

	private void validateImageFile(MultipartFile file) {
		if (file == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "FILE_REQUIRED", "업로드할 파일이 필요합니다.");
		}

		if (file.isEmpty() || file.getSize() <= 0) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE_NOT_ALLOWED", "빈 파일은 업로드할 수 없습니다.");
		}

		if (file.getSize() > mediaUploadPolicyProperties.maxFileSizeBytes()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "FILE_SIZE_LIMIT_EXCEEDED", "파일 1개는 최대 15MB까지 업로드할 수 있습니다.");
		}

		String contentType = normalizeContentType(file.getContentType());
		if (!StringUtils.hasText(contentType) || !contentType.startsWith("image/")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_IMAGE_CONTENT_TYPE", "이미지 파일만 업로드할 수 있습니다.");
		}

		if ("image/svg+xml".equals(contentType)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "SVG_IMAGE_NOT_ALLOWED", "SVG 이미지는 업로드할 수 없습니다.");
		}

		if (!ALLOWED_IMAGE_CONTENT_TYPES.contains(contentType)) {
			throw new ApiException(
				HttpStatus.BAD_REQUEST,
				"UNSUPPORTED_IMAGE_CONTENT_TYPE",
				"지원하는 이미지 형식은 JPEG, PNG, WEBP입니다."
			);
		}
	}

	private ImageInfo readImageInfo(byte[] bytes, String contentType) throws IOException {
		String normalizedContentType = normalizeContentType(contentType);
		if ("image/webp".equals(normalizedContentType)) {
			// TODO: Add a WebP decoder if width/height extraction becomes mandatory for WebP uploads.
			return new ImageInfo(null, null);
		}

		try (ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes)) {
			BufferedImage bufferedImage = ImageIO.read(inputStream);
			if (bufferedImage == null) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_IMAGE_FILE", "읽을 수 없는 이미지 파일입니다.");
			}

			return new ImageInfo(bufferedImage.getWidth(), bufferedImage.getHeight());
		}
	}

	private int maxAttachmentsPerRecord(Map<String, Object> ownedRecord) {
		String recordType = String.valueOf(ownedRecord.get("recordType"));
		if (CafeRecordType.VIEW_SPOT.equals(recordType)) {
			return mediaUploadPolicyProperties.maxAttachmentsPerViewSpotRecord();
		}

		return mediaUploadPolicyProperties.maxAttachmentsPerRecord();
	}

	private String sha256(byte[] bytes) {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
			byte[] digest = messageDigest.digest(bytes);
			StringBuilder builder = new StringBuilder(digest.length * 2);
			for (byte value : digest) {
				builder.append(String.format("%02x", value));
			}
			return builder.toString();
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException("SHA-256 digest is not available", exception);
		}
	}

	private int nextSortOrder(Long recordId) {
		Integer currentMaxSortOrder = mediaAttachmentMapper.findMaxSortOrderByOwnerTypeAndOwnerId(
			MediaOwnerType.CAFE_RECORD,
			recordId
		);
		return currentMaxSortOrder == null ? 0 : currentMaxSortOrder + 1;
	}

	private void cleanupSavedFiles(List<Path> savedPaths) {
		for (Path savedPath : savedPaths) {
			try {
				Files.deleteIfExists(savedPath);
			} catch (IOException ignored) {
				// Best-effort cleanup after DB or validation failure.
			}
		}
	}

	private Long requireMemberUserId(Authentication authentication) {
		if (
			authentication == null ||
			authentication instanceof AnonymousAuthenticationToken ||
			!authentication.isAuthenticated()
		) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "로그인이 필요합니다.");
		}

		if (
			!(authentication instanceof OAuth2AuthenticationToken) ||
			!(authentication.getPrincipal() instanceof OAuth2User oAuth2User)
		) {
			throw new ApiException(HttpStatus.FORBIDDEN, "MEMBER_ONLY", "게스트 계정은 이 기능을 사용할 수 없습니다.");
		}

		Object userIdValue = oAuth2User.getAttributes().get("coffeebaraUserId");
		if (userIdValue == null) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_USER", "사용자 정보를 확인하지 못했습니다.");
		}

		try {
			return Long.parseLong(String.valueOf(userIdValue));
		} catch (NumberFormatException exception) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_USER", "사용자 정보를 확인하지 못했습니다.");
		}
	}

	private String originalFileName(MultipartFile file) {
		String originalFilename = file.getOriginalFilename();
		return StringUtils.hasText(originalFilename) ? Path.of(originalFilename).getFileName().toString() : "upload.bin";
	}

	private String normalizeContentType(String contentType) {
		return contentType == null ? "" : contentType.trim().toLowerCase();
	}

	private Long toLong(Object value) {
		if (value == null) {
			return null;
		}

		if (value instanceof Number number) {
			return number.longValue();
		}

		return Long.parseLong(String.valueOf(value));
	}

	private record StoredImage(
		String storageKey,
		Path storagePath,
		Long fileSize,
		Integer width,
		Integer height,
		String checksum
	) {
	}

	private record ImageInfo(Integer width, Integer height) {
	}
}
