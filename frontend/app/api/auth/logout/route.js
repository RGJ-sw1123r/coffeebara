import { NextResponse } from "next/server";

import { fetchBackend, readJsonResponse } from "../../../lib/server/backend-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const response = await fetchBackend(request, "/api/auth/logout", {
      method: "POST",
    });
    const payload = await readJsonResponse(response);

    return NextResponse.json(payload ?? {}, {
      status: response.status,
    });
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
