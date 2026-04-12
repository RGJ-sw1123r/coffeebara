"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getMessages } from "../messages";
import useSavedPlacesState from "./useSavedPlacesState";

const LOCALE_STORAGE_KEY = "coffeebara.locale.v1";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";

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

export default function useAppShellState() {
  const router = useRouter();
  const [locale, setLocale] = useState(getInitialLocale);
  const [authStatus, setAuthStatus] = useState("checking");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messages = useMemo(() => getMessages(locale), [locale]);
  const {
    backendSavedPlaceFetch,
    clearSavedPlaces,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    placeProfiles,
    savedPlaceIds,
    savedPlaces,
    savePlaceProfile,
  } = useSavedPlacesState({
    authStatus,
  });

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

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout transport failures and continue local cleanup.
    }

    clearSavedPlaces();
    setIsSidebarOpen(false);
    setAuthStatus("redirecting");
    router.replace("/login");
  }, [clearSavedPlaces, router]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((current) => !current);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return {
    authStatus,
    backendSavedPlaceFetch,
    closeSidebar,
    handleLogout,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    isSidebarOpen,
    locale,
    messages,
    placeProfiles,
    savePlaceProfile,
    savedPlaceIds,
    savedPlaces,
    setLocale,
    toggleSidebar,
  };
}
