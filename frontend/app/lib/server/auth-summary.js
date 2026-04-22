import { prisma } from "../prisma";

export async function buildMemberAuthSummary(payload) {
  const userId = Number(payload?.userId);

  if (!Number.isFinite(userId) || userId < 1) {
    return payload;
  }

  try {
    const [userAccount, recordCount] = await Promise.all([
      prisma.appUser.findUnique({
        where: {
          id: BigInt(userId),
        },
      }),
      prisma.cafeRecord.count({
        where: {
          appUserId: BigInt(userId),
        },
      }),
    ]);

    return {
      ...payload,
      userId: String(userAccount?.id ?? payload.userId ?? ""),
      nickname: userAccount?.nickname ?? payload.nickname ?? "",
      displayName:
        userAccount?.displayName ??
        userAccount?.nickname ??
        payload.displayName ??
        payload.nickname ??
        "",
      profileImageUrl:
        userAccount?.profileImageUrl ?? payload.profileImageUrl ?? "",
      recordCount,
    };
  } catch {
    return payload;
  }
}
