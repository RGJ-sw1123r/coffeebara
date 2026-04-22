function toNumber(value) {
  if (value == null) {
    return null;
  }

  return Number(value);
}

function toStringValue(value) {
  if (value == null) {
    return "";
  }

  return String(value);
}

function toIsoString(value) {
  if (!(value instanceof Date)) {
    return "";
  }

  return value.toISOString();
}

export function toMediaAttachmentResponse(attachment) {
  return {
    attachmentId: toNumber(attachment?.id),
    mediaAssetId: toNumber(attachment?.mediaAssetId),
    ownerType: toStringValue(attachment?.ownerType),
    ownerId: toNumber(attachment?.ownerId),
    attachmentRole: toStringValue(attachment?.attachmentRole),
    sortOrder: toNumber(attachment?.sortOrder),
    isCover: Boolean(attachment?.isCover),
    storageKey: toStringValue(attachment?.mediaAsset?.storageKey),
    originalFileName: toStringValue(attachment?.mediaAsset?.originalFileName),
    contentType: toStringValue(attachment?.mediaAsset?.contentType),
    fileSize: toNumber(attachment?.mediaAsset?.fileSize),
    width: toNumber(attachment?.mediaAsset?.width),
    height: toNumber(attachment?.mediaAsset?.height),
    checksum: toStringValue(attachment?.mediaAsset?.checksum),
    createdAt: toIsoString(attachment?.createdAt),
  };
}

export function groupMediaAttachmentsByOwnerId(attachments) {
  const grouped = new Map();

  for (const attachment of attachments || []) {
    const ownerId = toNumber(attachment?.ownerId);
    if (!ownerId) {
      continue;
    }

    const current = grouped.get(ownerId) || [];
    current.push(toMediaAttachmentResponse(attachment));
    grouped.set(ownerId, current);
  }

  return grouped;
}
