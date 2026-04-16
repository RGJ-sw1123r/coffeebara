package com.coffeebara.cafe.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.coffeebara.media.support.MediaAttachmentWarningContext;

@Component
public class RecordResponseHeaderSupport {

	public static final String WARNING_HEADER_NAME = "X-Coffeebara-Warning";

	private final MediaAttachmentWarningContext mediaAttachmentWarningContext;

	public RecordResponseHeaderSupport(MediaAttachmentWarningContext mediaAttachmentWarningContext) {
		this.mediaAttachmentWarningContext = mediaAttachmentWarningContext;
	}

	public <T> ResponseEntity<T> ok(T body) {
		if (!mediaAttachmentWarningContext.hasWarnings()) {
			return ResponseEntity.ok(body);
		}

		return ResponseEntity.ok()
			.header(WARNING_HEADER_NAME, mediaAttachmentWarningContext.toHeaderValue())
			.body(body);
	}

	public ResponseEntity<Void> noContent() {
		if (!mediaAttachmentWarningContext.hasWarnings()) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.noContent()
			.header(WARNING_HEADER_NAME, mediaAttachmentWarningContext.toHeaderValue())
			.build();
	}
}
