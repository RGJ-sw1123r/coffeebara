"use client";

import { create } from "zustand";

export const DEFAULT_MAP_VIEW = { lat: 37.566826, lng: 126.9786567 };
export const INITIAL_SEARCH_STATE = {
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

function cloneSearchState(state = INITIAL_SEARCH_STATE) {
  return {
    ...INITIAL_SEARCH_STATE,
    ...state,
    results: Array.isArray(state?.results) ? state.results : [],
  };
}

export const useHomeSearchMapStore = create((set) => ({
  searchQuery: "",
  searchRequestVersion: 0,
  resetViewVersion: 0,
  mapViewport: DEFAULT_MAP_VIEW,
  selectedPlace: null,
  activePlaceId: "",
  searchState: cloneSearchState(),
  noticeState: null,
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
  },
  incrementSearchRequestVersion: () => {
    set((state) => ({
      searchRequestVersion: state.searchRequestVersion + 1,
    }));
  },
  setMapViewport: (mapViewport) => {
    set({ mapViewport });
  },
  selectPlace: (place) => {
    set({
      selectedPlace: place,
      activePlaceId: place?.id ?? "",
    });
  },
  clearSelectedPlace: () => {
    set({
      selectedPlace: null,
      activePlaceId: "",
    });
  },
  setSearchState: (searchState) => {
    set({
      searchState: cloneSearchState(searchState),
    });
  },
  setNoticeState: (noticeState) => {
    set({ noticeState });
  },
  clearSavedPlacesMapState: () => {
    set((state) => {
      if (state.searchState.source !== "saved") {
        return {};
      }

      return {
        selectedPlace: null,
        activePlaceId: "",
        searchState: cloneSearchState(),
        noticeState:
          state.noticeState?.type === "saved-places-empty" ||
          state.noticeState?.type === "saved-places-ready"
            ? null
            : state.noticeState,
      };
    });
  },
  resetHomeSearchMapState: () => {
    set((state) => ({
      searchQuery: "",
      searchRequestVersion: state.searchRequestVersion,
      resetViewVersion: state.resetViewVersion + 1,
      mapViewport: DEFAULT_MAP_VIEW,
      selectedPlace: null,
      activePlaceId: "",
      searchState: cloneSearchState(),
      noticeState: null,
    }));
  },
}));
