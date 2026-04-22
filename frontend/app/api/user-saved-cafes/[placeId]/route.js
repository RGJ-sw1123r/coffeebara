import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";
import { requireMemberSession } from "../../../lib/server/member-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request, context) {
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
    await prisma.$transaction([
      prisma.cafeRecord.deleteMany({
        where: {
          appUserId: BigInt(session.userId),
          kakaoPlaceId: placeId,
        },
      }),
      prisma.userSavedCafe.deleteMany({
        where: {
          appUserId: BigInt(session.userId),
          kakaoPlaceId: placeId,
        },
      }),
    ]);
  } catch {
    return NextResponse.json(
      {
        code: "USER_SAVED_CAFE_DELETE_FAILED",
        message: "Failed to delete the saved cafe.",
      },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
