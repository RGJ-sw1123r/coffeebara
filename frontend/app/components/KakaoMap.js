"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CENTER = { lat: 37.566826, lng: 126.9786567 };
const DEFAULT_LEVEL = 7;
const MAX_ZOOM_OUT_LEVEL = 8;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";
const API_REQUEST_TIMEOUT_MS = 12000;
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

function normalizeSearchText(value) {
  return typeof value === "string"
    ? value.toLowerCase().replace(/\s+/g, "").replace(/[^\p{L}\p{N}]/gu, "")
    : "";
}

function getSearchTokens(value) {
  return normalizeSearchQuery(value)
    .toLowerCase()
    .split(/\s+/)
    .map((token) => normalizeSearchText(token))
    .filter(Boolean);
}

function buildKakaoSdkUrl(appKey) {
  return `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
}

function applyMarkerPriority(markerEntries, selectedPlaceId) {
  markerEntries.forEach(({ marker, place }) => {
    const isSelected = String(place.id) === String(selectedPlaceId);
    marker.setZIndex(isSelected ? ACTIVE_MARKER_Z_INDEX : DEFAULT_MARKER_Z_INDEX);
  });
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

  const existingScript = document.querySelector(
    'script[data-kakao-map-sdk="true"]',
  );

  if (existingScript) {
    const expectedSrc = buildKakaoSdkUrl(normalizedAppKey);
    const currentSrc = existingScript.getAttribute("src") ?? "";

    if (currentSrc !== expectedSrc) {
      existingScript.remove();
      kakaoMapSdkPromise = null;
    }
  }

  const activeScript = document.querySelector(
    'script[data-kakao-map-sdk="true"]',
  );

  if (activeScript) {
    kakaoMapSdkPromise = new Promise((resolve, reject) => {
      if (activeScript.dataset.loaded === "true") {
        resolveKakaoWhenReady(resolve, reject);
        return;
      }

      const handleLoad = () => {
        activeScript.dataset.loaded = "true";
        resolveKakaoWhenReady(resolve, reject);
      };

      const handleError = () => {
        kakaoMapSdkPromise = null;
        reject(
          new Error(
            "Failed to load Kakao Map SDK script. Check the Kakao JavaScript key and allowed web domains.",
          ),
        );
      };

      activeScript.addEventListener("load", handleLoad, { once: true });
      activeScript.addEventListener("error", handleError, { once: true });
    });

    return kakaoMapSdkPromise;
  }

  kakaoMapSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = buildKakaoSdkUrl(normalizedAppKey);
    script.async = true;
    script.defer = true;
    script.dataset.kakaoMapSdk = "true";
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

function toSavedPlace(place) {
  return {
    id: String(place.id),
    name: place.place_name,
    address: place.address_name,
    roadAddress: place.road_address_name,
    phone: place.phone,
    placeUrl: place.place_url,
    categoryName: place.category_name,
    lat: Number(place.y),
    lng: Number(place.x),
  };
}

function hasValidSavedPlaceCoordinates(place) {
  return (
    Number.isFinite(Number(place?.lat)) &&
    Number.isFinite(Number(place?.lng)) &&
    !(Number(place?.lat) === 0 && Number(place?.lng) === 0)
  );
}

function toMapPlaceFromSavedPlace(place) {
  return {
    id: String(place.id),
    place_name: place.name,
    address_name: place.address || "",
    road_address_name: place.roadAddress || "",
    phone: place.phone || "",
    place_url: place.placeUrl || "",
    category_name: place.categoryName || "",
    x: Number(place.lng),
    y: Number(place.lat),
  };
}

function getPlaceAddress(place) {
  return place.road_address_name || place.address_name || "주소 정보 없음";
}

function getPlaceArea(place) {
  return getPlaceAddress(place).split(" ").slice(0, 3).join(" ");
}

function sortPlacesByAddress(left, right) {
  return getPlaceAddress(left).localeCompare(getPlaceAddress(right), "ko");
}

function comparePlacesByRelevance(left, right, query) {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = getSearchTokens(query);

  const scorePlace = (place) => {
    const placeName = normalizeSearchText(place.place_name);
    const categoryName = normalizeSearchText(place.category_name);
    const address = normalizeSearchText(
      [place.road_address_name, place.address_name].filter(Boolean).join(" "),
    );

    let score = 0;

    if (!normalizedQuery) {
      return score;
    }

    if (placeName === normalizedQuery) {
      score += 1000;
    }

    if (placeName.startsWith(normalizedQuery)) {
      score += 700;
    }

    if (placeName.includes(normalizedQuery)) {
      score += 400;
    }

    if (categoryName.includes(normalizedQuery)) {
      score += 120;
    }

    if (address.includes(normalizedQuery)) {
      score += 60;
    }

    queryTokens.forEach((token) => {
      if (!token) {
        return;
      }

      if (placeName === token) {
        score += 260;
        return;
      }

      if (placeName.startsWith(token)) {
        score += 180;
      }

      if (placeName.includes(token)) {
        score += 90;
      }
    });

    return score;
  };

  const scoreDifference = scorePlace(right) - scorePlace(left);

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  return sortPlacesByAddress(left, right);
}

function isRelevantSearchResult(place, query) {
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = getSearchTokens(query);
  const placeName = normalizeSearchText(place.place_name);

  if (!normalizedQuery) {
    return true;
  }

  if (placeName === normalizedQuery) {
    return true;
  }

  if (placeName.startsWith(normalizedQuery)) {
    return true;
  }

  if (queryTokens.length > 1 && queryTokens.every((token) => placeName.includes(token))) {
    return true;
  }

  return false;
}

function createInfoContent(place, isSavedPlace, onToggleSavedPlace, messages) {
  const wrap = document.createElement("div");
  wrap.style.width = "354px";
  wrap.style.overflow = "hidden";
  wrap.style.border = "none";
  wrap.style.borderRadius = "24px";
  wrap.style.background =
    "linear-gradient(180deg, rgba(255,252,247,0.98) 0%, rgba(249,241,231,0.98) 100%)";
  wrap.style.boxShadow = "0 20px 40px rgba(60, 42, 30, 0.12)";
  wrap.style.backdropFilter = "blur(12px)";

  const body = document.createElement("div");
  body.style.padding = "18px";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "flex-start";
  header.style.justifyContent = "space-between";
  header.style.gap = "12px";

  const titleWrap = document.createElement("div");
  titleWrap.style.minWidth = "0";
  titleWrap.style.flex = "1";

  const title = document.createElement("div");
  title.textContent = place.place_name;
  title.style.fontSize = "16px";
  title.style.fontWeight = "700";
  title.style.color = "#241813";
  title.style.lineHeight = "1.4";

  const category = document.createElement("div");
  category.textContent = place.category_name || messages?.cafeCategoryFallback || "카페";
  category.style.marginTop = "6px";
  category.style.display = "inline-flex";
  category.style.alignItems = "center";
  category.style.padding = "4px 10px";
  category.style.borderRadius = "999px";
  category.style.background = "rgba(239, 227, 213, 0.9)";
  category.style.fontSize = "12px";
  category.style.color = "#7a604f";
  category.style.maxWidth = "100%";
  category.style.whiteSpace = "nowrap";
  category.style.overflow = "hidden";
  category.style.textOverflow = "ellipsis";

  titleWrap.appendChild(title);
  titleWrap.appendChild(category);

  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.textContent = isSavedPlace ? "★" : "+";
  favoriteButton.setAttribute(
    "aria-label",
    messages?.favoriteAriaLabel || "내 취향 카페에 추가",
  );
  favoriteButton.style.width = "34px";
  favoriteButton.style.height = "34px";
  favoriteButton.style.border = "none";
  favoriteButton.style.borderRadius = "999px";
  favoriteButton.style.background = isSavedPlace ? "#2f221b" : "#efe3d5";
  favoriteButton.style.color = isSavedPlace ? "#f3c76d" : "#5d473b";
  favoriteButton.style.fontSize = "18px";
  favoriteButton.style.cursor = "pointer";
  favoriteButton.style.boxShadow = "0 10px 20px rgba(47, 34, 27, 0.12)";
  favoriteButton.style.flexShrink = "0";
  favoriteButton.addEventListener("click", onToggleSavedPlace);

  header.appendChild(titleWrap);
  header.appendChild(favoriteButton);

  const address = document.createElement("div");
  address.textContent = getPlaceAddress(place);
  address.style.marginTop = "12px";
  address.style.fontSize = "13px";
  address.style.lineHeight = "1.5";
  address.style.color = "#5f4b3f";
  address.style.wordBreak = "keep-all";

  body.appendChild(header);
  body.appendChild(address);

  if (place.phone) {
    const phone = document.createElement("div");
    phone.textContent = place.phone;
    phone.style.marginTop = "10px";
    phone.style.fontSize = "12px";
    phone.style.color = "#8b7162";
    body.appendChild(phone);
  }

  if (place.place_url) {
    const link = document.createElement("a");
    link.href = place.place_url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = messages?.kakaoDetailLink || "카카오 상세 보기";
    link.style.display = "inline-block";
    link.style.marginTop = "10px";
    link.style.fontSize = "12px";
    link.style.fontWeight = "600";
    link.style.padding = "9px 14px";
    link.style.borderRadius = "999px";
    link.style.textDecoration = "none";
    link.style.boxShadow = "0 12px 24px rgba(47, 34, 27, 0.14)";
    link.style.setProperty("background", "#2f221b", "important");
    link.style.setProperty("color", "#ffffff", "important");
    link.style.setProperty("-webkit-text-fill-color", "#ffffff", "important");
    body.appendChild(link);
  }

  wrap.appendChild(body);

  return wrap;
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

function getMapCenter(map) {
  const center = map.getCenter();

  return {
    lat: Number(center.getLat()),
    lng: Number(center.getLng()),
  };
}

async function fetchCafeDocuments(pathname, params) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, API_REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${pathname}?${params.toString()}`, {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    });
  } catch (error) {
    window.clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError = new Error("Request timed out while loading places.");
      timeoutError.code = "REQUEST_TIMEOUT";
      throw timeoutError;
    }

    throw error;
  }

  window.clearTimeout(timeoutId);

  if (!response.ok) {
    let errorCode = "";
    let errorMessage = "카페 데이터를 불러오지 못했습니다.";

    try {
      const payload = await response.json();
      errorCode = typeof payload?.code === "string" ? payload.code : "";
      errorMessage =
        typeof payload?.message === "string" && payload.message
          ? payload.message
          : errorMessage;
    } catch {
      // Keep fallback values.
    }

    const error = new Error(errorMessage);
    error.code = errorCode;
    throw error;
  }

  const payload = await response.json();
  return Array.isArray(payload?.documents) ? payload.documents : [];
}

async function fetchAllVisibleCafes(map) {
  return fetchCafeDocuments("/api/cafes/map", getMapBoundsParams(map));
}

function buildKeywordSearchCacheKey(query) {
  return `keyword-search|${normalizeSearchQuery(query)}`;
}

async function fetchKeywordResults(query) {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return [];
  }

  const params = new URLSearchParams({ query: normalizedQuery });
  return fetchCafeDocuments("/api/cafes/search", params);
}

function rankKeywordResults(places, query) {
  const rankedPlaces = [...places].sort((left, right) =>
    comparePlacesByRelevance(left, right, query),
  );
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return rankedPlaces;
  }

  const exactMatches = rankedPlaces.filter(
    (place) => normalizeSearchText(place.place_name) === normalizedQuery,
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  const prefixMatches = rankedPlaces.filter((place) =>
    normalizeSearchText(place.place_name).startsWith(normalizedQuery),
  );

  if (prefixMatches.length > 0) {
    return prefixMatches;
  }

  const relevantPlaces = rankedPlaces.filter((place) =>
    isRelevantSearchResult(place, query),
  );

  return relevantPlaces.length > 0 ? relevantPlaces : rankedPlaces;
}

function fitMapToPlaces(kakao, map, places) {
  if (!places.length) {
    return;
  }

  if (places.length === 1) {
    map.setLevel(4);
    map.panTo(
      new kakao.maps.LatLng(Number(places[0].y), Number(places[0].x)),
    );
    return;
  }

  const bounds = new kakao.maps.LatLngBounds();

  places.forEach((place) => {
    bounds.extend(new kakao.maps.LatLng(Number(place.y), Number(place.x)));
  });

  map.setBounds(bounds);
}

function focusMapToPrimaryPlace(kakao, map, places) {
  if (!places.length) {
    return;
  }

  map.setLevel(4);
  map.panTo(new kakao.maps.LatLng(Number(places[0].y), Number(places[0].x)));
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

function waitForNextFrame() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function MarkerList({
  places,
  selectedPlaceId,
  savedPlaceIds,
  onSelectPlace,
  onToggleSavedPlace,
  searchQuery,
  hiddenResultCount,
  messages,
}) {
  const title = searchQuery ? "검색 결과" : "현재 지도 카페";
  const description = searchQuery
    ? "검색 결과를 지도 위에서 바로 비교하며 둘러볼 수 있습니다."
    : "현재 보고 있는 지도 범위 안의 카페를 확인할 수 있습니다.";

  return (
    <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-[#eadfd3] bg-white/95 p-4 shadow-[0_18px_36px_rgba(84,52,27,0.12)] backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
            {title}
          </p>
          <p className="mt-1 text-sm text-[#5f4b3f]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f5ecdf] px-3 py-1 text-xs font-medium text-[#6c5547]">
            표시 중 {places.length}곳
          </span>
          {hiddenResultCount > 0 ? (
            <span className="rounded-full bg-[#efe3d5] px-3 py-1 text-xs font-medium text-[#6c5547]">
              추가 {hiddenResultCount}곳
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 max-h-[220px] overflow-y-auto pr-1">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {places.map((place) => {
            const isSelected = selectedPlaceId === String(place.id);
            const isSavedPlace = savedPlaceIds.has(String(place.id));

            return (
              <div
                key={place.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectPlace(place)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectPlace(place);
                  }
                }}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  isSelected
                    ? "border-[#2f221b] bg-[#f7efe6]"
                    : "border-[#eadfd3] bg-[#fcfaf7] hover:border-[#cdb8a6]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#241813]">
                      {place.place_name}
                    </p>
                    <p className="mt-1 text-xs text-[#6d584b]">
                      {getPlaceArea(place)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={messages?.favoriteAriaLabel || "내 취향 카페에 추가"}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleSavedPlace(place);
                    }}
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      isSavedPlace
                        ? "bg-[#2f221b] text-[#f3c76d]"
                        : "bg-[#efe3d5] text-[#5d473b]"
                    }`}
                  >
                    {isSavedPlace ? "★" : "+"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#8f725d]">{getPlaceAddress(place)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function KakaoMap({
  appKey,
  savedPlaces,
  onToggleSavedPlace,
  searchQuery,
  searchRequestVersion,
  resetViewVersion,
  onSelectPlace,
  activePlaceId,
  onSearchResultsChange,
  onViewportChange,
  onClearSearchQuery,
  onShowSavedPlacesReadyNotice,
  onShowSavedPlacesEmptyNotice,
  searchSource,
  isSidebarOpen,
  messages,
}) {
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlayRef = useRef(null);
  const markerEntriesRef = useRef([]);
  const idleListenerRef = useRef(null);
  const mapClickListenerRef = useRef(null);
  const dragStartListenerRef = useRef(null);
  const selectedPlaceRef = useRef(null);
  const savedPlaceIdsRef = useRef(new Set());
  const onToggleSavedPlaceRef = useRef(onToggleSavedPlace);
  const onSelectPlaceRef = useRef(onSelectPlace);
  const normalizedSearchQueryRef = useRef("");
  const isCurrentAreaModeRef = useRef(false);
  const currentViewModeRef = useRef("idle");
  const searchRequestIdRef = useRef(0);
  const responseCacheRef = useRef(new Map());
  const shouldFocusSearchResultsRef = useRef(true);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [mapPlaces, setMapPlaces] = useState([]);
  const [searchPlaces, setSearchPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const savedPlaceIds = useMemo(
    () => new Set(savedPlaces.map((place) => place.id)),
    [savedPlaces],
  );
  const normalizedSearchQuery = useMemo(
    () => normalizeSearchQuery(searchQuery),
    [searchQuery],
  );
  const sortedMapPlaces = useMemo(
    () => [...mapPlaces].sort(sortPlacesByAddress),
    [mapPlaces],
  );
  const savedPlacesForMap = useMemo(
    () =>
      savedPlaces
        .filter(hasValidSavedPlaceCoordinates)
        .map(toMapPlaceFromSavedPlace),
    [savedPlaces],
  );
  const sortedSearchPlaces = useMemo(
    () => rankKeywordResults(searchPlaces, normalizedSearchQuery),
    [normalizedSearchQuery, searchPlaces],
  );
  const displayedPlaces = normalizedSearchQuery
    ? sortedSearchPlaces
    : searchSource === "saved"
      ? savedPlacesForMap
      : sortedMapPlaces;
  const hiddenSearchResultCount = normalizedSearchQuery
    ? Math.max(searchPlaces.length - sortedSearchPlaces.length, 0)
    : 0;

  const clearSelection = () => {
    selectedPlaceRef.current = null;
    setSelectedPlaceId("");
    onSelectPlaceRef.current?.(null);
    applyMarkerPriority(markerEntriesRef.current, "");
    overlayRef.current?.setMap(null);
  };

  const clearSelectionWithoutState = () => {
    selectedPlaceRef.current = null;
    onSelectPlaceRef.current?.(null);
    applyMarkerPriority(markerEntriesRef.current, "");
    overlayRef.current?.setMap(null);
  };

  const handleSearchCurrentView = async () => {
    if (!mapInstanceRef.current) {
      return;
    }

    const map = mapInstanceRef.current;
    const cacheKey = `bounds-search|${buildBoundsCacheKey(map)}`;

    clearSelection();
    shouldFocusSearchResultsRef.current = false;
    isCurrentAreaModeRef.current = true;
    currentViewModeRef.current = "map";
    setStatus("loading");
    setErrorMessage("");
    setErrorCode("");

    try {
      const cachedResults = responseCacheRef.current.get(cacheKey);
      const results = cachedResults ?? await fetchAllVisibleCafes(map);

      if (!cachedResults) {
        responseCacheRef.current.set(cacheKey, results);
      }

      setSearchPlaces([]);
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

  const handleShowSavedPlaces = () => {
    if (!mapInstanceRef.current || !window.kakao?.maps) {
      return;
    }

    const map = mapInstanceRef.current;

    clearSelection();
    onClearSearchQuery?.();
    shouldFocusSearchResultsRef.current = false;
    isCurrentAreaModeRef.current = false;
    currentViewModeRef.current = "saved";
    setSearchPlaces([]);
    setMapPlaces(savedPlacesForMap);
    setStatus("ready");
    setErrorMessage("");
    setErrorCode("");

    if (savedPlacesForMap.length === 0) {
      onShowSavedPlacesEmptyNotice?.();
      onViewportChange?.(getMapCenter(map));
      return;
    }

    onShowSavedPlacesReadyNotice?.();
    onViewportChange?.(getMapCenter(map));
  };

  useEffect(() => {
    savedPlaceIdsRef.current = savedPlaceIds;
    onToggleSavedPlaceRef.current = onToggleSavedPlace;
    onSelectPlaceRef.current = onSelectPlace;
  }, [onSelectPlace, onToggleSavedPlace, savedPlaceIds]);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    onViewportChange?.(getMapCenter(mapInstanceRef.current));
  }, [onViewportChange, status, normalizedSearchQuery, selectedPlaceId]);

  useEffect(() => {
    onSearchResultsChange?.({
      results: displayedPlaces.map(toSavedPlace),
      visibleCount: displayedPlaces.length,
      totalCount: normalizedSearchQuery
        ? searchPlaces.length
        : searchSource === "saved"
          ? savedPlacesForMap.length
          : sortedMapPlaces.length,
      hiddenCount: hiddenSearchResultCount,
      isSearching: Boolean(normalizedSearchQuery),
      source:
        currentViewModeRef.current === "search"
          ? "search"
          : currentViewModeRef.current === "map"
            ? "map"
            : currentViewModeRef.current === "saved"
              ? "saved"
            : "idle",
      status,
      errorMessage,
      errorCode,
    });
  }, [
    displayedPlaces,
    errorCode,
    errorMessage,
    hiddenSearchResultCount,
    normalizedSearchQuery,
    onSearchResultsChange,
    savedPlacesForMap.length,
    searchPlaces.length,
    searchSource,
    sortedMapPlaces,
    sortedSearchPlaces,
    status,
  ]);

  useEffect(() => {
    normalizedSearchQueryRef.current = normalizedSearchQuery;
  }, [normalizedSearchQuery]);

  useEffect(() => {
    if (!window.kakao?.maps || !mapInstanceRef.current) {
      return;
    }

    const map = mapInstanceRef.current;
    const timers = [];
    const relayoutMap = () => {
      const center = map.getCenter();
      map.relayout();
      map.setCenter(center);
    };

    const frameId = window.requestAnimationFrame(relayoutMap);
    timers.push(window.setTimeout(relayoutMap, 180));
    timers.push(window.setTimeout(relayoutMap, 320));

    return () => {
      window.cancelAnimationFrame(frameId);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapRef.current) {
        return;
      }

      setStatus("loading");
      setErrorMessage("");

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
        onViewportChange?.({
          lat: DEFAULT_CENTER.lat,
          lng: DEFAULT_CENTER.lng,
        });
        map.setMaxLevel(MAX_ZOOM_OUT_LEVEL);

        const overlay = new kakao.maps.CustomOverlay({
          clickable: true,
          zIndex: INFO_WINDOW_Z_INDEX,
          yAnchor: 1.2,
          xAnchor: 0.5,
        });
        const zoomControl = new kakao.maps.ZoomControl();

        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        kakao.maps.event.addListener(map, "zoom_changed", () => {
          if (map.getLevel() > MAX_ZOOM_OUT_LEVEL) {
            map.setLevel(MAX_ZOOM_OUT_LEVEL);
          }
        });

        mapInstanceRef.current = map;
        overlayRef.current = overlay;
        setIsMapReady(true);

        const searchVisibleCafes = async () => {
          if (
            normalizedSearchQueryRef.current ||
            isCurrentAreaModeRef.current ||
            currentViewModeRef.current === "saved"
          ) {
            onViewportChange?.(getMapCenter(map));
            return;
          }

          if (cancelled) {
            return;
          }

          setMapPlaces([]);
          setStatus("ready");
          onViewportChange?.(getMapCenter(map));
        };

        const clearSelectionFromMap = () => {
          clearSelection();
        };

        idleListenerRef.current = searchVisibleCafes;
        mapClickListenerRef.current = clearSelectionFromMap;
        dragStartListenerRef.current = clearSelectionFromMap;
        kakao.maps.event.addListener(map, "idle", searchVisibleCafes);
        kakao.maps.event.addListener(map, "click", clearSelectionFromMap);
        kakao.maps.event.addListener(map, "dragstart", clearSelectionFromMap);
        await searchVisibleCafes();
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

      if (
        window.kakao?.maps?.event &&
        mapInstanceRef.current &&
        idleListenerRef.current
      ) {
        window.kakao.maps.event.removeListener(
          mapInstanceRef.current,
          "idle",
          idleListenerRef.current,
        );
      }

      if (
        window.kakao?.maps?.event &&
        mapInstanceRef.current &&
        mapClickListenerRef.current
      ) {
        window.kakao.maps.event.removeListener(
          mapInstanceRef.current,
          "click",
          mapClickListenerRef.current,
        );
      }

      if (
        window.kakao?.maps?.event &&
        mapInstanceRef.current &&
        dragStartListenerRef.current
      ) {
        window.kakao.maps.event.removeListener(
          mapInstanceRef.current,
          "dragstart",
          dragStartListenerRef.current,
        );
      }

      markerEntriesRef.current.forEach(({ marker }) => marker.setMap(null));
      markerEntriesRef.current = [];
      overlayRef.current?.setMap(null);
      mapInstanceRef.current = null;
      overlayRef.current = null;
      setIsMapReady(false);
      idleListenerRef.current = null;
      mapClickListenerRef.current = null;
      dragStartListenerRef.current = null;
      selectedPlaceRef.current = null;
    };
  }, [appKey, onViewportChange]);

  useEffect(() => {
    if (!window.kakao?.maps || !mapInstanceRef.current || resetViewVersion <= 0) {
      return;
    }

    const kakao = window.kakao;
    const map = mapInstanceRef.current;
    const resetTimerId = window.setTimeout(() => {
      setSearchPlaces([]);
      setMapPlaces([]);
      setStatus("ready");
      setErrorMessage("");
      setErrorCode("");
      clearSelection();
    }, 0);

    searchRequestIdRef.current += 1;
    shouldFocusSearchResultsRef.current = true;
    normalizedSearchQueryRef.current = "";
    isCurrentAreaModeRef.current = false;
    currentViewModeRef.current = "idle";
    clearCurrentAreaCache(responseCacheRef.current);
    map.setLevel(DEFAULT_LEVEL);
    map.panTo(new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng));
    onViewportChange?.({
      lat: DEFAULT_CENTER.lat,
      lng: DEFAULT_CENTER.lng,
    });

    return () => {
      window.clearTimeout(resetTimerId);
    };
  }, [onViewportChange, resetViewVersion]);

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !window.kakao?.maps) {
      return;
    }

    let cancelled = false;
    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;

    async function runSearch() {
      if (!normalizedSearchQuery) {
        setSearchPlaces([]);

        if (currentViewModeRef.current === "saved") {
          setStatus("ready");
          return;
        }

        if (!isCurrentAreaModeRef.current) {
          currentViewModeRef.current = "idle";
          setMapPlaces([]);
        }

        setStatus("ready");
        return;
      }

      shouldFocusSearchResultsRef.current = true;
      isCurrentAreaModeRef.current = false;
      currentViewModeRef.current = "search";
      setStatus("loading");
      setErrorMessage("");
      setErrorCode("");

      try {
        const cacheKey = buildKeywordSearchCacheKey(normalizedSearchQuery);
        const cachedResults = responseCacheRef.current.get(cacheKey);

        if (cachedResults) {
          await waitForNextFrame();
        }

        const results =
          cachedResults ?? await fetchKeywordResults(normalizedSearchQuery);

        if (!cachedResults) {
          responseCacheRef.current.set(cacheKey, results);
        }

        if (cancelled || requestId !== searchRequestIdRef.current) {
          return;
        }

        setSearchPlaces(results);
        setStatus("ready");
      } catch (error) {
        if (cancelled || requestId !== searchRequestIdRef.current) {
          return;
        }

        setSearchPlaces([]);
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        setErrorCode(error instanceof Error ? (error.code ?? "") : "");
        setStatus("error");
      }
    }

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [isMapReady, normalizedSearchQuery, searchRequestVersion]);

  useEffect(() => {
    if (!window.kakao?.maps || !mapInstanceRef.current) {
      return;
    }

    const kakao = window.kakao;
    const map = mapInstanceRef.current;
    const overlay = overlayRef.current;

    markerEntriesRef.current.forEach(({ marker }) => marker.setMap(null));

    markerEntriesRef.current = displayedPlaces.map((place) => {
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(Number(place.y), Number(place.x)),
        title: place.place_name,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        if (String(selectedPlaceRef.current?.id) === String(place.id)) {
          clearSelection();
          return;
        }

        selectedPlaceRef.current = place;
        setSelectedPlaceId(String(place.id));
        onSelectPlaceRef.current?.(toSavedPlace(place));
        applyMarkerPriority(markerEntriesRef.current, place.id);

        const content = createInfoContent(
          place,
          savedPlaceIdsRef.current.has(String(place.id)),
          () => {
            onToggleSavedPlaceRef.current(toSavedPlace(place));
          },
          messages,
        );

        overlay?.setContent(content);
        overlay?.setPosition(marker.getPosition());
        overlay?.setMap(map);
      });

      return { place, marker };
    });

    applyMarkerPriority(markerEntriesRef.current, selectedPlaceId);

    if (
      normalizedSearchQuery &&
      !selectedPlaceId &&
      shouldFocusSearchResultsRef.current
    ) {
      focusMapToPrimaryPlace(kakao, map, displayedPlaces);
    }

    const selectedEntry = markerEntriesRef.current.find(
      ({ place }) => String(place.id) === String(selectedPlaceId),
    );

    if (!selectedEntry) {
      clearSelectionWithoutState();

      if (selectedPlaceId) {
        window.setTimeout(() => {
          setSelectedPlaceId("");
        }, 0);
      }

      return;
    }

    const content = createInfoContent(
      selectedEntry.place,
      savedPlaceIds.has(String(selectedEntry.place.id)),
      () => {
        onToggleSavedPlaceRef.current(toSavedPlace(selectedEntry.place));
      },
      messages,
    );

    overlay?.setContent(content);
    overlay?.setPosition(selectedEntry.marker.getPosition());
    overlay?.setMap(map);
    applyMarkerPriority(markerEntriesRef.current, selectedEntry.place.id);
  }, [displayedPlaces, messages, normalizedSearchQuery, savedPlaceIds, selectedPlaceId]);

  const handleSelectPlace = (place) => {
    if (!window.kakao?.maps || !mapInstanceRef.current) {
      return;
    }

    const targetEntry = markerEntriesRef.current.find(
      (entry) => String(entry.place.id) === String(place.id),
    );

    if (!targetEntry) {
      return;
    }

    if (String(selectedPlaceRef.current?.id) === String(targetEntry.place.id)) {
      clearSelection();
      return;
    }

    currentViewModeRef.current =
      currentViewModeRef.current === "saved"
        ? "saved"
        : normalizedSearchQuery
          ? "search"
          : "map";
    selectedPlaceRef.current = targetEntry.place;
    setSelectedPlaceId(String(targetEntry.place.id));
    onSelectPlaceRef.current?.(toSavedPlace(targetEntry.place));
    applyMarkerPriority(markerEntriesRef.current, targetEntry.place.id);

    const content = createInfoContent(
      targetEntry.place,
      savedPlaceIdsRef.current.has(String(targetEntry.place.id)),
      () => {
        onToggleSavedPlaceRef.current(toSavedPlace(targetEntry.place));
      },
      messages,
    );

    mapInstanceRef.current.panTo(targetEntry.marker.getPosition());
    onViewportChange?.({
      lat: Number(targetEntry.place.y),
      lng: Number(targetEntry.place.x),
    });
    overlayRef.current?.setContent(content);
    overlayRef.current?.setPosition(targetEntry.marker.getPosition());
    overlayRef.current?.setMap(mapInstanceRef.current);
  };

  useEffect(() => {
    if (!activePlaceId) {
      return;
    }

    const targetEntry = markerEntriesRef.current.find(
      (entry) => String(entry.place.id) === String(activePlaceId),
    );

    if (!targetEntry) {
      return;
    }

    if (!window.kakao?.maps || !mapInstanceRef.current) {
      return;
    }

    currentViewModeRef.current =
      currentViewModeRef.current === "saved"
        ? "saved"
        : normalizedSearchQuery
          ? "search"
          : "map";
    selectedPlaceRef.current = targetEntry.place;
    setSelectedPlaceId(String(targetEntry.place.id));
    onSelectPlaceRef.current?.(toSavedPlace(targetEntry.place));
    applyMarkerPriority(markerEntriesRef.current, targetEntry.place.id);

    const content = createInfoContent(
      targetEntry.place,
      savedPlaceIdsRef.current.has(String(targetEntry.place.id)),
      () => {
        onToggleSavedPlaceRef.current(toSavedPlace(targetEntry.place));
      },
      messages,
    );

    mapInstanceRef.current.panTo(targetEntry.marker.getPosition());
    onViewportChange?.({
      lat: Number(targetEntry.place.y),
      lng: Number(targetEntry.place.x),
    });
    overlayRef.current?.setContent(content);
    overlayRef.current?.setPosition(targetEntry.marker.getPosition());
    overlayRef.current?.setMap(mapInstanceRef.current);
  }, [activePlaceId, displayedPlaces, messages, normalizedSearchQuery, onViewportChange]);

  return (
    <div className="relative h-full min-h-[420px] w-full sm:min-h-[520px]">
      <div ref={mapRef} className="h-full w-full" />

      <div className="absolute left-4 top-4 z-20 flex max-w-[calc(100%-32px)] flex-col items-start gap-2">
        {!normalizeAppKey(appKey) ||
        normalizeAppKey(appKey) === "MOCK_KAKAO_MAP_KEY" ? null : (
          <button
            type="button"
            onClick={handleShowSavedPlaces}
            className={`rounded-full border px-4 py-2 text-xs font-semibold shadow-[0_16px_32px_rgba(47,34,27,0.24)] backdrop-blur transition ${
              searchSource === "saved"
                ? "border-[#5d4334] bg-[linear-gradient(160deg,rgba(56,39,30,0.96)_0%,rgba(38,26,21,0.94)_100%)] text-[#fff7f0]"
                : "border-[#dccfbe] bg-white/96 text-[#2f221b] hover:border-[#cdb8a6] hover:bg-[#fffaf5]"
            }`}
          >
            {messages.savedPlacesMapButton}
          </button>
        )}
      </div>

      {!normalizeAppKey(appKey) ||
      normalizeAppKey(appKey) === "MOCK_KAKAO_MAP_KEY" ? (
        <div className="absolute left-4 top-4 rounded-full bg-[#2f221b]/90 px-3 py-2 text-xs font-medium text-white shadow-[0_16px_30px_rgba(47,34,27,0.24)]">
          {messages.mapKeyMissing}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="absolute bottom-[260px] right-4 rounded-full bg-white/92 px-3 py-2 text-xs font-medium text-[#5e493d] shadow-[0_10px_25px_rgba(84,52,27,0.08)]">
          {searchSource === "saved"
            ? messages.savedPlacesMapButton
            : normalizedSearchQuery
            ? messages.mapLoadingSearch
            : messages.mapLoadingArea}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-x-4 bottom-[260px] rounded-2xl border border-[#eadfd3] bg-white/95 px-4 py-3 text-sm text-[#5f4b3f] shadow-[0_14px_30px_rgba(84,52,27,0.1)]">
          <p>{messages.mapLoadFailedTitle}</p>
          <p className="mt-1 text-xs text-[#8b7162]">
            {errorMessage ||
              messages.mapLoadFailedBody}
          </p>
          <p className="mt-2 text-xs text-[#8b7162]">
            {messages.mapLoadFailedDomainHint}
          </p>
        </div>
      ) : null}

      {status === "ready" && displayedPlaces.length === 0 ? (
        <div className="absolute bottom-[260px] left-4 rounded-2xl border border-[#eadfd3] bg-white/95 px-4 py-3 text-sm text-[#5f4b3f] shadow-[0_14px_30px_rgba(84,52,27,0.1)]">
          {searchSource === "saved"
            ? messages.mapEmptySavedPlaces
            : normalizedSearchQuery
            ? messages.mapEmptySearch
            : messages.mapEmptyArea}
        </div>
      ) : null}

    </div>
  );
}
