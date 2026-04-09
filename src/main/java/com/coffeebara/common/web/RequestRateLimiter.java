package com.coffeebara.common.web;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.coffeebara.common.error.ApiException;
import com.coffeebara.config.RateLimitProperties;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class RequestRateLimiter {

	private final RateLimitProperties rateLimitProperties;
	private final Map<String, WindowCounter> counters = new ConcurrentHashMap<>();

	public RequestRateLimiter(RateLimitProperties rateLimitProperties) {
		this.rateLimitProperties = rateLimitProperties;
	}

	public void checkLimit(String bucket, int maxRequests, String message) {
		if (maxRequests <= 0 || rateLimitProperties.windowSeconds() <= 0L) {
			return;
		}

		long now = System.currentTimeMillis();
		long windowMillis = rateLimitProperties.windowSeconds() * 1000L;
		String clientKey = resolveClientKey();
		String counterKey = bucket + "|" + clientKey;
		WindowCounter counter = counters.computeIfAbsent(counterKey, ignored -> new WindowCounter(now));

		synchronized (counter) {
			if (now - counter.windowStartedAtMillis >= windowMillis) {
				counter.windowStartedAtMillis = now;
				counter.requestCount = 0;
			}

			counter.requestCount += 1;
			counter.lastSeenAtMillis = now;

			if (counter.requestCount > maxRequests) {
				throw new ApiException(
					HttpStatus.TOO_MANY_REQUESTS,
					"RATE_LIMIT_EXCEEDED",
					message
				);
			}
		}

		cleanupIfNeeded(now, windowMillis);
	}

	private String resolveClientKey() {
		RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
		if (!(requestAttributes instanceof ServletRequestAttributes servletRequestAttributes)) {
			return "unknown";
		}

		HttpServletRequest request = servletRequestAttributes.getRequest();
		String forwardedFor = request.getHeader("X-Forwarded-For");
		if (StringUtils.hasText(forwardedFor)) {
			String[] parts = forwardedFor.split(",");
			if (parts.length > 0 && StringUtils.hasText(parts[0])) {
				return parts[0].trim();
			}
		}

		String remoteAddress = request.getRemoteAddr();
		return StringUtils.hasText(remoteAddress) ? remoteAddress : "unknown";
	}

	private void cleanupIfNeeded(long now, long windowMillis) {
		int maxTrackedKeys = rateLimitProperties.maxTrackedKeys();
		if (maxTrackedKeys <= 0 || counters.size() < maxTrackedKeys) {
			return;
		}

		counters.entrySet().removeIf(entry -> now - entry.getValue().lastSeenAtMillis >= windowMillis * 2);
	}

	private static final class WindowCounter {
		private long windowStartedAtMillis;
		private long lastSeenAtMillis;
		private int requestCount;

		private WindowCounter(long now) {
			this.windowStartedAtMillis = now;
			this.lastSeenAtMillis = now;
			this.requestCount = 0;
		}
	}
}
