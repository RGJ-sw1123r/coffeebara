import { NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { fetchBackend } from "@/app/lib/server/backend-api";
import { requireMemberSession } from "@/app/lib/server/member-session";

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
