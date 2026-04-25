"use client";

import { AppShellProvider } from "../components/app/AppShellContext";
import useAppShellState from "../hooks/useAppShellState";

export default function AppLayout({ children }) {
  const appShellState = useAppShellState();
  const backendUnavailableCopy =
    appShellState.locale === "ja"
      ? {
          title: "サービスを一時的に利用できません。",
          body: "しばらくしてから再度アクセスしてください。",
        }
      : appShellState.locale === "en"
        ? {
            title: "The service is temporarily unavailable.",
            body: "Please try again shortly.",
          }
        : {
            title: "서비스를 잠시 이용할 수 없습니다.",
            body: "잠시 후 다시 접속해주세요.",
          };

  if (appShellState.authStatus === "backend-unavailable") {
    return (
      <div className="min-h-screen bg-[#fffaf5] px-4 py-8 text-[#241813] sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[560px] items-center">
          <section className="w-full rounded-[32px] border border-[#e7c9c2] bg-white px-6 py-8 shadow-[0_24px_60px_rgba(84,52,27,0.08)] sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f725d]">
              {appShellState.messages.brandName}
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-[#241813]">
              {backendUnavailableCopy.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6d584b]">
              {backendUnavailableCopy.body}
            </p>
          </section>
        </div>
      </div>
    );
  }

  if (appShellState.authStatus !== "authenticated") {
    return <div className="min-h-screen bg-[#fffaf5]" />;
  }

  return <AppShellProvider value={appShellState}>{children}</AppShellProvider>;
}
