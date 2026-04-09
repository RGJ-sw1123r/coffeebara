"use client";

export default function SearchLoadingOverlay({ isVisible, searchQuery, messages }) {
  if (!isVisible) {
    return null;
  }

  const queryLabel = searchQuery.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(36,24,19,0.22)] backdrop-blur-[1.5px]">
      <div className="mx-4 flex w-full max-w-md flex-col gap-2 rounded-[28px] border border-[#e7dccf] bg-[rgba(255,251,246,0.96)] px-5 py-5 shadow-[0_24px_60px_rgba(84,52,27,0.16)]">
        <div className="flex items-center justify-between gap-3 text-sm font-medium text-[#5f4b3f]">
          <span>
            {queryLabel
              ? messages.searchLoadingWithQuery(queryLabel)
              : messages.searchLoadingWithoutQuery}
          </span>
          <span className="shrink-0 text-[#8f725d]">{messages.searchLoadingWait}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8d9ca]">
          <div className="search-progress-bar h-full w-1/3 rounded-full bg-[#2f221b]" />
        </div>
      </div>
    </div>
  );
}
