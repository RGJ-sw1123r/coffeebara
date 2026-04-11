"use client";

const MIN_RECOMMENDATION_READY_COUNT = 3;

function SimilarTasteSection({ favoriteCount, messages }) {
  const isReady = favoriteCount >= MIN_RECOMMENDATION_READY_COUNT;

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

function SidebarPolicySection({ messages }) {
  const privacyNoticeTitle = messages.privacyNoticeTitle ?? "개인정보 처리 안내";
  const privacyNoticeBody =
    messages.privacyNoticeBody ??
    "커피바라는 사용자를 직접 식별할 수 있는 정보와 사용자 동선, 검색 내역, 검색 지역, 사용자 좌표를 서버에 저장하지 않습니다.";
  const guestNoticeTitle = messages.guestNoticeTitle ?? "게스트 이용 안내";
  const guestNoticeBody =
    messages.guestNoticeBody ??
    "게스트로 이용하는 동안 생성된 정보는 브라우저 환경이나 운영 정책에 따라 초기화될 수 있습니다.";
  const dataPolicyTitle = messages.dataPolicyTitle ?? "데이터 수집 안내";
  const dataPolicyBody =
    messages.dataPolicyBody ??
    "카페 정보는 공식 API를 우선 사용하고, 추가 수집이 필요한 경우 공개 범위와 이용 정책, robots 설정을 확인한 뒤 필요한 최소 정보만 처리합니다.";

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="space-y-3 text-xs leading-5 text-[#d9c3b4]">
        <div>
          <p className="font-semibold text-[#fff3e8]">{privacyNoticeTitle}</p>
          <p className="mt-1">{privacyNoticeBody}</p>
        </div>
        <div>
          <p className="font-semibold text-[#fff3e8]">{guestNoticeTitle}</p>
          <p className="mt-1">{guestNoticeBody}</p>
        </div>
        <div>
          <p className="font-semibold text-[#fff3e8]">{dataPolicyTitle}</p>
          <p className="mt-1">{dataPolicyBody}</p>
        </div>
      </div>
    </div>
  );
}

function SidebarMapLink({ kakaoMapUrl }) {
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-between rounded-2xl bg-white/8 px-3 py-3 text-sm font-semibold text-[#fff7f0] transition hover:bg-white/12"
      >
        <span>Kakao Map</span>
        <span className="text-[#d8b89f]">↗</span>
      </a>
    </div>
  );
}

function SidebarContent({
  favoriteCafes,
  onClose,
  onHomeClick,
  onRemoveFavorite,
  kakaoMapUrl,
  isDesktop = false,
  messages,
}) {
  const wrapperClassName = isDesktop
    ? "rounded-[28px] border border-[#e7dccf] bg-[#fbf7f2] p-4 shadow-[0_24px_60px_rgba(84,52,27,0.1)]"
    : "h-full overflow-y-auto px-4 py-5";

  return (
    <div className={wrapperClassName}>
      <section className="rounded-[24px] bg-[#2f221b] p-4 text-white shadow-[0_16px_40px_rgba(47,34,27,0.24)]">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex w-full items-center gap-3 rounded-2xl bg-white/8 px-3 py-3 text-left text-sm font-semibold text-[#fff7f0] transition hover:bg-white/12"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,248,241,0.12)] text-base leading-none text-[#f3d2b4]">
            ⌂
          </span>
          <span>{messages.homeLabel ?? "Home"}</span>
        </button>

        <div className="my-4 border-b border-white/10" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b89f]">
          {messages.favoriteSectionTitle}
        </p>
        {!isDesktop ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#f7ede4]"
            >
              {messages.closeButton}
            </button>
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {favoriteCafes.length > 0 ? (
            favoriteCafes.map((cafe) => (
              <div key={cafe.id} className="rounded-2xl bg-white/8 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{cafe.name}</p>
                    <p className="mt-1 text-xs text-[#d9c3b4]">
                      {cafe.roadAddress || cafe.address || messages.noAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(cafe.id)}
                    aria-label={messages.removeFavoriteAriaLabel(cafe.name)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f221b] text-base leading-none text-[#f3c76d]"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-white/8 px-3 py-3 text-sm text-[#d9c3b4]">
              {messages.noFavoriteCafes}
            </div>
          )}
        </div>

        <SimilarTasteSection favoriteCount={favoriteCafes.length} messages={messages} />
        <SidebarMapLink kakaoMapUrl={kakaoMapUrl} />
        <SidebarPolicySection messages={messages} />
      </section>
    </div>
  );
}

export function Sidebar({
  favoriteCafes,
  isOpen,
  onClose,
  onHomeClick,
  onRemoveFavorite,
  kakaoMapUrl,
  messages,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-[rgba(36,24,19,0.42)] xl:hidden"
      />

      <aside className="fixed left-0 top-[76px] z-40 h-[calc(100vh-76px)] w-[312px] max-w-[85vw] border-r border-[#e7dccf] bg-[#fbf7f2] shadow-[0_24px_60px_rgba(84,52,27,0.18)] md:top-[88px] md:h-[calc(100vh-88px)] xl:hidden">
        <SidebarContent
          favoriteCafes={favoriteCafes}
          onClose={onClose}
          onHomeClick={onHomeClick}
          onRemoveFavorite={onRemoveFavorite}
          kakaoMapUrl={kakaoMapUrl}
          messages={messages}
        />
      </aside>
    </>
  );
}

export function DesktopSidebar({
  favoriteCafes,
  isOpen,
  onHomeClick,
  onRemoveFavorite,
  kakaoMapUrl,
  messages,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="hidden xl:block xl:w-[312px] xl:shrink-0" aria-hidden={!isOpen}>
      <div className="pointer-events-auto sticky top-[104px] h-[calc(100vh-128px)] overflow-y-auto pr-2 -mr-2 [scrollbar-gutter:stable]">
        <SidebarContent
          favoriteCafes={favoriteCafes}
          onHomeClick={onHomeClick}
          onRemoveFavorite={onRemoveFavorite}
          kakaoMapUrl={kakaoMapUrl}
          isDesktop
          messages={messages}
        />
      </div>
    </div>
  );
}
