package com.coffeebara.cafe.vo;

public record UserSavedCafeDeleteCheckResponse(
	String kakaoPlaceId,
	int recordCount,
	boolean hasRecords
) {
}
