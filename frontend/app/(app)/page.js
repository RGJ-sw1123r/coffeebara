"use client";

import BottomPanel from "../components/home/BottomPanel";
import HeaderBar from "../components/home/HeaderBar";
import MapPanel from "../components/home/MapPanel";
import SearchLoadingOverlay from "../components/home/SearchLoadingOverlay";
import { DesktopSidebar, Sidebar } from "../components/home/Sidebar";
import { BackendSyncBanner, GuestModeToast } from "../components/home/StatusNotice";
import { useAppShell } from "../components/app/AppShellContext";
import useHomePageState from "../hooks/useHomePageState";

export default function Home() {
  const kakaoMapKey =
    process.env.NEXT_PUBLIC_KAKAO_MAP_KEY?.trim() ??
    process.env.KAKAO_MAP_KEY?.trim() ??
    "";
  const {
    backendSavedPlaceFetch,
    closeSidebar,
    handleLogout,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    isSidebarOpen,
    locale,
    messages,
    savedPlaceIds,
    savedPlaces,
    setLocale,
    toggleSidebar,
  } = useAppShell();
  const {
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
    setSearchInput,
    setSearchState,
  } = useHomePageState();

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
        onToggleSidebar={toggleSidebar}
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
        savedPlaces={savedPlaces}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onHomeClick={handleResetHomeView}
        onRemoveSavedPlace={handleRemoveSavedPlace}
        kakaoMapUrl={kakaoMapUrl}
        messages={messages}
      />

      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 xl:px-8">
        <main className="relative flex min-w-0 gap-6">
          <DesktopSidebar
            savedPlaces={savedPlaces}
            isOpen={isSidebarOpen}
            onHomeClick={handleResetHomeView}
            onRemoveSavedPlace={handleRemoveSavedPlace}
            kakaoMapUrl={kakaoMapUrl}
            messages={messages}
          />

          <div className="min-w-0 flex-1 space-y-6">
            <BackendSyncBanner
              status={backendSavedPlaceFetch.status}
              errorMessage={backendSavedPlaceFetch.errorMessage}
              messages={messages}
            />

            <MapPanel
              kakaoMapKey={kakaoMapKey}
              savedPlaces={savedPlaces}
              onToggleSavedPlace={handleToggleSavedPlace}
              searchQuery={searchQuery}
              searchRequestVersion={searchRequestVersion}
              resetViewVersion={resetViewVersion}
              onSelectPlace={handleSelectPlace}
              activePlaceId={activePlaceId}
              onSearchResultsChange={setSearchState}
              onViewportChange={setMapViewport}
              isSidebarOpen={isSidebarOpen}
              noticeState={noticeState}
              onCloseNotice={closeNotice}
              messages={messages}
            />

            <BottomPanel
              searchQuery={searchQuery}
              searchState={searchState}
              selectedPlace={selectedPlace}
              savedPlaceIds={savedPlaceIds}
              onToggleSavedPlace={handleToggleSavedPlace}
              onSelectSearchResult={handleSelectPlace}
              messages={messages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
