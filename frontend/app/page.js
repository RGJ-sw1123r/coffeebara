"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import coffeebaraLogo from "./coffeebara-logo.png";
import KakaoMap from "./components/KakaoMap";

const STORAGE_KEY = "coffeebara.preferred-cafes";
const MIN_RECOMMENDATION_READY_COUNT = 3;

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

function Header({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  isSidebarOpen,
  onToggleSidebar,
}) {
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
              alt="커피바라 로고"
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
              우리 동네 카페 필드
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="ml-auto hidden min-w-[280px] max-w-[620px] flex-1 items-center gap-3 md:flex"
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
            내 취향 카페를 바탕으로 잘 맞는 새로운 카페를 추천받는 영역입니다.
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
          ? "준비 완료. 선택한 취향을 바탕으로 비슷한 무드의 카페 추천으로 이어갈 수 있습니다."
          : `최소 ${MIN_RECOMMENDATION_READY_COUNT}개 이상 고르면 취향 추천을 시작할 수 있습니다.`}
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
                    aria-label={`${cafe.name} 즐겨찾기 삭제`}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f221b] text-base leading-none text-[#f3c76d]"
                  >
                    ★
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

function Sidebar({ favoriteCafes, isOpen, onClose, onRemoveFavorite }) {
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

function DesktopSidebar({ favoriteCafes, isOpen, onRemoveFavorite }) {
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
        <p className="mt-2 text-sm text-[#6d584b]">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MapPanel({
  kakaoMapKey,
  favoriteCafes,
  onToggleFavorite,
  searchQuery,
  onSelectPlace,
  activePlaceId,
  onSearchResultsChange,
  isSidebarOpen,
}) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[#e7dccf] bg-white shadow-[0_24px_60px_rgba(84,52,27,0.08)]">
      <div className="flex flex-col gap-4 border-b border-[#f0e6dc] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
              카페 지도
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#241813]">
              지금 보고 있는 지역의 카페를 손쉽게 둘러보세요
            </h2>
            <p className="mt-2 text-sm text-[#6d584b]">
              카카오맵 기반으로 주변 카페를 탐색하고, 마음에 드는 곳을 내 취향 카페로 고를 수 있습니다.
              이 목록을 바탕으로 나와 잘 맞을 만한 카페를 추천받거나 새로운 카페를 더 빠르게 발견할 수 있도록 만든 공간입니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {searchQuery.trim() ? (
              <span className="rounded-full bg-[#f7efe6] px-3 py-2 text-xs font-medium text-[#6c5547]">
                검색어 {searchQuery.trim()}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(214,184,153,0.28),_transparent_28%),linear-gradient(180deg,_#f8f2ea_0%,_#f2e7da_100%)] sm:h-[520px]">
        <KakaoMap
          appKey={kakaoMapKey}
          favoriteCafes={favoriteCafes}
          onToggleFavorite={onToggleFavorite}
          searchQuery={searchQuery}
          onSelectPlace={onSelectPlace}
          activePlaceId={activePlaceId}
          onSearchResultsChange={onSearchResultsChange}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </section>
  );
}

function BottomPanel({
  searchQuery,
  searchState,
  selectedCafe,
  favoriteCafeIds,
  onToggleFavorite,
  onSelectSearchResult,
}) {
  const isSearching = Boolean(searchQuery.trim());

  return (
    <SectionCard
      title={isSearching ? "검색 결과" : "카페 정보"}
      description={
        isSearching
          ? "현재 검색한 카페 목록을 보여줍니다. 항목을 선택하면 지도 중심점과 상세 정보가 함께 맞춰집니다."
          : "지도에서 선택한 카페의 상세 정보와 취향 반영 여부를 확인하는 영역입니다. 검색 중이면 아래에 검색 결과 목록을 함께 표시합니다."
      }
    >
      {isSearching ? (
        searchState.status === "error" ? (
          <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4 text-sm text-[#5f4b3f]">
            {searchState.errorMessage || "검색 결과를 불러오지 못했습니다."}
          </div>
        ) : searchState.results.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5ecdf] px-3 py-2 text-xs font-medium text-[#6c5547]">
                검색 결과 {searchState.totalCount}곳
              </span>
              {searchState.hiddenCount > 0 ? (
                <span className="rounded-full bg-[#efe3d5] px-3 py-2 text-xs font-medium text-[#6c5547]">
                  지도 표시 {searchState.visibleCount}곳
                </span>
              ) : null}
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {searchState.results.map((cafe) => {
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
                          {cafe.categoryName || "카페"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleFavorite(cafe);
                        }}
                        aria-label="내 취향 카페 토글"
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          isFavorite
                            ? "bg-[#2f221b] text-[#f3c76d]"
                            : "bg-[#efe3d5] text-[#5d473b]"
                        }`}
                      >
                        {isFavorite ? "★" : "☆"}
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-[#5f4b3f]">
                      {cafe.roadAddress || cafe.address || "주소 정보 없음"}
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
              ? "검색 결과를 불러오는 중입니다."
              : "검색 결과가 없습니다."}
          </div>
        )
      ) : (
        <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4">
          {selectedCafe ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[#241813]">
                    {selectedCafe.name}
                  </p>
                  <p className="mt-1 text-sm text-[#8f725d]">
                    {selectedCafe.categoryName || "카페"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(selectedCafe)}
                  aria-label="내 취향 카페 토글"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    favoriteCafeIds.has(selectedCafe.id)
                      ? "bg-[#2f221b] text-[#f3c76d]"
                      : "bg-[#efe3d5] text-[#5d473b]"
                  }`}
                >
                  {favoriteCafeIds.has(selectedCafe.id) ? "★" : "☆"}
                </button>
              </div>

              <p className="text-sm text-[#5f4b3f]">
                {selectedCafe.roadAddress ||
                  selectedCafe.address ||
                  "주소 정보 없음"}
              </p>

              {selectedCafe.phone ? (
                <p className="text-sm text-[#5f4b3f]">
                  전화번호: {selectedCafe.phone}
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
                  카카오맵 상세 보기
                </a>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[#5f4b3f]">
              아직 선택한 카페가 없습니다. 지도에서 마커를 누르면 이 영역에 상세 정보가 표시됩니다.
            </p>
          )}
        </div>
      )}
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
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setFavoriteCafes(parsed);
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

  const favoriteCafeIds = useMemo(
    () => new Set(favoriteCafes.map((cafe) => cafe.id)),
    [favoriteCafes],
  );

  const handleToggleFavorite = (cafe) => {
    setFavoriteCafes((current) => {
      const exists = current.some((item) => item.id === cafe.id);

      if (exists) {
        return current.filter((item) => item.id !== cafe.id);
      }

      return [...current, cafe];
    });
  };

  const handleRemoveFavorite = (cafeId) => {
    setFavoriteCafes((current) => current.filter((item) => item.id !== cafeId));
  };

  const handleSearchSubmit = () => {
    const nextQuery = searchInput.trim();
    setSearchQuery(nextQuery);

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
      <Header
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
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
            <MapPanel
              kakaoMapKey={kakaoMapKey}
              favoriteCafes={favoriteCafes}
              onToggleFavorite={handleToggleFavorite}
              searchQuery={searchQuery}
              onSelectPlace={handleSelectCafe}
              activePlaceId={activePlaceId}
              onSearchResultsChange={setSearchState}
              isSidebarOpen={isSidebarOpen}
            />

            <BottomPanel
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
