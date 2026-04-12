"use client";

// v1 reference snapshot:
// This file keeps the earlier home-page handler that reset the search
// state when the map current-area search action started.

import { useCallback } from "react";

export function createLoadingSearchState(source) {
  return {
    results: [],
    visibleCount: 0,
    totalCount: 0,
    hiddenCount: 0,
    isSearching: false,
    source,
    status: "loading",
    errorMessage: "",
    errorCode: "",
  };
}

export function useCurrentAreaSearchHandlerV1({
  queueToast,
  setSearchInput,
  setSearchQuery,
  setNoticeState,
  setSearchState,
  setSelectedPlace,
  setActivePlaceId,
}) {
  return useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setNoticeState(null);
    setSearchState(createLoadingSearchState("map"));
    queueToast("map-search-submit", "mapTooMany");
    setSelectedPlace(null);
    setActivePlaceId("");
  }, [
    queueToast,
    setActivePlaceId,
    setNoticeState,
    setSearchInput,
    setSearchQuery,
    setSearchState,
    setSelectedPlace,
  ]);
}
