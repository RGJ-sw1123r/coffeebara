"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "coffeebara.guestFavorites.v1";
const LEGACY_STORAGE_KEY = "coffeebara.preferred-cafes";
const PLACE_PROFILE_STORAGE_KEY = "coffeebara.placeProfiles.v1";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";

function normalizeSavedPlace(place) {
  if (!place || typeof place !== "object") {
    return null;
  }

  const rawId = place.kakaoPlaceId ?? place.id ?? "";
  const rawName = place.name ?? place.placeName ?? "";
  const normalizedId = typeof rawId === "string" ? rawId : String(rawId);
  const normalizedName =
    typeof rawName === "string" ? rawName.trim() : String(rawName).trim();

  if (!normalizedId || !normalizedName) {
    return null;
  }

  return {
    id: normalizedId,
    savedCafeId:
      place.savedCafeId ?? (place.kakaoPlaceId ? place.id ?? "" : ""),
    name: normalizedName,
    address:
      typeof place.address === "string"
        ? place.address
        : typeof place.addressName === "string"
          ? place.addressName
          : "",
    roadAddress:
      typeof place.roadAddress === "string"
        ? place.roadAddress
        : typeof place.roadAddressName === "string"
          ? place.roadAddressName
          : "",
    phone: typeof place.phone === "string" ? place.phone : "",
    placeUrl: typeof place.placeUrl === "string" ? place.placeUrl : "",
    categoryName: typeof place.categoryName === "string" ? place.categoryName : "",
    lat:
      typeof place.lat === "number" && Number.isFinite(place.lat)
        ? place.lat
        : typeof place.latitude === "number" && Number.isFinite(place.latitude)
          ? place.latitude
          : Number(place.lat ?? place.latitude) || 0,
    lng:
      typeof place.lng === "number" && Number.isFinite(place.lng)
        ? place.lng
        : typeof place.longitude === "number" && Number.isFinite(place.longitude)
          ? place.longitude
          : Number(place.lng ?? place.longitude) || 0,
  };
}

function normalizeSavedPlaces(places) {
  if (!Array.isArray(places)) {
    return [];
  }

  return places.map(normalizeSavedPlace).filter(Boolean);
}

async function readErrorMessage(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);
  return payload?.message || fallbackMessage;
}

export default function useSavedPlacesState({ authStatus, authMode, messages }) {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [isGuestModeToastVisible, setIsGuestModeToastVisible] = useState(false);
  const [savedPlaceActionToast, setSavedPlaceActionToast] = useState(null);
  const [placeProfiles, setPlaceProfiles] = useState({});
  const [pendingSavedPlaceDelete, setPendingSavedPlaceDelete] = useState(null);
  const [backendSavedPlaceFetch, setBackendSavedPlaceFetch] = useState({
    status: "idle",
    fetchedCount: 0,
    totalCount: 0,
    errorMessage: "",
  });

  useEffect(() => {
    if (authStatus !== "authenticated" || authMode !== "guest") {
      return;
    }

    setIsGuestModeToastVisible(true);
    const timerId = window.setTimeout(() => {
      setIsGuestModeToastVisible(false);
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [authMode, authStatus]);

  useEffect(() => {
    if (!savedPlaceActionToast?.message) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSavedPlaceActionToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [savedPlaceActionToast]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      return;
    }

    let cancelled = false;

    async function hydrateSavedPlaces() {
      if (authMode === "guest") {
        try {
          const stored =
            window.localStorage.getItem(STORAGE_KEY) ??
            window.localStorage.getItem(LEGACY_STORAGE_KEY);

          if (!stored) {
            setSavedPlaces([]);
            return;
          }

          const parsed = JSON.parse(stored);
          const normalizedPlaces = Array.isArray(parsed)
            ? normalizeSavedPlaces(parsed)
            : [];

          if (cancelled) {
            return;
          }

          if (normalizedPlaces.length > 0 || Array.isArray(parsed)) {
            setSavedPlaces(normalizedPlaces);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedPlaces));
            window.localStorage.removeItem(LEGACY_STORAGE_KEY);
          } else {
            setSavedPlaces([]);
          }
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
          window.localStorage.removeItem(LEGACY_STORAGE_KEY);
          if (!cancelled) {
            setSavedPlaces([]);
          }
        } finally {
          if (!cancelled) {
            setBackendSavedPlaceFetch({
              status: "idle",
              fetchedCount: 0,
              totalCount: 0,
              errorMessage: "",
            });
            setIsStorageReady(true);
          }
        }

        return;
      }

      setBackendSavedPlaceFetch({
        status: "loading",
        fetchedCount: 0,
        totalCount: 0,
        errorMessage: "",
      });

      try {
        const response = await fetch(`${API_BASE_URL}/api/user-saved-cafes`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            await readErrorMessage(
              response,
              messages?.fetchUnexpectedError || "Failed to load saved cafes.",
            ),
          );
        }

        const payload = await response.json().catch(() => []);
        const normalizedPlaces = normalizeSavedPlaces(payload);

        if (cancelled) {
          return;
        }

        setSavedPlaces(normalizedPlaces);
        setBackendSavedPlaceFetch({
          status: "success",
          fetchedCount: normalizedPlaces.length,
          totalCount: normalizedPlaces.length,
          errorMessage: "",
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSavedPlaces([]);
        setBackendSavedPlaceFetch({
          status: "error",
          fetchedCount: 0,
          totalCount: 0,
          errorMessage:
            error instanceof Error
              ? error.message
              : messages?.backendBannerFallback || "",
        });
      } finally {
        if (!cancelled) {
          setIsStorageReady(true);
        }
      }
    }

    hydrateSavedPlaces();

    return () => {
      cancelled = true;
    };
  }, [authMode, authStatus, messages]);

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
    if (
      authStatus !== "authenticated" ||
      authMode !== "guest" ||
      !isStorageReady
    ) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlaces));
  }, [authMode, authStatus, isStorageReady, savedPlaces]);

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

  const handleToggleSavedPlace = useCallback(
    async (place) => {
      const nextPlace = normalizeSavedPlace(place);
      if (!nextPlace) {
        return;
      }

      if (authMode === "guest") {
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
        return;
      }

      const exists = savedPlaces.some((item) => item.id === nextPlace.id);

      try {
        if (exists) {
          const response = await fetch(
            `${API_BASE_URL}/api/user-saved-cafes/${encodeURIComponent(nextPlace.id)}`,
            {
              method: "DELETE",
              credentials: "include",
            },
          );

          if (!response.ok) {
            throw new Error(
              await readErrorMessage(
                response,
                messages?.saveUnexpectedError || "Failed to update saved cafe.",
              ),
            );
          }

          setSavedPlaces((current) =>
            current.filter((item) => item.id !== nextPlace.id),
          );
          setPlaceProfiles((currentProfiles) => {
            if (!(nextPlace.id in currentProfiles)) {
              return currentProfiles;
            }

            const { [nextPlace.id]: _removed, ...rest } = currentProfiles;
            return rest;
          });
        } else {
          const response = await fetch(`${API_BASE_URL}/api/user-saved-cafes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              kakaoPlaceId: nextPlace.id,
              name: nextPlace.name,
              categoryName: nextPlace.categoryName,
              phone: nextPlace.phone,
              addressName: nextPlace.address,
              roadAddressName: nextPlace.roadAddress,
              latitude: String(nextPlace.lat || ""),
              longitude: String(nextPlace.lng || ""),
              placeUrl: nextPlace.placeUrl,
              savedType: "GENERAL",
            }),
          });

          if (!response.ok) {
            throw new Error(
              await readErrorMessage(
                response,
                messages?.saveUnexpectedError || "Failed to save cafe.",
              ),
            );
          }

          const payload = await response.json().catch(() => null);
          const normalizedPlace = normalizeSavedPlace(payload) ?? nextPlace;

          setSavedPlaces((current) => {
            const filtered = current.filter((item) => item.id !== normalizedPlace.id);
            return [...filtered, normalizedPlace];
          });
        }

        setBackendSavedPlaceFetch((current) => ({
          ...current,
          status: "success",
          errorMessage: "",
        }));
      } catch (error) {
        setBackendSavedPlaceFetch((current) => ({
          ...current,
          status: "error",
          errorMessage:
            error instanceof Error
              ? error.message
              : messages?.backendBannerFallback || "",
        }));
      }
    },
    [authMode, messages, savedPlaces],
  );

  const deleteSavedPlace = useCallback(
    async (placeId) => {
      const response = await fetch(
        `${API_BASE_URL}/api/user-saved-cafes/${encodeURIComponent(placeId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(
          await readErrorMessage(
            response,
            messages?.saveUnexpectedError || "Failed to delete saved cafe.",
          ),
        );
      }

      setSavedPlaces((current) => current.filter((item) => item.id !== placeId));
      setPlaceProfiles((currentProfiles) => {
        if (!(placeId in currentProfiles)) {
          return currentProfiles;
        }

        const { [placeId]: _removed, ...rest } = currentProfiles;
        return rest;
      });
      setBackendSavedPlaceFetch((current) => ({
        ...current,
        status: "success",
        errorMessage: "",
      }));
      setSavedPlaceActionToast({
        type: "success",
        message: messages.savedPlaceDeletedToast,
      });
    },
    [messages],
  );

  const handleRemoveSavedPlace = useCallback(
    async (placeId) => {
      if (authMode === "guest") {
        setSavedPlaces((current) => current.filter((item) => item.id !== placeId));
        setPlaceProfiles((currentProfiles) => {
          if (!(placeId in currentProfiles)) {
            return currentProfiles;
          }

          const { [placeId]: _removed, ...rest } = currentProfiles;
          return rest;
        });
        return;
      }

      try {
        const deleteCheckResponse = await fetch(
          `${API_BASE_URL}/api/user-saved-cafes/${encodeURIComponent(placeId)}/delete-check`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!deleteCheckResponse.ok) {
          throw new Error(
            await readErrorMessage(
              deleteCheckResponse,
              messages?.saveUnexpectedError || "Failed to check saved cafe records.",
            ),
          );
        }

        const deleteCheck = await deleteCheckResponse.json().catch(() => null);
        const hasRecords = Boolean(deleteCheck?.hasRecords);
        const recordCount = Number(deleteCheck?.recordCount ?? 0);

        if (hasRecords) {
          setPendingSavedPlaceDelete({
            placeId,
            recordCount,
          });
          return;
        }

        await deleteSavedPlace(placeId);
      } catch (error) {
        setBackendSavedPlaceFetch((current) => ({
          ...current,
          status: "error",
          errorMessage:
            error instanceof Error
              ? error.message
              : messages?.backendBannerFallback || "",
        }));
      }
    },
    [authMode, deleteSavedPlace, messages],
  );

  const confirmRemoveSavedPlace = useCallback(async () => {
    if (!pendingSavedPlaceDelete?.placeId) {
      return;
    }

    try {
      await deleteSavedPlace(pendingSavedPlaceDelete.placeId);
      setPendingSavedPlaceDelete(null);
    } catch (error) {
      setBackendSavedPlaceFetch((current) => ({
        ...current,
        status: "error",
        errorMessage:
          error instanceof Error
            ? error.message
            : messages?.backendBannerFallback || "",
      }));
    }
  }, [deleteSavedPlace, messages, pendingSavedPlaceDelete]);

  const cancelRemoveSavedPlace = useCallback(() => {
    setPendingSavedPlaceDelete(null);
  }, []);

  const clearSavedPlaces = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    window.localStorage.removeItem(PLACE_PROFILE_STORAGE_KEY);
    setSavedPlaces([]);
    setPlaceProfiles({});
    setPendingSavedPlaceDelete(null);
    setIsGuestModeToastVisible(false);
    setSavedPlaceActionToast(null);
    setBackendSavedPlaceFetch({
      status: "idle",
      fetchedCount: 0,
      totalCount: 0,
      errorMessage: "",
    });
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

  return {
    backendSavedPlaceFetch,
    cancelRemoveSavedPlace,
    clearSavedPlaces,
    confirmRemoveSavedPlace,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    pendingSavedPlaceDelete,
    placeProfiles,
    savedPlaceActionToast,
    savedPlaceIds,
    savedPlaces,
    savePlaceProfile,
  };
}
