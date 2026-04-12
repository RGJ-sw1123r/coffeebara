"use client";

import { useCallback, useMemo, useState, useEffect } from "react";

const STORAGE_KEY = "coffeebara.guestFavorites.v1";
const LEGACY_STORAGE_KEY = "coffeebara.preferred-cafes";
const PLACE_PROFILE_STORAGE_KEY = "coffeebara.placeProfiles.v1";

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

export default function useSavedPlacesState({ authStatus }) {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isGuestModeToastVisible, setIsGuestModeToastVisible] = useState(false);
  const [placeProfiles, setPlaceProfiles] = useState({});

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
    if (authStatus !== "authenticated") {
      return;
    }

    try {
      const storedProfiles = window.localStorage.getItem(PLACE_PROFILE_STORAGE_KEY);

      if (!storedProfiles) {
        return;
      }

      const parsed = JSON.parse(storedProfiles);

      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        setPlaceProfiles(parsed);
      }
    } catch {
      window.localStorage.removeItem(PLACE_PROFILE_STORAGE_KEY);
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !isStorageReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlaces));
  }, [authStatus, isStorageReady, savedPlaces]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      return;
    }

    window.localStorage.setItem(
      PLACE_PROFILE_STORAGE_KEY,
      JSON.stringify(placeProfiles),
    );
  }, [authStatus, placeProfiles]);

  const savedPlaceIds = useMemo(
    () => new Set(savedPlaces.map((place) => place.id)),
    [savedPlaces],
  );

  const handleToggleSavedPlace = useCallback((place) => {
    const nextPlace = normalizeSavedPlace(place);
    if (!nextPlace) {
      return;
    }

    setSavedPlaces((current) => {
      const exists = current.some((item) => item.id === nextPlace.id);

      if (exists) {
        setPlaceProfiles((currentProfiles) => {
          if (!(nextPlace.id in currentProfiles)) {
            return currentProfiles;
          }

          const { [nextPlace.id]: _removed, ...rest } = currentProfiles;
          return rest;
        });
        return current.filter((item) => item.id !== nextPlace.id);
      }

      return [...current, nextPlace];
    });
  }, []);

  const handleRemoveSavedPlace = useCallback((placeId) => {
    setSavedPlaces((current) => current.filter((item) => item.id !== placeId));
    setPlaceProfiles((currentProfiles) => {
      if (!(placeId in currentProfiles)) {
        return currentProfiles;
      }

      const { [placeId]: _removed, ...rest } = currentProfiles;
      return rest;
    });
  }, []);

  const clearSavedPlaces = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.removeItem(PLACE_PROFILE_STORAGE_KEY);
    setSavedPlaces([]);
    setPlaceProfiles({});
    setIsGuestModeToastVisible(false);
  }, []);

  const savePlaceProfile = useCallback((placeId, tags) => {
    if (!placeId) {
      return;
    }
    setPlaceProfiles((current) => ({
      ...current,
      [placeId]: Array.isArray(tags) ? tags : [],
    }));
  }, []);

  const backendSavedPlaceFetch = useMemo(
    () => ({
      status: "idle",
      fetchedCount: 0,
      totalCount: 0,
      errorMessage: "",
    }),
    [],
  );

  return {
    backendSavedPlaceFetch,
    clearSavedPlaces,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    placeProfiles,
    savedPlaceIds,
    savedPlaces,
    savePlaceProfile,
  };
}
