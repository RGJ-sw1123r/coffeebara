"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getMessages } from "../messages";
import useSavedPlacesState from "./useSavedPlacesState";

const LOCALE_STORAGE_KEY = "coffeebara.locale.v1";

function createStatusError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

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
  const [authUser, setAuthUser] = useState(null);
  const [accountNotice, setAccountNotice] = useState({
    type: "",
    message: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messages = useMemo(
    () => ({
      ...getMessages(locale),
      localeCode: locale,
    }),
    [locale],
  );
  const applyAuthSummary = useCallback((payload) => {
    if (!payload?.authenticated) {
      return payload;
    }

    setAuthUser((current) =>
      current
        ? {
            ...current,
            mode: payload.mode ?? current.mode,
            userId: payload.userId ?? current.userId,
            nickname: payload.nickname ?? current.nickname,
            displayName: payload.displayName ?? payload.nickname ?? current.displayName,
            provider: payload.provider ?? current.provider,
            profileImageUrl: payload.profileImageUrl ?? current.profileImageUrl,
            recordCount: Number(payload.recordCount ?? current.recordCount ?? 0),
          }
        : {
            mode: payload.mode ?? "",
            userId: payload.userId ?? "",
            nickname: payload.nickname ?? "",
            displayName: payload.displayName ?? payload.nickname ?? "",
            provider: payload.provider ?? "",
            profileImageUrl: payload.profileImageUrl ?? "",
            recordCount: Number(payload.recordCount ?? 0),
          },
    );

    return payload;
  }, []);
  const refreshAccountSummary = useCallback(async () => {
    const response = await fetch("/api/auth/status", {
      method: "GET",
      credentials: "include",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw createStatusError(
        payload?.code || "AUTH_STATUS_LOOKUP_FAILED",
        payload?.message || "Failed to verify auth status.",
      );
    }
    return applyAuthSummary(payload);
  }, [applyAuthSummary]);
  const handleMemberDataChanged = useCallback(() => {
    void refreshAccountSummary()
      .then(() => {})
      .catch(() => {
        // Ignore background summary refresh failures.
      });
  }, [refreshAccountSummary]);
  const {
    backendSavedPlaceFetch,
    cancelRemoveSavedPlace,
    clearSavedPlaces,
    confirmRemoveSavedPlace,
    handleRemoveSavedPlace,
    handleToggleSavedPlace,
    isGuestModeToastVisible,
    pendingSavedPlaceDelete,
    placeProfiles,
    savedPlaceActionToast,
    savedPlaceIds,
    savedPlaces,
    savePlaceProfile,
  } = useSavedPlacesState({
    authStatus,
    authMode: authUser?.mode ?? "",
    messages,
    onMemberDataChanged: handleMemberDataChanged,
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage access failures and keep the in-memory locale.
    }
  }, [locale]);

  useEffect(() => {
    if (!accountNotice.message) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setAccountNotice({
        type: "",
        message: "",
      });
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [accountNotice]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAuthStatus() {
      try {
        const payload = await refreshAccountSummary();

        if (cancelled) {
          return;
        }

        if (payload?.authenticated) {
          setAuthUser({
            mode: payload.mode ?? "",
            userId: payload.userId ?? "",
            nickname: payload.nickname ?? "",
            displayName: payload.displayName ?? payload.nickname ?? "",
            provider: payload.provider ?? "",
            profileImageUrl: payload.profileImageUrl ?? "",
            recordCount: Number(payload.recordCount ?? 0),
          });
          setAuthStatus("authenticated");
          return;
        }

        setAuthUser(null);
        setAuthStatus("redirecting");
        router.replace("/login");
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error?.code === "BACKEND_UNAVAILABLE") {
          setAuthUser(null);
          setAuthStatus("backend-unavailable");
          return;
        }

        setAuthUser(null);
        setAuthStatus("redirecting");
        router.replace("/login");
      }
    }

    fetchAuthStatus();

    return () => {
      cancelled = true;
    };
  }, [refreshAccountSummary, router]);

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
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout transport failures and continue local cleanup.
    }

    setIsSidebarOpen(false);
    setAuthUser(null);
    setAuthStatus("redirecting");
    router.replace("/login");
  }, [router]);

  const handleLogoutWithKakaoAccount = useCallback(() => {
    setIsSidebarOpen(false);
    setAuthUser(null);
    setAuthStatus("redirecting");
    window.location.assign("/api/auth/logout/kakao-account");
  }, []);

  const updateDisplayName = useCallback(async (displayName) => {
    try {
      const response = await fetch("/api/auth/profile/display-name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          displayName,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "표시 이름을 저장하지 못했습니다.");
      }

      setAuthUser((current) =>
        current
          ? {
              ...current,
              mode: payload?.mode ?? current.mode,
              userId: payload?.userId ?? current.userId,
              nickname: payload?.nickname ?? current.nickname,
              displayName: payload?.displayName ?? displayName,
              provider: payload?.provider ?? current.provider,
              profileImageUrl: payload?.profileImageUrl ?? current.profileImageUrl,
              recordCount: Number(payload?.recordCount ?? current.recordCount ?? 0),
            }
          : current
      );
      setAccountNotice({
        type: "success",
        message: "프로필 이름을 저장했습니다.",
      });
      return true;
    } catch (error) {
      setAccountNotice({
        type: "error",
        message: error instanceof Error ? error.message : "표시 이름을 저장하지 못했습니다.",
      });
      return false;
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((current) => !current);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return {
    accountNotice,
    authStatus,
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
    placeProfiles,
    savedPlaceActionToast,
    savePlaceProfile,
    savedPlaceIds,
    savedPlaces,
    setLocale,
    toggleSidebar,
    updateDisplayName,
    refreshAccountSummary,
  };
}
