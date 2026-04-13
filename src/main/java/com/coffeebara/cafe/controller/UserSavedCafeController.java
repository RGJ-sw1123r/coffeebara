package com.coffeebara.cafe.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebara.cafe.service.UserSavedCafeService;
import com.coffeebara.cafe.vo.UserSavedCafeDeleteCheckResponse;
import com.coffeebara.cafe.vo.UserSavedCafeResponse;
import com.coffeebara.cafe.vo.UserSavedCafeSaveRequest;

@RestController
@RequestMapping("/api/user-saved-cafes")
public class UserSavedCafeController {

	private final UserSavedCafeService userSavedCafeService;

	public UserSavedCafeController(UserSavedCafeService userSavedCafeService) {
		this.userSavedCafeService = userSavedCafeService;
	}

	@GetMapping
	public ResponseEntity<List<UserSavedCafeResponse>> getSavedCafes(Authentication authentication) {
		return ResponseEntity.ok(userSavedCafeService.getSavedCafes(authentication));
	}

	@PostMapping
	public ResponseEntity<UserSavedCafeResponse> saveCafe(
		Authentication authentication,
		@RequestBody UserSavedCafeSaveRequest request
	) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userSavedCafeService.save(authentication, request));
	}

	@GetMapping("/{placeId}/delete-check")
	public ResponseEntity<UserSavedCafeDeleteCheckResponse> getDeleteCheck(
		Authentication authentication,
		@PathVariable("placeId") String placeId
	) {
		return ResponseEntity.ok(userSavedCafeService.getDeleteCheck(authentication, placeId));
	}

	@DeleteMapping("/{placeId}")
	public ResponseEntity<Void> deleteSavedCafe(
		Authentication authentication,
		@PathVariable("placeId") String placeId
	) {
		userSavedCafeService.delete(authentication, placeId);
		return ResponseEntity.noContent().build();
	}
}
