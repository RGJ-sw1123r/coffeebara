package com.coffeebara.cafe.mapper;

import java.util.Map;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CafeMapper {

	Map<String, Object> findByKakaoPlaceId(String kakaoPlaceId);

	void upsert(Map<String, Object> cafe);

	void upsertBatch(List<Map<String, Object>> cafes);
}
