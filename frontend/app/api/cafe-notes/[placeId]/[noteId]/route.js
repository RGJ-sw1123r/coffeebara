import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { requireMemberSession } from "@/app/lib/server/member-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEXT_RECORD_TYPE = "TEXT";

function invalidRequest(message, code = "INVALID_REQUEST") {
  return NextResponse.json(
    {
      code,
      message,
    },
    { status: 400 },
  );
}

function normalizePlaceId(value) {
  return typeof value === "string" ? decodeURIComponent(value).trim() : "";
}

function normalizeRecordId(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : 0;
}

export async function DELETE(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const placeId = normalizePlaceId(params.placeId);
  const noteId = normalizeRecordId(params.noteId);

  if (!placeId) {
    return invalidRequest("Cafe ID is required.", "PLACE_ID_REQUIRED");
  }

  if (!noteId) {
    return invalidRequest("Record ID is required.", "NOTE_ID_REQUIRED");
  }

  try {
    const existingRecord = await prisma.cafeRecord.findFirst({
      where: {
        id: BigInt(noteId),
        appUserId: BigInt(session.userId),
        kakaoPlaceId: placeId,
        recordType: TEXT_RECORD_TYPE,
      },
      select: {
        id: true,
      },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          code: "CAFE_NOTE_NOT_FOUND",
          message: "Could not find the record to delete.",
        },
        { status: 404 },
      );
    }

    await prisma.cafeRecord.delete({
      where: {
        id: existingRecord.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      {
        code: "CAFE_NOTE_DELETE_FAILED",
        message: "Failed to delete the record.",
      },
      { status: 500 },
    );
  }
}
