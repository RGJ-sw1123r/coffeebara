"use client";

export function BackendSyncBanner({ status, errorMessage, messages }) {
  if (status !== "error") {
    return null;
  }

  return (
    <section className="rounded-[24px] border border-[#e7c9c2] bg-[#fff1ed] px-5 py-4 text-[#6f3126] shadow-[0_12px_30px_rgba(111,49,38,0.08)]">
      <p className="text-sm font-semibold">{messages.backendBannerTitle}</p>
      <p className="mt-1 text-sm leading-6">
        {errorMessage || messages.backendBannerFallback}
      </p>
    </section>
  );
}

export function GuestModeToast({ isVisible, messages }) {
  if (!isVisible) {
    return null;
  }

  const bodyText = String(messages.guestModeBannerBody);
  const commaIndex = bodyText.indexOf(",");
  const bodyLines =
    commaIndex >= 0
      ? [
          bodyText.slice(0, commaIndex + 1).trim(),
          bodyText.slice(commaIndex + 1).trim(),
        ].filter(Boolean)
      : [bodyText];

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 w-[min(384px,calc(100vw-2rem))] rounded-[24px] border border-[#3d8f58] bg-[#2f9e55] px-5 py-[18px] text-white shadow-[0_18px_36px_rgba(29,92,50,0.22)]">
      <p className="text-sm font-semibold">{messages.guestModeBannerTitle}</p>
      <p className="mt-1 text-sm leading-6 text-white/92">
        {bodyLines.map((line, index) => (
          <span key={`${line}-${index}`} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

export function ActionToast({ toast }) {
  if (!toast?.message) {
    return null;
  }

  const isSuccess = toast.type === "success";
  const toneClass = isSuccess
    ? "border-[#3d8f58] bg-[#2f9e55] text-white shadow-[0_18px_36px_rgba(29,92,50,0.22)]"
    : "border-[#e7c9c2] bg-[#fff1ed] text-[#6f3126] shadow-[0_18px_36px_rgba(111,49,38,0.12)]";

  return (
    <div
      className={`pointer-events-none fixed bottom-5 right-5 z-50 w-[min(384px,calc(100vw-2rem))] rounded-[24px] border px-5 py-4 ${toneClass}`}
    >
      <p className="text-sm font-medium leading-6">{toast.message}</p>
    </div>
  );
}
