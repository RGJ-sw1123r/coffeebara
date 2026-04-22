import { NextResponse } from "next/server";

import { buildMemberAuthSummary } from "@/app/lib/server/auth-summary";
import { getBackendAuthStatus } from "@/app/lib/server/member-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { response, payload } = await getBackendAuthStatus(request);

  if (!response.ok) {
    return NextResponse.json(
      payload || {
        code: "AUTH_STATUS_LOOKUP_FAILED",
        message: "Failed to verify auth status.",
      },
      { status: response.status },
    );
  }

  if (!payload?.authenticated || payload.mode === "guest") {
    return NextResponse.json(payload);
  }

  return NextResponse.json(await buildMemberAuthSummary(payload));
}
