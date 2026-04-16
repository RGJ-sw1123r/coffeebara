package com.coffeebara.cafe.service;

import java.sql.Timestamp;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.coffeebara.cafe.mapper.CafeNoteMapper;
import com.coffeebara.cafe.vo.CafeNoteResponse;
import com.coffeebara.cafe.vo.CafeNoteSaveRequest;
import com.coffeebara.common.error.ApiException;
import com.coffeebara.media.domain.MediaOwnerType;
import com.coffeebara.media.mapper.MediaAttachmentMapper;
import com.coffeebara.media.support.MediaAttachmentWarningContext;
import com.coffeebara.media.vo.MediaAttachmentResponse;

@Service
public class CafeNoteService {

	private static final Logger log = LoggerFactory.getLogger(CafeNoteService.class);
	private static final String SQL_STATE_TABLE_NOT_FOUND = "42S02";
	private static final int MYSQL_ERROR_TABLE_NOT_FOUND = 1146;
	private static final String TEXT_RECORD_TYPE = "TEXT";

	private final CafeNoteMapper cafeNoteMapper;
	private final MediaAttachmentMapper mediaAttachmentMapper;
	private final MediaAttachmentWarningContext mediaAttachmentWarningContext;

	public CafeNoteService(
		CafeNoteMapper cafeNoteMapper,
		MediaAttachmentMapper mediaAttachmentMapper,
		MediaAttachmentWarningContext mediaAttachmentWarningContext
	) {
		this.cafeNoteMapper = cafeNoteMapper;
		this.mediaAttachmentMapper = mediaAttachmentMapper;
		this.mediaAttachmentWarningContext = mediaAttachmentWarningContext;
	}

	public List<CafeNoteResponse> getNotes(Authentication authentication, String placeId) {
		Long appUserId = requireMemberUserId(authentication);
		validatePlaceId(placeId);

		try {
			List<Map<String, Object>> notes = cafeNoteMapper.findByPlaceId(appUserId, placeId);
			Map<Long, List<MediaAttachmentResponse>> attachmentsByRecordId = safeFindAttachmentsByRecordIds(
				notes.stream()
					.map(note -> toLong(note.get("id")))
					.filter(recordId -> recordId != null)
					.toList()
			);

			return notes.stream()
				.map(note -> toResponse(note, attachmentsByRecordId.getOrDefault(toLong(note.get("id")), List.of())))
				.toList();
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "기록을 불러오지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CAFE_NOTE_LOOKUP_FAILED", "기록을 불러오는 중 문제가 발생했습니다.");
		}
	}

	public CafeNoteResponse getRecord(Authentication authentication, Long recordId) {
		Long appUserId = requireMemberUserId(authentication);

		if (recordId == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "RECORD_ID_REQUIRED", "기록 ID가 필요합니다.");
		}

		try {
			Map<String, Object> record = cafeNoteMapper.findOwnedRecordById(appUserId, recordId);
			if (record == null) {
				throw new ApiException(HttpStatus.NOT_FOUND, "CAFE_RECORD_NOT_FOUND", "기록을 찾지 못했습니다.");
			}

			return toResponse(
				record,
				safeFindAttachmentsByRecordIds(List.of(recordId)).getOrDefault(recordId, List.of())
			);
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "기록을 불러오지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CAFE_RECORD_LOOKUP_FAILED", "기록을 불러오는 중 문제가 발생했습니다.");
		}
	}

	public CafeNoteResponse save(
		Authentication authentication,
		String placeId,
		CafeNoteSaveRequest request
	) {
		Long appUserId = requireMemberUserId(authentication);
		validatePlaceId(placeId);
		validateRequest(request);

		try {
			if (request.id() != null) {
				Map<String, Object> existing = cafeNoteMapper.findByRecordId(appUserId, request.id());
				if (existing == null) {
					throw new ApiException(HttpStatus.NOT_FOUND, "CAFE_NOTE_NOT_FOUND", "수정할 기록을 찾지 못했습니다.");
				}

				String storedPlaceId = toStringValue(existing.get("kakaoPlaceId"));
				if (!placeId.equals(storedPlaceId)) {
					throw new ApiException(HttpStatus.BAD_REQUEST, "PLACE_ID_MISMATCH", "다른 카페의 기록은 수정할 수 없습니다.");
				}

				Map<String, Object> payload = new HashMap<>();
				payload.put("recordId", request.id());
				payload.put("title", normalizeTitle(request.title()));
				payload.put("noteText", request.noteText().trim());
				payload.put("displayOrder", request.displayOrder() == null ? 0 : request.displayOrder());
				cafeNoteMapper.updateRecord(payload);
				cafeNoteMapper.updateNote(payload);

				return toResponse(
					cafeNoteMapper.findByRecordId(appUserId, request.id()),
					safeFindAttachmentsByRecordIds(List.of(request.id())).getOrDefault(request.id(), List.of())
				);
			}

			Map<String, Object> payload = new HashMap<>();
			payload.put("appUserId", appUserId);
			payload.put("kakaoPlaceId", placeId);
			payload.put("recordType", TEXT_RECORD_TYPE);
			payload.put("displayOrder", request.displayOrder() == null ? 0 : request.displayOrder());
			cafeNoteMapper.insertRecord(payload);

			Object insertedRecordId = payload.get("id");
			Long recordId = insertedRecordId instanceof Number number
				? number.longValue()
				: Long.parseLong(String.valueOf(insertedRecordId));

			Map<String, Object> notePayload = new HashMap<>();
			notePayload.put("recordId", recordId);
			notePayload.put("title", normalizeTitle(request.title()));
			notePayload.put("noteText", request.noteText().trim());
			cafeNoteMapper.insertNote(notePayload);

			return toResponse(
				cafeNoteMapper.findByRecordId(appUserId, recordId),
				safeFindAttachmentsByRecordIds(List.of(recordId)).getOrDefault(recordId, List.of())
			);
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "기록을 저장하지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CAFE_NOTE_SAVE_FAILED", "기록을 저장하는 중 문제가 발생했습니다.");
		}
	}

	public void delete(Authentication authentication, String placeId, Long noteId) {
		Long appUserId = requireMemberUserId(authentication);
		validatePlaceId(placeId);

		if (noteId == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "NOTE_ID_REQUIRED", "기록 ID가 필요합니다.");
		}

		try {
			Map<String, Object> existing = cafeNoteMapper.findByRecordId(appUserId, noteId);
			if (existing == null) {
				throw new ApiException(HttpStatus.NOT_FOUND, "CAFE_NOTE_NOT_FOUND", "삭제할 기록을 찾지 못했습니다.");
			}

			String storedPlaceId = toStringValue(existing.get("kakaoPlaceId"));
			if (!placeId.equals(storedPlaceId)) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "PLACE_ID_MISMATCH", "다른 카페의 기록은 삭제할 수 없습니다.");
			}

			cafeNoteMapper.deleteNoteByRecordId(noteId);
			cafeNoteMapper.deleteRecordById(noteId);
		} catch (CannotGetJdbcConnectionException exception) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "DB_CONNECTION_FAILED", "기록을 삭제하지 못했습니다.");
		} catch (DataAccessException exception) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CAFE_NOTE_DELETE_FAILED", "기록을 삭제하는 중 문제가 발생했습니다.");
		}
	}

	private void validatePlaceId(String placeId) {
		if (!StringUtils.hasText(placeId)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "PLACE_ID_REQUIRED", "카페 ID가 필요합니다.");
		}
	}

	private void validateRequest(CafeNoteSaveRequest request) {
		if (request == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "REQUEST_REQUIRED", "저장할 기록 정보가 필요합니다.");
		}

		if (!StringUtils.hasText(request.noteText())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "NOTE_TEXT_REQUIRED", "기록 내용이 필요합니다.");
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

	private CafeNoteResponse toResponse(
		Map<String, Object> cafeNote,
		List<MediaAttachmentResponse> attachments
	) {
		if (cafeNote == null) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "CAFE_NOTE_NOT_FOUND", "저장한 기록을 다시 찾지 못했습니다.");
		}

		return new CafeNoteResponse(
			toLong(cafeNote.get("id")),
			toStringValue(cafeNote.get("kakaoPlaceId")),
			toStringValue(cafeNote.get("title")),
			toStringValue(cafeNote.get("noteText")),
			toInteger(cafeNote.get("displayOrder")),
			attachments == null ? List.of() : attachments,
			toDateTimeString(cafeNote.get("createdAt")),
			toDateTimeString(cafeNote.get("updatedAt"))
		);
	}

	private Map<Long, List<MediaAttachmentResponse>> findAttachmentsByRecordIds(List<Long> recordIds) {
		if (recordIds == null || recordIds.isEmpty()) {
			return Map.of();
		}

		return mediaAttachmentMapper.findActiveByOwnerTypeAndOwnerIds(MediaOwnerType.CAFE_RECORD, recordIds).stream()
			.map(this::toMediaAttachmentResponse)
			.collect(Collectors.groupingBy(MediaAttachmentResponse::ownerId));
	}

	private Map<Long, List<MediaAttachmentResponse>> safeFindAttachmentsByRecordIds(List<Long> recordIds) {
		try {
			return findAttachmentsByRecordIds(recordIds);
		} catch (BadSqlGrammarException exception) {
			if (isMissingMediaAttachmentTable(exception)) {
				log.warn("Media attachment tables are not ready yet. Returning records without attachments.");
				mediaAttachmentWarningContext.addWarning(MediaAttachmentWarningContext.MEDIA_TABLES_MISSING);
				return Map.of();
			}

			throw exception;
		}
	}

	private boolean isMissingMediaAttachmentTable(BadSqlGrammarException exception) {
		SQLException sqlException = exception.getSQLException();
		if (sqlException == null) {
			return false;
		}

		boolean isTableNotFoundError = SQL_STATE_TABLE_NOT_FOUND.equals(sqlException.getSQLState())
			|| sqlException.getErrorCode() == MYSQL_ERROR_TABLE_NOT_FOUND;
		if (!isTableNotFoundError) {
			return false;
		}

		String message = sqlException.getMessage();
		if (!StringUtils.hasText(message)) {
			return false;
		}

		String normalizedMessage = message.toLowerCase();
		return normalizedMessage.contains("media_attachment") || normalizedMessage.contains("media_asset");
	}

	private MediaAttachmentResponse toMediaAttachmentResponse(Map<String, Object> attachment) {
		return new MediaAttachmentResponse(
			toLong(attachment.get("attachmentId")),
			toLong(attachment.get("mediaAssetId")),
			toStringValue(attachment.get("ownerType")),
			toLong(attachment.get("ownerId")),
			toStringValue(attachment.get("attachmentRole")),
			toInteger(attachment.get("sortOrder")),
			toBoolean(attachment.get("isCover")),
			toStringValue(attachment.get("storageKey")),
			toStringValue(attachment.get("originalFileName")),
			toStringValue(attachment.get("contentType")),
			toLong(attachment.get("fileSize")),
			toInteger(attachment.get("width")),
			toInteger(attachment.get("height")),
			toStringValue(attachment.get("checksum")),
			toDateTimeString(attachment.get("createdAt"))
		);
	}

	private String normalizeTitle(String value) {
		if (!StringUtils.hasText(value)) {
			return null;
		}

		return value.trim();
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

	private Integer toInteger(Object value) {
		if (value == null) {
			return null;
		}

		if (value instanceof Number number) {
			return number.intValue();
		}

		return Integer.parseInt(String.valueOf(value));
	}

	private boolean toBoolean(Object value) {
		if (value == null) {
			return false;
		}

		if (value instanceof Boolean booleanValue) {
			return booleanValue;
		}

		if (value instanceof Number number) {
			return number.intValue() != 0;
		}

		return Boolean.parseBoolean(String.valueOf(value));
	}

	private String toStringValue(Object value) {
		return value == null ? "" : String.valueOf(value);
	}

	private String toDateTimeString(Object value) {
		if (value == null) {
			return "";
		}

		if (value instanceof LocalDateTime localDateTime) {
			return localDateTime.toString();
		}

		if (value instanceof Timestamp timestamp) {
			return timestamp.toLocalDateTime().toString();
		}

		return String.valueOf(value);
	}
}
