"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import HeaderBar from "./components/home/HeaderBar";
import KakaoMap from "./components/KakaoMap";
import SearchLoadingOverlay from "./components/home/SearchLoadingOverlay";
import SearchResultNotice from "./components/home/SearchResultNotice";
import { getMessages } from "./messages";

const STORAGE_KEY = "coffeebara.guestFavorites.v1";
const LEGACY_STORAGE_KEY = "coffeebara.preferred-cafes";
const LOCALE_STORAGE_KEY = "coffeebara.locale.v1";
const MIN_RECOMMENDATION_READY_COUNT = 3;
const SEARCH_RESULT_PANEL_LIMIT = 10;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";
const DEFAULT_MAP_VIEW = { lat: 37.566826, lng: 126.9786567 };

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


function SimilarTasteSection({ favoriteCount, messages }) {
  const isReady = favoriteCount >= MIN_RECOMMENDATION_READY_COUNT;

  return (
    <section className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
            {messages.similarTasteLabel}
          </p>
          <p className="mt-2 text-sm text-[#f7ede4]">
            {messages.similarTasteDescription}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={!isReady}
        className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          isReady
            ? "bg-[#f3d6b6] text-[#2f221b] shadow-[0_12px_24px_rgba(27,15,8,0.18)] hover:bg-[#f0ccb0]"
            : "cursor-not-allowed bg-[#675249] text-[#d9c3b4]"
        }`}
      >
        {messages.similarTasteButton}
      </button>

      <p className="mt-3 text-xs leading-5 text-[#d9c3b4]">
        {isReady
          ? messages.similarTasteReady
          : messages.similarTasteNeedMore(MIN_RECOMMENDATION_READY_COUNT)}
      </p>
    </section>
  );
}

function SidebarPolicySection({ messages }) {
  const privacyNoticeTitle = messages.privacyNoticeTitle ?? "개인정보 처리 안내";
  const privacyNoticeBody =
    messages.privacyNoticeBody ??
    "커피바라는 사용자를 직접 식별할 수 있는 정보와 사용자 동선, 검색 내역, 검색 지역, 사용자 좌표를 서버에 저장하지 않습니다.";
  const guestNoticeTitle = messages.guestNoticeTitle ?? "게스트 이용 안내";
  const guestNoticeBody =
    messages.guestNoticeBody ??
    "게스트로 이용하는 동안 생성된 정보는 브라우저 환경이나 운영 정책에 따라 초기화될 수 있습니다.";
  const dataPolicyTitle = messages.dataPolicyTitle ?? "데이터 수집 안내";
  const dataPolicyBody =
    messages.dataPolicyBody ??
    "카페 정보는 공식 API를 우선 사용하고, 추가 수집이 필요한 경우 공개 범위와 이용 정책, robots 설정을 확인한 뒤 필요한 최소 정보만 처리합니다.";

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="space-y-3 text-xs leading-5 text-[#d9c3b4]">
        <div>
          <p className="font-semibold text-[#fff3e8]">{privacyNoticeTitle}</p>
          <p className="mt-1">{privacyNoticeBody}</p>
        </div>
        <div>
          <p className="font-semibold text-[#fff3e8]">{guestNoticeTitle}</p>
          <p className="mt-1">{guestNoticeBody}</p>
        </div>
        <div>
          <p className="font-semibold text-[#fff3e8]">{dataPolicyTitle}</p>
          <p className="mt-1">{dataPolicyBody}</p>
        </div>
      </div>
    </div>
  );
}

function SidebarMapLink({ kakaoMapUrl }) {
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-between rounded-2xl bg-white/8 px-3 py-3 text-sm font-semibold text-[#fff7f0] transition hover:bg-white/12"
      >
        <span>Kakao Map</span>
        <span className="text-[#d8b89f]">↗</span>
      </a>
    </div>
  );
}

function BackendSyncSection({ status, fetchedCount, totalCount, errorMessage, isVisible, messages }) {
  if (!isVisible) {
    return null;
  }

  const isLoading = status === "loading";
  const isError = status === "error";
  const isSuccess = status === "success";

  return (
    <section className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
        {messages.backendSyncTitle}
      </p>
      <p className="mt-2 text-sm text-[#f7ede4]">
        {messages.backendSyncDescription}
      </p>

      <div className="mt-4 rounded-2xl bg-white/8 px-3 py-3 text-sm text-[#f7ede4]">
        {isLoading
          ? messages.backendSyncLoading(fetchedCount, totalCount)
          : null}
        {isSuccess
          ? messages.backendSyncSuccess(fetchedCount)
          : null}
        {isError ? errorMessage || messages.backendSyncError : null}
        {!isLoading && !isSuccess && !isError
          ? messages.backendSyncIdle
          : null}
      </div>
    </section>
  );
}

function BackendSyncBanner({ status, errorMessage, messages }) {
  if (status !== "error") {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-[#e7c9c2] bg-[#fff1ed] px-5 py-4 text-[#6f3126] shadow-[0_12px_30px_rgba(111,49,38,0.08)]">
      <p className="text-sm font-semibold">{messages.backendBannerTitle}</p>
      <p className="mt-1 text-sm leading-6">
        {errorMessage || messages.backendBannerFallback}
      </p>
    </section>
  );
}

function GuestModeToast({ isVisible, messages }) {
  if (!isVisible) {
    return null;
  }

  const bodyText = String(messages.guestModeBannerBody);
  const commaIndex = bodyText.indexOf(",");
  const bodyLines =
    commaIndex >= 0
      ? [
          bodyText.slice(0, commaIndex + 1).trim(),
          bodyText.slice(commaIndex + 1).trim(),
        ].filter(Boolean)
      : [bodyText];

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 w-[min(384px,calc(100vw-2rem))] rounded-[24px] border border-[#3d8f58] bg-[#2f9e55] px-5 py-[18px] text-white shadow-[0_18px_36px_rgba(29,92,50,0.22)]">
      <p className="text-sm font-semibold">{messages.guestModeBannerTitle}</p>
      <p className="mt-1 text-sm leading-6 text-white/92">
        {bodyLines.map((line, index) => (
          <span key={`${line}-${index}`} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

function SidebarContent({
  favoriteCafes,
  onClose,
  onHomeClick,
  onRemoveFavorite,
  kakaoMapUrl,
  isDesktop = false,
  messages,
}) {
  const wrapperClassName = isDesktop
    ? "rounded-[28px] border border-[#e7dccf] bg-[#fbf7f2] p-4 shadow-[0_24px_60px_rgba(84,52,27,0.1)]"
    : "h-full overflow-y-auto px-4 py-5";

  return (
    <div className={wrapperClassName}>
      <section className="rounded-[24px] bg-[#2f221b] p-4 text-white shadow-[0_16px_40px_rgba(47,34,27,0.24)]">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex w-full items-center gap-3 rounded-2xl bg-white/8 px-3 py-3 text-left text-sm font-semibold text-[#fff7f0] transition hover:bg-white/12"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,248,241,0.12)] text-base leading-none text-[#f3d2b4]">
            ⌂
          </span>
          <span>{messages.homeLabel ?? "Home"}</span>
        </button>

        <div className="my-4 border-b border-white/10" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
          {messages.favoriteSectionTitle}
        </p>
        {!isDesktop ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#f7ede4]"
            >
              {messages.closeButton}
            </button>
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {favoriteCafes.length > 0 ? (
            favoriteCafes.map((cafe) => (
              <div key={cafe.id} className="rounded-2xl bg-white/8 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{cafe.name}</p>
                    <p className="mt-1 text-xs text-[#d9c3b4]">
                      {cafe.roadAddress || cafe.address || messages.noAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(cafe.id)}
                    aria-label={messages.removeFavoriteAriaLabel(cafe.name)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f221b] text-base leading-none text-[#f3c76d]"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white/8 px-3 py-3 text-sm text-[#d9c3b4]">
              {messages.noFavoriteCafes}
            </div>
          )}
        </div>

        <SimilarTasteSection favoriteCount={favoriteCafes.length} messages={messages} />
        <SidebarMapLink kakaoMapUrl={kakaoMapUrl} />
        <SidebarPolicySection messages={messages} />
      </section>
    </div>
  );
}

function Sidebar({
  favoriteCafes,
  isOpen,
  onClose,
  onHomeClick,
  onRemoveFavorite,
  kakaoMapUrl,
  messages,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-[rgba(36,24,19,0.42)] xl:hidden"
      />

      <aside className="fixed left-0 top-[76px] z-40 h-[calc(100vh-76px)] w-[312px] max-w-[85vw] border-r border-[#e7dccf] bg-[#fbf7f2] shadow-[0_24px_60px_rgba(84,52,27,0.18)] md:top-[88px] md:h-[calc(100vh-88px)] xl:hidden">
        <SidebarContent
          favoriteCafes={favoriteCafes}
          onClose={onClose}
          onHomeClick={onHomeClick}
          onRemoveFavorite={onRemoveFavorite}
          kakaoMapUrl={kakaoMapUrl}
          messages={messages}
        />
      </aside>
    </>
  );
}

function DesktopSidebar({
  favoriteCafes,
  isOpen,
  onHomeClick,
  onRemoveFavorite,
  kakaoMapUrl,
  messages,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="hidden xl:block xl:w-[312px] xl:shrink-0" aria-hidden={!isOpen}>
      <div className="pointer-events-auto sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto pr-2 -mr-2 [scrollbar-gutter:stable]">
        <SidebarContent
          favoriteCafes={favoriteCafes}
          onHomeClick={onHomeClick}
          onRemoveFavorite={onRemoveFavorite}
          kakaoMapUrl={kakaoMapUrl}
          isDesktop
          messages={messages}
        />
      </div>
    </div>
  );
}

function SectionCard({ title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-[28px] border border-[#e8ddd0] bg-white p-5 shadow-[0_18px_45px_rgba(84,52,27,0.06)] sm:p-6 ${className}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f725d]">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-sm text-[#6d584b]">{description}</p>
        ) : null}
      </div>
      <div className={description ? "mt-5" : "mt-4"}>{children}</div>
    </section>
  );
}


function MapPanelV2({
  kakaoMapKey,
  favoriteCafes,
  onToggleFavorite,
  searchQuery,
  searchRequestVersion,
  resetViewVersion,
  onSelectPlace,
  activePlaceId,
  onSearchResultsChange,
  onViewportChange,
  isSidebarOpen,
  noticeState,
  onCloseNotice,
  onStartCurrentAreaSearch,
  messages,
}) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#e7dccf] bg-white shadow-[0_24px_60px_rgba(84,52,27,0.08)]">
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4">
        <div className="pointer-events-auto w-full max-w-[380px]">
          <SearchResultNotice
            notice={noticeState}
            onClose={onCloseNotice}
            messages={messages}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 border-b border-[#f0e6dc] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
              {messages.mapSectionLabel}
            </p>
            <h2 className="mt-2 text-sm font-semibold leading-6 text-[#241813]">
              {messages.mapSectionTitle}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#6d584b]">
              {messages.mapSectionDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(214,184,153,0.28),_transparent_28%),linear-gradient(180deg,_#f8f2ea_0%,_#f2e7da_100%)] sm:h-[520px]">
        <KakaoMap
          appKey={kakaoMapKey}
          favoriteCafes={favoriteCafes}
          onToggleFavorite={onToggleFavorite}
          searchQuery={searchQuery}
          searchRequestVersion={searchRequestVersion}
          resetViewVersion={resetViewVersion}
          onSelectPlace={onSelectPlace}
          activePlaceId={activePlaceId}
          onSearchResultsChange={onSearchResultsChange}
          onViewportChange={onViewportChange}
          isSidebarOpen={isSidebarOpen}
          onStartCurrentAreaSearch={onStartCurrentAreaSearch}
          messages={messages}
        />
      </div>
    </section>
  );
}

function BottomPanelV2({
  searchQuery,
  searchState,
  selectedCafe,
  favoriteCafeIds,
  onToggleFavorite,
  onSelectSearchResult,
  messages,
}) {
  const isSearching = Boolean(searchQuery.trim());
  const isResultPanelVisible = isSearching || searchState.source === "map";
  const visibleSearchResults = searchState.results.slice(0, SEARCH_RESULT_PANEL_LIMIT);

  if (isResultPanelVisible) {
    return (
      <SectionCard
        title={
          searchState.source === "map"
            ? messages.mapResultsTitle
            : messages.searchResultsTitle
        }
      >
        {searchState.status === "error" ? (
          <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4 text-sm text-[#5f4b3f]">
            {searchState.errorMessage || messages.searchError}
          </div>
        ) : searchState.results.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5ecdf] px-3 py-2 text-xs font-medium text-[#6c5547]">
                {searchState.source === "map"
                  ? messages.totalMapResults(searchState.totalCount)
                  : messages.totalSearchResults(
                      searchState.totalCount,
                      searchState.totalCount >= 45,
                    )}
              </span>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {visibleSearchResults.map((cafe) => {
                const isFavorite = favoriteCafeIds.has(cafe.id);
                const isSelected = selectedCafe?.id === cafe.id;

                return (
                  <div
                    key={cafe.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectSearchResult(cafe)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectSearchResult(cafe);
                      }
                    }}
                    className={`rounded-[22px] border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#2f221b] bg-[#f7efe6]"
                        : "border-[#eadfd3] bg-[#fcfaf7] hover:border-[#cdb8a6]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#241813]">
                          {cafe.name}
                        </p>
                        <p className="mt-1 text-xs text-[#8f725d]">
                          {cafe.categoryName || messages.cafeCategoryFallback}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleFavorite(cafe);
                        }}
                        aria-label={messages.favoriteAriaLabel}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          isFavorite
                            ? "bg-[#2f221b] text-[#f3c76d]"
                            : "bg-[#efe3d5] text-[#5d473b]"
                        }`}
                      >
                        {isFavorite ? "★" : "+"}
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-[#5f4b3f]">
                      {cafe.roadAddress || cafe.address || messages.noAddress}
                    </p>

                    {cafe.phone ? (
                      <p className="mt-2 text-xs text-[#8f725d]">{cafe.phone}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#d8c8b7] bg-[#fcfaf7] px-4 py-6 text-sm text-[#7a6456]">
            {searchState.status === "loading"
              ? messages.searchLoading
              : messages.searchEmpty}
          </div>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard title={messages.cafeInfoTitle}>
      <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4">
        {selectedCafe ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#241813]">
                  {selectedCafe.name}
                </p>
                <p className="mt-1 text-sm text-[#8f725d]">
                  {selectedCafe.categoryName || messages.cafeCategoryFallback}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleFavorite(selectedCafe)}
                aria-label={messages.favoriteAriaLabel}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  favoriteCafeIds.has(selectedCafe.id)
                    ? "bg-[#2f221b] text-[#f3c76d]"
                    : "bg-[#efe3d5] text-[#5d473b]"
                }`}
              >
                {favoriteCafeIds.has(selectedCafe.id) ? "★" : "+"}
              </button>
            </div>

            <p className="text-sm text-[#5f4b3f]">
              {selectedCafe.roadAddress ||
                selectedCafe.address ||
                messages.noAddress}
            </p>

            {selectedCafe.phone ? (
              <p className="text-sm text-[#5f4b3f]">
                {messages.phoneLabel}: {selectedCafe.phone}
              </p>
            ) : null}

            {selectedCafe.placeUrl ? (
              <a
                href={selectedCafe.placeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-[#2f221b] px-4 py-2 text-sm font-medium text-white visited:text-white hover:text-white"
                style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              >
                {messages.kakaoDetailLink}
              </a>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-[#5f4b3f]">{messages.noSelectedCafe}</p>
        )}
      </div>
    </SectionCard>
  );
}

export default function Home() {
  const router = useRouter();
  const kakaoMapKey =
    process.env.NEXT_PUBLIC_KAKAO_MAP_KEY?.trim() ??
    process.env.KAKAO_MAP_KEY?.trim() ??
    "";

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
  const [searchState, setSearchState] = useState({
    results: [],
    visibleCount: 0,
    totalCount: 0,
    hiddenCount: 0,
    isSearching: false,
    source: "idle",
    status: "idle",
    errorMessage: "",
    errorCode: "",
  });
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
  const toastCatalog = useMemo(() => ({
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
  }), [messages]);

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

  const showToast = useCallback((toastKey) => {
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
  }, [toastCatalog]);

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

  const handleToggleFavorite = (cafe) => {
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
  };

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
    queueToast("keyword-search-submit", "searchTooMany");
    setSearchQuery(nextQuery);
    setSearchRequestVersion((current) => current + 1);
  };

  const handleSelectCafe = (cafe) => {
    setSelectedCafe(cafe);
    setActivePlaceId(cafe?.id ?? "");
  };

  const handleStartCurrentAreaSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setNoticeState(null);
    queueToast("map-search-submit", "mapTooMany");
    setSelectedCafe(null);
    setActivePlaceId("");
  };

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
    setSearchState({
      results: [],
      visibleCount: 0,
      totalCount: 0,
      hiddenCount: 0,
      isSearching: false,
      source: "idle",
      status: "idle",
      errorMessage: "",
      errorCode: "",
    });
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

  if (authStatus !== "authenticated") {
    return <div className="min-h-screen bg-[#fffaf5]" />;
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#241813]">
      <GuestModeToast
        isVisible={isGuestModeToastVisible}
        messages={messages}
      />

      <HeaderBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onHomeClick={handleResetHomeView}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        locale={locale}
        onLocaleChange={setLocale}
        onLogout={handleLogout}
        messages={messages}
      />

      <SearchLoadingOverlay
        isVisible={searchState.status === "loading" && Boolean(searchQuery.trim())}
        searchQuery={searchQuery}
        messages={messages}
      />

      <Sidebar
        favoriteCafes={favoriteCafes}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onHomeClick={handleResetHomeView}
        onRemoveFavorite={handleRemoveFavorite}
        kakaoMapUrl={kakaoMapUrl}
        messages={messages}
      />

      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 xl:px-8">
        <main className="relative flex min-w-0 gap-6">
            <DesktopSidebar
              favoriteCafes={favoriteCafes}
              isOpen={isSidebarOpen}
              onHomeClick={handleResetHomeView}
              onRemoveFavorite={handleRemoveFavorite}
              kakaoMapUrl={kakaoMapUrl}
              messages={messages}
            />

          <div className="min-w-0 flex-1 space-y-6">
            <BackendSyncBanner
              status={backendFavoriteFetch.status}
              errorMessage={backendFavoriteFetch.errorMessage}
              messages={messages}
            />

            <MapPanelV2
              kakaoMapKey={kakaoMapKey}
              favoriteCafes={favoriteCafes}
              onToggleFavorite={handleToggleFavorite}
              searchQuery={searchQuery}
              searchRequestVersion={searchRequestVersion}
              resetViewVersion={resetViewVersion}
              onSelectPlace={handleSelectCafe}
              activePlaceId={activePlaceId}
              onSearchResultsChange={setSearchState}
              onViewportChange={setMapViewport}
              isSidebarOpen={isSidebarOpen}
              noticeState={noticeState}
              onCloseNotice={() => setNoticeState(null)}
              onStartCurrentAreaSearch={handleStartCurrentAreaSearch}
              messages={messages}
            />

            <BottomPanelV2
              searchQuery={searchQuery}
              searchState={searchState}
              selectedCafe={selectedCafe}
              favoriteCafeIds={favoriteCafeIds}
              onToggleFavorite={handleToggleFavorite}
              onSelectSearchResult={handleSelectCafe}
              messages={messages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

