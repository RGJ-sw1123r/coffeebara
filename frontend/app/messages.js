const messages = {
  ko: {
    brandName: "Coffeebara",
    brandTagline: "카피바라의 커피노트",
    headerTitle: "브루잉 노트와 커피 기록",
    loginPageEyebrow: "카피바라의 커피노트",
    loginPageTitle: "LOGIN",
    loginPageDescription:
      "Kakao 로그인 또는 게스트 이용으로 개인 커피 기록을 시작할 수 있습니다.",
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
    accountSavedCafeCountLabel: "저장한 카페",
    accountRecordCountLabel: "남긴 기록",
    accountGuestRecordUnavailable: "게스트는 이 기능을 이용할 수 없습니다",
    logoutButton: "로그아웃",
    guestModeBannerTitle: "현재 게스트로 이용 중입니다.",
    guestModeBannerBody:
      "게스트로 저장한 정보는 이 브라우저에만 유지되며, 로그인 페이지로 돌아가면 초기화됩니다.",
    logoAlt: "Coffeebara 로고",
    menuOpen: "사이드 메뉴 열기",
    menuClose: "사이드 메뉴 닫기",
    searchInputLabel: "카페 이름 검색",
    searchInputPlaceholder: "예: 카페 이름 + 지역명",
    searchButton: "카페 검색",
    searchButtonCompact: "검색",
    localeLabel: "언어 선택",
    mapSectionLabel: "카페 탐색",
    mapSectionTitle: "기록에 남길 카페를 찾아보세요. 구매처나 음용 카페로 저장할 수 있습니다.",
    mapSectionDescription: "지금은 카페를 모아 두고, 이후 원두 기록과 브루잉 기록에 연결할 수 있습니다.",
    searchCurrentAreaButton: "현재 위치에서 검색",
    searchResultsTitle: "검색 결과",
    mapResultsTitle: "현재 지도 카페",
    totalSearchResults: (count, hasMore = false) =>
      `총 검색 결과 ${count}곳${hasMore ? " 이상" : ""}`,
    totalMapResults: (count) => `현재 지도 카페 ${count}곳`,
    searchLoading: "검색 결과를 불러오고 있습니다.",
    searchLoadingWithQuery: (query) => `"${query}" 검색 결과를 불러오는 중입니다.`,
    searchLoadingWithoutQuery: "검색 결과를 불러오는 중입니다.",
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
      "카페 이름을 입력하고, 필요하면 지역이나 지점명을 함께 적어 검색해 주세요.",
    requestRateLimitedNotice:
      "요청이 잠시 몰렸습니다. 잠시 후 다시 시도해 주세요.",
    mapKeyMissing: "카카오맵 키가 설정되지 않았습니다.",
    mapLoadingSearch: "검색한 카페를 찾는 중",
    mapLoadingArea: "현재 지도 범위의 카페를 불러오는 중",
    mapLoadFailedTitle: "카카오 지도 데이터를 불러오지 못했습니다.",
    mapLoadFailedBody:
      "`frontend/.env.local`의 `NEXT_PUBLIC_KAKAO_MAP_KEY` 값을 확인한 뒤 개발 서버를 다시 실행해 주세요.",
    mapLoadFailedDomainHint:
      "카카오 개발자 콘솔에 `http://localhost:3000` 이 허용 도메인으로 등록되어 있는지도 확인해 주세요.",
    mapEmptySearch: "검색한 카페가 없습니다.",
    mapEmptyArea: "현재 지도 범위에서 카페를 찾지 못했습니다.",
    cafeInfoTitle: "카페 정보",
    cafeCategoryFallback: "카페",
    noAddress: "주소 정보 없음",
    favoriteAriaLabel: "기록 카페로 저장",
    phoneLabel: "전화번호",
    kakaoDetailLink: "카카오 상세 보기",
    noSelectedCafe: "지도에서 카페를 선택하거나 검색해 보세요.",
    similarTasteLabel: "기록 준비",
    similarTasteDescription:
      "저장한 카페는 다음 단계에서 원두 기록이나 브루잉 기록에 연결할 수 있습니다.",
    similarTasteButton: "기록 흐름 준비 중",
    similarTasteReady:
      "저장한 카페가 충분합니다. 다음 단계에서 기록 연결 흐름으로 이어질 수 있습니다.",
    similarTasteNeedMore: (count) =>
      `최소 ${count}곳 이상 저장하면 다음 기록 흐름을 시험하기 좋습니다.`,
    favoriteSectionTitle: "저장한 카페",
    homeLabel: "홈",
    placeDetailTitle: "카페 정보",
    placeDetailLoading: "저장한 카페 정보를 불러오는 중입니다.",
    placeDetailCardLabel: "저장한 카페",
    placeDetailManageLabel: "기록 관리",
    placeDetailManageTitle: "이 카페에서 기록을 이어가게 됩니다.",
    placeDetailManageBody:
      "브루잉 노트, 커피 기록, 카페 메모 같은 관리 기능이 이 페이지를 중심으로 붙게 됩니다. 지금은 진입점만 먼저 준비했습니다.",
    placeDetailNextLabel: "다음 기능",
    placeDetailNextBean: "원두 기록",
    placeDetailNextBrew: "브루잉 노트",
    placeDetailNextMemo: "카페 메모",
    placeDetailNextBody:
      "카페 정보는 최소한만 두고, 이후에는 이곳에서 직접 기록을 남기고 관리하는 흐름으로 확장합니다.",
    placeDetailMissingTitle: "저장된 카페를 찾지 못했습니다.",
    placeDetailMissingBody:
      "브라우저 저장소가 비워졌거나, 이 카페가 현재 저장 목록에 없습니다.",
    placeProfileModalLabel: "카페 성향",
    placeProfileModalTitle: "이 카페는 어떤 곳인가요?",
    placeProfileOptionFranchise: "1. 프랜차이즈 카페",
    placeProfileOptionHanddrip: "2. 핸드드립 카페",
    placeProfileOptionBeanRetail: "3. 원두 판매",
    placeProfileOptionWarehouse: "4. 창고형 카페",
    placeProfileOptionGreatView: "5. 뷰가 좋은 카페",
    placeProfileOptionEspressoBar: "6. 에스프레소 바",
    placeProfileModalSkip: "나중에",
    placeProfileModalSubmit: "확인",
    placeProfileManageButton: "카페 성향 기록하기",
    placeProfileManageButtonEdit: "카페 성향 다시 기록하기",
    closeButton: "닫기",
    removeFavoriteAriaLabel: (name) => `${name} 저장 목록에서 제거`,
    removeFavoriteLockedAriaLabel: (name) => `${name} 기록 중이라 제거할 수 없음`,
    savedPlaceLockedBadge: "기록 중",
    savedPlaceLockedHint: "현재 기록 중인 카페는 여기서 제거할 수 없습니다.",
    noFavoriteCafes: "아직 저장한 카페가 없습니다.",
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
    brandName: "Coffeebara",
    brandTagline: "Capybara's Coffee Notes",
    headerTitle: "Brewing Notes and Coffee Records",
    loginPageEyebrow: "Capybara's Coffee Notes",
    loginPageTitle: "LOGIN",
    loginPageDescription:
      "Use Kakao login or continue as a guest to start your personal coffee records.",
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
    accountSavedCafeCountLabel: "Saved Cafes",
    accountRecordCountLabel: "Records",
    accountGuestRecordUnavailable: "Guests cannot use this feature",
    logoutButton: "Log out",
    guestModeBannerTitle: "You are currently using guest mode.",
    guestModeBannerBody:
      "Guest data stays only in this browser and will be cleared when you return to the login page.",
    logoAlt: "Coffeebara logo",
    menuOpen: "Open side menu",
    menuClose: "Close side menu",
    searchInputLabel: "Search cafe name",
    searchInputPlaceholder: "e.g. cafe name + area",
    searchButton: "Search Cafes",
    searchButtonCompact: "Search",
    localeLabel: "Choose language",
    mapSectionLabel: "Cafe Search",
    mapSectionTitle: "Search for cafes to keep in your records. Save them as purchase or drink cafes.",
    mapSectionDescription: "For now, you can collect cafes and connect them to bean records and brewing records later.",
    searchCurrentAreaButton: "Search This Area",
    searchResultsTitle: "Search Results",
    mapResultsTitle: "Cafes In View",
    totalSearchResults: (count, hasMore = false) =>
      `Total search results ${count}${hasMore ? "+" : ""}`,
    totalMapResults: (count) => `Cafes in current map ${count}`,
    searchLoading: "Loading search results.",
    searchLoadingWithQuery: (query) => `Loading results for "${query}".`,
    searchLoadingWithoutQuery: "Loading search results.",
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
      "Enter a cafe name first. Add an area or branch name if needed.",
    requestRateLimitedNotice:
      "Requests are arriving too quickly. Please try again shortly.",
    mapKeyMissing: "Kakao Map key is missing.",
    mapLoadingSearch: "Finding searched cafes",
    mapLoadingArea: "Loading cafes in the current map area",
    mapLoadFailedTitle: "Could not load Kakao map data.",
    mapLoadFailedBody:
      "Check the `NEXT_PUBLIC_KAKAO_MAP_KEY` value in `frontend/.env.local`, then restart the dev server.",
    mapLoadFailedDomainHint:
      "Also verify that `http://localhost:3000` is registered as an allowed domain in the Kakao developer console.",
    mapEmptySearch: "No matching cafes were found.",
    mapEmptyArea: "No cafes were found in the current map area.",
    cafeInfoTitle: "Cafe Info",
    cafeCategoryFallback: "Cafe",
    noAddress: "No address available",
    favoriteAriaLabel: "Save as a record cafe",
    phoneLabel: "Phone",
    kakaoDetailLink: "View on Kakao",
    noSelectedCafe: "Select a cafe on the map or start a search.",
    similarTasteLabel: "Record Prep",
    similarTasteDescription:
      "Saved cafes can be connected to bean records or brewing records in the next step.",
    similarTasteButton: "Record Flow In Progress",
    similarTasteReady:
      "Ready. You have enough saved cafes to continue into a record-linking flow later.",
    similarTasteNeedMore: (count) =>
      `Saving at least ${count} cafes is a good start for the next record flow.`,
    favoriteSectionTitle: "Saved Cafes",
    homeLabel: "Home",
    placeDetailTitle: "Cafe Info",
    placeDetailLoading: "Loading saved cafe information.",
    placeDetailCardLabel: "Saved Cafe",
    placeDetailManageLabel: "Record Flow",
    placeDetailManageTitle: "This page will become the cafe-based record hub.",
    placeDetailManageBody:
      "Brewing notes, coffee records, and cafe notes will be managed from here later. For now, only the entry point is prepared.",
    placeDetailNextLabel: "Next Features",
    placeDetailNextBean: "Bean Records",
    placeDetailNextBrew: "Brewing Notes",
    placeDetailNextMemo: "Cafe Notes",
    placeDetailNextBody:
      "Cafe information is intentionally minimal here. This page is meant to grow into a direct record-management flow.",
    placeDetailMissingTitle: "Could not find this saved cafe.",
    placeDetailMissingBody:
      "Browser storage may have been cleared, or this cafe is no longer in the saved list.",
    placeProfileModalLabel: "Cafe Profile",
    placeProfileModalTitle: "What kind of cafe is this?",
    placeProfileOptionFranchise: "1. Franchise Cafe",
    placeProfileOptionHanddrip: "2. Hand-Drip Cafe",
    placeProfileOptionBeanRetail: "3. Bean Retail",
    placeProfileOptionWarehouse: "4. Warehouse Cafe",
    placeProfileOptionGreatView: "5. Great View Cafe",
    placeProfileOptionEspressoBar: "6. Espresso Bar",
    placeProfileModalSkip: "Later",
    placeProfileModalSubmit: "Save",
    placeProfileManageButton: "Record Cafe Profile",
    placeProfileManageButtonEdit: "Edit Cafe Profile",
    closeButton: "Close",
    removeFavoriteAriaLabel: (name) => `Remove ${name} from saved cafes`,
    removeFavoriteLockedAriaLabel: (name) => `Cannot remove ${name} while it is being edited`,
    savedPlaceLockedBadge: "Active",
    savedPlaceLockedHint: "The cafe currently being edited cannot be removed here.",
    noFavoriteCafes: "No saved cafes yet.",
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
    brandName: "Coffeebara",
    brandTagline: "カピバラのコーヒーノート",
    headerTitle: "ブリューイングノートとコーヒー記録",
    loginPageEyebrow: "カピバラのコーヒーノート",
    loginPageTitle: "LOGIN",
    loginPageDescription:
      "Kakao ログインまたはゲスト利用で、個人のコーヒー記録を始められます。",
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
    accountSavedCafeCountLabel: "保存したカフェ",
    accountRecordCountLabel: "記録件数",
    accountGuestRecordUnavailable: "ゲストはこの機能を利用できません",
    logoutButton: "ログアウト",
    guestModeBannerTitle: "現在ゲストモードで利用中です。",
    guestModeBannerBody:
      "ゲストとして保存した情報はこのブラウザにのみ保持され、ログインページに戻ると初期化されます。",
    logoAlt: "Coffeebara ロゴ",
    menuOpen: "サイドメニューを開く",
    menuClose: "サイドメニューを閉じる",
    searchInputLabel: "カフェ名を検索",
    searchInputPlaceholder: "例: カフェ名 + 地域名",
    searchButton: "カフェを検索",
    searchButtonCompact: "検索",
    localeLabel: "言語を選択",
    mapSectionLabel: "カフェ探索",
    mapSectionTitle: "記録に残したいカフェを探しましょう。購入先や飲んだカフェとして保存できます。",
    mapSectionDescription: "今はカフェを集めておき、あとで豆の記録やブリューイング記録に結び付けられます。",
    searchCurrentAreaButton: "このエリアで検索",
    searchResultsTitle: "検索結果",
    mapResultsTitle: "現在の地図内のカフェ",
    totalSearchResults: (count, hasMore = false) =>
      `検索結果 ${count}件${hasMore ? "以上" : ""}`,
    totalMapResults: (count) => `現在の地図内のカフェ ${count}件`,
    searchLoading: "検索結果を読み込んでいます。",
    searchLoadingWithQuery: (query) => `「${query}」の検索結果を読み込んでいます。`,
    searchLoadingWithoutQuery: "検索結果を読み込んでいます。",
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
      "まずカフェ名を入力し、必要なら地域名や店舗名を一緒に入力して検索してください。",
    requestRateLimitedNotice:
      "リクエストが集中しています。しばらくしてからもう一度お試しください。",
    mapKeyMissing: "Kakao Map キーが設定されていません。",
    mapLoadingSearch: "検索したカフェを探しています",
    mapLoadingArea: "現在の地図範囲のカフェを読み込んでいます",
    mapLoadFailedTitle: "Kakao 地図データを読み込めませんでした。",
    mapLoadFailedBody:
      "`frontend/.env.local` の `NEXT_PUBLIC_KAKAO_MAP_KEY` の値を確認し、開発サーバーを再起動してください。",
    mapLoadFailedDomainHint:
      "Kakao 開発者コンソールに `http://localhost:3000` が許可ドメインとして登録されているかも確認してください。",
    mapEmptySearch: "検索したカフェがありません。",
    mapEmptyArea: "現在の地図範囲でカフェを見つけられませんでした。",
    cafeInfoTitle: "カフェ情報",
    cafeCategoryFallback: "カフェ",
    noAddress: "住所情報なし",
    favoriteAriaLabel: "記録用のカフェとして保存",
    phoneLabel: "電話番号",
    kakaoDetailLink: "Kakao 詳細を見る",
    noSelectedCafe: "地図でカフェを選ぶか、検索してみてください。",
    similarTasteLabel: "記録の準備",
    similarTasteDescription:
      "保存したカフェは、次の段階で豆の記録やブリューイング記録に結び付けられます。",
    similarTasteButton: "記録フロー準備中",
    similarTasteReady:
      "準備完了です。保存したカフェをもとに、次の記録連携フローへ進みやすくなります。",
    similarTasteNeedMore: (count) =>
      `次の記録フローを試すには、最低 ${count} 件ほど保存しておくと十分です。`,
    favoriteSectionTitle: "保存したカフェ",
    placeDetailTitle: "カフェ情報",
    placeDetailLoading: "保存したカフェの情報を読み込んでいます。",
    placeDetailCardLabel: "保存したカフェ",
    placeDetailManageLabel: "記録管理",
    placeDetailManageTitle: "このカフェを中心に記録を続けるページになります。",
    placeDetailManageBody:
      "ブリューイングノート、コーヒー記録、カフェメモの管理機能がここに追加される予定です。今は入口だけ先に整えています。",
    placeDetailNextLabel: "次の機能",
    placeDetailNextBean: "豆の記録",
    placeDetailNextBrew: "ブリューイングノート",
    placeDetailNextMemo: "カフェメモ",
    placeDetailNextBody:
      "カフェ情報は最小限に抑えています。今後はこのページから直接記録を残して管理する流れへ広げます。",
    placeDetailMissingTitle: "保存したカフェが見つかりません。",
    placeDetailMissingBody:
      "ブラウザ保存領域が消えたか、このカフェが現在の保存一覧にありません。",
    placeProfileModalLabel: "カフェ傾向",
    placeProfileModalTitle: "このカフェはどんなタイプですか？",
    placeProfileOptionFranchise: "1. フランチャイズカフェ",
    placeProfileOptionHanddrip: "2. ハンドドリップカフェ",
    placeProfileOptionBeanRetail: "3. 豆の販売あり",
    placeProfileOptionWarehouse: "4. 倉庫型カフェ",
    placeProfileOptionGreatView: "5. 景色が良いカフェ",
    placeProfileOptionEspressoBar: "6. エスプレッソバー",
    placeProfileModalSkip: "あとで",
    placeProfileModalSubmit: "保存",
    placeProfileManageButton: "カフェ傾向を記録する",
    placeProfileManageButtonEdit: "カフェ傾向を編集する",
    closeButton: "閉じる",
    removeFavoriteAriaLabel: (name) => `${name} を保存済みのカフェから削除`,
    removeFavoriteLockedAriaLabel: (name) => `${name} は記録中のためここでは削除できません`,
    savedPlaceLockedBadge: "記録中",
    savedPlaceLockedHint: "現在記録中のカフェは、ここでは削除できません。",
    noFavoriteCafes: "まだ保存したカフェがありません。",
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
    homeLabel: "ホーム",
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
