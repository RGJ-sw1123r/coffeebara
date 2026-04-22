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

export function toUserSavedCafeResponse(savedCafe) {
  return {
    id: toNumber(savedCafe.id),
    appUserId: toNumber(savedCafe.appUserId),
    kakaoPlaceId: toStringValue(savedCafe.kakaoPlaceId),
    savedType: toStringValue(savedCafe.savedType),
    placeName: toStringValue(savedCafe.cafe?.placeName),
    categoryName: toStringValue(savedCafe.cafe?.categoryName),
    phone: toStringValue(savedCafe.cafe?.phone),
    addressName: toStringValue(savedCafe.cafe?.addressName),
    roadAddressName: toStringValue(savedCafe.cafe?.roadAddressName),
    latitude: toStringValue(savedCafe.cafe?.latitude),
    longitude: toStringValue(savedCafe.cafe?.longitude),
    placeUrl: toStringValue(savedCafe.cafe?.placeUrl),
    createdAt: toIsoString(savedCafe.createdAt),
    updatedAt: toIsoString(savedCafe.updatedAt),
  };
}
