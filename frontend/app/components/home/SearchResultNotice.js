"use client";

export default function SearchResultNotice({ notice, onClose, messages }) {
  if (!notice?.message) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-[#6d5443] bg-[linear-gradient(160deg,rgba(56,39,30,0.98)_0%,rgba(38,26,21,0.97)_100%)] px-4 py-4 text-[#f8efe6] shadow-[0_28px_70px_rgba(27,15,8,0.32)] backdrop-blur">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(243,198,151,0.28),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(120,85,62,0.22),transparent_70%)]"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9b99d]">
            {messages.searchNoticeLabel}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#f7e3d0]">
            {notice.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#f2e5da]">{notice.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={messages.searchNoticeClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8a6b56] bg-[rgba(255,248,241,0.1)] text-[#fff7f0] transition hover:bg-[rgba(255,248,241,0.18)]"
        >
          ×
        </button>
      </div>
      <div className="relative mt-4 h-[3px] overflow-hidden rounded-full bg-[rgba(255,244,235,0.12)]">
        <div className="search-progress-bar h-full w-1/3 rounded-full bg-[linear-gradient(90deg,#f2d1b0_0%,#fff4e7_100%)]" />
      </div>
    </div>
  );
}
