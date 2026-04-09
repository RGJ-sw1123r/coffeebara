package com.coffeebara.cafe.vo;

public record CafeUpsertRequest(
	String kakaoPlaceId,
	String name,
	String categoryName,
	String phone,
	String addressName,
	String roadAddressName,
	String latitude,
	String longitude,
	String placeUrl
) {
}
