const messages = {
  ko: {
    headerTitle: "취향 카페 탐색",
    loginPageEyebrow: "Coffeebara",
    loginPageTitle: "LOGIN",
    loginPageDescription:
      "Kakao 소셜 로그인 또는 게스트 이용 중 하나를 선택해 계속 진행할 수 있습니다.",
    loginPageKakaoButton: "Kakao 소셜 로그인",
    loginPageGuestButton: "게스트로 사용",
    loginPageLoginHint: "Kakao 로그인 연동은 준비 중입니다.",
    loginPageGuestHint:
      "게스트로 저장한 정보는 이 브라우저에만 유지되며 환경에 따라 초기화될 수 있습니다.",
    loginPagePending: (providerLabel) =>
      `${providerLabel} 기능은 아직 준비 중입니다. 우선 게스트로 이용할 수 있습니다.`,
    loginPageGuestFailed:
      "게스트 진입을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    loginPageStatusFailed:
      "로그인 상태를 확인하지 못했습니다. 백엔드가 실행 중인지 확인해 주세요.",
    accountMenuLabel: "계정 메뉴 열기",
    logoutButton: "로그아웃",
    guestModeBannerTitle: "현재 게스트로 이용 중입니다.",
    guestModeBannerBody:
      "게스트로 저장한 정보는 이 브라우저에만 유지되며, 로그인 페이지로 돌아가면 초기화됩니다.",
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
    searchCurrentAreaButton: "현재 위치에서 검색",
    searchResultsTitle: "검색 결과",
    mapResultsTitle: "현재 위치 카페",
    totalSearchResults: (count, hasMore = false) =>
      `총 검색 결과 ${count}곳${hasMore ? " 이상" : ""}`,
    totalMapResults: (count) => `현재 지도 카페 ${count}곳`,
    searchLoading: "검색 결과를 불러오고 있습니다.",
    searchLoadingWithQuery: (query) => `"${query}" 검색 결과를 불러오고 저장하는 중입니다.`,
    searchLoadingWithoutQuery: "검색 결과를 불러오고 저장하는 중입니다.",
    searchLoadingWait: "잠시만 기다려주세요",
    searchEmpty: "검색 결과가 없습니다.",
    searchError: "검색 결과를 불러오지 못했습니다.",
    searchNoticeLabel: "Search Tip",
    searchTooManyTitle: "검색 범위가 넓습니다",
    searchEmptyInputTitle: "검색어를 입력해 주세요",
    requestRateLimitedTitle: "요청이 많습니다",
    searchNoticeClose: "알림 닫기",
    searchTooManyNotice:
      "검색 결과가 많습니다. 지역명을 함께 입력하면 더 정확하게 찾을 수 있습니다.",
    mapTooManyNotice:
      "검색 결과가 많습니다. 지도를 조정하거나 검색 기능을 이용해 범위를 좁혀 주세요.",
    searchEmptyInputNotice:
      "카페명이나 지역명을 함께 입력한 뒤 검색해 주세요.",
    requestRateLimitedNotice:
      "요청이 잠시 몰렸습니다. 잠시 후 다시 시도해 주세요.",
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
    homeLabel: "Home",
    closeButton: "닫기",
    removeFavoriteAriaLabel: (name) => `${name} 즐겨찾기 해제`,
    noFavoriteCafes: "아직 고른 카페가 없습니다.",
    privacyNoticeTitle: "개인정보 처리 안내",
    privacyNoticeBody:
      "커피바라는 사용자를 직접 식별할 수 있는 정보와 사용자 동선, 검색 내역, 검색 지역, 사용자 좌표를 서버에 저장하지 않습니다.",
    guestNoticeTitle: "게스트 이용 안내",
    guestNoticeBody:
      "게스트로 이용하는 동안 생성된 정보는 브라우저 환경이나 운영 정책에 따라 초기화될 수 있습니다.",
    dataPolicyTitle: "데이터 수집 안내",
    dataPolicyBody:
      "카페 정보는 공식 API를 우선 사용하고, 추가 수집이 필요한 경우 공개 범위와 이용 정책, robots 설정을 확인한 뒤 필요한 최소 정보만 처리합니다.",
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
    loginPageEyebrow: "Coffeebara",
    loginPageTitle: "LOGIN",
    loginPageDescription:
      "Choose Kakao social login or continue as a guest to proceed.",
    loginPageKakaoButton: "Kakao Social Login",
    loginPageGuestButton: "Continue as Guest",
    loginPageLoginHint: "Kakao login integration is coming soon.",
    loginPageGuestHint:
      "Guest data stays only in this browser and may be reset depending on browser conditions.",
    loginPagePending: (providerLabel) =>
      `${providerLabel} is not ready yet. You can continue as a guest for now.`,
    loginPageGuestFailed:
      "Could not start guest access. Please try again shortly.",
    loginPageStatusFailed:
      "Could not verify login status. Check whether the backend is running.",
    accountMenuLabel: "Open account menu",
    logoutButton: "Log out",
    guestModeBannerTitle: "You are currently using guest mode.",
    guestModeBannerBody:
      "Guest data stays only in this browser and will be cleared when you return to the login page.",
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
    searchCurrentAreaButton: "Search This Area",
    searchResultsTitle: "Search Results",
    mapResultsTitle: "Cafes In View",
    totalSearchResults: (count, hasMore = false) =>
      `Total search results ${count}${hasMore ? "+" : ""}`,
    totalMapResults: (count) => `Cafes in current map ${count}`,
    searchLoading: "Loading search results.",
    searchLoadingWithQuery: (query) => `Loading and saving results for "${query}".`,
    searchLoadingWithoutQuery: "Loading and saving search results.",
    searchLoadingWait: "Please wait",
    searchEmpty: "No search results found.",
    searchError: "Failed to load search results.",
    searchNoticeLabel: "Search Tip",
    searchTooManyTitle: "Search area is broad",
    searchEmptyInputTitle: "Enter a search term",
    requestRateLimitedTitle: "Too many requests",
    searchNoticeClose: "Close notice",
    searchTooManyNotice:
      "There are many results. Add a region to search more precisely.",
    mapTooManyNotice:
      "There are many results. Adjust the map or use search to narrow the area.",
    searchEmptyInputNotice:
      "Enter a cafe name or region, then try searching again.",
    requestRateLimitedNotice:
      "Requests are arriving too quickly. Please try again shortly.",
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
    homeLabel: "Home",
    closeButton: "Close",
    removeFavoriteAriaLabel: (name) => `Remove ${name} from favorites`,
    noFavoriteCafes: "No cafes selected yet.",
    privacyNoticeTitle: "Privacy Notice",
    privacyNoticeBody:
      "Coffeebara does not store directly identifiable personal information, user movement paths, search history, searched areas, or user coordinates on the server.",
    guestNoticeTitle: "Guest Mode Notice",
    guestNoticeBody:
      "Information created during guest use may be reset depending on browser conditions or operating policy changes.",
    dataPolicyTitle: "Data Collection Notice",
    dataPolicyBody:
      "Cafe data is collected from official APIs first. If additional collection is needed, only the minimum necessary public information is handled after checking scope, usage policy, and robots settings.",
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
    loginPageEyebrow: "Coffeebara",
    loginPageTitle: "LOGIN",
    loginPageDescription:
      "Kakao ソーシャルログインまたはゲスト利用のどちらかを選んで続行できます。",
    loginPageKakaoButton: "Kakao ソーシャルログイン",
    loginPageGuestButton: "ゲストで利用する",
    loginPageLoginHint: "Kakao ログイン連携は準備中です。",
    loginPageGuestHint:
      "ゲストとして保存した情報はこのブラウザにのみ保持され、環境により初期化されることがあります。",
    loginPagePending: (providerLabel) =>
      `${providerLabel} はまだ準備中です。今はゲスト利用のみ可能です。`,
    loginPageGuestFailed:
      "ゲスト利用を開始できませんでした。しばらくしてからもう一度お試しください。",
    loginPageStatusFailed:
      "ログイン状態を確認できませんでした。バックエンドが起動しているか確認してください。",
    accountMenuLabel: "アカウントメニューを開く",
    logoutButton: "ログアウト",
    guestModeBannerTitle: "現在ゲストモードで利用中です。",
    guestModeBannerBody:
      "ゲストとして保存した情報はこのブラウザにのみ保持され、ログインページに戻ると初期化されます。",
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
    searchCurrentAreaButton: "この場所で検索",
    searchResultsTitle: "検索結果",
    mapResultsTitle: "現在位置のカフェ",
    totalSearchResults: (count, hasMore = false) =>
      `検索結果 ${count}件${hasMore ? "以上" : ""}`,
    totalMapResults: (count) => `現在の地図内カフェ ${count}件`,
    searchLoading: "検索結果を読み込んでいます。",
    searchLoadingWithQuery: (query) => `「${query}」の検索結果を読み込み、保存しています。`,
    searchLoadingWithoutQuery: "検索結果を読み込み、保存しています。",
    searchLoadingWait: "しばらくお待ちください",
    searchEmpty: "検索結果がありません。",
    searchError: "検索結果を読み込めませんでした。",
    searchNoticeLabel: "Search Tip",
    searchTooManyTitle: "検索範囲が広いです",
    searchEmptyInputTitle: "検索語を入力してください",
    requestRateLimitedTitle: "リクエストが多すぎます",
    searchNoticeClose: "通知を閉じる",
    searchTooManyNotice:
      "検索結果が多すぎます。地域名を一緒に入力すると、より正確に探せます。",
    mapTooManyNotice:
      "結果が多すぎます。地図を調整するか検索機能で範囲を絞ってください。",
    searchEmptyInputNotice:
      "カフェ名や地域名を入力してから検索してください。",
    requestRateLimitedNotice:
      "リクエストが集中しています。しばらくしてからもう一度お試しください。",
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
    homeLabel: "Home",
    privacyNoticeTitle: "個人情報のご案内",
    privacyNoticeBody:
      "コーヒーバラは、個人を直接識別できる情報、ユーザーの移動経路、検索履歴、検索した地域、ユーザー座標をサーバーに保存しません。",
    guestNoticeTitle: "ゲスト利用のご案内",
    guestNoticeBody:
      "ゲスト利用中に作成された情報は、ブラウザ環境や運用ポリシーにより初期化されることがあります。",
    dataPolicyTitle: "データ収集のご案内",
    dataPolicyBody:
      "カフェ情報は公式 API を優先して利用し、追加収集が必要な場合は公開範囲、利用ポリシー、robots 設定を確認したうえで必要最小限の情報のみを扱います。",
  },
};

export function getMessages(locale = "ko") {
  return messages[locale] ?? messages.ko;
}
