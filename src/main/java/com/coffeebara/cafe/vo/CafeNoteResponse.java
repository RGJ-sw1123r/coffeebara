package com.coffeebara.cafe.vo;

public record CafeNoteResponse(
	Long id,
	String kakaoPlaceId,
	String title,
	String noteText,
	Integer displayOrder,
	String createdAt,
	String updatedAt
) {
}
