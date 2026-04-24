import { NextResponse } from "next/server";

import { copySetCookieHeaders, fetchBackend, readJsonResponse } from "@/app/lib/server/backend-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const response = await fetchBackend(request, "/api/auth/logout", {
      method: "POST",
    });
    const payload = await readJsonResponse(response);
    const nextResponse = NextResponse.json(payload ?? {}, {
      status: response.status,
    });

    copySetCookieHeaders(response, nextResponse.headers);

    return nextResponse;
  } catch {
    return NextResponse.json(
      {
        code: "BACKEND_UNAVAILABLE",
        message: "Could not reach the Spring backend.",
      },
      { status: 502 },
    );
  }
}
