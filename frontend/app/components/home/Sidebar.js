"use client";

import Link from "next/link";
import { useState } from "react";

export function SavedPlaceDeleteConfirmModal({
  pendingDelete,
  onCancel,
  onConfirm,
  messages,
}) {
  if (!pendingDelete?.placeId) {
    return null;
  }

  const recordCount = Number(pendingDelete.recordCount ?? 0);
  const recordLabel =
    Number.isFinite(recordCount) && recordCount > 0
      ? `${recordCount}${messages.savedPlaceDeleteRecordCountSuffix ?? ""}`
      : messages.savedPlaceDeleteRecordFallback;

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(36,24,19,0.45)] px-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[460px] rounded-[30px] border border-[#e7dccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf5ee_100%)] p-6 shadow-[0_28px_70px_rgba(84,52,27,0.2)] sm:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
          {messages.savedPlaceDeleteModalEyebrow}
        </p>
        <h2 className="mt-3 text-[22px] font-semibold leading-8 text-[#241813]">
          {messages.savedPlaceDeleteModalTitle}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">
          {messages.savedPlaceDeleteModalBody(recordLabel)}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#6f3126] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5d281f]"
          >
            {messages.savedPlaceDeleteConfirmButton}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#dccfbe] bg-white px-5 py-2.5 text-sm font-medium text-[#5f4b3f] transition hover:bg-[#fcfaf7]"
          >
            {messages.savedPlaceDeleteCancelButton}
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarPolicySection({ messages }) {
  const privacyNoticeTitle = messages.privacyNoticeTitle ?? "Privacy Notice";
  const privacyNoticeBody =
    messages.privacyNoticeBody ??
    "Coffeebara does not store directly identifiable personal information, movement paths, search history, searched areas, or user coordinates on the server.";
  const guestNoticeTitle = messages.guestNoticeTitle ?? "Guest Mode Notice";
  const guestNoticeBody =
    messages.guestNoticeBody ??
    "Guest information may be reset depending on browser conditions or operating policy changes.";
  const dataPolicyTitle = messages.dataPolicyTitle ?? "Data Collection Notice";
  const dataPolicyBody =
    messages.dataPolicyBody ??
    "Cafe data is collected from official APIs first. If additional collection is needed, only the minimum necessary public information is handled after checking scope and policy.";

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
        <span className="text-[#d8b89f]">{">"}</span>
      </a>
    </div>
  );
}

function SidebarContent({
  savedPlaces,
  onClose,
  onHomeClick,
  onRemoveSavedPlace,
  getPlaceHref,
  kakaoMapUrl,
  isDesktop = false,
  lockedPlaceId = "",
  messages,
}) {
  const [isSavedPlacesCollapsed, setIsSavedPlacesCollapsed] = useState(false);
  const wrapperClassName = isDesktop
    ? "h-full rounded-[28px] border border-[#e7dccf] bg-[#fbf7f2] p-4 shadow-[0_24px_60px_rgba(84,52,27,0.1)]"
    : "h-full overflow-y-auto px-4 py-5";

  return (
    <div className={wrapperClassName}>
      <section className="h-full rounded-[24px] bg-[#2f221b] p-4 text-white shadow-[0_16px_40px_rgba(47,34,27,0.24)]">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex w-full items-center gap-3 rounded-2xl bg-white/8 px-3 py-3 text-left text-sm font-semibold text-[#fff7f0] transition hover:bg-white/12"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,248,241,0.12)] text-[#f3d2b4]">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
            >
              <path
                d="M4.5 10.5 12 4l7.5 6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.75 9.75v9h10.5v-9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 18.75v-4.5h4v4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>{messages.homeLabel ?? "Home"}</span>
        </button>

        <div className="my-4 border-b border-white/10" />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
            {messages.favoriteSectionTitle}
          </p>
          <button
            type="button"
            onClick={() => setIsSavedPlacesCollapsed((current) => !current)}
            aria-expanded={!isSavedPlacesCollapsed}
            aria-label={
              isSavedPlacesCollapsed
                ? messages.expandSavedCafesAriaLabel
                : messages.collapseSavedCafesAriaLabel
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#f7ede4] transition hover:bg-white/14"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={`h-4 w-4 text-[#d8b89f] transition-transform ${
                isSavedPlacesCollapsed ? "" : "rotate-180"
              }`}
            >
              <path
                d="M6 14l6-6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

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

        {!isSavedPlacesCollapsed ? (
          <div className="mt-4 space-y-3">
            {savedPlaces.length > 0 ? (
              savedPlaces.map((place) => {
                const isLockedPlace = lockedPlaceId === place.id;
                const placeHref = getPlaceHref
                  ? getPlaceHref(place)
                  : `/places/${encodeURIComponent(place.id)}`;

                return (
                  <div key={place.id} className="rounded-2xl bg-white/8 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={placeHref}
                        onClick={onClose}
                        className="min-w-0 flex-1 rounded-xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#f3d2b4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f221b]"
                      >
                        <p className="truncate text-sm font-medium">{place.name}</p>
                        <p className="mt-1 text-xs text-[#d9c3b4]">
                          {place.roadAddress || place.address || messages.noAddress}
                        </p>
                      </Link>
                      {isLockedPlace ? (
                        <span className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-[rgba(243,210,180,0.16)] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3d2b4]">
                          {messages.savedPlaceLockedBadge}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRemoveSavedPlace(place.id)}
                          aria-label={messages.removeFavoriteAriaLabel(place.name)}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f221b] text-base leading-none text-[#f3c76d]"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl bg-white/8 px-3 py-3 text-sm text-[#d9c3b4]">
                {messages.noFavoriteCafes}
              </div>
            )}
          </div>
        ) : null}

        <SidebarMapLink kakaoMapUrl={kakaoMapUrl} />
        <SidebarPolicySection messages={messages} />
      </section>
    </div>
  );
}

export function Sidebar({
  savedPlaces,
  isOpen,
  onClose,
  onHomeClick,
  onRemoveSavedPlace,
  getPlaceHref,
  kakaoMapUrl,
  lockedPlaceId,
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
          savedPlaces={savedPlaces}
          onClose={onClose}
          onHomeClick={onHomeClick}
          onRemoveSavedPlace={onRemoveSavedPlace}
          getPlaceHref={getPlaceHref}
          kakaoMapUrl={kakaoMapUrl}
          lockedPlaceId={lockedPlaceId}
          messages={messages}
        />
      </aside>
    </>
  );
}

export function DesktopSidebar({
  savedPlaces,
  isOpen,
  onHomeClick,
  onRemoveSavedPlace,
  getPlaceHref,
  kakaoMapUrl,
  lockedPlaceId,
  messages,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="hidden xl:block xl:w-[312px] xl:shrink-0" aria-hidden={!isOpen}>
      <div className="pointer-events-auto sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto pr-2 -mr-2 [scrollbar-gutter:stable]">
        <SidebarContent
          savedPlaces={savedPlaces}
          onHomeClick={onHomeClick}
          onRemoveSavedPlace={onRemoveSavedPlace}
          getPlaceHref={getPlaceHref}
          kakaoMapUrl={kakaoMapUrl}
          lockedPlaceId={lockedPlaceId}
          isDesktop
          messages={messages}
        />
      </div>
    </div>
  );
}
