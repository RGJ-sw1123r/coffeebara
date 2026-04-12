"use client";

// v1 reference snapshot:
// This file preserves the earlier KakaoMap runtime path that exposed
// the current-area search button above the map and triggered
// `onStartCurrentAreaSearch` before fetching visible cafes.

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CENTER = { lat: 37.566826, lng: 126.9786567 };
const DEFAULT_LEVEL = 7;
const MAX_ZOOM_OUT_LEVEL = 8;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";
let kakaoMapSdkPromise = null;
const DEFAULT_MARKER_Z_INDEX = 1;
const ACTIVE_MARKER_Z_INDEX = 1000;
const INFO_WINDOW_Z_INDEX = 2000;

function normalizeAppKey(appKey) {
  return typeof appKey === "string" ? appKey.trim() : "";
}

function normalizeSearchQuery(query) {
  return typeof query === "string" ? query.trim() : "";
}

function buildKakaoSdkUrl(appKey) {
  return `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
}

function resolveKakaoWhenReady(resolve, reject) {
  if (!window.kakao?.maps?.load) {
    kakaoMapSdkPromise = null;
    reject(
      new Error("Kakao Map SDK loaded, but core map APIs are unavailable."),
    );
    return;
  }

  window.kakao.maps.load(() => {
    resolve(window.kakao);
  });
}

function loadKakaoMapSdk(appKey) {
  const normalizedAppKey = normalizeAppKey(appKey);

  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Map can only load in the browser."));
  }

  if (!normalizedAppKey || normalizedAppKey === "MOCK_KAKAO_MAP_KEY") {
    return Promise.reject(new Error("Kakao Map key is missing."));
  }

  if (window.kakao?.maps?.load) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise;
  }

  kakaoMapSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = buildKakaoSdkUrl(normalizedAppKey);
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolveKakaoWhenReady(resolve, reject);
    };
    script.onerror = () => {
      kakaoMapSdkPromise = null;
      reject(
        new Error(
          "Failed to load Kakao Map SDK script. Check the Kakao JavaScript key and allowed web domains.",
        ),
      );
    };
    document.head.appendChild(script);
  });

  return kakaoMapSdkPromise;
}

function getMapBoundsParams(map) {
  const bounds = map.getBounds();
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();

  return new URLSearchParams({
    swLat: String(southWest.getLat()),
    swLng: String(southWest.getLng()),
    neLat: String(northEast.getLat()),
    neLng: String(northEast.getLng()),
  });
}

async function fetchCafeDocuments(pathname, params) {
  const response = await fetch(`${API_BASE_URL}${pathname}?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cafe documents.");
  }

  const payload = await response.json();
  return Array.isArray(payload?.documents) ? payload.documents : [];
}

async function fetchAllVisibleCafes(map) {
  return fetchCafeDocuments("/api/cafes/map", getMapBoundsParams(map));
}

function roundBoundValue(value) {
  return Number(value).toFixed(4);
}

function buildBoundsCacheKey(map, query = "") {
  const bounds = map.getBounds();
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();

  return [
    normalizeSearchQuery(query),
    roundBoundValue(southWest.getLat()),
    roundBoundValue(southWest.getLng()),
    roundBoundValue(northEast.getLat()),
    roundBoundValue(northEast.getLng()),
  ].join("|");
}

function clearCurrentAreaCache(responseCache) {
  Array.from(responseCache.keys())
    .filter((cacheKey) => cacheKey.startsWith("bounds-search|"))
    .forEach((cacheKey) => {
      responseCache.delete(cacheKey);
    });
}

export default function KakaoMapCurrentAreaSearchV1({
  appKey,
  searchQuery,
  resetViewVersion,
  onSearchResultsChange,
  onViewportChange,
  onStartCurrentAreaSearch,
  messages,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const normalizedSearchQueryRef = useRef("");
  const isCurrentAreaModeRef = useRef(false);
  const currentViewModeRef = useRef("idle");
  const responseCacheRef = useRef(new Map());
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [mapPlaces, setMapPlaces] = useState([]);
  const normalizedSearchQuery = useMemo(
    () => normalizeSearchQuery(searchQuery),
    [searchQuery],
  );

  const handleSearchCurrentView = async () => {
    if (!mapInstanceRef.current) {
      return;
    }

    const map = mapInstanceRef.current;
    const cacheKey = `bounds-search|${buildBoundsCacheKey(map)}`;

    isCurrentAreaModeRef.current = true;
    currentViewModeRef.current = "map";
    onStartCurrentAreaSearch?.();
    setStatus("loading");
    setErrorMessage("");
    setErrorCode("");

    try {
      const cachedResults = responseCacheRef.current.get(cacheKey);
      const results = cachedResults ?? await fetchAllVisibleCafes(map);

      if (!cachedResults) {
        responseCacheRef.current.set(cacheKey, results);
      }

      setMapPlaces(results);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error",
      );
      setErrorCode(error instanceof Error ? (error.code ?? "") : "");
      setStatus("error");
    }
  };

  useEffect(() => {
    normalizedSearchQueryRef.current = normalizedSearchQuery;
  }, [normalizedSearchQuery]);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapRef.current) {
        return;
      }

      try {
        const kakao = await loadKakaoMapSdk(appKey);

        if (cancelled || !mapRef.current) {
          return;
        }

        const center = new kakao.maps.LatLng(
          DEFAULT_CENTER.lat,
          DEFAULT_CENTER.lng,
        );

        const map = new kakao.maps.Map(mapRef.current, {
          center,
          level: DEFAULT_LEVEL,
        });

        map.setMaxLevel(MAX_ZOOM_OUT_LEVEL);
        mapInstanceRef.current = map;
        onViewportChange?.(DEFAULT_CENTER);
        setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unknown error");
          setErrorCode(error instanceof Error ? (error.code ?? "") : "");
          setStatus("error");
        }
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      mapInstanceRef.current = null;
    };
  }, [appKey, onViewportChange]);

  useEffect(() => {
    onSearchResultsChange?.({
      results: mapPlaces,
      visibleCount: mapPlaces.length,
      totalCount: mapPlaces.length,
      hiddenCount: 0,
      isSearching: false,
      source: currentViewModeRef.current,
      status,
      errorMessage,
      errorCode,
    });
  }, [errorCode, errorMessage, mapPlaces, onSearchResultsChange, status]);

  useEffect(() => {
    if (!window.kakao?.maps || !mapInstanceRef.current || resetViewVersion <= 0) {
      return;
    }

    const kakao = window.kakao;
    const map = mapInstanceRef.current;

    normalizedSearchQueryRef.current = "";
    isCurrentAreaModeRef.current = false;
    currentViewModeRef.current = "idle";
    clearCurrentAreaCache(responseCacheRef.current);
    map.setLevel(DEFAULT_LEVEL);
    map.panTo(new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
    onViewportChange?.(DEFAULT_CENTER);
    setMapPlaces([]);
    setStatus("ready");
    setErrorMessage("");
    setErrorCode("");
  }, [onViewportChange, resetViewVersion]);

  return (
    <div className="relative h-full min-h-[420px] w-full sm:min-h-[520px]">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute left-4 top-4 z-20 flex max-w-[calc(100%-32px)] flex-col items-start gap-2">
        {!normalizeAppKey(appKey) ||
        normalizeAppKey(appKey) === "MOCK_KAKAO_MAP_KEY" ? null : (
          <button
            type="button"
            onClick={handleSearchCurrentView}
            disabled={status === "loading"}
            className={`rounded-full border border-[#5d4334] bg-[linear-gradient(160deg,rgba(56,39,30,0.96)_0%,rgba(38,26,21,0.94)_100%)] px-4 py-2 text-xs font-semibold text-[#fff7f0] shadow-[0_16px_32px_rgba(47,34,27,0.24)] backdrop-blur transition ${
              status === "loading"
                ? "cursor-not-allowed opacity-60"
                : "hover:border-[#7b5a46] hover:brightness-110"
            }`}
          >
            {messages.searchCurrentAreaButton}
          </button>
        )}
      </div>
    </div>
  );
}
