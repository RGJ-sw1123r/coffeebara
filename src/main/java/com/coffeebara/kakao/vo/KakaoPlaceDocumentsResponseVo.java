package com.coffeebara.kakao.vo;

import java.util.List;

import com.coffeebara.kakao.vo.KakaoKeywordSearchResponseVo.KakaoPlaceDocumentVo;

public record KakaoPlaceDocumentsResponseVo(
	List<KakaoPlaceDocumentVo> documents
) {
}
