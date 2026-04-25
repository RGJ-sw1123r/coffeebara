import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { fetchBackend } from "@/app/lib/server/backend-api";
import { groupMediaAttachmentsByOwnerId } from "@/app/lib/server/media-attachment-response";
import { requireMemberSession } from "@/app/lib/server/member-session";
import { toPlaceRecordResponse } from "@/app/lib/server/place-record-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(status, code, message) {
  return NextResponse.json(
    {
      code,
      message,
    },
    { status },
  );
}

function toPositiveInt(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? normalized : 0;
}

export async function GET(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const recordId = toPositiveInt(params.recordId);
  const attachmentId = toPositiveInt(params.attachmentId);

  if (!recordId || !attachmentId) {
    return errorResponse(400, "ATTACHMENT_ID_REQUIRED", "Attachment ID is required.");
  }

  const ownedAttachment = await prisma.mediaAttachment.findFirst({
    where: {
      id: BigInt(attachmentId),
      ownerType: "CAFE_RECORD",
      ownerId: BigInt(recordId),
      deletedAt: null,
    },
    include: {
      mediaAsset: true,
    },
  });

  if (!ownedAttachment?.mediaAsset?.storageKey) {
    return errorResponse(404, "ATTACHMENT_NOT_FOUND", "Could not find the attachment.");
  }

  const ownedRecord = await prisma.cafeRecord.findFirst({
    where: {
      id: BigInt(recordId),
      appUserId: BigInt(session.userId),
    },
    select: {
      id: true,
    },
  });

  if (!ownedRecord) {
    return errorResponse(404, "CAFE_RECORD_NOT_FOUND", "Could not find the record.");
  }

  try {
    const backendResponse = await fetchBackend(
      request,
      `/api/media/images/content?storageKey=${encodeURIComponent(ownedAttachment.mediaAsset.storageKey)}`,
      {
        method: "GET",
      },
    );

    if (!backendResponse.ok) {
      return errorResponse(
        backendResponse.status,
        "ATTACHMENT_CONTENT_NOT_FOUND",
        "Could not load the attachment image.",
      );
    }

    const headers = new Headers();
    const contentType = backendResponse.headers.get("content-type");
    const cacheControl = backendResponse.headers.get("cache-control");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    if (cacheControl) {
      headers.set("cache-control", cacheControl);
    }

    return new NextResponse(backendResponse.body, {
      status: 200,
      headers,
    });
  } catch {
    return errorResponse(502, "ATTACHMENT_CONTENT_PROXY_FAILED", "Could not load the attachment image.");
  }
}

export async function DELETE(request, context) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  const params = await context.params;
  const recordId = toPositiveInt(params.recordId);
  const attachmentId = toPositiveInt(params.attachmentId);

  if (!recordId || !attachmentId) {
    return errorResponse(400, "ATTACHMENT_ID_REQUIRED", "Attachment ID is required.");
  }

  const ownedRecord = await prisma.cafeRecord.findFirst({
    where: {
      id: BigInt(recordId),
      appUserId: BigInt(session.userId),
    },
    include: {
      note: true,
      bean: true,
    },
  });

  if (!ownedRecord) {
    return errorResponse(404, "CAFE_RECORD_NOT_FOUND", "Could not find the record.");
  }

  const ownedAttachment = await prisma.mediaAttachment.findFirst({
    where: {
      id: BigInt(attachmentId),
      ownerType: "CAFE_RECORD",
      ownerId: BigInt(recordId),
      deletedAt: null,
    },
    include: {
      mediaAsset: true,
    },
  });

  if (!ownedAttachment) {
    return errorResponse(404, "ATTACHMENT_NOT_FOUND", "Could not find the attachment.");
  }

  try {
    const refreshedRecord = await prisma.$transaction(async (tx) => {
      await tx.mediaAttachment.delete({
        where: {
          id: ownedAttachment.id,
        },
      });

      const remainingAttachments = await tx.mediaAttachment.findMany({
        where: {
          ownerType: "CAFE_RECORD",
          ownerId: BigInt(recordId),
          deletedAt: null,
        },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      });

      for (let index = 0; index < remainingAttachments.length; index += 1) {
        const attachment = remainingAttachments[index];
        await tx.mediaAttachment.update({
          where: {
            id: attachment.id,
          },
          data: {
            sortOrder: index,
            isCover: index === 0,
          },
        });
      }

      const remainingAssetReferenceCount = await tx.mediaAttachment.count({
        where: {
          mediaAssetId: ownedAttachment.mediaAssetId,
        },
      });

      if (remainingAssetReferenceCount === 0) {
        await tx.mediaAsset.delete({
          where: {
            id: ownedAttachment.mediaAssetId,
          },
        });
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

    if (ownedAttachment.mediaAsset?.storageKey) {
      try {
        await fetchBackend(request, "/api/media/images/preprocess", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storageKeys: [ownedAttachment.mediaAsset.storageKey],
          }),
        });
      } catch {
        // Best-effort cleanup.
      }
    }

    const attachments = await prisma.mediaAttachment.findMany({
      where: {
        ownerType: "CAFE_RECORD",
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
      toPlaceRecordResponse(
        refreshedRecord,
        attachmentsByRecordId.get(recordId) || [],
      ),
    );
  } catch {
    return errorResponse(
      500,
      "ATTACHMENT_DELETE_FAILED",
      "Failed to delete the attachment image.",
    );
  }
}
