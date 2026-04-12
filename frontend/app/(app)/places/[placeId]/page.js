"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import coffeebaraLogo from "../../../coffeebara-logo.png";
import { useAppShell } from "../../../components/app/AppShellContext";
import { DesktopSidebar, Sidebar } from "../../../components/home/Sidebar";

function normalizeSavedPlace(place) {
  if (!place || typeof place !== "object") {
    return null;
  }

  const normalizedId = typeof place.id === "string" ? place.id : String(place.id ?? "");
  const normalizedName =
    typeof place.name === "string" ? place.name.trim() : String(place.name ?? "").trim();

  if (!normalizedId || !normalizedName) {
    return null;
  }

  return {
    id: normalizedId,
    name: normalizedName,
    address: typeof place.address === "string" ? place.address : "",
    roadAddress: typeof place.roadAddress === "string" ? place.roadAddress : "",
  };
}

export default function SavedPlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const {
    closeSidebar,
    handleRemoveSavedPlace,
    isSidebarOpen,
    messages,
    placeProfiles,
    savePlaceProfile,
    savedPlaces,
    toggleSidebar,
  } = useAppShell();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const placeId = Array.isArray(params?.placeId) ? params.placeId[0] : params?.placeId;
  const savedPlace = useMemo(() => {
    if (!placeId) {
      return null;
    }

    const matchedPlace =
      savedPlaces.find((place) => place.id === String(placeId)) ?? null;

    return normalizeSavedPlace(matchedPlace);
  }, [placeId, savedPlaces]);
  const savedProfileTags = placeId ? placeProfiles[String(placeId)] ?? [] : [];
  const [draftProfileTags, setDraftProfileTags] = useState([]);

  const profileOptions = [
    { key: "franchise", label: messages.placeProfileOptionFranchise },
    { key: "handdrip", label: messages.placeProfileOptionHanddrip },
    { key: "beanRetail", label: messages.placeProfileOptionBeanRetail },
    { key: "warehouse", label: messages.placeProfileOptionWarehouse },
    { key: "greatView", label: messages.placeProfileOptionGreatView },
    { key: "espressoBar", label: messages.placeProfileOptionEspressoBar },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const handleGoHome = (event) => {
    event?.preventDefault?.();
    router.push("/");
  };

  const openProfileModal = () => {
    setDraftProfileTags(savedProfileTags);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setDraftProfileTags([]);
  };

  const toggleDraftProfileTag = (tag) => {
    setDraftProfileTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const submitProfileModal = () => {
    if (!placeId) {
      return;
    }

    savePlaceProfile(String(placeId), draftProfileTags);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#241813]">
      {isProfileModalOpen && savedPlace ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(36,24,19,0.5)] px-4">
          <div className="w-full max-w-[560px] rounded-[32px] border border-[#e7dccf] bg-white p-6 shadow-[0_24px_60px_rgba(84,52,27,0.18)] sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
              {messages.placeProfileModalLabel}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#241813]">
              {messages.placeProfileModalTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5f4b3f]">
              {savedPlace.name}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profileOptions.map((option) => {
                const isSelected = draftProfileTags.includes(option.key);

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => toggleDraftProfileTag(option.key)}
                    className={`rounded-[22px] border px-4 py-4 text-left text-sm font-medium transition ${
                      isSelected
                        ? "border-[#2f221b] bg-[#f7efe6] text-[#241813]"
                        : "border-[#eadfd3] bg-[#fcfaf7] text-[#5f4b3f] hover:border-[#cdb8a6]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeProfileModal}
                className="rounded-full border border-[#dccfbe] bg-white px-4 py-2 text-sm font-medium text-[#5f4b3f] transition hover:bg-[#f7efe6]"
              >
                {messages.placeProfileModalSkip}
              </button>
              <button
                type="button"
                onClick={submitProfileModal}
                className="rounded-full bg-[#2f221b] px-4 py-2 text-sm font-medium text-white"
              >
                {messages.placeProfileModalSubmit}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-[#e7ddd2] bg-[rgba(255,251,246,0.96)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[2200px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? messages.menuClose : messages.menuOpen}
              aria-expanded={isSidebarOpen}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#cdb8a6] bg-white text-[#2f221b] shadow-[0_10px_24px_rgba(84,52,27,0.08)] transition hover:bg-[#f6efe7]"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[2px] w-4 rounded-full bg-current" />
                <span className="block h-[2px] w-4 rounded-full bg-current" />
                <span className="block h-[2px] w-4 rounded-full bg-current" />
              </span>
            </button>

            <Link
              href="/"
              className="flex min-w-0 items-center gap-3 rounded-2xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#cdb8a6] focus-visible:ring-offset-2"
            >
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#dbcab8] bg-white shadow-[0_10px_24px_rgba(84,52,27,0.08)]">
                <Image
                  src={coffeebaraLogo}
                  alt={messages.logoAlt}
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
                  {messages.brandName}
                </p>
                <p className="truncate text-lg font-semibold text-[#241813]">
                  {messages.headerTitle}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <Sidebar
        savedPlaces={savedPlaces}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onHomeClick={handleGoHome}
        onRemoveSavedPlace={handleRemoveSavedPlace}
        kakaoMapUrl="https://map.kakao.com/"
        lockedPlaceId={savedPlace?.id ?? ""}
        messages={messages}
      />

      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 xl:px-8">
        <main className="relative flex min-w-0 gap-6">
          <DesktopSidebar
            savedPlaces={savedPlaces}
            isOpen={isSidebarOpen}
            onHomeClick={handleGoHome}
            onRemoveSavedPlace={handleRemoveSavedPlace}
            kakaoMapUrl="https://map.kakao.com/"
            lockedPlaceId={savedPlace?.id ?? ""}
            messages={messages}
          />

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={handleBack}
              className="mb-4 inline-flex items-center gap-2 rounded-full px-1 py-1 text-sm font-medium text-[#7a6456] transition hover:text-[#2f221b]"
            >
              <span>{"<"}</span>
              <span>{messages.placeDetailBackButton}</span>
            </button>

            <section className="rounded-[32px] border border-[#e7dccf] bg-white p-6 shadow-[0_24px_60px_rgba(84,52,27,0.08)] sm:p-8">
              {savedPlace ? (
                <>
                  <div className="rounded-[28px] bg-[linear-gradient(180deg,#f9f1e7_0%,#fdf9f4_100%)] px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
                      {messages.placeDetailCardLabel}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-[#241813]">
                      {savedPlace.name}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">
                      {savedPlace.roadAddress || savedPlace.address || messages.noAddress}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <section className="rounded-[28px] border border-[#eadfd3] bg-[#fcfaf7] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
                        {messages.placeDetailManageLabel}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-[#241813]">
                        {messages.placeDetailManageTitle}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">
                        {messages.placeDetailManageBody}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {savedProfileTags.length > 0
                          ? profileOptions
                              .filter((option) => savedProfileTags.includes(option.key))
                              .map((option) => (
                                <span
                                  key={option.key}
                                  className="rounded-full bg-[#efe3d5] px-3 py-2 text-xs font-medium text-[#6c5547]"
                                >
                                  {option.label}
                                </span>
                              ))
                          : null}
                      </div>
                      <button
                        type="button"
                        onClick={openProfileModal}
                        className="mt-5 rounded-full bg-[#2f221b] px-4 py-2 text-sm font-medium text-white"
                      >
                        {savedProfileTags.length > 0
                          ? messages.placeProfileManageButtonEdit
                          : messages.placeProfileManageButton}
                      </button>
                    </section>

                    <section className="rounded-[28px] border border-dashed border-[#d8c8b7] bg-[#fcfaf7] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
                        {messages.placeDetailNextLabel}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#efe3d5] px-3 py-2 text-xs font-medium text-[#6c5547]">
                          {messages.placeDetailNextBean}
                        </span>
                        <span className="rounded-full bg-[#efe3d5] px-3 py-2 text-xs font-medium text-[#6c5547]">
                          {messages.placeDetailNextBrew}
                        </span>
                        <span className="rounded-full bg-[#efe3d5] px-3 py-2 text-xs font-medium text-[#6c5547]">
                          {messages.placeDetailNextMemo}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#7a6456]">
                        {messages.placeDetailNextBody}
                      </p>
                    </section>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8c8b7] bg-[#fcfaf7] px-4 py-8 text-sm text-[#7a6456]">
                  <p className="font-medium text-[#352720]">{messages.placeDetailMissingTitle}</p>
                  <p className="mt-2">{messages.placeDetailMissingBody}</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
