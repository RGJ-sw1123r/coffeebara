import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { groupMediaAttachmentsByOwnerId } from "@/app/lib/server/media-attachment-response";
import { requireMemberSession } from "@/app/lib/server/member-session";
import { toPlaceRecordResponse } from "@/app/lib/server/place-record-response";

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
        bean: true,
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

    const attachments = await prisma.mediaAttachment.findMany({
      where: {
        ownerType: "CAFE_RECORD",
        ownerId: record.id,
        deletedAt: null,
      },
      include: {
        mediaAsset: true,
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    const attachmentsByRecordId = groupMediaAttachmentsByOwnerId(attachments);
    return NextResponse.json(
      toPlaceRecordResponse(record, attachmentsByRecordId.get(Number(record.id)) || []),
    );
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
