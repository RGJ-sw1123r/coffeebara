import { NextResponse } from "next/server";

import { buildMemberAuthSummary } from "@/app/lib/server/auth-summary";
import { prisma } from "@/app/lib/prisma";
import { requireMemberSession } from "@/app/lib/server/member-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function invalidDisplayName(message, code = "DISPLAY_NAME_INVALID") {
  return NextResponse.json(
    {
      code,
      message,
    },
    { status: 400 },
  );
}

function normalizeDisplayName(value) {
  const normalized = typeof value === "string" ? value.trim() : "";

  if (!normalized) {
    return {
      error: invalidDisplayName("Display name is required.", "DISPLAY_NAME_REQUIRED"),
    };
  }

  if (normalized.length > 100) {
    return {
      error: invalidDisplayName("Display name must be 100 characters or fewer.", "DISPLAY_NAME_TOO_LONG"),
    };
  }

  return {
    value: normalized,
  };
}

export async function PATCH(request) {
  const session = await requireMemberSession(request);
  if (session.error) {
    return session.error;
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return invalidDisplayName("Request body must be valid JSON.", "INVALID_JSON");
  }

  const displayNameResult = normalizeDisplayName(body?.displayName);
  if (displayNameResult.error) {
    return displayNameResult.error;
  }

  try {
    const userAccount = await prisma.appUser.update({
      where: {
        id: BigInt(session.userId),
      },
      data: {
        displayName: displayNameResult.value,
      },
    });

    return NextResponse.json(
      await buildMemberAuthSummary({
        ...session.payload,
        authenticated: true,
        userId: String(userAccount.id),
        nickname: userAccount.nickname,
        displayName: userAccount.displayName ?? userAccount.nickname,
        profileImageUrl: userAccount.profileImageUrl ?? session.payload?.profileImageUrl ?? "",
      }),
    );
  } catch {
    return NextResponse.json(
      {
        code: "DISPLAY_NAME_UPDATE_FAILED",
        message: "Failed to update the display name.",
      },
      { status: 500 },
    );
  }
}
