package com.coffeebara.cafe.vo;

public record CafeNoteSaveRequest(
	Long id,
	String title,
	String noteText,
	Integer displayOrder
) {
}
