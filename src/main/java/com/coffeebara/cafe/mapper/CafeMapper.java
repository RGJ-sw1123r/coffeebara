package com.coffeebara.cafe.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CafeMapper {

	Map<String, Object> findByKakaoPlaceId(String kakaoPlaceId);

	int insert(Map<String, Object> cafe);

	int updateByKakaoPlaceId(Map<String, Object> cafe);
}
