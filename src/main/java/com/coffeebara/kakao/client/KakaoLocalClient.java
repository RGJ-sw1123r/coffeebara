package com.coffeebara.kakao.client;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import com.coffeebara.kakao.vo.KakaoKeywordSearchResponseVo;

@Component
public class KakaoLocalClient {

	private final RestClient kakaoLocalRestClient;

	public KakaoLocalClient(RestClient kakaoLocalRestClient) {
		this.kakaoLocalRestClient = kakaoLocalRestClient;
	}

	public KakaoKeywordSearchResponseVo searchByKeyword(String query, Integer page, Integer size) {
		return searchByKeyword(query, page, size, null, null);
	}

	public KakaoKeywordSearchResponseVo searchByKeyword(
		String query,
		Integer page,
		Integer size,
		String rect,
		String categoryGroupCode
	) {
		if (!StringUtils.hasText(query)) {
			throw new IllegalArgumentException("query must not be blank");
		}

		return kakaoLocalRestClient.get()
			.uri(uriBuilder -> uriBuilder
				.path("/v2/local/search/keyword.json")
				.queryParam("query", query)
				.queryParamIfPresent("page", java.util.Optional.ofNullable(page))
				.queryParamIfPresent("size", java.util.Optional.ofNullable(size))
				.queryParamIfPresent("rect", java.util.Optional.ofNullable(rect))
				.queryParamIfPresent("category_group_code", java.util.Optional.ofNullable(categoryGroupCode))
				.build())
			.accept(MediaType.APPLICATION_JSON)
			.retrieve()
			.body(KakaoKeywordSearchResponseVo.class);
	}

	public KakaoKeywordSearchResponseVo searchByCategory(
		String categoryGroupCode,
		Integer page,
		Integer size,
		String rect
	) {
		if (!StringUtils.hasText(categoryGroupCode)) {
			throw new IllegalArgumentException("categoryGroupCode must not be blank");
		}

		return kakaoLocalRestClient.get()
			.uri(uriBuilder -> uriBuilder
				.path("/v2/local/search/category.json")
				.queryParam("category_group_code", categoryGroupCode)
				.queryParamIfPresent("page", java.util.Optional.ofNullable(page))
				.queryParamIfPresent("size", java.util.Optional.ofNullable(size))
				.queryParamIfPresent("rect", java.util.Optional.ofNullable(rect))
				.build())
			.accept(MediaType.APPLICATION_JSON)
			.retrieve()
			.body(KakaoKeywordSearchResponseVo.class);
	}
}
