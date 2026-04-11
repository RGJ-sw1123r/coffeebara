"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getMessages } from "../messages";

const STORAGE_KEY = "coffeebara.guestFavorites.v1";
const LEGACY_STORAGE_KEY = "coffeebara.preferred-cafes";
const LOCALE_STORAGE_KEY = "coffeebara.locale.v1";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";
const DEFAULT_MAP_VIEW = { lat: 37.566826, lng: 126.9786567 };
const INITIAL_SEARCH_STATE = {
  results: [],
  visibleCount: 0,
  totalCount: 0,
  hiddenCount: 0,
  isSearching: false,
  source: "idle",
  status: "idle",
  errorMessage: "",
  errorCode: "",
};

function createLoadingSearchState(source) {
  return {
    ...INITIAL_SEARCH_STATE,
    source,
    status: "loading",
  };
}

function getInitialLocale() {
  if (typeof window === "undefined") {
    return "ko";
  }

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

    if (storedLocale === "ko" || storedLocale === "en" || storedLocale === "ja") {
      return storedLocale;
    }
  } catch {
    // Ignore storage access failures and keep the default locale.
  }

  return "ko";
}

function buildFriendlyBackendErrorMessage(errorCode, fallbackMessage, cafeName, messages) {
  const cafeLabel = cafeName ? `"${cafeName}"` : messages.selectedCafeLabel;

  switch (errorCode) {
    case "DB_CONNECTION_FAILED":
      return messages.fetchTemporaryConnectionError(cafeLabel);
    case "CAFE_UPSERT_FAILED":
      return messages.fetchUpsertError(cafeLabel);
    case "CAFE_LOOKUP_FAILED":
    case "DATA_ACCESS_ERROR":
      return messages.fetchLookupError(cafeLabel);
    default:
      return fallbackMessage || messages.fetchGenericError(cafeLabel);
  }
}

async function parseBackendError(response, cafeName, messages) {
  try {
    const payload = await response.json();

    return buildFriendlyBackendErrorMessage(
      typeof payload?.code === "string" ? payload.code : "",
      typeof payload?.message === "string" ? payload.message : "",
      cafeName,
      messages,
    );
  } catch {
    return buildFriendlyBackendErrorMessage("", "", cafeName, messages);
  }
}

function mapBackendCafeToFavoriteCafe(cafe) {
  const placeName = cafe.placeName ?? cafe.place_name;
  const addressName = cafe.addressName ?? cafe.address_name;
  const roadAddressName = cafe.roadAddressName ?? cafe.road_address_name;
  const categoryName = cafe.categoryName ?? cafe.category_name;
  const placeUrl = cafe.placeUrl ?? cafe.place_url;
  const latitude = cafe.latitude ?? cafe.y;
  const longitude = cafe.longitude ?? cafe.x;

  return {
    id: String(cafe.id),
    name: placeName,
    address: addressName,
    roadAddress: roadAddressName,
    phone: cafe.phone,
    placeUrl,
    categoryName,
    lat: Number(latitude),
    lng: Number(longitude),
  };
}

function normalizeFavoriteCafe(cafe) {
  if (!cafe || typeof cafe !== "object") {
    return null;
  }

  const normalizedId = typeof cafe.id === "string" ? cafe.id : String(cafe.id ?? "");
  const normalizedName =
    typeof cafe.name === "string" ? cafe.name.trim() : String(cafe.name ?? "").trim();

  if (!normalizedId || !normalizedName) {
    return null;
  }

  return {
    id: normalizedId,
    name: normalizedName,
    address: typeof cafe.address === "string" ? cafe.address : "",
    roadAddress: typeof cafe.roadAddress === "string" ? cafe.roadAddress : "",
    phone: typeof cafe.phone === "string" ? cafe.phone : "",
    placeUrl: typeof cafe.placeUrl === "string" ? cafe.placeUrl : "",
    categoryName: typeof cafe.categoryName === "string" ? cafe.categoryName : "",
    lat:
      typeof cafe.lat === "number" && Number.isFinite(cafe.lat)
        ? cafe.lat
        : Number(cafe.lat) || 0,
    lng:
      typeof cafe.lng === "number" && Number.isFinite(cafe.lng)
        ? cafe.lng
        : Number(cafe.lng) || 0,
  };
}

function normalizeFavoriteCafes(cafes) {
  if (!Array.isArray(cafes)) {
    return [];
  }

  return cafes
    .map(normalizeFavoriteCafe)
    .filter(Boolean);
}

function areFavoriteCafesEqual(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((cafe, index) => {
    const target = right[index];

    return (
      cafe.id === target.id &&
      cafe.name === target.name &&
      cafe.address === target.address &&
      cafe.roadAddress === target.roadAddress &&
      cafe.phone === target.phone &&
      cafe.placeUrl === target.placeUrl &&
      cafe.categoryName === target.categoryName &&
      cafe.lat === target.lat &&
      cafe.lng === target.lng
    );
  });
}

async function syncFavoriteCafeToBackend(cafe, messages) {
  const response = await fetch(`${API_BASE_URL}/api/cafes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kakaoPlaceId: cafe.id,
      name: cafe.name,
      categoryName: cafe.categoryName,
      phone: cafe.phone,
      addressName: cafe.address,
      roadAddressName: cafe.roadAddress,
      latitude: String(cafe.lat),
      longitude: String(cafe.lng),
      placeUrl: cafe.placeUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseBackendError(response, cafe.name, messages));
  }
}

export default function useHomePageState() {
  const router = useRouter();
  const [favoriteCafes, setFavoriteCafes] = useState([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [locale, setLocale] = useState(getInitialLocale);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRequestVersion, setSearchRequestVersion] = useState(0);
  const [resetViewVersion, setResetViewVersion] = useState(0);
  const [mapViewport, setMapViewport] = useState(DEFAULT_MAP_VIEW);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [activePlaceId, setActivePlaceId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);
  const [backendFavoriteFetch, setBackendFavoriteFetch] = useState({
    status: "idle",
    fetchedCount: 0,
    totalCount: 0,
    errorMessage: "",
  });
  const [authStatus, setAuthStatus] = useState("checking");
  const [isGuestModeToastVisible, setIsGuestModeToastVisible] = useState(false);
  const [hasHydratedFavoriteCafes, setHasHydratedFavoriteCafes] = useState(false);
  const [noticeState, setNoticeState] = useState(null);
  const [pendingToastKey, setPendingToastKey] = useState("");
  const [pendingToastSource, setPendingToastSource] = useState("idle");
  const [pendingToastToken, setPendingToastToken] = useState(0);
  const toastTokenRef = useRef(0);
  const noticeTokenRef = useRef(0);
  const messages = useMemo(() => getMessages(locale), [locale]);
  const toastCatalog = useMemo(
    () => ({
      searchTooMany: {
        type: "search-too-many",
        title: messages.searchTooManyTitle,
        message: messages.searchTooManyNotice,
      },
      searchEmptyInput: {
        type: "search-empty-input",
        title: messages.searchEmptyInputTitle,
        message: messages.searchEmptyInputNotice,
      },
      mapTooMany: {
        type: "map-too-many",
        title: messages.searchTooManyTitle,
        message: messages.mapTooManyNotice,
      },
      requestRateLimited: {
        type: "request-rate-limited",
        title: messages.requestRateLimitedTitle,
        message: messages.requestRateLimitedNotice,
      },
    }),
    [messages],
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage access failures and keep the in-memory locale.
    }
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAuthStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to verify auth status.");
        }

        const payload = await response.json();

        if (cancelled) {
          return;
        }

        if (payload?.authenticated) {
          setAuthStatus("authenticated");
          return;
        }

        setAuthStatus("redirecting");
        router.replace("/login");
      } catch {
        if (cancelled) {
          return;
        }

        setAuthStatus("redirecting");
        router.replace("/login");
      }
    }

    fetchAuthStatus();

    return () => {
      cancelled = true;
    };
  }, [router]);

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
      const normalizedFavorites = Array.isArray(parsed)
        ? normalizeFavoriteCafes(parsed)
        : [];

      if (normalizedFavorites.length > 0 || Array.isArray(parsed)) {
        setFavoriteCafes(normalizedFavorites);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedFavorites));
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

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteCafes));
  }, [authStatus, favoriteCafes, isStorageReady]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !isStorageReady) {
      return;
    }

    if (hasHydratedFavoriteCafes) {
      return;
    }

    if (favoriteCafes.length === 0) {
      setHasHydratedFavoriteCafes(true);
      setBackendFavoriteFetch({
        status: "idle",
        fetchedCount: 0,
        totalCount: 0,
        errorMessage: "",
      });
      return;
    }

    let cancelled = false;

    async function fetchFavoriteCafesFromBackend() {
      setBackendFavoriteFetch({
        status: "loading",
        fetchedCount: 0,
        totalCount: favoriteCafes.length,
        errorMessage: "",
      });

      const fetchedCafes = [];

      try {
        for (const cafe of favoriteCafes) {
          const response = await fetch(
            `${API_BASE_URL}/api/cafes/${encodeURIComponent(cafe.id)}?query=${encodeURIComponent(cafe.name)}`,
            {
              credentials: "include",
            },
          );

          if (!response.ok) {
            throw new Error(await parseBackendError(response, cafe.name, messages));
          }

          const data = await response.json();
          const fetchedCafe = mapBackendCafeToFavoriteCafe(data);
          await syncFavoriteCafeToBackend(fetchedCafe, messages);
          fetchedCafes.push(fetchedCafe);

          if (cancelled) {
            return;
          }

          setBackendFavoriteFetch({
            status: "loading",
            fetchedCount: fetchedCafes.length,
            totalCount: favoriteCafes.length,
            errorMessage: "",
          });
        }

        if (cancelled) {
          return;
        }

        if (!areFavoriteCafesEqual(favoriteCafes, fetchedCafes)) {
          setFavoriteCafes(normalizeFavoriteCafes(fetchedCafes));
        }
        setHasHydratedFavoriteCafes(true);
        setBackendFavoriteFetch({
          status: "success",
          fetchedCount: fetchedCafes.length,
          totalCount: favoriteCafes.length,
          errorMessage: "",
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setBackendFavoriteFetch({
          status: "error",
          fetchedCount: fetchedCafes.length,
          totalCount: favoriteCafes.length,
          errorMessage:
            error instanceof Error
              ? error.message
              : messages.fetchUnexpectedError,
        });
        setHasHydratedFavoriteCafes(true);
      }
    }

    fetchFavoriteCafesFromBackend();

    return () => {
      cancelled = true;
    };
  }, [authStatus, favoriteCafes, hasHydratedFavoriteCafes, isStorageReady, messages]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    if (window.matchMedia("(min-width: 1280px)").matches) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  const showToast = useCallback(
    (toastKey) => {
      const toastDefinition = toastCatalog[toastKey];

      if (!toastDefinition) {
        setNoticeState(null);
        return;
      }

      noticeTokenRef.current += 1;
      setNoticeState({
        ...toastDefinition,
        key: `${toastDefinition.type}:${noticeTokenRef.current}`,
      });
    },
    [toastCatalog],
  );

  const queueToast = useCallback((source, toastKey) => {
    toastTokenRef.current += 1;
    setPendingToastSource(source);
    setPendingToastKey(toastKey);
    setPendingToastToken(toastTokenRef.current);
  }, []);

  useEffect(() => {
    if (!noticeState?.key) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setNoticeState((current) =>
        current?.key === noticeState.key ? null : current,
      );
    }, 2500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [noticeState]);

  useEffect(() => {
    if (
      pendingToastSource === "keyword-search-submit" &&
      searchState.source !== "map"
    ) {
      if (searchState.status === "ready") {
        if (searchState.totalCount >= 45) {
          showToast(pendingToastKey);
        }
        setPendingToastSource("idle");
        setPendingToastKey("");
        setPendingToastToken(0);
      } else if (searchState.status === "error") {
        if (searchState.errorCode === "RATE_LIMIT_EXCEEDED") {
          showToast("requestRateLimited");
        }
        setPendingToastSource("idle");
        setPendingToastKey("");
        setPendingToastToken(0);
      }
      return;
    }

    if (
      pendingToastSource === "map-search-submit" &&
      searchState.source === "map"
    ) {
      if (searchState.status === "ready") {
        if (searchState.totalCount >= 45) {
          showToast(pendingToastKey);
        }
        setPendingToastSource("idle");
        setPendingToastKey("");
        setPendingToastToken(0);
      } else if (searchState.status === "error") {
        if (searchState.errorCode === "RATE_LIMIT_EXCEEDED") {
          showToast("requestRateLimited");
        }
        setPendingToastSource("idle");
        setPendingToastKey("");
        setPendingToastToken(0);
      }
    }
  }, [
    pendingToastKey,
    pendingToastSource,
    pendingToastToken,
    searchState.source,
    searchState.errorCode,
    searchState.status,
    searchState.totalCount,
    showToast,
  ]);

  const favoriteCafeIds = useMemo(
    () => new Set(favoriteCafes.map((cafe) => cafe.id)),
    [favoriteCafes],
  );

  const handleToggleFavorite = useCallback((cafe) => {
    const nextCafe = normalizeFavoriteCafe(cafe);
    if (!nextCafe) {
      return;
    }

    const isAlreadyFavorite = favoriteCafeIds.has(nextCafe.id);

    setFavoriteCafes((current) => {
      const exists = current.some((item) => item.id === nextCafe.id);

      if (exists) {
        return current.filter((item) => item.id !== nextCafe.id);
      }

      return [...current, nextCafe];
    });

    if (isAlreadyFavorite) {
      return;
    }

    syncFavoriteCafeToBackend(nextCafe, messages)
      .then(() => {
        setBackendFavoriteFetch((current) => ({
          ...current,
          status: "idle",
          errorMessage: "",
        }));
      })
      .catch((error) => {
        setBackendFavoriteFetch((current) => ({
          ...current,
          status: "error",
          errorMessage:
            error instanceof Error
              ? error.message
              : messages.saveUnexpectedError,
        }));
      });
  }, [favoriteCafeIds, messages]);

  const handleRemoveFavorite = (cafeId) => {
    setFavoriteCafes((current) => current.filter((item) => item.id !== cafeId));
  };

  const handleSearchSubmit = () => {
    const nextQuery = searchInput.trim();

    if (!nextQuery) {
      setSearchQuery("");
      showToast("searchEmptyInput");
      setPendingToastSource("idle");
      setPendingToastKey("");
      setPendingToastToken(0);
      setSelectedCafe(null);
      setActivePlaceId("");
      return;
    }

    setNoticeState(null);
    setSearchState(createLoadingSearchState("search"));
    queueToast("keyword-search-submit", "searchTooMany");
    setSearchQuery(nextQuery);
    setSearchRequestVersion((current) => current + 1);
  };

  const handleSelectCafe = useCallback((cafe) => {
    setSelectedCafe(cafe);
    setActivePlaceId(cafe?.id ?? "");
  }, []);

  const handleStartCurrentAreaSearch = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setNoticeState(null);
    setSearchState(createLoadingSearchState("map"));
    queueToast("map-search-submit", "mapTooMany");
    setSelectedCafe(null);
    setActivePlaceId("");
  }, [queueToast]);

  const closeNotice = useCallback(() => {
    setNoticeState(null);
  }, []);

  const handleResetHomeView = (event) => {
    event?.preventDefault?.();
    setSearchInput("");
    setSearchQuery("");
    setSelectedCafe(null);
    setActivePlaceId("");
    setIsSidebarOpen(false);
    setNoticeState(null);
    setPendingToastSource("idle");
    setPendingToastKey("");
    setPendingToastToken(0);
    setMapViewport(DEFAULT_MAP_VIEW);
    setSearchState(INITIAL_SEARCH_STATE);
    setResetViewVersion((current) => current + 1);
  };

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout transport failures and continue local cleanup.
    }

    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    setFavoriteCafes([]);
    setHasHydratedFavoriteCafes(false);
    setIsGuestModeToastVisible(false);
    setAuthStatus("redirecting");
    router.replace("/login");
  }, [router]);

  const kakaoMapUrl = useMemo(() => {
    const hasActiveMapContext =
      Boolean(searchQuery.trim()) ||
      searchState.source === "map" ||
      Boolean(selectedCafe) ||
      Boolean(activePlaceId);

    if (!hasActiveMapContext) {
      return "https://map.kakao.com/";
    }

    if (
      typeof mapViewport?.lat !== "number" ||
      Number.isNaN(mapViewport.lat) ||
      typeof mapViewport?.lng !== "number" ||
      Number.isNaN(mapViewport.lng)
    ) {
      return "https://map.kakao.com/";
    }

    return `https://map.kakao.com/link/map/${mapViewport.lat},${mapViewport.lng}`;
  }, [activePlaceId, mapViewport, searchQuery, searchState.source, selectedCafe]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((current) => !current);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return {
    activePlaceId,
    authStatus,
    backendFavoriteFetch,
    closeSidebar,
    favoriteCafeIds,
    favoriteCafes,
    handleLogout,
    handleRemoveFavorite,
    handleResetHomeView,
    handleSearchSubmit,
    handleSelectCafe,
    handleStartCurrentAreaSearch,
    handleToggleFavorite,
    isGuestModeToastVisible,
    isSidebarOpen,
    kakaoMapUrl,
    locale,
    messages,
    closeNotice,
    noticeState,
    resetViewVersion,
    searchInput,
    searchQuery,
    searchRequestVersion,
    searchState,
    selectedCafe,
    setLocale,
    setMapViewport,
    setNoticeState,
    setSearchInput,
    setSearchState,
    toggleSidebar,
  };
}
