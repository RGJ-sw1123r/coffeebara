const messages = {
  ko: {
    headerTitle: "취향 카페 탐색",
    mapSectionLabel: "카페 지도",
    mapSectionTitle: "카페를 찾아보세요. 마음에 드는 곳을 내 취향 카페로 지정하세요.",
    mapSectionDescription: "비슷한 카페를 추천 받을 수 있습니다.",
    searchResultsTitle: "검색 결과",
    totalSearchResults: (count, hasMore = false) =>
      `총 검색 결과 ${count}곳${hasMore ? " 이상" : ""}`,
    searchLoading: "검색 결과를 불러오는 중입니다.",
    searchEmpty: "검색 결과가 없습니다.",
    searchError: "검색 결과를 불러오지 못했습니다.",
    cafeInfoTitle: "카페 정보",
    cafeCategoryFallback: "카페",
    noAddress: "주소 정보 없음",
    favoriteAriaLabel: "내 취향 카페 추가",
    phoneLabel: "전화번호",
    kakaoDetailLink: "카카오 상세 보기",
    noSelectedCafe: "선택한 카페가 없습니다.",
    searchTooManyNotice:
      "검색 결과가 많습니다. 지역명을 함께 입력하면 더 정확하게 찾을 수 있습니다.",
  },
  en: {
    headerTitle: "Cafe Preference Explorer",
    mapSectionLabel: "Cafe Map",
    mapSectionTitle: "Search for cafes. Save places you like as preferred cafes.",
    mapSectionDescription: "You can receive recommendations for similar cafes.",
    searchResultsTitle: "Search Results",
    totalSearchResults: (count, hasMore = false) =>
      `Total results ${count}${hasMore ? "+" : ""}`,
    searchLoading: "Loading search results.",
    searchEmpty: "No search results found.",
    searchError: "Failed to load search results.",
    cafeInfoTitle: "Cafe Info",
    cafeCategoryFallback: "Cafe",
    noAddress: "No address available",
    favoriteAriaLabel: "Add to preferred cafes",
    phoneLabel: "Phone",
    kakaoDetailLink: "View on Kakao",
    noSelectedCafe: "No cafe selected.",
    searchTooManyNotice:
      "There are many results. Add a region to search more precisely.",
  },
  ja: {
    headerTitle: "好みのカフェ探索",
    mapSectionLabel: "カフェ地図",
    mapSectionTitle: "カフェを探してみましょう。気に入った場所を好みのカフェに指定できます。",
    mapSectionDescription: "似た雰囲気のカフェをおすすめできます。",
    searchResultsTitle: "検索結果",
    totalSearchResults: (count, hasMore = false) =>
      `検索結果 ${count}件${hasMore ? "以上" : ""}`,
    searchLoading: "検索結果を読み込み中です。",
    searchEmpty: "検索結果がありません。",
    searchError: "検索結果を読み込めませんでした。",
    cafeInfoTitle: "カフェ情報",
    cafeCategoryFallback: "カフェ",
    noAddress: "住所情報がありません",
    favoriteAriaLabel: "お気に入りカフェに追加",
    phoneLabel: "電話番号",
    kakaoDetailLink: "Kakaoで詳細を見る",
    noSelectedCafe: "選択したカフェがありません。",
    searchTooManyNotice:
      "検索結果が多いです。地域名を追加すると、より正確に探せます。",
  },
};

export function getMessages(locale = "ko") {
  return messages[locale] ?? messages.ko;
}
