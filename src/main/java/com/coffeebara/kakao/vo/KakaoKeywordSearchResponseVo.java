package com.coffeebara.kakao.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoKeywordSearchResponseVo(
	List<KakaoPlaceDocumentVo> documents,
	KakaoMetaVo meta
) {

	public record KakaoMetaVo(
		@JsonProperty("is_end")
		boolean isEnd,
		@JsonProperty("pageable_count")
		int pageableCount,
		@JsonProperty("same_name")
		KakaoSameNameVo sameName,
		@JsonProperty("total_count")
		int totalCount
	) {
	}

	public record KakaoSameNameVo(
		String keyword,
		List<String> region,
		@JsonProperty("selected_region")
		String selectedRegion
	) {
	}

	public record KakaoPlaceDocumentVo(
		String id,
		@JsonProperty("address_name")
		String addressName,
		@JsonProperty("category_group_code")
		String categoryGroupCode,
		@JsonProperty("category_group_name")
		String categoryGroupName,
		@JsonProperty("category_name")
		String categoryName,
		String distance,
		@JsonProperty("phone")
		String phone,
		@JsonProperty("place_name")
		String placeName,
		@JsonProperty("place_url")
		String placeUrl,
		@JsonProperty("road_address_name")
		String roadAddressName,
		String x,
		String y
	) {
	}
}
