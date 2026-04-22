import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { toCafeNoteResponse } from "@/app/lib/server/cafe-note-response";
import { groupMediaAttachmentsByOwnerId } from "@/app/lib/server/media-attachment-response";
import {
  cleanupStoredFiles,
  isAllowedImageContentType,
  MEDIA_UPLOAD_POLICY,
  normalizeContentType,
  persistUploadFile,
} from "@/app/lib/server/media-storage";
import { requireMemberSession } from "@/app/lib/server/member-session";

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

    if (!isAllowedImageContentType(file.type)) {
      return errorResponse(
        400,
        "UNSUPPORTED_IMAGE_CONTENT_TYPE",
        "Only JPEG, PNG, and WEBP images are supported.",
      );
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
    },
  });
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

  const storedPaths = [];

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
      ownedRecord.recordType === VIEW_SPOT_RECORD_TYPE
        ? MEDIA_UPLOAD_POLICY.maxAttachmentsPerViewSpotRecord
        : MEDIA_UPLOAD_POLICY.maxAttachmentsPerRecord;

    if (existingAttachmentCount + files.length > maxAttachments) {
      return errorResponse(
        400,
        "RECORD_ATTACHMENT_LIMIT_EXCEEDED",
        "This record cannot store that many images.",
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

    let nextSortOrder = (currentMaxSortOrder._max.sortOrder ?? -1) + 1;
    const shouldMarkFirstAsCover = existingAttachmentCount === 0;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const stored = await persistUploadFile(file, OWNER_TYPE);
      storedPaths.push(stored.storagePath);

      await prisma.mediaAttachment.create({
        data: {
          ownerType: OWNER_TYPE,
          ownerId: BigInt(recordId),
          attachmentRole: ATTACHMENT_ROLE,
          sortOrder: nextSortOrder,
          isCover: shouldMarkFirstAsCover && index === 0,
          mediaAsset: {
            create: {
              storageKey: stored.storageKey,
              originalFileName: file.name || "upload.bin",
              contentType: normalizeContentType(file.type),
              fileSize: BigInt(stored.fileSize),
              width: null,
              height: null,
              checksum: stored.checksum,
            },
          },
        },
      });

      nextSortOrder += 1;
    }

    const refreshedRecord = await findRecordWithAttachments(session.userId, recordId);
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
      toCafeNoteResponse(refreshedRecord, attachmentsByRecordId.get(recordId) || []),
    );
  } catch {
    await cleanupStoredFiles(storedPaths);
    return errorResponse(500, "RECORD_ATTACHMENT_SAVE_FAILED", "Failed to upload images.");
  }
}
