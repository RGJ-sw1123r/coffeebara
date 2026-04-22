import { NextResponse } from "next/server";

import { prisma } from "../../lib/prisma";
import { fetchBackend, readJsonResponse } from "../../lib/server/backend-api";
import { requireMemberSession } from "../../lib/server/member-session";
import { toUserSavedCafeResponse } from "../../lib/server/saved-cafe-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeSavedType(value) {
  const normalized = typeof value === "string" ? value.trim().toUpperCase() : "";
  return normalized || "GENERAL";
}

function validateSaveRequest(body) {
  if (!body || typeof body !== "object") {
    return "Saved cafe payload is required.";
  }

  if (!String(body.kakaoPlaceId || "").trim()) {
    return "Cafe ID is required.";
  }

  if (!String(body.name || "").trim()) {
    return "Cafe name is required.";
  }

  return "";
}

export async function GET(request) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  try {
    const savedCafes = await prisma.userSavedCafe.findMany({
      where: {
        appUserId: BigInt(session.userId),
      },
      include: {
        cafe: true,
      },
      orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json(savedCafes.map(toUserSavedCafeResponse));
  } catch {
    return NextResponse.json(
      {
        code: "USER_SAVED_CAFE_LOOKUP_FAILED",
        message: "Failed to load saved cafes.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const body = await request.json().catch(() => null);
  const validationMessage = validateSaveRequest(body);
  if (validationMessage) {
    return NextResponse.json(
      {
        code: "INVALID_REQUEST",
        message: validationMessage,
      },
      { status: 400 },
    );
  }

  let cafeResponse;

  try {
    cafeResponse = await fetchBackend(request, "/api/cafes", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
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

  if (!cafeResponse.ok) {
    const payload = await readJsonResponse(cafeResponse);
    return NextResponse.json(
      {
        code: payload?.code || "CAFE_UPSERT_FAILED",
        message: payload?.message || "Failed to save cafe master data.",
      },
      { status: cafeResponse.status },
    );
  }

  try {
    const savedCafe = await prisma.userSavedCafe.upsert({
      where: {
        appUserId_kakaoPlaceId: {
          appUserId: BigInt(session.userId),
          kakaoPlaceId: String(body.kakaoPlaceId),
        },
      },
      update: {
        savedType: normalizeSavedType(body.savedType),
      },
      create: {
        appUserId: BigInt(session.userId),
        kakaoPlaceId: String(body.kakaoPlaceId),
        savedType: normalizeSavedType(body.savedType),
      },
      include: {
        cafe: true,
      },
    });

    return NextResponse.json(toUserSavedCafeResponse(savedCafe), { status: 201 });
  } catch {
    return NextResponse.json(
      {
        code: "USER_SAVED_CAFE_SAVE_FAILED",
        message: "Failed to save the cafe.",
      },
      { status: 500 },
    );
  }
}
