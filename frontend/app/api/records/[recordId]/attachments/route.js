import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { RECORD_TYPE_BEAN } from "@/app/lib/record-types";
import { groupMediaAttachmentsByOwnerId } from "@/app/lib/server/media-attachment-response";
import { MEDIA_UPLOAD_POLICY } from "@/app/lib/server/media-storage";
import { fetchBackend, readJsonResponse } from "@/app/lib/server/backend-api";
import { requireMemberSession } from "@/app/lib/server/member-session";
import { toPlaceRecordResponse } from "@/app/lib/server/place-record-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER_TYPE = "CAFE_RECORD";
const ATTACHMENT_ROLE = "RECORD_GALLERY";
const VIEW_SPOT_RECORD_TYPE = "VIEW_SPOT";

function errorResponse(status, code, message) {
  return NextResponse.json(
    {
      code,
      message,
    },
    { status },
  );
}

function toRecordId(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : 0;
}

function validateFiles(files) {
  if (!files.length) {
    return errorResponse(400, "FILES_REQUIRED", "At least one image file is required.");
  }

  if (files.length > MEDIA_UPLOAD_POLICY.maxFilesPerRequest) {
    return errorResponse(400, "TOO_MANY_FILES_IN_REQUEST", "Too many files were uploaded at once.");
  }

  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
  if (totalSize > MEDIA_UPLOAD_POLICY.maxRequestSizeBytes) {
    return errorResponse(400, "REQUEST_SIZE_LIMIT_EXCEEDED", "The upload request is too large.");
  }

  for (const file of files) {
    if (!file || typeof file.arrayBuffer !== "function") {
      return errorResponse(400, "FILE_REQUIRED", "Each upload must be a file.");
    }

    if (!file.size) {
      return errorResponse(400, "EMPTY_FILE_NOT_ALLOWED", "Empty files are not allowed.");
    }

    if (file.size > MEDIA_UPLOAD_POLICY.maxFileSizeBytes) {
      return errorResponse(400, "FILE_SIZE_LIMIT_EXCEEDED", "Each file must be 15MB or smaller.");
    }
  }

  return null;
}

async function findRecordWithAttachments(userId, recordId) {
  return prisma.cafeRecord.findFirst({
    where: {
      id: BigInt(recordId),
      appUserId: BigInt(userId),
    },
    include: {
      note: true,
      bean: true,
    },
  });
}

async function cleanupBackendStoredFiles(request, storageKeys) {
  if (!storageKeys?.length) {
    return;
  }

  try {
    await fetchBackend(request, "/api/media/images/preprocess", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storageKeys,
      }),
    });
  } catch {
    // Best-effort cleanup.
  }
}

function toUploadedItems(payload) {
  const items = Array.isArray(payload?.files) ? payload.files : [];

  return items
    .map((item) => ({
      storageKey: typeof item?.storageKey === "string" ? item.storageKey : "",
      originalFileName:
        typeof item?.originalFileName === "string" ? item.originalFileName : "upload.bin",
      contentType: typeof item?.contentType === "string" ? item.contentType : "",
      fileSize:
        typeof item?.fileSize === "number" && Number.isFinite(item.fileSize)
          ? item.fileSize
          : Number(item?.fileSize ?? 0) || 0,
      width:
        typeof item?.width === "number" && Number.isFinite(item.width)
          ? item.width
          : item?.width == null
            ? null
            : Number(item.width) || null,
      height:
        typeof item?.height === "number" && Number.isFinite(item.height)
          ? item.height
          : item?.height == null
            ? null
            : Number(item.height) || null,
      checksum: typeof item?.checksum === "string" ? item.checksum : "",
    }))
    .filter((item) => item.storageKey && item.contentType && item.fileSize > 0 && item.checksum);
}

export async function POST(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const recordId = toRecordId(params.recordId);
  if (!recordId) {
    return errorResponse(400, "RECORD_ID_REQUIRED", "Record ID is required.");
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, "INVALID_MULTIPART_REQUEST", "A multipart form upload is required.");
  }

  const files = formData.getAll("files").filter(Boolean);
  const fileValidationError = validateFiles(files);
  if (fileValidationError) {
    return fileValidationError;
  }

  let uploadedItems = [];

  try {
    const ownedRecord = await findRecordWithAttachments(session.userId, recordId);
    if (!ownedRecord) {
      return errorResponse(404, "CAFE_RECORD_NOT_FOUND", "Could not find the record.");
    }

    const existingAttachmentCount = await prisma.mediaAttachment.count({
      where: {
        ownerType: OWNER_TYPE,
        ownerId: BigInt(recordId),
        deletedAt: null,
      },
    });

    const maxAttachments =
      ownedRecord.recordType === RECORD_TYPE_BEAN
        ? MEDIA_UPLOAD_POLICY.maxAttachmentsPerBeanRecord
        : ownedRecord.recordType === VIEW_SPOT_RECORD_TYPE
          ? MEDIA_UPLOAD_POLICY.maxAttachmentsPerViewSpotRecord
          : MEDIA_UPLOAD_POLICY.maxAttachmentsPerRecord;

    if (existingAttachmentCount + files.length > maxAttachments) {
      return errorResponse(
        400,
        "RECORD_ATTACHMENT_LIMIT_EXCEEDED",
        "This record cannot store that many images.",
      );
    }

    const preprocessFormData = new FormData();
    for (const file of files) {
      preprocessFormData.append("files", file);
    }

    const backendResponse = await fetchBackend(request, "/api/media/images/preprocess", {
      method: "POST",
      body: preprocessFormData,
    });
    const backendPayload = await readJsonResponse(backendResponse);

    if (!backendResponse.ok) {
      return errorResponse(
        backendResponse.status,
        backendPayload?.code || "IMAGE_PREPROCESS_FAILED",
        backendPayload?.message || "Failed to preprocess uploaded images.",
      );
    }

    uploadedItems = toUploadedItems(backendPayload);
    if (uploadedItems.length !== files.length) {
      await cleanupBackendStoredFiles(
        request,
        uploadedItems.map((item) => item.storageKey),
      );
      return errorResponse(
        502,
        "IMAGE_PREPROCESS_RESPONSE_INVALID",
        "The upload service returned an invalid image response.",
      );
    }

    const currentMaxSortOrder = await prisma.mediaAttachment.aggregate({
      where: {
        ownerType: OWNER_TYPE,
        ownerId: BigInt(recordId),
        deletedAt: null,
      },
      _max: {
        sortOrder: true,
      },
    });

    const createdRecord = await prisma.$transaction(async (tx) => {
      let nextSortOrder = (currentMaxSortOrder._max.sortOrder ?? -1) + 1;
      const shouldMarkFirstAsCover = existingAttachmentCount === 0;

      for (let index = 0; index < uploadedItems.length; index += 1) {
        const uploadedItem = uploadedItems[index];

        await tx.mediaAttachment.create({
          data: {
            ownerType: OWNER_TYPE,
            ownerId: BigInt(recordId),
            attachmentRole: ATTACHMENT_ROLE,
            sortOrder: nextSortOrder,
            isCover: shouldMarkFirstAsCover && index === 0,
            mediaAsset: {
              create: {
                storageKey: uploadedItem.storageKey,
                originalFileName: uploadedItem.originalFileName,
                contentType: uploadedItem.contentType,
                fileSize: BigInt(uploadedItem.fileSize),
                width: uploadedItem.width,
                height: uploadedItem.height,
                checksum: uploadedItem.checksum,
              },
            },
          },
        });

        nextSortOrder += 1;
      }

      return tx.cafeRecord.findUnique({
        where: {
          id: BigInt(recordId),
        },
        include: {
          note: true,
          bean: true,
        },
      });
    });

    const attachments = await prisma.mediaAttachment.findMany({
      where: {
        ownerType: OWNER_TYPE,
        ownerId: BigInt(recordId),
        deletedAt: null,
      },
      include: {
        mediaAsset: true,
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    const attachmentsByRecordId = groupMediaAttachmentsByOwnerId(attachments);
    return NextResponse.json(
      toPlaceRecordResponse(createdRecord, attachmentsByRecordId.get(recordId) || []),
    );
  } catch {
    await cleanupBackendStoredFiles(
      request,
      uploadedItems.map((item) => item.storageKey),
    );
    return errorResponse(500, "RECORD_ATTACHMENT_SAVE_FAILED", "Failed to upload images.");
  }
}
