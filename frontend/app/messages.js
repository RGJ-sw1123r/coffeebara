const messages = {
  ko: {
    headerTitle: "취향 카페 탐색",
    logoAlt: "Coffeebara 로고",
    menuOpen: "사이드 메뉴 열기",
    menuClose: "사이드 메뉴 닫기",
    searchInputLabel: "카페 이름 검색",
    searchInputPlaceholder: "카페명",
    searchButton: "카페 검색",
    searchButtonCompact: "검색",
    localeLabel: "언어 선택",
    mapSectionLabel: "카페 지도",
    mapSectionTitle: "카페를 찾아보세요. 마음에 드는 곳을 내 취향 카페로 지정하세요.",
    mapSectionDescription: "비슷한 카페를 추천 받을 수 있습니다.",
    searchResultsTitle: "검색 결과",
    totalSearchResults: (count, hasMore = false) =>
      `총 검색 결과 ${count}곳${hasMore ? " 이상" : ""}`,
    searchLoading: "검색 결과를 불러오고 있습니다.",
    searchLoadingWithQuery: (query) => `"${query}" 검색 결과를 불러오고 저장하는 중입니다.`,
    searchLoadingWithoutQuery: "검색 결과를 불러오고 저장하는 중입니다.",
    searchLoadingWait: "잠시만 기다려주세요",
    searchEmpty: "검색 결과가 없습니다.",
    searchError: "검색 결과를 불러오지 못했습니다.",
    searchNoticeLabel: "Search Tip",
    searchNoticeTitle: "검색 범위가 넓습니다",
    searchNoticeClose: "알림 닫기",
    searchTooManyNotice:
      "검색 결과가 많습니다. 지역명을 함께 입력하면 더 정확하게 찾을 수 있습니다.",
    cafeInfoTitle: "카페 정보",
    cafeCategoryFallback: "카페",
    noAddress: "주소 정보 없음",
    favoriteAriaLabel: "내 취향 카페에 추가",
    phoneLabel: "전화번호",
    kakaoDetailLink: "카카오 상세 보기",
    noSelectedCafe: "선택한 카페가 없습니다.",
    similarTasteLabel: "취향 추천",
    similarTasteDescription:
      "내 취향 카페를 바탕으로 비슷한 분위기의 카페를 추천받는 영역입니다.",
    similarTasteButton: "비슷한 취향 추천 받기",
    similarTasteReady:
      "준비 완료. 선택한 취향을 바탕으로 비슷한 카페 추천으로 이어갈 수 있습니다.",
    similarTasteNeedMore: (count) =>
      `최소 ${count}곳 이상 고르면 취향 추천을 시작할 수 있습니다.`,
    favoriteSectionTitle: "내 취향 카페",
    closeButton: "닫기",
    removeFavoriteAriaLabel: (name) => `${name} 즐겨찾기 해제`,
    noFavoriteCafes: "아직 고른 카페가 없습니다.",
    backendSyncTitle: "백엔드 조회",
    backendSyncDescription:
      "로컬 스토리지에 저장한 카페를 기준으로 백엔드에서 최신 카페 정보를 다시 불러옵니다.",
    backendSyncLoading: (fetched, total) =>
      `백엔드에서 카페 정보를 조회하는 중입니다. (${fetched}/${total})`,
    backendSyncSuccess: (count) =>
      `백엔드 조회 완료. ${count}개의 카페 정보를 불러왔습니다.`,
    backendSyncIdle: "저장한 카페가 있으면 백엔드 조회가 자동으로 시작됩니다.",
    backendSyncError: "백엔드 조회에 실패했습니다.",
    backendBannerTitle: "카페 불러오기 중 문제가 발생했습니다.",
    backendBannerFallback:
      "백엔드에서 카페 정보를 조회하거나 최신 상태로 맞추는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    selectedCafeLabel: "선택한 카페",
    fetchTemporaryConnectionError: (cafeLabel) =>
      `${cafeLabel} 정보를 불러오는 중 서버 연결이 일시적으로 불안정합니다. 잠시 후 다시 시도해 주세요.`,
    fetchUpsertError: (cafeLabel) =>
      `${cafeLabel} 정보를 최신 상태로 맞추는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`,
    fetchLookupError: (cafeLabel) =>
      `${cafeLabel} 정보를 확인하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`,
    fetchGenericError: (cafeLabel) =>
      `${cafeLabel} 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.`,
    fetchUnexpectedError:
      "카페 정보를 불러오는 중 예상하지 못한 문제가 발생했습니다.",
    saveUnexpectedError:
      "선택한 카페를 저장하는 중 예상하지 못한 문제가 발생했습니다.",
  },
  en: {
    headerTitle: "Cafe Preference Explorer",
    logoAlt: "Coffeebara logo",
    menuOpen: "Open side menu",
    menuClose: "Close side menu",
    searchInputLabel: "Search cafe name",
    searchInputPlaceholder: "Cafe name",
    searchButton: "Search",
    searchButtonCompact: "Search",
    localeLabel: "Choose language",
    mapSectionLabel: "Cafe Map",
    mapSectionTitle: "Search for cafes. Save places you like as preferred cafes.",
    mapSectionDescription: "You can receive recommendations for similar cafes.",
    searchResultsTitle: "Search Results",
    totalSearchResults: (count, hasMore = false) =>
      `Total search results ${count}${hasMore ? "+" : ""}`,
    searchLoading: "Loading search results.",
    searchLoadingWithQuery: (query) => `Loading and saving results for "${query}".`,
    searchLoadingWithoutQuery: "Loading and saving search results.",
    searchLoadingWait: "Please wait",
    searchEmpty: "No search results found.",
    searchError: "Failed to load search results.",
    searchNoticeLabel: "Search Tip",
    searchNoticeTitle: "Search area is broad",
    searchNoticeClose: "Close notice",
    searchTooManyNotice:
      "There are many results. Add a region to search more precisely.",
    cafeInfoTitle: "Cafe Info",
    cafeCategoryFallback: "Cafe",
    noAddress: "No address available",
    favoriteAriaLabel: "Add to preferred cafes",
    phoneLabel: "Phone",
    kakaoDetailLink: "View on Kakao",
    noSelectedCafe: "No cafe selected.",
    similarTasteLabel: "Taste Match",
    similarTasteDescription:
      "This area will recommend cafes with a similar feel based on your preferred cafes.",
    similarTasteButton: "Get Similar Recommendations",
    similarTasteReady:
      "Ready. You can continue to similar cafe recommendations based on your selections.",
    similarTasteNeedMore: (count) =>
      `Select at least ${count} cafes to start taste recommendations.`,
    favoriteSectionTitle: "Preferred Cafes",
    closeButton: "Close",
    removeFavoriteAriaLabel: (name) => `Remove ${name} from favorites`,
    noFavoriteCafes: "No cafes selected yet.",
    backendSyncTitle: "Backend Sync",
    backendSyncDescription:
      "Reload the latest cafe data from the backend based on cafes saved in local storage.",
    backendSyncLoading: (fetched, total) =>
      `Loading cafe data from the backend. (${fetched}/${total})`,
    backendSyncSuccess: (count) =>
      `Backend sync complete. Loaded ${count} cafes.`,
    backendSyncIdle: "Backend sync starts automatically when saved cafes exist.",
    backendSyncError: "Backend sync failed.",
    backendBannerTitle: "There was a problem loading cafes.",
    backendBannerFallback:
      "A problem occurred while loading cafe data from the backend or refreshing it. Please try again shortly.",
    selectedCafeLabel: "Selected cafe",
    fetchTemporaryConnectionError: (cafeLabel) =>
      `The server connection was temporarily unstable while loading ${cafeLabel}. Please try again shortly.`,
    fetchUpsertError: (cafeLabel) =>
      `A problem occurred while refreshing ${cafeLabel}. Please try again shortly.`,
    fetchLookupError: (cafeLabel) =>
      `A problem occurred while checking ${cafeLabel}. Please try again shortly.`,
    fetchGenericError: (cafeLabel) =>
      `Could not load ${cafeLabel}. Please try again shortly.`,
    fetchUnexpectedError: "An unexpected error occurred while loading cafe data.",
    saveUnexpectedError: "An unexpected error occurred while saving the selected cafe.",
  },
  ja: {
    headerTitle: "好みのカフェ探し",
    logoAlt: "Coffeebara ロゴ",
    menuOpen: "サイドメニューを開く",
    menuClose: "サイドメニューを閉じる",
    searchInputLabel: "カフェ名を検索",
    searchInputPlaceholder: "カフェ名",
    searchButton: "検索",
    searchButtonCompact: "検索",
    localeLabel: "言語を選択",
    mapSectionLabel: "カフェマップ",
    mapSectionTitle: "カフェを探してみましょう。気に入った場所を好みのカフェに追加してください。",
    mapSectionDescription: "似ているカフェのおすすめを受け取れます。",
    searchResultsTitle: "検索結果",
    totalSearchResults: (count, hasMore = false) =>
      `検索結果 ${count}件${hasMore ? "以上" : ""}`,
    searchLoading: "検索結果を読み込んでいます。",
    searchLoadingWithQuery: (query) => `「${query}」の検索結果を読み込み、保存しています。`,
    searchLoadingWithoutQuery: "検索結果を読み込み、保存しています。",
    searchLoadingWait: "しばらくお待ちください",
    searchEmpty: "検索結果がありません。",
    searchError: "検索結果を読み込めませんでした。",
    searchNoticeLabel: "Search Tip",
    searchNoticeTitle: "検索範囲が広いです",
    searchNoticeClose: "通知を閉じる",
    searchTooManyNotice:
      "検索結果が多すぎます。地域名を一緒に入力すると、より正確に探せます。",
    cafeInfoTitle: "カフェ情報",
    cafeCategoryFallback: "カフェ",
    noAddress: "住所情報なし",
    favoriteAriaLabel: "好みのカフェに追加",
    phoneLabel: "電話番号",
    kakaoDetailLink: "Kakao 詳細を見る",
    noSelectedCafe: "選択したカフェがありません。",
    similarTasteLabel: "好みのおすすめ",
    similarTasteDescription:
      "好みのカフェをもとに、似た雰囲気のカフェをおすすめするエリアです。",
    similarTasteButton: "似た好みをおすすめ",
    similarTasteReady:
      "準備完了です。選んだ好みをもとに、似たカフェのおすすめに進めます。",
    similarTasteNeedMore: (count) =>
      `好みのおすすめを始めるには、最低 ${count} 件以上選んでください。`,
    favoriteSectionTitle: "好みのカフェ",
    closeButton: "閉じる",
    removeFavoriteAriaLabel: (name) => `${name} をお気に入りから解除`,
    noFavoriteCafes: "まだ選んだカフェがありません。",
    backendSyncTitle: "バックエンド同期",
    backendSyncDescription:
      "ローカルストレージに保存したカフェを基準に、バックエンドから最新のカフェ情報を再取得します。",
    backendSyncLoading: (fetched, total) =>
      `バックエンドからカフェ情報を取得しています。 (${fetched}/${total})`,
    backendSyncSuccess: (count) =>
      `バックエンド同期が完了しました。${count} 件のカフェ情報を読み込みました。`,
    backendSyncIdle:
      "保存したカフェがある場合、バックエンド同期が自動で始まります。",
    backendSyncError: "バックエンド同期に失敗しました。",
    backendBannerTitle: "カフェの読み込み中に問題が発生しました。",
    backendBannerFallback:
      "バックエンドからカフェ情報を取得する途中、または最新化する途中で問題が発生しました。しばらくしてからもう一度お試しください。",
    selectedCafeLabel: "選択したカフェ",
    fetchTemporaryConnectionError: (cafeLabel) =>
      `${cafeLabel} の読み込み中にサーバー接続が一時的に不安定でした。しばらくしてからもう一度お試しください。`,
    fetchUpsertError: (cafeLabel) =>
      `${cafeLabel} を最新状態に更新する途中で問題が発生しました。しばらくしてからもう一度お試しください。`,
    fetchLookupError: (cafeLabel) =>
      `${cafeLabel} を確認する途中で問題が発生しました。しばらくしてからもう一度お試しください。`,
    fetchGenericError: (cafeLabel) =>
      `${cafeLabel} を読み込めませんでした。しばらくしてからもう一度お試しください。`,
    fetchUnexpectedError:
      "カフェ情報の読み込み中に予期しない問題が発生しました。",
    saveUnexpectedError:
      "選択したカフェの保存中に予期しない問題が発生しました。",
  },
};

export function getMessages(locale = "ko") {
  return messages[locale] ?? messages.ko;
}
