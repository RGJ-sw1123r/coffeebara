package com.coffeebara.media.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MediaAttachmentMapper {

	List<Map<String, Object>> findActiveByOwnerTypeAndOwnerIds(
		@Param("ownerType") String ownerType,
		@Param("ownerIds") List<Long> ownerIds
	);

	int countActiveByOwnerTypeAndOwnerId(
		@Param("ownerType") String ownerType,
		@Param("ownerId") Long ownerId
	);

	Integer findMaxSortOrderByOwnerTypeAndOwnerId(
		@Param("ownerType") String ownerType,
		@Param("ownerId") Long ownerId
	);

	int insertMediaAsset(Map<String, Object> mediaAsset);

	int insertMediaAttachment(Map<String, Object> mediaAttachment);
}
