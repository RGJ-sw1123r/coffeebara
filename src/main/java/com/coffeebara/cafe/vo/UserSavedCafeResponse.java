package com.coffeebara.cafe.vo;

public record UserSavedCafeResponse(
	Long id,
	Long appUserId,
	String kakaoPlaceId,
	String savedType,
	String placeName,
	String categoryName,
	String phone,
	String addressName,
	String roadAddressName,
	String latitude,
	String longitude,
	String placeUrl,
	String createdAt,
	String updatedAt
) {
}
