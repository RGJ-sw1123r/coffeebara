"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppShell } from "../components/app/AppShellContext";
import { KEYWORD_SEARCH_RESULT_LIMIT } from "../constants/search";
import {
  INITIAL_SEARCH_STATE,
  useHomeSearchMapStore,
} from "../stores/useHomeSearchMapStore";

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
  const searchQuery = useHomeSearchMapStore((state) => state.searchQuery);
  const searchRequestVersion = useHomeSearchMapStore(
    (state) => state.searchRequestVersion,
  );
  const mapViewport = useHomeSearchMapStore((state) => state.mapViewport);
  const selectedPlace = useHomeSearchMapStore((state) => state.selectedPlace);
  const activePlaceId = useHomeSearchMapStore((state) => state.activePlaceId);
  const searchState = useHomeSearchMapStore((state) => state.searchState);
  const noticeState = useHomeSearchMapStore((state) => state.noticeState);
  const setSearchQuery = useHomeSearchMapStore((state) => state.setSearchQuery);
  const incrementSearchRequestVersion = useHomeSearchMapStore(
    (state) => state.incrementSearchRequestVersion,
  );
  const clearSelectedPlace = useHomeSearchMapStore(
    (state) => state.clearSelectedPlace,
  );
  const setSearchState = useHomeSearchMapStore((state) => state.setSearchState);
  const setNoticeState = useHomeSearchMapStore((state) => state.setNoticeState);
  const clearSavedPlacesMapState = useHomeSearchMapStore(
    (state) => state.clearSavedPlacesMapState,
  );
  const resetHomeSearchMapState = useHomeSearchMapStore(
    (state) => state.resetHomeSearchMapState,
  );
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
    [setNoticeState, toastCatalog],
  );

  useEffect(() => {
    if (!noticeState?.key) {
      return;
    }

    const timerId = window.setTimeout(() => {
      if (useHomeSearchMapStore.getState().noticeState?.key === noticeState.key) {
        setNoticeState(null);
      }
    }, 2500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [noticeState, setNoticeState]);

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
      if (searchState.totalCount < KEYWORD_SEARCH_RESULT_LIMIT) {
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
    clearSavedPlacesMapState();

    const nextQuery = searchInput.trim();

    if (!nextQuery) {
      setSearchQuery("");
      showToast("searchEmptyInput");
      clearSelectedPlace();
      return;
    }

    setNoticeState(null);
    setSearchState(createLoadingSearchState("search"));
    setSearchQuery(nextQuery);
    incrementSearchRequestVersion();
  };

  useEffect(() => {
    return () => {
      clearSavedPlacesMapState();
    };
  }, [clearSavedPlacesMapState]);

  const handleResetHomeView = (event) => {
    event?.preventDefault?.();
    setSearchInput("");
    activeSearchNoticeVersionRef.current = 0;
    handledSearchNoticeVersionRef.current = 0;
    resetHomeSearchMapState();
  };

  const kakaoMapUrl = useMemo(() => {
    const hasActiveMapContext =
      Boolean(searchQuery.trim()) ||
      searchState.source === "map" ||
      searchState.source === "saved" ||
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
    handleResetHomeView,
    handleSearchSubmit,
    kakaoMapUrl,
    searchInput,
    setSearchInput,
  };
}
