"use client";

import { AppShellProvider } from "../components/app/AppShellContext";
import useAppShellState from "../hooks/useAppShellState";

export default function AppLayout({ children }) {
  const appShellState = useAppShellState();

  if (appShellState.authStatus !== "authenticated") {
    return <div className="min-h-screen bg-[#fffaf5]" />;
  }

  return <AppShellProvider value={appShellState}>{children}</AppShellProvider>;
}
