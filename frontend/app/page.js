"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import coffeebaraLogo from "./coffeebara-logo.png";
import KakaoMap from "./components/KakaoMap";
import { getMessages } from "./messages";

const STORAGE_KEY = "coffeebara.preferred-cafes";
const MIN_RECOMMENDATION_READY_COUNT = 3;
const SEARCH_RESULT_PANEL_LIMIT = 10;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";
const messages = getMessages();

function buildFriendlyBackendErrorMessage(errorCode, fallbackMessage, cafeName) {
  const cafeLabel = cafeName ? `"${cafeName}"` : "선택한 카페";

  switch (errorCode) {
    case "DB_CONNECTION_FAILED":
      return `${cafeLabel} 정보를 불러오는 중 서버 연결이 일시적으로 불안정합니다. 잠시 후 다시 시도해 주세요.`;
    case "CAFE_UPSERT_FAILED":
      return `${cafeLabel} 정보를 최신 상태로 맞추는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`;
    case "CAFE_LOOKUP_FAILED":
    case "DATA_ACCESS_ERROR":
      return `${cafeLabel} 정보를 확인하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`;
    default:
      return (
        fallbackMessage ||
        `${cafeLabel} 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.`
      );
  }
}

async function parseBackendError(response, cafeName) {
  try {
    const payload = await response.json();

    return buildFriendlyBackendErrorMessage(
      typeof payload?.code === "string" ? payload.code : "",
      typeof payload?.message === "string" ? payload.message : "",
      cafeName,
    );
  } catch {
    return buildFriendlyBackendErrorMessage("", "", cafeName);
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

async function syncFavoriteCafeToBackend(cafe) {
  const response = await fetch(`${API_BASE_URL}/api/cafes`, {
    method: "POST",
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
    throw new Error(await parseBackendError(response, cafe.name));
  }
}

function HamburgerButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "사이드 메뉴 닫기" : "사이드 메뉴 열기"}
      aria-expanded={isOpen}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#cdb8a6] bg-white text-[#2f221b] shadow-[0_10px_24px_rgba(84,52,27,0.08)] transition hover:bg-[#f6efe7]"
    >
      <span className="flex flex-col gap-[3px]">
        <span className="block h-[2px] w-4 rounded-full bg-current" />
        <span className="block h-[2px] w-4 rounded-full bg-current" />
        <span className="block h-[2px] w-4 rounded-full bg-current" />
      </span>
    </button>
  );
}

function SearchResultNoticeV2({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-[#6d5443] bg-[linear-gradient(160deg,rgba(56,39,30,0.98)_0%,rgba(38,26,21,0.97)_100%)] px-4 py-4 text-[#f8efe6] shadow-[0_28px_70px_rgba(27,15,8,0.32)] backdrop-blur">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(243,198,151,0.28),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(120,85,62,0.22),transparent_70%)]"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9b99d]">
            Search Tip
          </p>
          <p className="mt-2 text-sm font-semibold text-[#f7e3d0]">
            검색 범위가 넓습니다
          </p>
          <p className="mt-2 text-sm leading-6 text-[#f2e5da]">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="알림 닫기"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8a6b56] bg-[rgba(255,248,241,0.1)] text-[#fff7f0] transition hover:bg-[rgba(255,248,241,0.18)]"
        >
          ×
        </button>
      </div>
      <div className="relative mt-4 h-[3px] overflow-hidden rounded-full bg-[rgba(255,244,235,0.12)]">
        <div className="search-progress-bar h-full w-1/3 rounded-full bg-[linear-gradient(90deg,#f2d1b0_0%,#fff4e7_100%)]" />
      </div>
    </div>
  );
}

function SearchLoadingOverlayV2({ isVisible, searchQuery }) {
  if (!isVisible) {
    return null;
  }

  const queryLabel = searchQuery.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(36,24,19,0.22)] backdrop-blur-[1.5px]">
      <div className="mx-4 flex w-full max-w-md flex-col gap-2 rounded-[28px] border border-[#e7dccf] bg-[rgba(255,251,246,0.96)] px-5 py-5 shadow-[0_24px_60px_rgba(84,52,27,0.16)]">
        <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#5f4b3f]">
          <span>
            {queryLabel
              ? `"${queryLabel}" 검색 결과를 불러오고 저장하는 중입니다.`
              : "검색 결과를 불러오고 저장하는 중입니다."}
          </span>
          <span className="shrink-0 text-[#8f725d]">잠시만 기다려주세요</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8d9ca]">
          <div className="search-progress-bar h-full w-1/3 rounded-full bg-[#2f221b]" />
        </div>
      </div>
    </div>
  );
}

function SimilarTasteSection({ favoriteCount }) {
  const isReady = favoriteCount >= MIN_RECOMMENDATION_READY_COUNT;

  return (
    <section className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
            취향 추천
          </p>
          <p className="mt-2 text-sm text-[#f7ede4]">
            내 취향 카페를 바탕으로 비슷한 분위기의 카페를 추천받는 영역입니다.
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
        비슷한 취향 추천 받기
      </button>

      <p className="mt-3 text-xs leading-5 text-[#d9c3b4]">
        {isReady
          ? "준비 완료. 선택한 취향을 바탕으로 비슷한 카페 추천으로 이어갈 수 있습니다."
          : `최소 ${MIN_RECOMMENDATION_READY_COUNT}곳 이상 고르면 취향 추천을 시작할 수 있습니다.`}
      </p>
    </section>
  );
}

function BackendSyncSection({ status, fetchedCount, totalCount, errorMessage, isVisible }) {
  if (!isVisible) {
    return null;
  }

  const isLoading = status === "loading";
  const isError = status === "error";
  const isSuccess = status === "success";

  return (
    <section className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
        백엔드 조회
      </p>
      <p className="mt-2 text-sm text-[#f7ede4]">
        로컬 스토리지에 저장한 카페를 기준으로 백엔드에서 최신 카페 정보를 다시 불러옵니다.
      </p>

      <div className="mt-4 rounded-2xl bg-white/8 px-3 py-3 text-sm text-[#f7ede4]">
        {isLoading
          ? `백엔드에서 카페 정보를 조회하는 중입니다. (${fetchedCount}/${totalCount})`
          : null}
        {isSuccess
          ? `백엔드 조회 완료. ${fetchedCount}개의 카페 정보를 불러왔습니다.`
          : null}
        {isError ? errorMessage || "백엔드 조회에 실패했습니다." : null}
        {!isLoading && !isSuccess && !isError
          ? "저장한 카페가 있으면 백엔드 조회가 자동으로 시작됩니다."
          : null}
      </div>
    </section>
  );
}

function BackendSyncBanner({ status, errorMessage }) {
  if (status !== "error") {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-[#e7c9c2] bg-[#fff1ed] px-5 py-4 text-[#6f3126] shadow-[0_12px_30px_rgba(111,49,38,0.08)]">
      <p className="text-sm font-semibold">카페 불러오기 중 문제가 발생했습니다.</p>
      <p className="mt-1 text-sm leading-6">
        {errorMessage || "백엔드에서 카페 정보를 조회하거나 최신 상태로 맞추는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."}
      </p>
    </section>
  );
}

function SidebarContent({
  favoriteCafes,
  onClose,
  onRemoveFavorite,
  isDesktop = false,
}) {
  const wrapperClassName = isDesktop
    ? "rounded-[28px] border border-[#e7dccf] bg-[#fbf7f2] p-4 shadow-[0_24px_60px_rgba(84,52,27,0.1)]"
    : "h-full overflow-y-auto px-4 py-5";

  return (
    <div className={wrapperClassName}>
      <section className="rounded-[24px] bg-[#2f221b] p-4 text-white shadow-[0_16px_40px_rgba(47,34,27,0.24)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
          내 취향 카페
        </p>
        {!isDesktop ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#f7ede4]"
            >
              닫기
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
                      {cafe.roadAddress || cafe.address || "주소 정보 없음"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(cafe.id)}
                    aria-label={`${cafe.name} 즐겨찾기 해제`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f221b] text-base leading-none text-[#f3c76d]"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white/8 px-3 py-3 text-sm text-[#d9c3b4]">
              아직 고른 카페가 없습니다.
            </div>
          )}
        </div>

        <SimilarTasteSection favoriteCount={favoriteCafes.length} />
      </section>
    </div>
  );
}

function Sidebar({
  favoriteCafes,
  isOpen,
  onClose,
  onRemoveFavorite,
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
          onRemoveFavorite={onRemoveFavorite}
        />
      </aside>
    </>
  );
}

function DesktopSidebar({
  favoriteCafes,
  isOpen,
  onRemoveFavorite,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="hidden xl:block xl:w-[312px] xl:shrink-0" aria-hidden={!isOpen}>
      <div className="pointer-events-auto sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto pr-2 -mr-2 [scrollbar-gutter:stable]">
        <SidebarContent
          favoriteCafes={favoriteCafes}
          onRemoveFavorite={onRemoveFavorite}
          isDesktop
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

function HeaderV2({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  isSidebarOpen,
  onToggleSidebar,
  locale,
  onLocaleChange,
}) {
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  const localeOptions = ["ko", "en", "ja"];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7ddd2] bg-[rgba(255,251,246,0.96)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[2200px] items-center gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <HamburgerButton isOpen={isSidebarOpen} onClick={onToggleSidebar} />

          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#dbcab8] bg-white shadow-[0_10px_24px_rgba(84,52,27,0.08)]">
            <Image
              src={coffeebaraLogo}
              alt="Coffeebara 로고"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
              Coffeebara
            </p>
            <h1 className="truncate text-lg font-semibold text-[#241813]">
              {messages.headerTitle}
            </h1>
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLocaleMenuOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-[#dccfbe] bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f4b3f] shadow-[0_10px_24px_rgba(84,52,27,0.06)] transition hover:bg-[#f7efe6]"
            >
              <span>{locale.toUpperCase()}</span>
              <span className="text-[#8f725d]">{isLocaleMenuOpen ? "▲" : "▼"}</span>
            </button>

            {isLocaleMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-40 min-w-[88px] overflow-hidden rounded-2xl border border-[#dccfbe] bg-white shadow-[0_18px_40px_rgba(84,52,27,0.12)]">
                {localeOptions.map((option) => {
                  const isActive = locale === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onLocaleChange(option);
                        setIsLocaleMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                        isActive
                          ? "bg-[#f7efe6] text-[#2f221b]"
                          : "text-[#6d584b] hover:bg-[#fcf7f2]"
                      }`}
                    >
                      <span>{option.toUpperCase()}</span>
                      <span>{isActive ? "•" : ""}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="min-w-[280px] max-w-[620px] flex-1 items-center gap-3 md:flex"
          >
            <label className="flex flex-1 items-center rounded-full border border-[#dccfbe] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(84,52,27,0.06)]">
              <span className="sr-only">카페 이름 검색</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => onSearchInputChange(event.target.value)}
                placeholder="카페명"
                className="w-full bg-transparent text-sm text-[#352720] outline-none placeholder:text-[#a38b79]"
              />
            </label>

            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#2f221b] px-4 py-3 text-sm font-medium text-white"
            >
              카페 검색
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 pb-4 md:hidden">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[2200px] items-center gap-3 xl:px-8"
        >
          <label className="flex flex-1 items-center rounded-full border border-[#dccfbe] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(84,52,27,0.06)]">
            <span className="sr-only">카페 이름 검색</span>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              placeholder="카페명"
              className="w-full bg-transparent text-sm text-[#352720] outline-none placeholder:text-[#a38b79]"
            />
          </label>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#2f221b] px-4 py-3 text-sm font-medium text-white"
          >
            검색
          </button>
        </form>
      </div>
    </header>
  );
}

function MapPanelV2({
  kakaoMapKey,
  favoriteCafes,
  onToggleFavorite,
  searchQuery,
  searchRequestVersion,
  onSelectPlace,
  activePlaceId,
  onSearchResultsChange,
  isSidebarOpen,
  searchNoticeMessage,
  onCloseSearchNotice,
}) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#e7dccf] bg-white shadow-[0_24px_60px_rgba(84,52,27,0.08)]">
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4">
        <div className="pointer-events-auto w-full max-w-[380px]">
          <SearchResultNoticeV2
            message={searchNoticeMessage}
            onClose={onCloseSearchNotice}
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
          onSelectPlace={onSelectPlace}
          activePlaceId={activePlaceId}
          onSearchResultsChange={onSearchResultsChange}
          isSidebarOpen={isSidebarOpen}
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
}) {
  const isSearching = Boolean(searchQuery.trim());
  const visibleSearchResults = searchState.results.slice(0, SEARCH_RESULT_PANEL_LIMIT);

  if (isSearching) {
    return (
      <SectionCard title={messages.searchResultsTitle}>
        {searchState.status === "error" ? (
          <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4 text-sm text-[#5f4b3f]">
            {searchState.errorMessage || messages.searchError}
          </div>
        ) : searchState.results.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5ecdf] px-3 py-2 text-xs font-medium text-[#6c5547]">
                {messages.totalSearchResults(
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
  const kakaoMapKey =
    process.env.NEXT_PUBLIC_KAKAO_MAP_KEY?.trim() ??
    process.env.KAKAO_MAP_KEY?.trim() ??
    "";

  const [favoriteCafes, setFavoriteCafes] = useState([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [locale, setLocale] = useState("ko");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRequestVersion, setSearchRequestVersion] = useState(0);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [activePlaceId, setActivePlaceId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchState, setSearchState] = useState({
    results: [],
    visibleCount: 0,
    totalCount: 0,
    hiddenCount: 0,
    isSearching: false,
    status: "idle",
    errorMessage: "",
  });
  const [backendFavoriteFetch, setBackendFavoriteFetch] = useState({
    status: "idle",
    fetchedCount: 0,
    totalCount: 0,
    errorMessage: "",
  });
  const [hasHydratedFavoriteCafes, setHasHydratedFavoriteCafes] = useState(false);
  const [searchNoticeMessage, setSearchNoticeMessage] = useState("");
  const [searchNoticeQuery, setSearchNoticeQuery] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setFavoriteCafes(normalizeFavoriteCafes(parsed));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteCafes));
  }, [favoriteCafes, isStorageReady]);

  useEffect(() => {
    if (!isStorageReady) {
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
          );

          if (!response.ok) {
            throw new Error(await parseBackendError(response, cafe.name));
          }

          const data = await response.json();
          fetchedCafes.push(mapBackendCafeToFavoriteCafe(data));

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
              : "카페 정보를 불러오는 중 예상하지 못한 문제가 발생했습니다.",
        });
        setHasHydratedFavoriteCafes(true);
      }
    }

    fetchFavoriteCafesFromBackend();

    return () => {
      cancelled = true;
    };
  }, [favoriteCafes, hasHydratedFavoriteCafes, isStorageReady]);

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

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      return;
    }

    if (searchState.status !== "ready") {
      return;
    }

    if (searchState.totalCount < 45) {
      return;
    }

    if (searchNoticeQuery === normalizedQuery) {
      return;
    }

    setSearchNoticeQuery(normalizedQuery);
    setSearchNoticeMessage(messages.searchTooManyNotice);
  }, [searchNoticeQuery, searchQuery, searchState.status, searchState.totalCount]);

  useEffect(() => {
    if (!searchNoticeMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSearchNoticeMessage("");
    }, 2500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [searchNoticeMessage]);

  useEffect(() => {
    if (!searchNoticeMessage) {
      return;
    }

    if (searchState.totalCount < 45) {
      return;
    }

    if (searchNoticeMessage === messages.searchTooManyNotice) {
      return;
    }

    setSearchNoticeMessage(messages.searchTooManyNotice);
  }, [searchNoticeMessage, searchState.totalCount]);

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

    syncFavoriteCafeToBackend(nextCafe)
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
              : "선택한 카페를 저장하는 중 예상하지 못한 문제가 발생했습니다.",
        }));
      });
  };

  const handleRemoveFavorite = (cafeId) => {
    setFavoriteCafes((current) => current.filter((item) => item.id !== cafeId));
  };

  const handleSearchSubmit = () => {
    const nextQuery = searchInput.trim();
    setSearchQuery(nextQuery);
    setSearchRequestVersion((current) => current + 1);

    if (!nextQuery) {
      setSelectedCafe(null);
      setActivePlaceId("");
    }
  };

  const handleSelectCafe = (cafe) => {
    setSelectedCafe(cafe);
    setActivePlaceId(cafe?.id ?? "");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#241813]">
      <HeaderV2
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
        locale={locale}
        onLocaleChange={setLocale}
      />

      <SearchLoadingOverlayV2
        isVisible={searchState.status === "loading" && Boolean(searchQuery.trim())}
        searchQuery={searchQuery}
      />

      <Sidebar
        favoriteCafes={favoriteCafes}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onRemoveFavorite={handleRemoveFavorite}
      />

      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 xl:px-8">
        <main className="relative flex min-w-0 gap-6">
          <DesktopSidebar
            favoriteCafes={favoriteCafes}
            isOpen={isSidebarOpen}
            onRemoveFavorite={handleRemoveFavorite}
          />

          <div className="min-w-0 flex-1 space-y-6">
            <BackendSyncBanner
              status={backendFavoriteFetch.status}
              errorMessage={backendFavoriteFetch.errorMessage}
            />

            <MapPanelV2
              kakaoMapKey={kakaoMapKey}
              favoriteCafes={favoriteCafes}
              onToggleFavorite={handleToggleFavorite}
              searchQuery={searchQuery}
              searchRequestVersion={searchRequestVersion}
              onSelectPlace={handleSelectCafe}
              activePlaceId={activePlaceId}
              onSearchResultsChange={setSearchState}
              isSidebarOpen={isSidebarOpen}
              searchNoticeMessage={searchNoticeMessage}
              onCloseSearchNotice={() => setSearchNoticeMessage("")}
            />

            <BottomPanelV2
              searchQuery={searchQuery}
              searchState={searchState}
              selectedCafe={selectedCafe}
              favoriteCafeIds={favoriteCafeIds}
              onToggleFavorite={handleToggleFavorite}
              onSelectSearchResult={handleSelectCafe}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

