const ko = {
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
    savedPlaceDeleteModalEyebrow:
      "저장한 카페 삭제",
    savedPlaceDeleteModalTitle:
      "등록된 기록도 함께 삭제됩니다",
    savedPlaceDeleteModalBody: (recordLabel) =>
      `이 카페에는 ${recordLabel}이 있습니다. 저장한 카페를 삭제하면 관련 기록도 모두 삭제됩니다. 계속할까요?`,
    savedPlaceDeleteRecordCountSuffix: "건",
    savedPlaceDeleteRecordFallback: "등록된 기록",
    savedPlaceDeleteConfirmButton: "삭제",
    savedPlaceDeleteCancelButton: "취소",
    savedPlaceDeletedToast:
      "저장한 카페를 삭제했습니다.",
    expandSavedCafesAriaLabel:
      "저장한 카페 펼치기",
    collapseSavedCafesAriaLabel:
      "저장한 카페 접기",
    recordListTitle: "Records",
    recordListDescription:
      "드래그 앤 드롭으로 순서를 변경할 수 있습니다.",
    recordUntitledPlaceholder: "기록 제목",
    recordEmptyPreview:
      "내용을 아직 입력하지 않았습니다.",
    recordTypeTextLabel: "Text",
    recordMenuAriaLabel:
      "기록 메뉴 열기",
    recordDeleteActionLabel: "삭제",
    recordEmptyState:
      "아직 등록된 기록이 없습니다.",
    recordNewModalEyebrow: "New Record",
    recordNewModalTitle:
      "어떤 기록을 만들까요?",
    recordNewModalBody:
      "지금은 텍스트 기록만 선택할 수 있습니다.",
    recordNewModalCloseAriaLabel:
      "팝업 닫기",
    recordNewTextOptionTitle: "텍스트",
    recordNewTextOptionBody:
      "간단한 메모 형태로 기록을 시작합니다.",
    recordLoadFailed:
      "기록을 불러오지 못했습니다.",
    recordContentRequired:
      "기록 내용을 입력한 뒤 등록해 주세요.",
    recordSaveFailed:
      "기록을 저장하지 못했습니다.",
    recordReloadFailed:
      "저장한 기록을 다시 불러오지 못했습니다.",
    recordCreatedToast:
      "기록을 등록했습니다.",
    recordUpdatedToast:
      "기록을 수정했습니다.",
    recordOrderSaveFailed:
      "기록 순서를 저장하지 못했습니다.",
    recordDeletedToast:
      "기록을 삭제했습니다.",
    recordDeleteFailed:
      "기록을 삭제하지 못했습니다.",
    recordAddActionLabel: "+ 새 기록",
    recordAddActionCompactLabel: "+ 기록",
    recordEditorTitle: "Record Editor",
    recordEditorCreatePendingLabel:
      "등록 중...",
    recordEditorUpdatePendingLabel:
      "수정 중...",
    recordEditorCreateLabel: "등록",
    recordEditorUpdateLabel: "수정",
    recordEditorCancelLabel: "취소",
    recordTitleFieldLabel: "기록 이름",
    recordTitlePlaceholder:
      "기록 이름을 입력해 주세요",
    recordContentFieldLabel: "기록 내용",
    recordContentPlaceholder:
      "이 카페에서 남기고 싶은 메모를 입력해 주세요",
    recordLoadingLabel:
      "기록을 불러오는 중입니다.",
    recordEmptyEditorTitle:
      "아직 등록된 기록이 없습니다.",
    recordEmptyEditorBody:
      "상단의 새 기록 버튼으로 빈 기록을 만든 뒤 내용을 입력하고 등록해 주세요.",
    accountDisplayNameEditAriaLabel:
      "표시 이름 수정",
    accountDisplayNamePlaceholder:
      "표시 이름",
    accountDisplayNameSaveLabel: "저장",
  
};

export default ko;
