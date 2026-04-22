import { NextResponse } from "next/server";

import { fetchBackend, readJsonResponse } from "./backend-api";

function errorResponse(status, code, message) {
  return NextResponse.json(
    {
      code,
      message,
    },
    { status },
  );
}

export async function getBackendAuthStatus(request) {
  try {
    const response = await fetchBackend(request, "/api/auth/status", {
      method: "GET",
    });
    const payload = await readJsonResponse(response);

    return {
      response,
      payload,
    };
  } catch {
    return {
      response: new Response(
        JSON.stringify({
          code: "BACKEND_UNAVAILABLE",
          message: "Could not reach the Spring backend.",
        }),
        {
          status: 502,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
      payload: {
        code: "BACKEND_UNAVAILABLE",
        message: "Could not reach the Spring backend.",
      },
    };
  }
}

export async function requireMemberSession(request) {
  const { response, payload } = await getBackendAuthStatus(request);

  if (!response.ok) {
    return {
      error: errorResponse(502, "AUTH_STATUS_LOOKUP_FAILED", "Failed to verify auth status."),
    };
  }

  if (!payload?.authenticated) {
    return {
      error: errorResponse(401, "UNAUTHORIZED", "Authentication is required."),
    };
  }

  if (payload.mode === "guest") {
    return {
      error: errorResponse(403, "MEMBER_ONLY", "Guest mode cannot use this endpoint."),
    };
  }

  const userId = Number(payload.userId);
  if (!Number.isFinite(userId) || userId < 1) {
    return {
      error: errorResponse(401, "INVALID_USER", "Could not resolve the authenticated user."),
    };
  }

  return {
    payload,
    userId,
  };
}
