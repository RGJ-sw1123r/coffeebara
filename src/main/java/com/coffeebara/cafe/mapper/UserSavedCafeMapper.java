package com.coffeebara.cafe.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserSavedCafeMapper {

	int insert(Map<String, Object> savedCafe);

	int updateSavedType(
		@Param("appUserId") Long appUserId,
		@Param("kakaoPlaceId") String kakaoPlaceId,
		@Param("savedType") String savedType
	);

	int deleteByUserIdAndPlaceId(
		@Param("appUserId") Long appUserId,
		@Param("kakaoPlaceId") String kakaoPlaceId
	);

	int countCafeRecordsByUserIdAndPlaceId(
		@Param("appUserId") Long appUserId,
		@Param("kakaoPlaceId") String kakaoPlaceId
	);

	int countAllCafeRecordsByUserId(@Param("appUserId") Long appUserId);

	int deleteCafeRecordsByUserIdAndPlaceId(
		@Param("appUserId") Long appUserId,
		@Param("kakaoPlaceId") String kakaoPlaceId
	);

	List<Map<String, Object>> findSavedCafesByUserId(@Param("appUserId") Long appUserId);
}
