"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getMessages } from "../messages";
import useSavedPlacesState from "./useSavedPlacesState";

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

export default function useHomePageState() {
  const router = useRouter();
  const [locale, setLocale] = useState(getInitialLocale);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRequestVersion, setSearchRequestVersion] = useState(0);
  const [resetViewVersion, setResetViewVersion] = useState(0);
  const [mapViewport, setMapViewport] = useState(DEFAULT_MAP_VIEW);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activePlaceId, setActivePlaceId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);
  const [authStatus, setAuthStatus] = useState("checking");
  const [noticeState, setNoticeState] = useState(null);
  const [pendingToastKey, setPendingToastKey] = useState("");
  const [pendingToastSource, setPendingToastSource] = useState("idle");
  const [pendingToastToken, setPendingToastToken] = useState(0);
  const toastTokenRef = useRef(0);
  const noticeTokenRef = useRef(0);
  const messages = useMemo(() => getMessages(locale), [locale]);
  const {
    backendSavedPlaceFetch,
    clearSavedPlaces,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    savedPlaceIds,
    savedPlaces,
  } = useSavedPlacesState({
    authStatus,
  });
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

  const handleSearchSubmit = () => {
    const nextQuery = searchInput.trim();

    if (!nextQuery) {
      setSearchQuery("");
      showToast("searchEmptyInput");
      setPendingToastSource("idle");
      setPendingToastKey("");
      setPendingToastToken(0);
      setSelectedPlace(null);
      setActivePlaceId("");
      return;
    }

    setNoticeState(null);
    setSearchState(createLoadingSearchState("search"));
    queueToast("keyword-search-submit", "searchTooMany");
    setSearchQuery(nextQuery);
    setSearchRequestVersion((current) => current + 1);
  };

  const handleSelectPlace = useCallback((place) => {
    setSelectedPlace(place);
    setActivePlaceId(place?.id ?? "");
  }, []);

  const closeNotice = useCallback(() => {
    setNoticeState(null);
  }, []);

  const handleResetHomeView = (event) => {
    event?.preventDefault?.();
    setSearchInput("");
    setSearchQuery("");
    setSelectedPlace(null);
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

    clearSavedPlaces();
    setAuthStatus("redirecting");
    router.replace("/login");
  }, [clearSavedPlaces, router]);

  const kakaoMapUrl = useMemo(() => {
    const hasActiveMapContext =
      Boolean(searchQuery.trim()) ||
      searchState.source === "map" ||
      Boolean(selectedPlace) ||
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
  }, [activePlaceId, mapViewport, searchQuery, searchState.source, selectedPlace]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((current) => !current);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return {
    activePlaceId,
    authStatus,
    backendSavedPlaceFetch,
    closeSidebar,
    savedPlaceIds,
    savedPlaces,
    handleLogout,
    handleRemoveSavedPlace,
    handleResetHomeView,
    handleSearchSubmit,
    handleSelectPlace,
    handleToggleSavedPlace,
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
    selectedPlace,
    setLocale,
    setMapViewport,
    setNoticeState,
    setSearchInput,
    setSearchState,
    toggleSidebar,
  };
}
