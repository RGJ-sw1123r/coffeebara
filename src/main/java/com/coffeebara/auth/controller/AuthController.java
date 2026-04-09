package com.coffeebara.auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@PostMapping("/guest")
	public ResponseEntity<AuthStatusResponse> enterAsGuest(HttpServletRequest request) {
		Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
			"guest",
			"N/A",
			List.of(new SimpleGrantedAuthority("ROLE_GUEST"))
		);

		SecurityContext context = SecurityContextHolder.createEmptyContext();
		context.setAuthentication(authentication);
		SecurityContextHolder.setContext(context);

		HttpSession session = request.getSession(true);
		session.setAttribute(
			HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
			context
		);

		return ResponseEntity.ok(new AuthStatusResponse(true, "guest"));
	}

	@PostMapping("/logout")
	public ResponseEntity<AuthStatusResponse> logout(HttpServletRequest request) {
		SecurityContextHolder.clearContext();

		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
		}

		return ResponseEntity.ok(new AuthStatusResponse(false, ""));
	}

	@GetMapping("/status")
	public ResponseEntity<AuthStatusResponse> getAuthStatus(Authentication authentication) {
		if (
			authentication == null ||
			authentication instanceof AnonymousAuthenticationToken ||
			!authentication.isAuthenticated()
		) {
			return ResponseEntity.ok(new AuthStatusResponse(false, ""));
		}

		return ResponseEntity.ok(new AuthStatusResponse(true, String.valueOf(authentication.getName())));
	}

	private record AuthStatusResponse(
		boolean authenticated,
		String mode
	) {
	}
}
