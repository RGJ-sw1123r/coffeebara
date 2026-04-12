"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import coffeebaraLogo from "../../coffeebara-logo.png";

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

function AccountMenu({ onLogout, messages }) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsAccountMenuOpen(false);
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
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2f221b] bg-[#2f221b] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(84,52,27,0.12)] transition hover:bg-[#241813]"
      >
        G
      </button>

      {isAccountMenuOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 min-w-[132px] overflow-hidden rounded-2xl border border-[#dccfbe] bg-white shadow-[0_18px_40px_rgba(84,52,27,0.12)]">
          <button
            type="button"
            onClick={() => {
              setIsAccountMenuOpen(false);
              onLogout();
            }}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#5f4b3f] transition hover:bg-[#fcf7f2]"
          >
            <span>{messages.logoutButton}</span>
            <span>↗</span>
          </button>
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
      <div className="mx-auto flex w-full max-w-[2200px] items-center gap-4 px-4 py-4 sm:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <HamburgerButton isOpen={isSidebarOpen} onClick={onToggleSidebar} messages={messages} />

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
            <AccountMenu onLogout={onLogout} messages={messages} />
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
          <AccountMenu onLogout={onLogout} messages={messages} />
        </form>
      </div>
    </header>
  );
}
