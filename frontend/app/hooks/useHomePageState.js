"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppShell } from "../components/app/AppShellContext";

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

export default function useHomePageState() {
  const { messages } = useAppShell();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRequestVersion, setSearchRequestVersion] = useState(0);
  const [resetViewVersion, setResetViewVersion] = useState(0);
  const [mapViewport, setMapViewport] = useState(DEFAULT_MAP_VIEW);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activePlaceId, setActivePlaceId] = useState("");
  const [searchState, setSearchState] = useState(INITIAL_SEARCH_STATE);
  const [noticeState, setNoticeState] = useState(null);
  const handledSearchNoticeVersionRef = useRef(0);
  const activeSearchNoticeVersionRef = useRef(0);
  const noticeTokenRef = useRef(0);
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
    if (searchRequestVersion <= 0) {
      return;
    }

    if (searchState.source !== "search") {
      return;
    }

    if (searchState.status === "loading") {
      activeSearchNoticeVersionRef.current = searchRequestVersion;
      return;
    }

    if (handledSearchNoticeVersionRef.current === searchRequestVersion) {
      return;
    }

    if (activeSearchNoticeVersionRef.current !== searchRequestVersion) {
      return;
    }

    if (searchState.status === "ready") {
      if (searchState.totalCount < 45) {
        return;
      }

      handledSearchNoticeVersionRef.current = searchRequestVersion;
      window.setTimeout(() => {
        showToast("searchTooMany");
      }, 0);
      return;
    }

    if (searchState.status === "error") {
      handledSearchNoticeVersionRef.current = searchRequestVersion;

      if (searchState.errorCode === "RATE_LIMIT_EXCEEDED") {
        window.setTimeout(() => {
          showToast("requestRateLimited");
        }, 0);
      }
    }
  }, [
    searchRequestVersion,
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
      setSelectedPlace(null);
      setActivePlaceId("");
      return;
    }

    setNoticeState(null);
    setSearchState(createLoadingSearchState("search"));
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
    setNoticeState(null);
    activeSearchNoticeVersionRef.current = 0;
    handledSearchNoticeVersionRef.current = 0;
    setMapViewport(DEFAULT_MAP_VIEW);
    setSearchState(INITIAL_SEARCH_STATE);
    setResetViewVersion((current) => current + 1);
  };

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

  return {
    activePlaceId,
    closeNotice,
    handleResetHomeView,
    handleSearchSubmit,
    handleSelectPlace,
    kakaoMapUrl,
    noticeState,
    resetViewVersion,
    searchInput,
    searchQuery,
    searchRequestVersion,
    searchState,
    selectedPlace,
    setMapViewport,
    setNoticeState,
    setSearchInput,
    setSearchState,
  };
}
