package com.coffeebara.cafe.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coffeebara.cafe.service.CafeNoteService;
import com.coffeebara.cafe.vo.CafeNoteResponse;
import com.coffeebara.cafe.vo.CafeNoteSaveRequest;

@RestController
@RequestMapping("/api/cafe-notes")
public class CafeNoteController {

	private final CafeNoteService cafeNoteService;

	public CafeNoteController(CafeNoteService cafeNoteService) {
		this.cafeNoteService = cafeNoteService;
	}

	@GetMapping("/{placeId}")
	public ResponseEntity<List<CafeNoteResponse>> getNotes(
		Authentication authentication,
		@PathVariable("placeId") String placeId
	) {
		return ResponseEntity.ok(cafeNoteService.getNotes(authentication, placeId));
	}

	@PostMapping("/{placeId}")
	public ResponseEntity<CafeNoteResponse> save(
		Authentication authentication,
		@PathVariable("placeId") String placeId,
		@RequestBody CafeNoteSaveRequest request
	) {
		return ResponseEntity.ok(cafeNoteService.save(authentication, placeId, request));
	}

	@DeleteMapping("/{placeId}/{noteId}")
	public ResponseEntity<Void> delete(
		Authentication authentication,
		@PathVariable("placeId") String placeId,
		@PathVariable("noteId") Long noteId
	) {
		cafeNoteService.delete(authentication, placeId, noteId);
		return ResponseEntity.noContent().build();
	}
}
