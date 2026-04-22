import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";

export async function GET() {
  return NextResponse.redirect(
    new URL("/api/auth/logout/kakao-account", BACKEND_API_BASE_URL),
  );
}
