package com.coffeebara.media.support;

import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class MediaAttachmentWarningContext {

	public static final String MEDIA_TABLES_MISSING = "MEDIA_TABLES_MISSING";

	private final Set<String> warnings = new LinkedHashSet<>();

	public void addWarning(String warningCode) {
		if (warningCode != null && !warningCode.isBlank()) {
			warnings.add(warningCode);
		}
	}

	public boolean hasWarnings() {
		return !warnings.isEmpty();
	}

	public String toHeaderValue() {
		return String.join(",", warnings);
	}
}
