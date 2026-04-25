import { RECORD_TYPE_BEAN } from "@/app/lib/record-types";

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

function toDateOnlyString(value) {
  if (!(value instanceof Date)) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

export function toPlaceRecordResponse(record, attachments = []) {
  const baseResponse = {
    id: toNumber(record?.id),
    kakaoPlaceId: toStringValue(record?.kakaoPlaceId),
    recordType: toStringValue(record?.recordType),
    displayOrder: toNumber(record?.displayOrder) ?? 0,
    attachments,
    createdAt: toIsoString(record?.createdAt),
    updatedAt: toIsoString(record?.updatedAt),
  };

  if (record?.recordType === RECORD_TYPE_BEAN) {
    return {
      ...baseResponse,
      beanName: toStringValue(record?.bean?.beanName),
      originCountry: toStringValue(record?.bean?.originCountry),
      originRegion: toStringValue(record?.bean?.originRegion),
      beanVariety: toStringValue(record?.bean?.beanVariety),
      processType: toStringValue(record?.bean?.processType),
      roastLevel: toStringValue(record?.bean?.roastLevel),
      roastDate: toDateOnlyString(record?.bean?.roastDate),
      altitudeMeters: toNumber(record?.bean?.altitudeMeters),
      tastingNotes: toStringValue(record?.bean?.tastingNotes),
      purchaseDate: toDateOnlyString(record?.bean?.purchaseDate),
      purchasePrice: toNumber(record?.bean?.purchasePrice),
      quantityGrams: toNumber(record?.bean?.quantityGrams),
      memo: toStringValue(record?.bean?.memo),
    };
  }

  return {
    ...baseResponse,
    title: toStringValue(record?.note?.title),
    noteText: toStringValue(record?.note?.noteText),
  };
}
