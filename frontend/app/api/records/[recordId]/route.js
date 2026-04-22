import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { toCafeNoteResponse } from "@/app/lib/server/cafe-note-response";
import { requireMemberSession } from "@/app/lib/server/member-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function invalidRequest(message, code = "INVALID_REQUEST") {
  return NextResponse.json(
    {
      code,
      message,
    },
    { status: 400 },
  );
}

export async function GET(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const recordId = Number(params.recordId);
  if (!Number.isFinite(recordId) || recordId < 1) {
    return invalidRequest("Record ID is required.", "RECORD_ID_REQUIRED");
  }

  try {
    const record = await prisma.cafeRecord.findFirst({
      where: {
        id: BigInt(recordId),
        appUserId: BigInt(session.userId),
      },
      include: {
        note: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        {
          code: "CAFE_RECORD_NOT_FOUND",
          message: "Could not find the record.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(toCafeNoteResponse(record));
  } catch {
    return NextResponse.json(
      {
        code: "CAFE_RECORD_LOOKUP_FAILED",
        message: "Failed to load the record.",
      },
      { status: 500 },
    );
  }
}
