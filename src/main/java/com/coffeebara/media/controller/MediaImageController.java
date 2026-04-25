package com.coffeebara.media.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.coffeebara.media.dto.MediaImageUploadItemResponse;
import com.coffeebara.media.dto.MediaImageUploadResponse;
import com.coffeebara.media.dto.MediaStorageCleanupRequest;
import com.coffeebara.media.service.MediaImageUploadService;
import com.coffeebara.media.service.MediaImageUploadService.InvalidUploadRequestException;
import com.coffeebara.media.service.MediaImageUploadService.MediaContent;
import com.coffeebara.media.service.MediaImageUploadService.UnsupportedImageTypeException;

@RestController
@RequestMapping("/api/media/images")
public class MediaImageController {

	private final MediaImageUploadService mediaImageUploadService;

	public MediaImageController(MediaImageUploadService mediaImageUploadService) {
		this.mediaImageUploadService = mediaImageUploadService;
	}

	@PostMapping("/preprocess")
	public ResponseEntity<?> preprocessImages(@RequestPart("files") List<MultipartFile> files) {
		try {
			mediaImageUploadService.validateUploadRequest(files);
			List<MediaImageUploadItemResponse> uploadedFiles = new ArrayList<>(files.size());
			List<String> storedStorageKeys = new ArrayList<>(files.size());

			try {
				for (MultipartFile file : files) {
					MediaImageUploadItemResponse uploaded = mediaImageUploadService.storeImage(file);
					uploadedFiles.add(uploaded);
					storedStorageKeys.add(uploaded.storageKey());
				}
			} catch (IOException | RuntimeException exception) {
				mediaImageUploadService.cleanupStoredFiles(storedStorageKeys);
				throw exception;
			}

			return ResponseEntity.ok(new MediaImageUploadResponse(uploadedFiles));
		} catch (InvalidUploadRequestException exception) {
			return ResponseEntity.badRequest().body(Map.of(
				"code", exception.code(),
				"message", exception.getMessage()
			));
		} catch (UnsupportedImageTypeException exception) {
			return ResponseEntity.badRequest().body(Map.of(
				"code", "UNSUPPORTED_IMAGE_CONTENT_TYPE",
				"message", exception.getMessage()
			));
		} catch (IOException exception) {
			return ResponseEntity.internalServerError().body(Map.of(
				"code", "IMAGE_PREPROCESS_FAILED",
				"message", "Failed to preprocess uploaded images."
			));
		} catch (RuntimeException exception) {
			return ResponseEntity.internalServerError().body(Map.of(
				"code", "IMAGE_PREPROCESS_FAILED",
				"message", "Failed to preprocess uploaded images."
			));
		}
	}

	@DeleteMapping("/preprocess")
	public ResponseEntity<?> cleanupStoredImages(@RequestBody(required = false) MediaStorageCleanupRequest request) {
		mediaImageUploadService.cleanupStoredFiles(request == null ? List.of() : request.storageKeys());
		return ResponseEntity.ok(Map.of("deleted", true));
	}

	@GetMapping("/content")
	public ResponseEntity<?> readImageContent(@RequestParam("storageKey") String storageKey) {
		try {
			MediaContent mediaContent = mediaImageUploadService.readStoredImage(storageKey);
			return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(mediaContent.contentType()))
				.header(HttpHeaders.CACHE_CONTROL, "private, max-age=300")
				.body(new ByteArrayResource(mediaContent.bytes()));
		} catch (UnsupportedImageTypeException exception) {
			return ResponseEntity.badRequest().body(Map.of(
				"code", "UNSUPPORTED_IMAGE_CONTENT_TYPE",
				"message", exception.getMessage()
			));
		} catch (IOException | IllegalArgumentException exception) {
			return ResponseEntity.notFound().build();
		}
	}
}
