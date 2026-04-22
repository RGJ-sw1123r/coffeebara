import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { toCafeNoteResponse } from "@/app/lib/server/cafe-note-response";
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

function normalizeTitle(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}

function normalizeDisplayOrder(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
}

function validatePayload(body) {
  if (!body || typeof body !== "object") {
    return "Record payload is required.";
  }

  const noteText = typeof body.noteText === "string" ? body.noteText.trim() : "";
  if (!noteText) {
    return "Record content is required.";
  }

  return "";
}

async function findOwnedTextRecord(appUserId, placeId, recordId) {
  return prisma.cafeRecord.findFirst({
    where: {
      id: BigInt(recordId),
      appUserId,
      kakaoPlaceId: placeId,
      recordType: TEXT_RECORD_TYPE,
    },
    include: {
      note: true,
    },
  });
}

export async function GET(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const placeId = normalizePlaceId(params.placeId);
  if (!placeId) {
    return invalidRequest("Cafe ID is required.", "PLACE_ID_REQUIRED");
  }

  try {
    const records = await prisma.cafeRecord.findMany({
      where: {
        appUserId: BigInt(session.userId),
        kakaoPlaceId: placeId,
        recordType: TEXT_RECORD_TYPE,
      },
      include: {
        note: true,
      },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    return NextResponse.json(
      records.filter((record) => record.note).map(toCafeNoteResponse),
    );
  } catch {
    return NextResponse.json(
      {
        code: "CAFE_NOTE_LOOKUP_FAILED",
        message: "Failed to load records.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const placeId = normalizePlaceId(params.placeId);
  if (!placeId) {
    return invalidRequest("Cafe ID is required.", "PLACE_ID_REQUIRED");
  }

  const body = await request.json().catch(() => null);
  const validationMessage = validatePayload(body);
  if (validationMessage) {
    return invalidRequest(validationMessage, "NOTE_TEXT_REQUIRED");
  }

  const recordId = Number(body?.id);
  const noteText = body.noteText.trim();
  const title = normalizeTitle(body?.title);
  const displayOrder = normalizeDisplayOrder(body?.displayOrder);

  try {
    if (Number.isFinite(recordId) && recordId > 0) {
      const existingRecord = await findOwnedTextRecord(
        BigInt(session.userId),
        placeId,
        recordId,
      );

      if (!existingRecord?.note) {
        return NextResponse.json(
          {
            code: "CAFE_NOTE_NOT_FOUND",
            message: "Could not find the record to update.",
          },
          { status: 404 },
        );
      }

      const updatedRecord = await prisma.$transaction(async (tx) => {
        await tx.cafeRecord.update({
          where: {
            id: existingRecord.id,
          },
          data: {
            displayOrder,
          },
        });

        await tx.cafeNote.update({
          where: {
            cafeRecordId: existingRecord.id,
          },
          data: {
            title,
            noteText,
          },
        });

        return tx.cafeRecord.findUnique({
          where: {
            id: existingRecord.id,
          },
          include: {
            note: true,
          },
        });
      });

      return NextResponse.json(toCafeNoteResponse(updatedRecord));
    }

    const createdRecord = await prisma.$transaction(async (tx) => {
      const record = await tx.cafeRecord.create({
        data: {
          appUserId: BigInt(session.userId),
          kakaoPlaceId: placeId,
          recordType: TEXT_RECORD_TYPE,
          displayOrder,
          note: {
            create: {
              title,
              noteText,
            },
          },
        },
        include: {
          note: true,
        },
      });

      return record;
    });

    return NextResponse.json(toCafeNoteResponse(createdRecord));
  } catch {
    return NextResponse.json(
      {
        code: "CAFE_NOTE_SAVE_FAILED",
        message: "Failed to save the record.",
      },
      { status: 500 },
    );
  }
}
