package com.coffeebara.cafe.vo;

import java.util.List;

import com.coffeebara.media.vo.MediaAttachmentResponse;

public record CafeNoteResponse(
	Long id,
	String kakaoPlaceId,
	String title,
	String noteText,
	Integer displayOrder,
	List<MediaAttachmentResponse> attachments,
	String createdAt,
	String updatedAt
) {
}
