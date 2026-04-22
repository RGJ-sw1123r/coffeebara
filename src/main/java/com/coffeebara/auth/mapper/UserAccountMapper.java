package com.coffeebara.auth.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserAccountMapper {

	Map<String, Object> findByProviderUserId(
		@Param("authProvider") String authProvider,
		@Param("providerUserId") String providerUserId
	);

	int insert(Map<String, Object> userAccount);

	int updateProfileAndLastLogin(Map<String, Object> userAccount);
}
