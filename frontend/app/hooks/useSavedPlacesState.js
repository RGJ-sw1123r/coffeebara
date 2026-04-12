"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "coffeebara.guestFavorites.v1";
const LEGACY_STORAGE_KEY = "coffeebara.preferred-cafes";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";

function buildFriendlyBackendErrorMessage(errorCode, fallbackMessage, placeName, messages) {
  const placeLabel = placeName ? `"${placeName}"` : messages.selectedCafeLabel;

  switch (errorCode) {
    case "DB_CONNECTION_FAILED":
      return messages.fetchTemporaryConnectionError(placeLabel);
    case "CAFE_UPSERT_FAILED":
      return messages.fetchUpsertError(placeLabel);
    case "CAFE_LOOKUP_FAILED":
    case "DATA_ACCESS_ERROR":
      return messages.fetchLookupError(placeLabel);
    default:
      return fallbackMessage || messages.fetchGenericError(placeLabel);
  }
}

async function parseBackendError(response, placeName, messages) {
  try {
    const payload = await response.json();

    return buildFriendlyBackendErrorMessage(
      typeof payload?.code === "string" ? payload.code : "",
      typeof payload?.message === "string" ? payload.message : "",
      placeName,
      messages,
    );
  } catch {
    return buildFriendlyBackendErrorMessage("", "", placeName, messages);
  }
}

function mapBackendPlaceToSavedPlace(place) {
  const placeName = place.placeName ?? place.place_name;
  const addressName = place.addressName ?? place.address_name;
  const roadAddressName = place.roadAddressName ?? place.road_address_name;
  const categoryName = place.categoryName ?? place.category_name;
  const placeUrl = place.placeUrl ?? place.place_url;
  const latitude = place.latitude ?? place.y;
  const longitude = place.longitude ?? place.x;

  return {
    id: String(place.id),
    name: placeName,
    address: addressName,
    roadAddress: roadAddressName,
    phone: place.phone,
    placeUrl,
    categoryName,
    lat: Number(latitude),
    lng: Number(longitude),
  };
}

function normalizeSavedPlace(place) {
  if (!place || typeof place !== "object") {
    return null;
  }

  const normalizedId = typeof place.id === "string" ? place.id : String(place.id ?? "");
  const normalizedName =
    typeof place.name === "string" ? place.name.trim() : String(place.name ?? "").trim();

  if (!normalizedId || !normalizedName) {
    return null;
  }

  return {
    id: normalizedId,
    name: normalizedName,
    address: typeof place.address === "string" ? place.address : "",
    roadAddress: typeof place.roadAddress === "string" ? place.roadAddress : "",
    phone: typeof place.phone === "string" ? place.phone : "",
    placeUrl: typeof place.placeUrl === "string" ? place.placeUrl : "",
    categoryName: typeof place.categoryName === "string" ? place.categoryName : "",
    lat:
      typeof place.lat === "number" && Number.isFinite(place.lat)
        ? place.lat
        : Number(place.lat) || 0,
    lng:
      typeof place.lng === "number" && Number.isFinite(place.lng)
        ? place.lng
        : Number(place.lng) || 0,
  };
}

function normalizeSavedPlaces(places) {
  if (!Array.isArray(places)) {
    return [];
  }

  return places.map(normalizeSavedPlace).filter(Boolean);
}

function areSavedPlacesEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((place, index) => {
    const target = right[index];

    return (
      place.id === target.id &&
      place.name === target.name &&
      place.address === target.address &&
      place.roadAddress === target.roadAddress &&
      place.phone === target.phone &&
      place.placeUrl === target.placeUrl &&
      place.categoryName === target.categoryName &&
      place.lat === target.lat &&
      place.lng === target.lng
    );
  });
}

async function syncSavedPlaceToBackend(place, messages) {
  const response = await fetch(`${API_BASE_URL}/api/cafes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kakaoPlaceId: place.id,
      name: place.name,
      categoryName: place.categoryName,
      phone: place.phone,
      addressName: place.address,
      roadAddressName: place.roadAddress,
      latitude: String(place.lat),
      longitude: String(place.lng),
      placeUrl: place.placeUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseBackendError(response, place.name, messages));
  }
}

export default function useSavedPlacesState({ authStatus, messages }) {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [backendSavedPlaceFetch, setBackendSavedPlaceFetch] = useState({
    status: "idle",
    fetchedCount: 0,
    totalCount: 0,
    errorMessage: "",
  });
  const [isGuestModeToastVisible, setIsGuestModeToastVisible] = useState(false);
  const [hasHydratedSavedPlaces, setHasHydratedSavedPlaces] = useState(false);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      return;
    }

    setIsGuestModeToastVisible(true);
    const timerId = window.setTimeout(() => {
      setIsGuestModeToastVisible(false);
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      return;
    }

    try {
      const stored =
        window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem(LEGACY_STORAGE_KEY);

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      const normalizedPlaces = Array.isArray(parsed)
        ? normalizeSavedPlaces(parsed)
        : [];

      if (normalizedPlaces.length > 0 || Array.isArray(parsed)) {
        setSavedPlaces(normalizedPlaces);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedPlaces));
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } finally {
      setIsStorageReady(true);
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !isStorageReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlaces));
  }, [authStatus, isStorageReady, savedPlaces]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !isStorageReady) {
      return;
    }

    if (hasHydratedSavedPlaces) {
      return;
    }

    if (savedPlaces.length === 0) {
      setHasHydratedSavedPlaces(true);
      setBackendSavedPlaceFetch({
        status: "idle",
        fetchedCount: 0,
        totalCount: 0,
        errorMessage: "",
      });
      return;
    }

    let cancelled = false;

    async function fetchSavedPlacesFromBackend() {
      setBackendSavedPlaceFetch({
        status: "loading",
        fetchedCount: 0,
        totalCount: savedPlaces.length,
        errorMessage: "",
      });

      const fetchedPlaces = [];

      try {
        for (const place of savedPlaces) {
          const response = await fetch(
            `${API_BASE_URL}/api/cafes/${encodeURIComponent(place.id)}?query=${encodeURIComponent(place.name)}`,
            {
              credentials: "include",
            },
          );

          if (!response.ok) {
            throw new Error(await parseBackendError(response, place.name, messages));
          }

          const data = await response.json();
          const fetchedPlace = mapBackendPlaceToSavedPlace(data);
          await syncSavedPlaceToBackend(fetchedPlace, messages);
          fetchedPlaces.push(fetchedPlace);

          if (cancelled) {
            return;
          }

          setBackendSavedPlaceFetch({
            status: "loading",
            fetchedCount: fetchedPlaces.length,
            totalCount: savedPlaces.length,
            errorMessage: "",
          });
        }

        if (cancelled) {
          return;
        }

        if (!areSavedPlacesEqual(savedPlaces, fetchedPlaces)) {
          setSavedPlaces(normalizeSavedPlaces(fetchedPlaces));
        }

        setHasHydratedSavedPlaces(true);
        setBackendSavedPlaceFetch({
          status: "success",
          fetchedCount: fetchedPlaces.length,
          totalCount: savedPlaces.length,
          errorMessage: "",
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setBackendSavedPlaceFetch({
          status: "error",
          fetchedCount: fetchedPlaces.length,
          totalCount: savedPlaces.length,
          errorMessage:
            error instanceof Error ? error.message : messages.fetchUnexpectedError,
        });
        setHasHydratedSavedPlaces(true);
      }
    }

    fetchSavedPlacesFromBackend();

    return () => {
      cancelled = true;
    };
  }, [authStatus, hasHydratedSavedPlaces, isStorageReady, messages, savedPlaces]);

  const savedPlaceIds = useMemo(
    () => new Set(savedPlaces.map((place) => place.id)),
    [savedPlaces],
  );

  const handleToggleSavedPlace = useCallback((place) => {
    const nextPlace = normalizeSavedPlace(place);
    if (!nextPlace) {
      return;
    }

    const isAlreadySaved = savedPlaceIds.has(nextPlace.id);

    setSavedPlaces((current) => {
      const exists = current.some((item) => item.id === nextPlace.id);

      if (exists) {
        return current.filter((item) => item.id !== nextPlace.id);
      }

      return [...current, nextPlace];
    });

    if (isAlreadySaved) {
      return;
    }

    syncSavedPlaceToBackend(nextPlace, messages)
      .then(() => {
        setBackendSavedPlaceFetch((current) => ({
          ...current,
          status: "idle",
          errorMessage: "",
        }));
      })
      .catch((error) => {
        setBackendSavedPlaceFetch((current) => ({
          ...current,
          status: "error",
          errorMessage:
            error instanceof Error ? error.message : messages.saveUnexpectedError,
        }));
      });
  }, [messages, savedPlaceIds]);

  const handleRemoveSavedPlace = useCallback((placeId) => {
    setSavedPlaces((current) => current.filter((item) => item.id !== placeId));
  }, []);

  const clearSavedPlaces = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    setSavedPlaces([]);
    setHasHydratedSavedPlaces(false);
    setIsGuestModeToastVisible(false);
  }, []);

  return {
    backendSavedPlaceFetch,
    clearSavedPlaces,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    savedPlaceIds,
    savedPlaces,
  };
}
