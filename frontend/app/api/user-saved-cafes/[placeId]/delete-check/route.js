import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { requireMemberSession } from "@/app/lib/server/member-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const placeId = decodeURIComponent(params.placeId || "").trim();
  if (!placeId) {
    return NextResponse.json(
      {
        code: "PLACE_ID_REQUIRED",
        message: "Cafe ID is required.",
      },
      { status: 400 },
    );
  }

  try {
    const recordCount = await prisma.cafeRecord.count({
      where: {
        appUserId: BigInt(session.userId),
        kakaoPlaceId: placeId,
      },
    });

    return NextResponse.json({
      placeId,
      recordCount,
      hasRecords: recordCount > 0,
    });
  } catch {
    return NextResponse.json(
      {
        code: "USER_SAVED_CAFE_DELETE_CHECK_FAILED",
        message: "Failed to check related records.",
      },
      { status: 500 },
    );
  }
}
