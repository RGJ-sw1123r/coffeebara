"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getMessages } from "../messages";
import coffeebaraLogo from "../coffeebara-logo.png";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:18080";
const LOCALE_STORAGE_KEY = "coffeebara.locale.v1";

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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState(getInitialLocale);
  const [status, setStatus] = useState("idle");
  const [toastMessage, setToastMessage] = useState("");
  const messages = useMemo(() => getMessages(locale), [locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage access failures and keep the in-memory locale.
    }
  }, [locale]);

  useEffect(() => {
    if (searchParams.get("error") !== "kakao") {
      return;
    }

    const errorMessages = {
      ko: "카카오 로그인에 실패했습니다. 동의 항목과 앱 설정을 확인한 뒤 다시 시도해 주세요.",
      en: "Kakao login failed. Check the consent items and app settings, then try again.",
      ja: "Kakaoログインに失敗しました。 同意項目とアプリ設定を確認してから、もう一度お試しください。",
    };

    setToastMessage(errorMessages[locale] ?? errorMessages.ko);
    router.replace("/login");
  }, [locale, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAuthStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();

        if (!cancelled && payload?.authenticated) {
          router.replace("/");
        }
      } catch {
        if (!cancelled) {
          setToastMessage(messages.loginPageStatusFailed);
        }
      }
    }

    fetchAuthStatus();

    return () => {
      cancelled = true;
    };
  }, [messages.loginPageStatusFailed, router]);

  const handleGuestAccess = async () => {
    setStatus("loading");
    setToastMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/guest`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(messages.loginPageGuestFailed);
      }

      router.replace("/");
    } catch {
      setStatus("error");
      setToastMessage(messages.loginPageGuestFailed);
    }
  };

  const handleKakaoAccess = () => {
    setStatus("loading");
    setToastMessage("");
    window.location.assign(`${API_BASE_URL}/oauth2/authorization/kakao`);
  };

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setToastMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-[#fffaf5] px-4 py-8 text-[#241813] sm:px-6">
      {toastMessage ? (
        <div className="pointer-events-none fixed bottom-5 right-5 z-50 w-[min(360px,calc(100vw-2rem))] rounded-[24px] border border-[#e7c9c2] bg-[#fff1ed] px-5 py-4 text-[#6f3126] shadow-[0_18px_36px_rgba(111,49,38,0.12)]">
          <p className="text-sm font-medium leading-6">{toastMessage}</p>
        </div>
      ) : null}

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[400px] items-center">
        <div className="w-full rounded-[32px] border border-[#e8ddd0] bg-white p-6 shadow-[0_24px_60px_rgba(84,52,27,0.08)] sm:px-7 sm:py-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
              {messages.loginPageEyebrow}
            </p>

            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
              <span>{messages.localeLabel}</span>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className="h-10 appearance-none rounded-full border border-[#dfd1c2] bg-[#fcfaf7] px-3 text-xs font-semibold text-[#4c3b31]"
              >
                <option value="ko">KO</option>
                <option value="en">EN</option>
                <option value="ja">JA</option>
              </select>
            </label>
          </div>

          <div className="mt-6">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="relative h-40 w-40 overflow-hidden rounded-[40px] border border-[#dbcab8] bg-[#fcfaf7] shadow-[0_18px_40px_rgba(84,52,27,0.08)]">
                  <Image
                    src={coffeebaraLogo}
                    alt={messages.logoAlt}
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleKakaoAccess}
                disabled={status === "loading"}
                className={`flex w-full items-center justify-center rounded-2xl border border-[#e2d3c1] px-4 py-3 text-sm font-semibold transition ${
                  status === "loading"
                    ? "cursor-not-allowed bg-[#fee500]/80 text-[#3b2a1f]/70"
                    : "bg-[#fee500] text-[#3b2a1f] hover:bg-[#f5de00]"
                }`}
              >
                {messages.loginPageKakaoButton}
              </button>

              <button
                type="button"
                onClick={handleGuestAccess}
                disabled={status === "loading"}
                className={`flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  status === "loading"
                    ? "cursor-not-allowed bg-[#8f725d] text-white/80"
                    : "bg-[#2f221b] text-white hover:bg-[#241813]"
                }`}
              >
                {messages.loginPageGuestButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
