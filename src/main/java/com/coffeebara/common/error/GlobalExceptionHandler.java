package com.coffeebara.common.error;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ApiErrorResponse> handleApiException(
		ApiException exception,
		HttpServletRequest request
	) {
		HttpStatus status = exception.getStatus();

		return ResponseEntity.status(status).body(new ApiErrorResponse(
			LocalDateTime.now(),
			status.value(),
			status.getReasonPhrase(),
			exception.getCode(),
			exception.getMessage(),
			request.getRequestURI()
		));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(
		IllegalArgumentException exception,
		HttpServletRequest request
	) {
		return ResponseEntity.badRequest().body(new ApiErrorResponse(
			LocalDateTime.now(),
			HttpStatus.BAD_REQUEST.value(),
			HttpStatus.BAD_REQUEST.getReasonPhrase(),
			"INVALID_REQUEST",
			exception.getMessage(),
			request.getRequestURI()
		));
	}

	@ExceptionHandler(CannotGetJdbcConnectionException.class)
	public ResponseEntity<ApiErrorResponse> handleJdbcConnectionException(
		CannotGetJdbcConnectionException exception,
		HttpServletRequest request
	) {
		return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ApiErrorResponse(
			LocalDateTime.now(),
			HttpStatus.SERVICE_UNAVAILABLE.value(),
			HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase(),
			"DB_CONNECTION_FAILED",
			"데이터베이스 연결이 불안정합니다. 잠시 후 다시 시도해 주세요.",
			request.getRequestURI()
		));
	}

	@ExceptionHandler(DataAccessException.class)
	public ResponseEntity<ApiErrorResponse> handleDataAccessException(
		DataAccessException exception,
		HttpServletRequest request
	) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiErrorResponse(
			LocalDateTime.now(),
			HttpStatus.INTERNAL_SERVER_ERROR.value(),
			HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
			"DATA_ACCESS_ERROR",
			"카페 정보를 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
			request.getRequestURI()
		));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiErrorResponse> handleException(
		Exception exception,
		HttpServletRequest request
	) {
		log.error("Unhandled exception for request={}", request.getRequestURI(), exception);

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiErrorResponse(
			LocalDateTime.now(),
			HttpStatus.INTERNAL_SERVER_ERROR.value(),
			HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
			"INTERNAL_SERVER_ERROR",
			"요청을 처리하는 중 예기치 않은 문제가 발생했습니다.",
			request.getRequestURI()
		));
	}
}
