"use client";

import { memo } from "react";

import KakaoMap from "../KakaoMap";
import SearchResultNotice from "./SearchResultNotice";

function MapPanel({
  kakaoMapKey,
  savedPlaces,
  onToggleSavedPlace,
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
          savedPlaces={savedPlaces}
          onToggleSavedPlace={onToggleSavedPlace}
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

export default memo(MapPanel);
