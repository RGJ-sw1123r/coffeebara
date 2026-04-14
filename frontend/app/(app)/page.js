"use client";

import BottomPanel from "../components/home/BottomPanel";
import HeaderBar from "../components/home/HeaderBar";
import MapPanel from "../components/home/MapPanel";
import SearchLoadingOverlay from "../components/home/SearchLoadingOverlay";
import {
  DesktopSidebar,
  SavedPlaceDeleteConfirmModal,
  Sidebar,
} from "../components/home/Sidebar";
import {
  ActionToast,
  BackendSyncBanner,
  GuestModeToast,
} from "../components/home/StatusNotice";
import { useAppShell } from "../components/app/AppShellContext";
import useHomePageState from "../hooks/useHomePageState";

export default function Home() {
  const kakaoMapKey =
    process.env.NEXT_PUBLIC_KAKAO_MAP_KEY?.trim() ??
    process.env.KAKAO_MAP_KEY?.trim() ??
    "";
  const {
    accountNotice,
    authUser,
    backendSavedPlaceFetch,
    cancelRemoveSavedPlace,
    closeSidebar,
    confirmRemoveSavedPlace,
    handleLogout,
    handleLogoutWithKakaoAccount,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    isSidebarOpen,
    locale,
    messages,
    pendingSavedPlaceDelete,
    savedPlaceActionToast,
    savedPlaceIds,
    savedPlaces,
    setLocale,
    toggleSidebar,
    updateDisplayName,
  } = useAppShell();
  const getPlaceHref = (place) => {
    const targetId = place?.id ? String(place.id) : "";
    if (!targetId) {
      return "/";
    }

    if (authUser?.mode === "guest") {
      return `/places/${encodeURIComponent(targetId)}/sample`;
    }

    return `/places/${encodeURIComponent(targetId)}`;
  };
  const {
    handleResetHomeView,
    handleSearchSubmit,
    kakaoMapUrl,
    searchInput,
    setSearchInput,
  } = useHomePageState();

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#241813] xl:h-screen xl:overflow-hidden">
      <GuestModeToast isVisible={isGuestModeToastVisible} messages={messages} />
      <ActionToast toast={savedPlaceActionToast} />

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
        onLogoutWithKakaoAccount={handleLogoutWithKakaoAccount}
        authUser={authUser}
        accountNotice={accountNotice}
        onUpdateDisplayName={updateDisplayName}
        savedCafeCount={savedPlaces.length}
        recordCount={authUser?.recordCount ?? 0}
        messages={messages}
      />

      <SearchLoadingOverlay messages={messages} />

      <SavedPlaceDeleteConfirmModal
        pendingDelete={pendingSavedPlaceDelete}
        onCancel={cancelRemoveSavedPlace}
        onConfirm={confirmRemoveSavedPlace}
        messages={messages}
      />

      <Sidebar
        savedPlaces={savedPlaces}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onHomeClick={handleResetHomeView}
        onRemoveSavedPlace={handleRemoveSavedPlace}
        getPlaceHref={getPlaceHref}
        kakaoMapUrl={kakaoMapUrl}
        messages={messages}
      />

      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 xl:h-[calc(100vh-88px)] xl:px-8 xl:py-4">
        <main className="relative flex min-w-0 gap-6 xl:h-full xl:overflow-hidden">
          <DesktopSidebar
            savedPlaces={savedPlaces}
            isOpen={isSidebarOpen}
            onHomeClick={handleResetHomeView}
            onRemoveSavedPlace={handleRemoveSavedPlace}
            getPlaceHref={getPlaceHref}
            kakaoMapUrl={kakaoMapUrl}
            messages={messages}
          />

          <div className="min-w-0 flex-1 space-y-6 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:overflow-hidden">
            <BackendSyncBanner
              status={backendSavedPlaceFetch.status}
              errorMessage={backendSavedPlaceFetch.errorMessage}
              messages={messages}
            />

            <div className="flex min-w-0 flex-col gap-6 xl:flex-1 xl:min-h-0 xl:flex-row xl:items-stretch xl:overflow-hidden">
              <div className="min-w-0 flex-1 xl:h-[calc(100vh-128px)]">
                <MapPanel
                  kakaoMapKey={kakaoMapKey}
                  savedPlaces={savedPlaces}
                  onToggleSavedPlace={handleToggleSavedPlace}
                  isSidebarOpen={isSidebarOpen}
                  messages={messages}
                />
              </div>

              <BottomPanel
                savedPlaceIds={savedPlaceIds}
                onToggleSavedPlace={handleToggleSavedPlace}
                messages={messages}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
