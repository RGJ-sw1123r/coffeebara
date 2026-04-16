package com.coffeebara.cafe.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CafeNoteMapper {

	List<Map<String, Object>> findByPlaceId(
		@Param("appUserId") Long appUserId,
		@Param("kakaoPlaceId") String kakaoPlaceId
	);

	Map<String, Object> findByRecordId(
		@Param("appUserId") Long appUserId,
		@Param("recordId") Long recordId
	);

	Map<String, Object> findOwnedRecordById(
		@Param("appUserId") Long appUserId,
		@Param("recordId") Long recordId
	);

	int insertRecord(Map<String, Object> cafeRecord);

	int insertNote(Map<String, Object> cafeNote);

	int updateRecord(Map<String, Object> cafeRecord);

	int updateNote(Map<String, Object> cafeNote);

	int deleteNoteByRecordId(@Param("recordId") Long recordId);

	int deleteRecordById(@Param("recordId") Long recordId);
}
