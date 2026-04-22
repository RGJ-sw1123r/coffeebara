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

export function toCafeNoteResponse(record, attachments = []) {
  return {
    id: toNumber(record?.id),
    kakaoPlaceId: toStringValue(record?.kakaoPlaceId),
    title: toStringValue(record?.note?.title),
    noteText: toStringValue(record?.note?.noteText),
    displayOrder: toNumber(record?.displayOrder) ?? 0,
    attachments,
    createdAt: toIsoString(record?.createdAt),
    updatedAt: toIsoString(record?.updatedAt),
  };
}
