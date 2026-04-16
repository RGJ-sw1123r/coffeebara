package com.coffeebara.media.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import com.coffeebara.cafe.mapper.CafeNoteMapper;
import com.coffeebara.cafe.service.CafeNoteService;
import com.coffeebara.cafe.vo.CafeNoteResponse;
import com.coffeebara.config.MediaStorageProperties;
import com.coffeebara.config.MediaUploadPolicyProperties;
import com.coffeebara.media.domain.MediaOwnerType;
import com.coffeebara.media.mapper.MediaAttachmentMapper;
import com.coffeebara.media.support.MediaAttachmentWarningContext;

class RecordAttachmentServiceTest {

	@TempDir
	Path tempDir;

	@Test
	void uploadsLogoFileAndReturnsAttachmentInRecordResponse() throws Exception {
		InMemoryCafeNoteMapper cafeNoteMapper = new InMemoryCafeNoteMapper();
		InMemoryMediaAttachmentMapper mediaAttachmentMapper = new InMemoryMediaAttachmentMapper();
		LocalMediaStoragePathService localMediaStoragePathService = new LocalMediaStoragePathService(
			new MediaStorageProperties(tempDir.toString()),
			Clock.systemDefaultZone()
		);
		CafeNoteService cafeNoteService = new CafeNoteService(
			cafeNoteMapper,
			mediaAttachmentMapper,
			new MediaAttachmentWarningContext()
		);
		RecordAttachmentService recordAttachmentService = new RecordAttachmentService(
			cafeNoteMapper,
			cafeNoteService,
			mediaAttachmentMapper,
			localMediaStoragePathService,
			new MediaUploadPolicyProperties(5, 5, 30, 15L * 1024 * 1024, 100L * 1024 * 1024)
		);

		Path logoPath = Path.of("frontend", "public", "coffeebara-logo.png");
		byte[] fileBytes = Files.readAllBytes(logoPath);
		MockMultipartFile logoFile = new MockMultipartFile(
			"files",
			"coffeebara-logo.png",
			"image/png",
			fileBytes
		);

		CafeNoteResponse response = recordAttachmentService.uploadRecordAttachments(
			memberAuthentication(1L),
			100L,
			List.of(logoFile)
		);

		assertEquals(1, response.attachments().size());
		assertEquals(100L, response.id());
		assertNotNull(response.attachments().getFirst().attachmentId());
		assertNotNull(response.attachments().getFirst().mediaAssetId());
		assertEquals("image/png", response.attachments().getFirst().contentType());
		assertEquals("coffeebara-logo.png", response.attachments().getFirst().originalFileName());
		assertEquals(fileBytes.length, response.attachments().getFirst().fileSize());
		assertEquals("RECORD_GALLERY", response.attachments().getFirst().attachmentRole());
		assertEquals(0, response.attachments().getFirst().sortOrder());
		assertTrue(response.attachments().getFirst().isCover());
		assertNotNull(response.attachments().getFirst().width());
		assertNotNull(response.attachments().getFirst().height());
		assertTrue(response.attachments().getFirst().storageKey().startsWith("cafe-record/"));
		assertFalse(response.attachments().getFirst().storageKey().contains(":"));

		Path savedPath = localMediaStoragePathService.resolveStoragePath(response.attachments().getFirst().storageKey());
		assertTrue(savedPath.startsWith(tempDir.toAbsolutePath().normalize()));
		assertTrue(Files.exists(savedPath));
		assertEquals(fileBytes.length, Files.size(savedPath));
	}

	private Authentication memberAuthentication(Long userId) {
		DefaultOAuth2User principal = new DefaultOAuth2User(
			List.of(new SimpleGrantedAuthority("ROLE_USER")),
			Map.of("coffeebaraUserId", userId),
			"coffeebaraUserId"
		);
		return new OAuth2AuthenticationToken(principal, principal.getAuthorities(), "kakao");
	}

	private static final class InMemoryCafeNoteMapper implements CafeNoteMapper {

		private final Map<Long, Map<String, Object>> records = new HashMap<>();

		private InMemoryCafeNoteMapper() {
			Map<String, Object> record = new HashMap<>();
			record.put("id", 100L);
			record.put("appUserId", 1L);
			record.put("kakaoPlaceId", "place-1");
			record.put("recordType", "TEXT");
			record.put("displayOrder", 0);
			record.put("createdAt", LocalDateTime.now());
			record.put("updatedAt", LocalDateTime.now());
			record.put("title", "Logo Upload Test");
			record.put("noteText", "Attachment verification");
			records.put(100L, record);
		}

		@Override
		public List<Map<String, Object>> findByPlaceId(Long appUserId, String kakaoPlaceId) {
			return records.values().stream()
				.filter(record -> appUserId.equals(record.get("appUserId")))
				.filter(record -> kakaoPlaceId.equals(record.get("kakaoPlaceId")))
				.toList();
		}

		@Override
		public Map<String, Object> findByRecordId(Long appUserId, Long recordId) {
			return findOwnedRecordById(appUserId, recordId);
		}

		@Override
		public Map<String, Object> findOwnedRecordById(Long appUserId, Long recordId) {
			Map<String, Object> record = records.get(recordId);
			if (record == null || !appUserId.equals(record.get("appUserId"))) {
				return null;
			}
			return new HashMap<>(record);
		}

		@Override
		public int insertRecord(Map<String, Object> cafeRecord) {
			throw new UnsupportedOperationException();
		}

		@Override
		public int insertNote(Map<String, Object> cafeNote) {
			throw new UnsupportedOperationException();
		}

		@Override
		public int updateRecord(Map<String, Object> cafeRecord) {
			throw new UnsupportedOperationException();
		}

		@Override
		public int updateNote(Map<String, Object> cafeNote) {
			throw new UnsupportedOperationException();
		}

		@Override
		public int deleteNoteByRecordId(Long recordId) {
			throw new UnsupportedOperationException();
		}

		@Override
		public int deleteRecordById(Long recordId) {
			throw new UnsupportedOperationException();
		}
	}

	private static final class InMemoryMediaAttachmentMapper implements MediaAttachmentMapper {

		private long nextMediaAssetId = 1L;
		private long nextAttachmentId = 1L;
		private final Map<Long, Map<String, Object>> mediaAssets = new HashMap<>();
		private final List<Map<String, Object>> attachments = new ArrayList<>();

		@Override
		public List<Map<String, Object>> findActiveByOwnerTypeAndOwnerIds(String ownerType, List<Long> ownerIds) {
			return attachments.stream()
				.filter(row -> ownerType.equals(row.get("ownerType")))
				.filter(row -> ownerIds.contains(row.get("ownerId")))
				.filter(row -> row.get("deletedAt") == null)
				.<Map<String, Object>>map(row -> new HashMap<>(row))
				.toList();
		}

		@Override
		public int countActiveByOwnerTypeAndOwnerId(String ownerType, Long ownerId) {
			return (int) attachments.stream()
				.filter(row -> ownerType.equals(row.get("ownerType")))
				.filter(row -> ownerId.equals(row.get("ownerId")))
				.filter(row -> row.get("deletedAt") == null)
				.count();
		}

		@Override
		public Integer findMaxSortOrderByOwnerTypeAndOwnerId(String ownerType, Long ownerId) {
			return attachments.stream()
				.filter(row -> ownerType.equals(row.get("ownerType")))
				.filter(row -> ownerId.equals(row.get("ownerId")))
				.filter(row -> row.get("deletedAt") == null)
				.map(row -> (Integer) row.get("sortOrder"))
				.max(Integer::compareTo)
				.orElse(null);
		}

		@Override
		public int insertMediaAsset(Map<String, Object> mediaAsset) {
			Long id = nextMediaAssetId++;
			mediaAsset.put("id", id);
			mediaAssets.put(id, new HashMap<>(mediaAsset));
			return 1;
		}

		@Override
		public int insertMediaAttachment(Map<String, Object> mediaAttachment) {
			Map<String, Object> mediaAsset = mediaAssets.get((Long) mediaAttachment.get("mediaAssetId"));
			Map<String, Object> row = new HashMap<>();
			row.put("attachmentId", nextAttachmentId++);
			row.put("mediaAssetId", mediaAttachment.get("mediaAssetId"));
			row.put("ownerType", mediaAttachment.get("ownerType"));
			row.put("ownerId", mediaAttachment.get("ownerId"));
			row.put("attachmentRole", mediaAttachment.get("attachmentRole"));
			row.put("sortOrder", mediaAttachment.get("sortOrder"));
			row.put("isCover", mediaAttachment.get("isCover"));
			row.put("storageKey", mediaAsset.get("storageKey"));
			row.put("originalFileName", mediaAsset.get("originalFileName"));
			row.put("contentType", mediaAsset.get("contentType"));
			row.put("fileSize", mediaAsset.get("fileSize"));
			row.put("width", mediaAsset.get("width"));
			row.put("height", mediaAsset.get("height"));
			row.put("checksum", mediaAsset.get("checksum"));
			row.put("createdAt", LocalDateTime.now());
			row.put("deletedAt", null);
			attachments.add(row);
			return 1;
		}
	}
}
