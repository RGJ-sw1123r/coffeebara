import { NextResponse } from "next/server";

import { buildMemberAuthSummary } from "../../../../../lib/server/auth-summary";
import { fetchBackend, readJsonResponse } from "../../../../../lib/server/backend-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request) {
  let response;
  let payload;

  try {
    const body = await request.text();
    response = await fetchBackend(request, "/api/auth/profile/display-name", {
      method: "PATCH",
      headers: {
        "content-type": request.headers.get("content-type") || "application/json",
      },
      body,
    });
    payload = await readJsonResponse(response);
  } catch {
    return NextResponse.json(
      {
        code: "BACKEND_UNAVAILABLE",
        message: "Could not reach the Spring backend.",
      },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      payload || {
        code: "DISPLAY_NAME_UPDATE_FAILED",
        message: "Failed to update the display name.",
      },
      { status: response.status },
    );
  }

  return NextResponse.json(await buildMemberAuthSummary(payload));
}
