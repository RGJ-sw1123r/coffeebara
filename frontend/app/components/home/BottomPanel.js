"use client";

const SEARCH_RESULT_PANEL_LIMIT = 10;

function SectionCard({ title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-[28px] border border-[#e8ddd0] bg-white p-5 shadow-[0_18px_45px_rgba(84,52,27,0.06)] sm:p-6 ${className}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f725d]">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-sm text-[#6d584b]">{description}</p>
        ) : null}
      </div>
      <div className={description ? "mt-5" : "mt-4"}>{children}</div>
    </section>
  );
}

export default function BottomPanel({
  searchQuery,
  searchState,
  selectedPlace,
  savedPlaceIds,
  onToggleSavedPlace,
  onSelectSearchResult,
  messages,
}) {
  const isSearching = Boolean(searchQuery.trim());
  const isResultPanelVisible = isSearching || searchState.source === "map";
  const visibleSearchResults = searchState.results.slice(0, SEARCH_RESULT_PANEL_LIMIT);

  if (isResultPanelVisible) {
    return (
      <SectionCard
        title={
          searchState.source === "map"
            ? messages.mapResultsTitle
            : messages.searchResultsTitle
        }
      >
        {searchState.status === "error" ? (
          <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4 text-sm text-[#5f4b3f]">
            {searchState.errorMessage || messages.searchError}
          </div>
        ) : searchState.results.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5ecdf] px-3 py-2 text-xs font-medium text-[#6c5547]">
                {searchState.source === "map"
                  ? messages.totalMapResults(searchState.totalCount)
                  : messages.totalSearchResults(
                      searchState.totalCount,
                      searchState.totalCount >= 45,
                    )}
              </span>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {visibleSearchResults.map((place) => {
                const isSaved = savedPlaceIds.has(place.id);
                const isSelected = selectedPlace?.id === place.id;

                return (
                  <div
                    key={place.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectSearchResult(place)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectSearchResult(place);
                      }
                    }}
                    className={`rounded-[22px] border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#2f221b] bg-[#f7efe6]"
                        : "border-[#eadfd3] bg-[#fcfaf7] hover:border-[#cdb8a6]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#241813]">
                          {place.name}
                        </p>
                        <p className="mt-1 text-xs text-[#8f725d]">
                          {place.categoryName || messages.cafeCategoryFallback}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleSavedPlace(place);
                        }}
                        aria-label={messages.favoriteAriaLabel}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          isSaved
                            ? "bg-[#2f221b] text-[#f3c76d]"
                            : "bg-[#efe3d5] text-[#5d473b]"
                        }`}
                      >
                        {isSaved ? "★" : "+"}
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-[#5f4b3f]">
                      {place.roadAddress || place.address || messages.noAddress}
                    </p>

                    {place.phone ? (
                      <p className="mt-2 text-xs text-[#8f725d]">{place.phone}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#d8c8b7] bg-[#fcfaf7] px-4 py-6 text-sm text-[#7a6456]">
            {searchState.status === "loading"
              ? messages.searchLoading
              : messages.searchEmpty}
          </div>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard title={messages.cafeInfoTitle}>
      <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4">
        {selectedPlace ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#241813]">
                  {selectedPlace.name}
                </p>
                <p className="mt-1 text-sm text-[#8f725d]">
                  {selectedPlace.categoryName || messages.cafeCategoryFallback}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleSavedPlace(selectedPlace)}
                aria-label={messages.favoriteAriaLabel}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  savedPlaceIds.has(selectedPlace.id)
                    ? "bg-[#2f221b] text-[#f3c76d]"
                    : "bg-[#efe3d5] text-[#5d473b]"
                }`}
              >
                {savedPlaceIds.has(selectedPlace.id) ? "★" : "+"}
              </button>
            </div>

            <p className="text-sm text-[#5f4b3f]">
              {selectedPlace.roadAddress ||
                selectedPlace.address ||
                messages.noAddress}
            </p>

            {selectedPlace.phone ? (
              <p className="text-sm text-[#5f4b3f]">
                {messages.phoneLabel}: {selectedPlace.phone}
              </p>
            ) : null}

            {selectedPlace.placeUrl ? (
              <a
                href={selectedPlace.placeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-[#2f221b] px-4 py-2 text-sm font-medium text-white visited:text-white hover:text-white"
                style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              >
                {messages.kakaoDetailLink}
              </a>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-[#5f4b3f]">{messages.noSelectedCafe}</p>
        )}
      </div>
    </SectionCard>
  );
}
