"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import coffeebaraLogo from "../../coffeebara-logo.png";
import { formatCount } from "../../lib/formatCount";

function HamburgerButton({ isOpen, onClick, messages }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? messages.menuClose : messages.menuOpen}
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

function AccountAvatar({ authUser, messages }) {
  const profileImageUrl = authUser?.profileImageUrl?.trim() ?? "";
  const isKakaoUser = authUser?.mode === "kakao";

  if (profileImageUrl) {
    return (
      <span className="inline-flex h-11 w-11 overflow-hidden rounded-full border border-[#dccfbe] bg-white shadow-[0_10px_24px_rgba(84,52,27,0.12)]">
        <span className="relative h-full w-full">
          <Image
            src={profileImageUrl}
            alt={authUser?.displayName || authUser?.nickname || messages.accountMenuLabel}
            fill
            sizes="44px"
            className="object-cover"
            referrerPolicy="no-referrer"
            unoptimized
          />
        </span>
      </span>
    );
  }

  if (isKakaoUser) {
    return (
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7be22] bg-[#fee500] text-sm font-semibold text-[#2f221b] shadow-[0_10px_24px_rgba(84,52,27,0.12)]">
        K
      </span>
    );
  }

  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2f221b] bg-[#2f221b] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(84,52,27,0.12)]">
      G
    </span>
  );
}

function MenuActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#5f4b3f] transition hover:bg-[#fcf7f2]"
    >
      <span>{children}</span>
      <span>{">"}</span>
    </button>
  );
}

function AccountMenu({
  authUser,
  onLogout,
  onLogoutWithKakaoAccount,
  onUpdateDisplayName,
  savedCafeCount,
  recordCount = 0,
  messages,
}) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [draftDisplayName, setDraftDisplayName] = useState(
    authUser?.displayName || authUser?.nickname || "",
  );
  const [isSavingDisplayName, setIsSavingDisplayName] = useState(false);
  const menuRef = useRef(null);
  const currentDisplayName = authUser?.displayName || authUser?.nickname || "User";

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false);
        setIsEditingDisplayName(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isAccountMenuOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsAccountMenuOpen((current) => !current)}
        aria-label={messages.accountMenuLabel}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition hover:opacity-90"
      >
        <AccountAvatar authUser={authUser} messages={messages} />
      </button>

      {isAccountMenuOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 min-w-[288px] overflow-hidden rounded-2xl border border-[#dccfbe] bg-white shadow-[0_18px_40px_rgba(84,52,27,0.12)]">
          <div className="border-b border-[#efe5da] px-4 py-4">
            {authUser?.mode === "kakao" ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-semibold text-[#2f221b]">
                    {currentDisplayName}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setDraftDisplayName(
                        authUser?.displayName || authUser?.nickname || "",
                      );
                      setIsEditingDisplayName((current) => !current);
                    }}
                    aria-label="Edit display name"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dccfbe] bg-[#fcf7f2] text-[#5f4b3f] transition hover:bg-[#f5ede4]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
                    >
                      <path
                        d="M4 20h4l9.5-9.5a1.8 1.8 0 0 0 0-2.5l-1.5-1.5a1.8 1.8 0 0 0-2.5 0L4 16v4Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m12.5 7.5 4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {isEditingDisplayName ? (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={draftDisplayName}
                      onChange={(event) => setDraftDisplayName(event.target.value)}
                      maxLength={100}
                      placeholder="Display name"
                      onKeyDown={async (event) => {
                        if (event.key !== "Enter") {
                          return;
                        }

                        event.preventDefault();
                        setIsSavingDisplayName(true);
                        const succeeded = await onUpdateDisplayName(draftDisplayName);
                        setIsSavingDisplayName(false);
                        if (succeeded) {
                          setIsEditingDisplayName(false);
                        }
                      }}
                      className="h-10 min-w-0 flex-1 rounded-full border border-[#dccfbe] bg-white px-4 text-sm text-[#352720] outline-none placeholder:text-[#a38b79]"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        setIsSavingDisplayName(true);
                        const succeeded = await onUpdateDisplayName(draftDisplayName);
                        setIsSavingDisplayName(false);
                        if (succeeded) {
                          setIsEditingDisplayName(false);
                        }
                      }}
                      disabled={isSavingDisplayName}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                        isSavingDisplayName
                          ? "cursor-not-allowed bg-[#8f725d] text-white/80"
                          : "bg-[#2f221b] text-white hover:bg-[#241813]"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="min-w-0 truncate text-sm font-semibold text-[#2f221b]">
                {currentDisplayName}
              </p>
            )}

            <div className="mt-4 grid gap-3">
              <div className="rounded-[20px] border border-[#efe5da] bg-[#fcf7f2] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f725d]">
                  {messages.accountSavedCafeCountLabel}
                </p>
                <p className="mt-2 text-right text-2xl font-semibold leading-none text-[#2f221b]">
                  {formatCount(savedCafeCount)}
                </p>
              </div>

              <div className="rounded-[20px] border border-[#efe5da] bg-[#fcf7f2] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8f725d]">
                  {messages.accountRecordCountLabel}
                </p>
                {authUser?.mode === "guest" ? (
                  <p className="mt-2 text-sm font-medium leading-5 text-[#7a6456]">
                    {messages.accountGuestRecordUnavailable}
                  </p>
                ) : (
                  <p className="mt-2 text-right text-2xl font-semibold leading-none text-[#2f221b]">
                    {formatCount(recordCount)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <MenuActionButton
            onClick={() => {
              setIsAccountMenuOpen(false);
              if (authUser?.mode === "kakao") {
                onLogoutWithKakaoAccount();
                return;
              }

              onLogout();
            }}
          >
            {messages.logoutButton}
          </MenuActionButton>
        </div>
      ) : null}
    </div>
  );
}

export default function HeaderBar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  onHomeClick,
  isSidebarOpen,
  onToggleSidebar,
  locale,
  onLocaleChange,
  onLogout,
  onLogoutWithKakaoAccount,
  authUser,
  accountNotice,
  onUpdateDisplayName,
  savedCafeCount = 0,
  recordCount = 0,
  messages,
}) {
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  const localeMenuRef = useRef(null);
  const localeOptions = ["ko", "en", "ja"];

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit();
  };

  useEffect(() => {
    if (!isLocaleMenuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!localeMenuRef.current?.contains(event.target)) {
        setIsLocaleMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isLocaleMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7ddd2] bg-[rgba(255,251,246,0.96)] backdrop-blur">
      {accountNotice?.message ? (
        <div className="border-b border-[#eaded1] bg-[#fff8f1] px-4 py-2 text-center text-sm text-[#6f3126]">
          {accountNotice.message}
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[2200px] items-center gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <HamburgerButton
            isOpen={isSidebarOpen}
            onClick={onToggleSidebar}
            messages={messages}
          />

          <Link
            href="/"
            onClick={onHomeClick}
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
              <h1 className="truncate text-lg font-semibold text-[#241813]">
                {messages.headerTitle}
              </h1>
            </div>
          </Link>
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div ref={localeMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsLocaleMenuOpen((current) => !current)}
              aria-label={messages.localeLabel}
              className="inline-flex items-center gap-2 rounded-full border border-[#dccfbe] bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f4b3f] shadow-[0_10px_24px_rgba(84,52,27,0.06)] transition hover:bg-[#f7efe6]"
            >
              <span>{locale.toUpperCase()}</span>
              <span className="text-[#8f725d]">{isLocaleMenuOpen ? "˄" : "˅"}</span>
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
              <span className="sr-only">{messages.searchInputLabel}</span>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => onSearchInputChange(event.target.value)}
                placeholder={messages.searchInputPlaceholder}
                className="w-full bg-transparent text-sm text-[#352720] outline-none placeholder:text-[#a38b79]"
              />
            </label>

            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#2f221b] px-4 py-3 text-sm font-medium text-white"
            >
              {messages.searchButton}
            </button>
            <AccountMenu
              authUser={authUser}
              onLogout={onLogout}
              onLogoutWithKakaoAccount={onLogoutWithKakaoAccount}
              onUpdateDisplayName={onUpdateDisplayName}
              savedCafeCount={savedCafeCount}
              recordCount={recordCount}
              messages={messages}
            />
          </form>
        </div>
      </div>

      <div className="px-4 pb-4 md:hidden">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[2200px] items-center gap-3 xl:px-8"
        >
          <label className="flex flex-1 items-center rounded-full border border-[#dccfbe] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(84,52,27,0.06)]">
            <span className="sr-only">{messages.searchInputLabel}</span>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              placeholder={messages.searchInputPlaceholder}
              className="w-full bg-transparent text-sm text-[#352720] outline-none placeholder:text-[#a38b79]"
            />
          </label>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#2f221b] px-4 py-3 text-sm font-medium text-white"
          >
            {messages.searchButtonCompact}
          </button>
          <AccountMenu
            authUser={authUser}
            onLogout={onLogout}
            onLogoutWithKakaoAccount={onLogoutWithKakaoAccount}
            onUpdateDisplayName={onUpdateDisplayName}
            savedCafeCount={savedCafeCount}
            recordCount={recordCount}
            messages={messages}
          />
        </form>
      </div>
    </header>
  );
}
