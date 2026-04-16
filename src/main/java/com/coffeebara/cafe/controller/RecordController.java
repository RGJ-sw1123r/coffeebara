package com.coffeebara.cafe.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.coffeebara.cafe.service.CafeNoteService;
import com.coffeebara.cafe.vo.CafeNoteResponse;
import com.coffeebara.media.service.RecordAttachmentService;

@RestController
@RequestMapping("/api/records")
public class RecordController {

	private final CafeNoteService cafeNoteService;
	private final RecordAttachmentService recordAttachmentService;
	private final RecordResponseHeaderSupport recordResponseHeaderSupport;

	public RecordController(
		CafeNoteService cafeNoteService,
		RecordAttachmentService recordAttachmentService,
		RecordResponseHeaderSupport recordResponseHeaderSupport
	) {
		this.cafeNoteService = cafeNoteService;
		this.recordAttachmentService = recordAttachmentService;
		this.recordResponseHeaderSupport = recordResponseHeaderSupport;
	}

	@GetMapping("/{recordId}")
	public ResponseEntity<CafeNoteResponse> getRecord(
		Authentication authentication,
		@PathVariable("recordId") Long recordId
	) {
		return recordResponseHeaderSupport.ok(cafeNoteService.getRecord(authentication, recordId));
	}

	@PostMapping(
		value = "/{recordId}/attachments",
		consumes = MediaType.MULTIPART_FORM_DATA_VALUE
	)
	public ResponseEntity<CafeNoteResponse> uploadAttachments(
		Authentication authentication,
		@PathVariable("recordId") Long recordId,
		@RequestParam(value = "files", required = false) List<MultipartFile> files
	) {
		return recordResponseHeaderSupport.ok(
			recordAttachmentService.uploadRecordAttachments(authentication, recordId, files)
		);
	}
}
