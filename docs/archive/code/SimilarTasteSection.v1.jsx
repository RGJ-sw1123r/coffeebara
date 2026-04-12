"use client";

const MIN_RECOMMENDATION_READY_COUNT = 3;

export default function SimilarTasteSection({ savedPlaceCount, messages }) {
  const isReady = savedPlaceCount >= MIN_RECOMMENDATION_READY_COUNT;

  return (
    <section className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
            {messages.similarTasteLabel}
          </p>
          <p className="mt-2 text-sm text-[#f7ede4]">
            {messages.similarTasteDescription}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={!isReady}
        className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          isReady
            ? "bg-[#f3d6b6] text-[#2f221b] shadow-[0_12px_24px_rgba(27,15,8,0.18)] hover:bg-[#f0ccb0]"
            : "cursor-not-allowed bg-[#675249] text-[#d9c3b4]"
        }`}
      >
        {messages.similarTasteButton}
      </button>

      <p className="mt-3 text-xs leading-5 text-[#d9c3b4]">
        {isReady
          ? messages.similarTasteReady
          : messages.similarTasteNeedMore(MIN_RECOMMENDATION_READY_COUNT)}
      </p>
    </section>
  );
}
