import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { ACTIVE_RECORD_TYPE_CODES, RECORD_TYPE_BEAN, RECORD_TYPE_TEXT } from "@/app/lib/record-types";
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

function normalizePlaceId(value) {
  return typeof value === "string" ? decodeURIComponent(value).trim() : "";
}

function normalizeStringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableString(value) {
  const normalized = normalizeStringValue(value);
  return normalized || null;
}

function normalizeDisplayOrder(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : 0;
}

function normalizeOptionalInt(value) {
  if (value === "" || value == null) {
    return null;
  }

  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : null;
}

function normalizeRequiredDate(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return null;
  }

  return new Date(`${normalized}T00:00:00.000Z`);
}

function normalizeOptionalDate(value) {
  if (value == null || value === "") {
    return null;
  }

  return normalizeRequiredDate(value);
}

function validateTextPayload(body) {
  const title = normalizeStringValue(body?.title);
  if (!title) {
    return "Record title is required.";
  }

  const noteText = normalizeStringValue(body?.noteText);
  if (!noteText) {
    return "Record content is required.";
  }

  return "";
}

function validateBeanPayload(body) {
  const beanName = normalizeStringValue(body?.beanName);
  if (!beanName) {
    return "Bean name is required.";
  }

  if (!normalizeRequiredDate(body?.purchaseDate)) {
    return "Purchase date is required.";
  }

  return "";
}

function getValidationCode(recordType, message) {
  if (recordType === RECORD_TYPE_BEAN) {
    return message === "Bean name is required."
      ? "BEAN_NAME_REQUIRED"
      : "BEAN_PURCHASE_DATE_REQUIRED";
  }

  return message === "Record title is required."
    ? "NOTE_TITLE_REQUIRED"
    : "NOTE_TEXT_REQUIRED";
}

async function findAttachmentsByRecordIds(recordIds) {
  if (!recordIds.length) {
    return new Map();
  }

  const attachments = await prisma.mediaAttachment.findMany({
    where: {
      ownerType: "CAFE_RECORD",
      deletedAt: null,
      ownerId: {
        in: recordIds,
      },
    },
    include: {
      mediaAsset: true,
    },
    orderBy: [{ ownerId: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
  });

  return groupMediaAttachmentsByOwnerId(attachments);
}

async function findOwnedRecord(appUserId, placeId, recordId, recordType) {
  return prisma.cafeRecord.findFirst({
    where: {
      id: BigInt(recordId),
      appUserId,
      kakaoPlaceId: placeId,
      recordType,
    },
    include: {
      note: true,
      bean: true,
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
        recordType: {
          in: ACTIVE_RECORD_TYPE_CODES,
        },
      },
      include: {
        note: true,
        bean: true,
      },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    const attachmentsByRecordId = await findAttachmentsByRecordIds(records.map((record) => record.id));
    return NextResponse.json(
      records.map((record) =>
        toPlaceRecordResponse(record, attachmentsByRecordId.get(Number(record.id)) || []),
      ),
    );
  } catch {
    return NextResponse.json(
      {
        code: "PLACE_RECORD_LOOKUP_FAILED",
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
  if (!body || typeof body !== "object") {
    return invalidRequest("Record payload is required.", "INVALID_RECORD_PAYLOAD");
  }

  const recordType = normalizeStringValue(body?.recordType);
  if (!ACTIVE_RECORD_TYPE_CODES.includes(recordType)) {
    return invalidRequest("Record type is required.", "RECORD_TYPE_REQUIRED");
  }

  const validationMessage =
    recordType === RECORD_TYPE_BEAN ? validateBeanPayload(body) : validateTextPayload(body);
  if (validationMessage) {
    return invalidRequest(validationMessage, getValidationCode(recordType, validationMessage));
  }

  const recordId = Number(body?.id);
  const displayOrder = normalizeDisplayOrder(body?.displayOrder);

  try {
    if (Number.isFinite(recordId) && recordId > 0) {
      const existingRecord = await findOwnedRecord(
        BigInt(session.userId),
        placeId,
        recordId,
        recordType,
      );

      if (!existingRecord) {
        return NextResponse.json(
          {
            code: "PLACE_RECORD_NOT_FOUND",
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

        if (recordType === RECORD_TYPE_BEAN) {
          await tx.beanRecord.update({
            where: {
              cafeRecordId: existingRecord.id,
            },
            data: {
              beanName: normalizeStringValue(body.beanName),
              originCountry: normalizeNullableString(body.originCountry),
              originRegion: normalizeNullableString(body.originRegion),
              beanVariety: normalizeNullableString(body.beanVariety),
              processType: normalizeNullableString(body.processType),
              roastLevel: normalizeNullableString(body.roastLevel),
              roastDate: normalizeOptionalDate(body.roastDate),
              altitudeMeters: normalizeOptionalInt(body.altitudeMeters),
              tastingNotes: normalizeNullableString(body.tastingNotes),
              purchaseDate: normalizeRequiredDate(body.purchaseDate),
              purchasePrice: normalizeOptionalInt(body.purchasePrice),
              quantityGrams: normalizeOptionalInt(body.quantityGrams),
              memo: normalizeNullableString(body.memo),
            },
          });
        } else {
          await tx.cafeNote.update({
            where: {
              cafeRecordId: existingRecord.id,
            },
            data: {
              title: normalizeStringValue(body.title),
              noteText: normalizeStringValue(body.noteText),
            },
          });
        }

        return tx.cafeRecord.findUnique({
          where: {
            id: existingRecord.id,
          },
          include: {
            note: true,
            bean: true,
          },
        });
      });

      const attachmentsByRecordId = await findAttachmentsByRecordIds([updatedRecord.id]);
      return NextResponse.json(
        toPlaceRecordResponse(updatedRecord, attachmentsByRecordId.get(Number(updatedRecord.id)) || []),
      );
    }

    const createdRecord = await prisma.$transaction(async (tx) => {
      return tx.cafeRecord.create({
        data: {
          appUserId: BigInt(session.userId),
          kakaoPlaceId: placeId,
          recordType,
          displayOrder,
          ...(recordType === RECORD_TYPE_BEAN
            ? {
                bean: {
                  create: {
                    beanName: normalizeStringValue(body.beanName),
                    originCountry: normalizeNullableString(body.originCountry),
                    originRegion: normalizeNullableString(body.originRegion),
                    beanVariety: normalizeNullableString(body.beanVariety),
                    processType: normalizeNullableString(body.processType),
                    roastLevel: normalizeNullableString(body.roastLevel),
                    roastDate: normalizeOptionalDate(body.roastDate),
                    altitudeMeters: normalizeOptionalInt(body.altitudeMeters),
                    tastingNotes: normalizeNullableString(body.tastingNotes),
                    purchaseDate: normalizeRequiredDate(body.purchaseDate),
                    purchasePrice: normalizeOptionalInt(body.purchasePrice),
                    quantityGrams: normalizeOptionalInt(body.quantityGrams),
                    memo: normalizeNullableString(body.memo),
                  },
                },
              }
            : {
                note: {
                  create: {
                    title: normalizeStringValue(body.title),
                    noteText: normalizeStringValue(body.noteText),
                  },
                },
              }),
        },
        include: {
          note: true,
          bean: true,
        },
      });
    });

    return NextResponse.json(toPlaceRecordResponse(createdRecord, []));
  } catch {
    return NextResponse.json(
      {
        code: "PLACE_RECORD_SAVE_FAILED",
        message: "Failed to save the record.",
      },
      { status: 500 },
    );
  }
}
