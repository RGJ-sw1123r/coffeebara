const ja = {
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
    savedPlacesMapButton: "保存したカフェを見る",
    searchResultsTitle: "検索結果",
    mapResultsTitle: "現在の地図内のカフェ",
    savedPlacesMapResultsTitle: "保存したカフェ",
    totalSearchResults: (count, hasMore = false) =>
      `検索結果 ${count}件${hasMore ? "以上" : ""}`,
    totalMapResults: (count) => `現在の地図内のカフェ ${count}件`,
    totalSavedPlacesOnMap: (count) => `保存したカフェ ${count}件`,
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
    mapEmptySavedPlaces: "地図に表示できる保存済みカフェがありません。",
    savedPlacesMapReadyTitle: "保存したカフェを表示しました",
    savedPlacesMapReadyNotice:
      "保存したカフェを読み込みました。実際の位置は結果リストで保存したカフェを直接選んで確認してください。",
    savedPlacesMapEmptyTitle: "保存したカフェがありません",
    savedPlacesMapEmptyNotice:
      "先にカフェを保存すると、このボタンで保存したカフェだけを地図に表示できます。",
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
    savedPlaceDeleteModalEyebrow:
      "保存したカフェを削除",
    savedPlaceDeleteModalTitle:
      "登録した記録も一緒に削除されます",
    savedPlaceDeleteModalBody: (recordLabel) =>
      `このカフェには${recordLabel}があります。保存したカフェを削除すると、関連する記録もすべて削除されます。続行しますか？`,
    savedPlaceDeleteRecordCountSuffix: "件",
    savedPlaceDeleteRecordFallback:
      "登録済みの記録",
    savedPlaceDeleteConfirmButton: "削除",
    savedPlaceDeleteCancelButton: "キャンセル",
    savedPlaceDeletedToast:
      "保存したカフェを削除しました。",
    expandSavedCafesAriaLabel:
      "保存したカフェを開く",
    collapseSavedCafesAriaLabel:
      "保存したカフェを閉じる",
    recordListTitle: "Records",
    recordListDescription:
      "ドラッグアンドドロップで順序を変更できます。",
    recordUntitledPlaceholder:
      "記録タイトル",
    recordTextUntitledPlaceholder: "テキスト記録",
    recordEmptyPreview:
      "内容はまだ入力されていません。",
    recordTypeTextLabel: "テキスト",
    recordMenuAriaLabel:
      "記録メニューを開く",
    recordDeleteActionLabel: "削除",
    recordEmptyState:
      "まだ登録された記録がありません。",
    recordNewModalEyebrow: "New Record",
    recordNewModalTitle:
      "どの記録を作成しますか？",
    recordNewModalBody:
      "このカフェアーカイブに追加する記録タイプを選んでください。",
    recordNewModalCloseAriaLabel:
      "ダイアログを閉じる",
    recordNewTextOptionTitle: "テキスト",
    recordNewTextOptionBody:
      "シンプルなメモ形式で記録を始めます。",
    recordNewBeanOptionTitle: "豆",
    recordNewBeanOptionBody: "豆の記録を始めます。",
    recordLoadFailed:
      "記録を読み込めませんでした。",
    recordTitleRequired:
      "記録名を入力してから保存してください。",
    recordContentRequired:
      "記録内容を入力してから保存してください。",
    recordBeanIdentityRequired:
      "豆の名前を入力してから保存してください。",
    recordBeanPurchaseDateRequired:
      "購入日を選択してから保存してください。",
    recordSaveFailed:
      "記録を保存できませんでした。",
    recordReloadFailed:
      "保存した記録を再読み込みできませんでした。",
    recordCreatedToast:
      "記録を登録しました。",
    recordUpdatedToast:
      "記録を修正しました。",
    recordBeanSavedToast:
      "豆の記録シェルをローカル状態に保存しました。",
    recordOrderSaveFailed:
      "記録の順序を保存できませんでした。",
    recordDeletedToast:
      "記録を削除しました。",
    recordDeleteFailed:
      "記録を削除できませんでした。",
    recordDeleteModalEyebrow: "記録削除",
    recordDeleteModalTitle: "この記録を削除しますか？",
    recordDeleteModalBody:
      "現在のカードを削除します。まだ保存していない下書きはすぐに消えます。",
    recordAddActionLabel:
      "+ 新しい記録",
    recordAddActionCompactLabel: "+ 記録",
    recordEditorTitle: "Record Editor",
    recordEditorCreatePendingLabel:
      "保存中...",
    recordEditorUpdatePendingLabel:
      "修正中...",
    recordEditorCreateLabel: "保存",
    recordEditorUpdateLabel: "修正",
    recordEditorCancelLabel: "キャンセル",
    recordTitleFieldLabel: "記録名",
    recordTitlePlaceholder:
      "記録名を入力してください",
    recordContentFieldLabel: "記録内容",
    recordContentPlaceholder:
      "このカフェで残したいメモを入力してください",
    recordTypeBeanLabel: "豆",
    recordBeanUntitledPlaceholder: "豆の記録",
    recordBeanEmptyPreview:
      "まだ豆の詳細情報が入力されていません。",
    recordBeanSectionIdentity: "豆の情報",
    recordBeanSectionPurchase: "購入情報",
    recordBeanSectionTasting: "パッケージのテイスティングノート",
    recordBeanSectionMemo: "メモ",
    recordBeanSectionImages: "画像",
    recordBeanFieldName: "豆の名前",
    recordBeanFieldOriginCountry: "原産国",
    recordBeanFieldOriginRegion: "原産地域",
    recordBeanFieldVariety: "品種",
    recordBeanFieldProcessType: "精製方法",
    recordBeanFieldRoastLevel: "焙煎度",
    recordBeanFieldRoastDate: "焙煎日",
    recordBeanFieldAltitudeMeters: "標高(m)",
    recordBeanFieldTastingNotes: "テイスティングノート",
    recordBeanFieldPurchaseDate: "購入日",
    recordBeanFieldPurchasePrice: "購入価格",
    recordBeanFieldQuantityGrams: "容量(g)",
    recordBeanFieldMemo: "メモ",
    recordBeanPlaceholderName: "豆の名前を入力してください",
    recordBeanPlaceholderOriginCountry: "例: エチオピア",
    recordBeanPlaceholderOriginRegion: "例: イルガチェフェ",
    recordBeanPlaceholderVariety: "例: Heirloom",
    recordBeanPlaceholderProcessType: "例: Washed",
    recordBeanPlaceholderRoastLevel: "例: Light",
    recordBeanPlaceholderAltitudeMeters: "例: 1900",
    recordBeanPlaceholderTastingNotes:
      "カフェやパッケージに書かれたノートを記録してください",
    recordBeanPlaceholderPurchasePrice: "例: 18000",
    recordBeanPlaceholderQuantityGrams: "例: 200",
    recordBeanPlaceholderMemo:
      "その他に残しておきたい記録を書いてください",
    recordBeanAttachmentPlaceholderTitle: "画像添付エリア",
    recordBeanAttachmentPlaceholderBody:
      "アップロードはまだ接続されていません。代わりにここで画像を追加してUIを確認できます。",
    recordBeanImageDropzoneHint:
      "ここに画像をドラッグするか、クリックして端末からファイルを選択してください。",
    recordBeanImageBrowseLabel: "画像を選択",
    recordBeanImagePendingLabel: "選択した画像",
    recordBeanImageAttachedLabel: "添付済みの画像",
    recordBeanImageRemoveLabel: "削除",
    recordBeanImageLimitHint: "最大{count}枚まで先に追加して確認できます。",
    recordBeanImageSaveHint: "この豆の記録を先に保存すると画像をアップロードできます。",
    recordAttachmentUploadSucceeded: "記録の保存と画像アップロードが完了しました。",
    recordAttachmentUploadFailed: "記録は保存されましたが、画像アップロードは失敗しました。",
    recordLoadingLabel:
      "記録を読み込み中です。",
    recordEmptyEditorTitle:
      "まだ登録された記録がありません。",
    recordEmptyEditorBody:
      "上の新しい記録ボタンで空の記録を作成し、内容を入力して保存してください。",
    accountDisplayNameEditAriaLabel:
      "表示名を修正",
    accountDisplayNamePlaceholder:
      "表示名",
    accountDisplayNameSaveLabel: "保存",
  
};

export default ja;
