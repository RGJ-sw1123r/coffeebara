"use client";

import { KEYWORD_SEARCH_RESULT_LIMIT } from "../../constants/search";
import { useHomeSearchMapStore } from "../../stores/useHomeSearchMapStore";

const SEARCH_RESULT_PANEL_LIMIT = 10;
const SAVED_PLACE_RESULT_PANEL_LIMIT = 1000;
const PANEL_CLASS_NAME =
  "w-full xl:sticky xl:top-[104px] xl:h-[calc(100vh-128px)] xl:w-[400px] xl:self-start";

function SectionCard({ title, description, children, className = "" }) {
  return (
    <section
      className={`flex flex-col rounded-[28px] border border-[#e8ddd0] bg-white p-5 shadow-[0_18px_45px_rgba(84,52,27,0.06)] sm:p-6 ${className}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f725d]">
          {title}
        </p>
        {description ? (
          <p className="mt-2 text-sm text-[#6d584b]">{description}</p>
        ) : null}
      </div>
      <div className={`${description ? "mt-5" : "mt-4"} min-h-0 flex-1`}>
        {children}
      </div>
    </section>
  );
}

function SaveButton({ isSaved, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        isSaved
          ? "bg-[#2f221b] text-[#f3c76d]"
          : "bg-[#efe3d5] text-[#5d473b]"
      }`}
    >
      {isSaved ? "★" : "+"}
    </button>
  );
}

export default function BottomPanel({
  savedPlaceIds,
  onToggleSavedPlace,
  messages,
}) {
  const searchQuery = useHomeSearchMapStore((state) => state.searchQuery);
  const searchState = useHomeSearchMapStore((state) => state.searchState);
  const selectedPlace = useHomeSearchMapStore((state) => state.selectedPlace);
  const selectPlace = useHomeSearchMapStore((state) => state.selectPlace);
  const isSearching = Boolean(searchQuery.trim());
  const isResultPanelVisible =
    isSearching || searchState.source === "map" || searchState.source === "saved";
  const searchResultPanelLimit =
    searchState.source === "saved"
      ? SAVED_PLACE_RESULT_PANEL_LIMIT
      : SEARCH_RESULT_PANEL_LIMIT;
  const visibleSearchResults = searchState.results.slice(0, searchResultPanelLimit);

  if (isResultPanelVisible) {
    return (
      <SectionCard
        className={PANEL_CLASS_NAME}
        title={
          searchState.source === "saved"
            ? messages.savedPlacesMapResultsTitle
            : searchState.source === "map"
            ? messages.mapResultsTitle
            : messages.searchResultsTitle
        }
      >
        {searchState.status === "error" ? (
          <div className="rounded-[24px] border border-[#eadfd3] bg-[#fcfaf7] px-4 py-4 text-sm text-[#5f4b3f]">
            {searchState.errorMessage || messages.searchError}
          </div>
        ) : searchState.results.length > 0 ? (
          <div className="flex h-full min-h-0 flex-col space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f5ecdf] px-3 py-2 text-xs font-medium text-[#6c5547]">
                {searchState.source === "saved"
                  ? messages.totalSavedPlacesOnMap(searchState.totalCount)
                  : searchState.source === "map"
                  ? messages.totalMapResults(searchState.totalCount)
                  : messages.totalSearchResults(
                      searchState.totalCount,
                      searchState.totalCount >= KEYWORD_SEARCH_RESULT_LIMIT,
                    )}
              </span>
            </div>

            <div className="min-h-0 space-y-3 overflow-y-auto overscroll-contain xl:pr-1 [scrollbar-gutter:stable]">
              {visibleSearchResults.map((place) => {
                const isSaved = savedPlaceIds.has(place.id);
                const isSelected = selectedPlace?.id === place.id;

                return (
                  <div
                    key={place.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => selectPlace(place)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectPlace(place);
                      }
                    }}
                    className={`rounded-[22px] border px-4 py-4 text-left transition ${
                      isSelected
                        ? "border-[#2f221b] bg-[#f7efe6] shadow-[0_12px_24px_rgba(47,34,27,0.08)]"
                        : "border-[#eadfd3] bg-[#fcfaf7] hover:border-[#cdb8a6] hover:bg-[#fffdf9]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-6 text-[#241813]">
                          {place.name}
                        </p>
                        <p className="mt-1 text-xs text-[#8f725d]">
                          {place.categoryName || messages.cafeCategoryFallback}
                        </p>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#5f4b3f]">
                          {place.roadAddress || place.address || messages.noAddress}
                        </p>
                        {place.phone ? (
                          <p className="mt-2 text-xs text-[#8f725d]">{place.phone}</p>
                        ) : null}
                      </div>
                      <SaveButton
                        isSaved={isSaved}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleSavedPlace(place);
                        }}
                        label={messages.favoriteAriaLabel}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#d8c8b7] bg-[#fcfaf7] px-4 py-6 text-sm text-[#7a6456]">
            {searchState.status === "loading"
              ? messages.searchLoading
              : searchState.source === "saved"
                ? messages.mapEmptySavedPlaces
              : messages.searchEmpty}
          </div>
        )}
      </SectionCard>
    );
  }

  return (
    <SectionCard title={messages.cafeInfoTitle} className={PANEL_CLASS_NAME}>
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
              <SaveButton
                isSaved={savedPlaceIds.has(selectedPlace.id)}
                onClick={() => onToggleSavedPlace(selectedPlace)}
                label={messages.favoriteAriaLabel}
              />
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
          <p className="text-sm leading-6 text-[#5f4b3f]">
            {messages.noSelectedCafe}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
