"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAppShell } from "../app/AppShellContext";
import HeaderBar from "../home/HeaderBar";
import { ActionToast } from "../home/StatusNotice";
import {
  DesktopSidebar,
  SavedPlaceDeleteConfirmModal,
  Sidebar,
} from "../home/Sidebar";

const RECORD_API_BASE_URL = "";
const WARNING_HEADER_NAME = "X-Coffeebara-Warning";
const MEDIA_TABLES_MISSING_WARNING = "MEDIA_TABLES_MISSING";

function normalizeSavedPlace(place) {
  if (!place || typeof place !== "object") {
    return null;
  }

  const normalizedId = typeof place.id === "string" ? place.id : String(place.id ?? "");
  const normalizedName =
    typeof place.name === "string" ? place.name.trim() : String(place.name ?? "").trim();

  if (!normalizedId || !normalizedName) {
    return null;
  }

  return {
    id: normalizedId,
    name: normalizedName,
    address: typeof place.address === "string" ? place.address : "",
    roadAddress: typeof place.roadAddress === "string" ? place.roadAddress : "",
    phone: typeof place.phone === "string" ? place.phone : "",
  };
}

function createDraftRecord(index) {
  const timestamp = Date.now();

  return {
    id: `draft-${timestamp}-${index}`,
    persistedId: null,
    title: "",
    noteText: "",
    displayOrder: index - 1,
  };
}

function normalizeRecord(record, index = 0) {
  if (!record || typeof record !== "object") {
    return null;
  }

  const persistedId =
    typeof record.id === "number" && Number.isFinite(record.id)
      ? record.id
      : Number(record.id ?? 0) || null;

  if (!persistedId) {
    return null;
  }

  return {
    id: `note-${persistedId}`,
    persistedId,
    title: typeof record.title === "string" ? record.title : "",
    noteText: typeof record.noteText === "string" ? record.noteText : "",
    displayOrder:
      typeof record.displayOrder === "number" && Number.isFinite(record.displayOrder)
        ? record.displayOrder
        : Number(record.displayOrder ?? index) || index,
  };
}

function reindexRecords(records) {
  return records.map((record, index) => ({
    ...record,
    displayOrder: index,
  }));
}

function moveRecord(records, draggedRecordId, targetRecordId) {
  const sourceIndex = records.findIndex((record) => record.id === draggedRecordId);
  const targetIndex = records.findIndex((record) => record.id === targetRecordId);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return records;
  }

  const nextRecords = [...records];
  const [movedRecord] = nextRecords.splice(sourceIndex, 1);
  nextRecords.splice(targetIndex, 0, movedRecord);
  return reindexRecords(nextRecords);
}

async function readErrorMessage(response, fallbackMessage) {
  const payload = await response.json().catch(() => null);
  return payload?.message || fallbackMessage;
}

function readWarningMessage(response) {
  const warningHeader = response.headers.get(WARNING_HEADER_NAME);
  if (!warningHeader) {
    return "";
  }

  const warningCodes = warningHeader
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (warningCodes.includes(MEDIA_TABLES_MISSING_WARNING)) {
    return "이미지 첨부 테이블이 아직 준비되지 않아 이미지 정보는 불러오지 못했습니다.";
  }

  return "";
}

function getRecordPageCopy(messages) {
  return {
    listTitle: messages.recordListTitle,
    listDescription: messages.recordListDescription,
    untitled: messages.recordUntitledPlaceholder,
    emptyPreview: messages.recordEmptyPreview,
    typeText: messages.recordTypeTextLabel,
    menuAria: messages.recordMenuAriaLabel,
    deleteAction: messages.recordDeleteActionLabel,
    listEmpty: messages.recordEmptyState,
    modalEyebrow: messages.recordNewModalEyebrow,
    modalTitle: messages.recordNewModalTitle,
    modalBody: messages.recordNewModalBody,
    modalCloseAria: messages.recordNewModalCloseAriaLabel,
    modalTextTitle: messages.recordNewTextOptionTitle,
    modalTextBody: messages.recordNewTextOptionBody,
    loadFailed: messages.recordLoadFailed,
    contentRequired: messages.recordContentRequired,
    saveFailed: messages.recordSaveFailed,
    reloadFailed: messages.recordReloadFailed,
    createdToast: messages.recordCreatedToast,
    updatedToast: messages.recordUpdatedToast,
    orderSaveFailed: messages.recordOrderSaveFailed,
    deletedToast: messages.recordDeletedToast,
    deleteFailed: messages.recordDeleteFailed,
    addAction: messages.recordAddActionLabel,
    addActionCompact: messages.recordAddActionCompactLabel,
    editorTitle: messages.recordEditorTitle,
    createPending: messages.recordEditorCreatePendingLabel,
    updatePending: messages.recordEditorUpdatePendingLabel,
    createLabel: messages.recordEditorCreateLabel,
    updateLabel: messages.recordEditorUpdateLabel,
    cancelLabel: messages.recordEditorCancelLabel,
    titleField: messages.recordTitleFieldLabel,
    titlePlaceholder: messages.recordTitlePlaceholder,
    contentField: messages.recordContentFieldLabel,
    contentPlaceholder: messages.recordContentPlaceholder,
    loading: messages.recordLoadingLabel,
    emptyEditorTitle: messages.recordEmptyEditorTitle,
    emptyEditorBody: messages.recordEmptyEditorBody,
  };
}

function RecordListPanel({
  records,
  selectedRecordId,
  draggedRecordId,
  onSelectRecord,
  onDragStart,
  onDrop,
  onDragEnd,
  onDeleteRecord,
  copy,
}) {
  const [openMenuRecordId, setOpenMenuRecordId] = useState("");
  const menuRootRef = useRef(null);

  useEffect(() => {
    if (!openMenuRecordId) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!menuRootRef.current?.contains(event.target)) {
        setOpenMenuRecordId("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [openMenuRecordId]);

  return (
    <section className="mt-6 w-full xl:mt-0 xl:sticky xl:top-[104px] xl:h-[calc(100vh-128px)] xl:w-[400px] xl:self-start">
      <div className="flex h-full min-h-[420px] flex-col rounded-[28px] border border-[#e8ddd0] bg-white p-5 shadow-[0_18px_45px_rgba(84,52,27,0.06)] sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f725d]">
            {copy.listTitle}
          </p>
          <p className="mt-2 text-sm text-[#6d584b]">
            {copy.listDescription}
          </p>
        </div>

        <div
          ref={menuRootRef}
          onClickCapture={(event) => {
            if (!event.target.closest("[data-record-menu-root='true']")) {
              setOpenMenuRecordId("");
            }
          }}
          className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain xl:pr-1 [scrollbar-gutter:stable]"
        >
          {records.length > 0 ? (
            records.map((record) => {
              const isActive = selectedRecordId === record.id;
              const title = record.title.trim() || copy.untitled;
              const notePreview = record.noteText.trim() || copy.emptyPreview;

              return (
                <div
                  key={record.id}
                  draggable
                  onDragStart={() => onDragStart(record.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    onDrop(record.id);
                  }}
                  onDragEnd={onDragEnd}
                  className={`group relative pl-4 ${
                    draggedRecordId === record.id ? "opacity-60" : ""
                  }`}
                >
                  {isActive ? (
                    <span className="absolute -left-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center text-sm text-[#2f221b]">
                      {"\u25B6"}
                    </span>
                  ) : null}

                  <div
                    className={`relative rounded-[22px] border px-4 py-4 transition ${
                      isActive
                        ? "border-[#2f221b] bg-[#f7efe6] shadow-[0_12px_24px_rgba(47,34,27,0.08)]"
                        : "border-[#eadfd3] bg-[#fcfaf7] hover:border-[#cdb8a6] hover:bg-[#fffdf9]"
                    }`}
                  >
                  <button
                    type="button"
                    onClick={() => onSelectRecord(record.id)}
                    className="block w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      <p
                        className={`min-w-0 flex-1 truncate text-sm font-semibold ${
                          record.title.trim() ? "text-[#241813]" : "text-[#9b8575]"
                        }`}
                      >
                        {title}
                      </p>
                      <span className="inline-flex shrink-0 items-center rounded-full border border-[#dccfbe] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f725d]">
                        {copy.typeText}
                      </span>
                    </div>

                    <div className="mt-3 flex items-start gap-3">
                      <p className="min-w-0 flex-1 line-clamp-1 text-sm leading-6 text-[#5f4b3f]">
                        {notePreview}
                      </p>
                    </div>
                  </button>

                  <div
                    data-record-menu-root="true"
                    className="absolute bottom-4 right-4"
                  >
                    <button
                      type="button"
                      aria-label={copy.menuAria}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuRecordId((current) =>
                          current === record.id ? "" : record.id,
                        );
                      }}
                      className={`inline-flex h-7 w-7 items-center justify-center text-[#6d584b] transition ${
                        openMenuRecordId === record.id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } cursor-pointer`}
                    >
                      {"\u22EE"}
                    </button>

                    {openMenuRecordId === record.id ? (
                      <div className="absolute bottom-[calc(100%+8px)] right-0 z-20 min-w-[112px] overflow-hidden rounded-2xl border border-[#dccfbe] bg-white shadow-[0_18px_40px_rgba(84,52,27,0.12)]">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenMenuRecordId("");
                            onDeleteRecord(record);
                          }}
                          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#6f3126] transition hover:bg-[#fff1ed]"
                        >
                          <span>{copy.deleteAction}</span>
                          <span>{">"}</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#d8c8b7] bg-[#fcfaf7] px-4 py-6 text-sm text-[#7a6456]">
              {copy.listEmpty}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RecordTypeModal({ onClose, onSelectText, copy }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(36,24,19,0.45)] px-4">
      <div className="w-full max-w-[420px] rounded-[28px] border border-[#e7dccf] bg-white p-6 shadow-[0_24px_60px_rgba(84,52,27,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
              {copy.modalEyebrow}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#241813]">
              {copy.modalTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">
              {copy.modalBody}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.modalCloseAria}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dccfbe] bg-[#fcfaf7] text-[#5f4b3f] transition hover:bg-[#f5ede4]"
          >
            X
          </button>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onSelectText}
            className="flex w-full items-center justify-between rounded-[22px] border border-[#dccfbe] bg-[#fcfaf7] px-5 py-4 text-left transition hover:border-[#cdb8a6] hover:bg-[#fffdf9]"
          >
            <span>
              <span className="block text-base font-semibold text-[#241813]">
                {copy.modalTextTitle}
              </span>
              <span className="mt-1 block text-sm text-[#6d584b]">
                {copy.modalTextBody}
              </span>
            </span>
            <span className="text-[#8f725d]">{">"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlaceRecordPrototypePage() {
  const params = useParams();
  const router = useRouter();
  const {
    accountNotice,
    authUser,
    cancelRemoveSavedPlace,
    closeSidebar,
    confirmRemoveSavedPlace,
    handleLogout,
    handleLogoutWithKakaoAccount,
    handleRemoveSavedPlace,
    isSidebarOpen,
    locale,
    messages,
    pendingSavedPlaceDelete,
    savedPlaces,
    setLocale,
    toggleSidebar,
    updateDisplayName,
    refreshAccountSummary,
  } = useAppShell();
  const recordCopy = useMemo(() => getRecordPageCopy(messages), [messages]);
  const [searchInput, setSearchInput] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [isRecordTypeModalOpen, setIsRecordTypeModalOpen] = useState(false);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [recordLoadError, setRecordLoadError] = useState("");
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [draggedRecordId, setDraggedRecordId] = useState("");
  const [toast, setToast] = useState(null);
  const placeId = Array.isArray(params?.placeId) ? params.placeId[0] : params?.placeId;
  const savedPlace = useMemo(() => {
    if (!placeId) {
      return null;
    }

    const matchedPlace = savedPlaces.find((place) => place.id === String(placeId)) ?? null;
    return normalizeSavedPlace(matchedPlace);
  }, [placeId, savedPlaces]);
  const effectiveSelectedRecordId =
    records.some((record) => record.id === selectedRecordId)
      ? selectedRecordId
      : records[0]?.id ?? "";
  const selectedRecord = useMemo(
    () => records.find((record) => record.id === effectiveSelectedRecordId) ?? null,
    [effectiveSelectedRecordId, records],
  );
  const isEditingPersistedRecord = Boolean(selectedRecord?.persistedId);

  useEffect(() => {
    if (!toast?.message) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [toast]);

  useEffect(() => {
    if (!savedPlace?.id || authUser?.mode === "guest") {
      setRecords([]);
      setSelectedRecordId("");
      setRecordLoadError("");
      return;
    }

    let cancelled = false;

    async function loadNotes() {
      setIsNotesLoading(true);
      setRecordLoadError("");

      try {
        const response = await fetch(
          `${RECORD_API_BASE_URL}/api/cafe-notes/${encodeURIComponent(savedPlace.id)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(await readErrorMessage(response, recordCopy.loadFailed));
        }

        const warningMessage = readWarningMessage(response);

        const payload = await response.json().catch(() => []);
        const nextRecords = Array.isArray(payload)
          ? payload.map(normalizeRecord).filter(Boolean)
          : [];

        if (cancelled) {
          return;
        }

        setRecords(nextRecords);
        setSelectedRecordId(nextRecords[0]?.id ?? "");
        setRecordLoadError("");
        if (warningMessage) {
          setToast({
            type: "error",
            message: warningMessage,
          });
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const nextMessage =
          error instanceof Error ? error.message : recordCopy.loadFailed;
        setRecords([]);
        setSelectedRecordId("");
        setRecordLoadError(nextMessage);
        setToast({
          type: "error",
          message: nextMessage,
        });
      } finally {
        if (!cancelled) {
          setIsNotesLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [authUser?.mode, recordCopy.loadFailed, savedPlace?.id]);

  const handleGoHome = (event) => {
    event?.preventDefault?.();
    router.push("/");
  };

  const handleAddRecord = () => {
    if (authUser?.mode === "guest") {
      return;
    }

    setIsRecordTypeModalOpen(true);
  };

  const handleCreateTextRecord = () => {
    const nextRecord = createDraftRecord(records.length + 1);

    setIsRecordTypeModalOpen(false);
    setRecords((current) => [...current, nextRecord]);
    setSelectedRecordId(nextRecord.id);
  };

  const getPlaceHref = (place) => {
    const targetId = place?.id ? String(place.id) : "";
    if (!targetId) {
      return "/";
    }

    if (authUser?.mode === "guest") {
      return `/places/${encodeURIComponent(targetId)}/sample`;
    }

    return `/places/${encodeURIComponent(targetId)}`;
  };

  const updateSelectedRecord = (field, value) => {
    if (!effectiveSelectedRecordId) {
      return;
    }

    setRecords((current) =>
      current.map((record) =>
        record.id === effectiveSelectedRecordId
          ? {
              ...record,
              [field]: value,
            }
          : record,
      ),
    );
  };

  const handleSaveRecord = async () => {
    if (!savedPlace?.id || !selectedRecord || authUser?.mode === "guest") {
      return;
    }

    const trimmedNoteText = selectedRecord.noteText.trim();
    if (!trimmedNoteText) {
      setToast({
        type: "error",
        message: recordCopy.contentRequired,
      });
      return;
    }

    setIsSavingRecord(true);

    try {
      const response = await fetch(
        `${RECORD_API_BASE_URL}/api/cafe-notes/${encodeURIComponent(savedPlace.id)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: selectedRecord.persistedId,
            title: selectedRecord.title.trim(),
            noteText: trimmedNoteText,
            displayOrder: selectedRecord.displayOrder,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, recordCopy.saveFailed));
      }

      const payload = await response.json().catch(() => null);
      const savedRecord = normalizeRecord(payload, selectedRecord.displayOrder);

      if (!savedRecord) {
        throw new Error(recordCopy.reloadFailed);
      }

      setRecords((current) =>
        current.map((record) =>
          record.id === selectedRecord.id || record.persistedId === savedRecord.persistedId
            ? savedRecord
            : record,
        ),
      );
      setSelectedRecordId(savedRecord.id);
      await refreshAccountSummary();
      setToast({
        type: "success",
        message: isEditingPersistedRecord ? recordCopy.updatedToast : recordCopy.createdToast,
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error ? error.message : recordCopy.saveFailed,
      });
    } finally {
      setIsSavingRecord(false);
    }
  };

  const persistRecordOrder = async (nextRecords) => {
    if (!savedPlace?.id || authUser?.mode === "guest") {
      return;
    }

    const persistedRecords = nextRecords.filter((record) => record.persistedId);

    try {
      const responses = await Promise.all(
        persistedRecords.map((record) =>
          fetch(`${RECORD_API_BASE_URL}/api/cafe-notes/${encodeURIComponent(savedPlace.id)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              id: record.persistedId,
              title: record.title.trim(),
              noteText: record.noteText.trim(),
              displayOrder: record.displayOrder,
            }),
          }),
        ),
      );

      const failedResponse = responses.find((response) => !response.ok);
      if (failedResponse) {
        throw new Error(await readErrorMessage(failedResponse, recordCopy.orderSaveFailed));
      }
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error ? error.message : recordCopy.orderSaveFailed,
      });
    }
  };

  const handleCancelDraft = () => {
    if (!selectedRecord || selectedRecord.persistedId) {
      return;
    }

    setRecords((current) =>
      reindexRecords(current.filter((record) => record.id !== selectedRecord.id)),
    );
  };

  const handleDeleteRecord = async (record) => {
    if (!record) {
      return;
    }

    if (!record.persistedId) {
      setRecords((current) =>
        reindexRecords(current.filter((item) => item.id !== record.id)),
      );
      if (selectedRecordId === record.id) {
        setSelectedRecordId("");
      }
      await refreshAccountSummary();
      setToast({
        type: "success",
        message: recordCopy.deletedToast,
      });
      return;
    }

    try {
      const response = await fetch(
        `${RECORD_API_BASE_URL}/api/cafe-notes/${encodeURIComponent(savedPlace.id)}/${record.persistedId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, recordCopy.deleteFailed));
      }

      setRecords((current) =>
        reindexRecords(current.filter((item) => item.id !== record.id)),
      );
      if (selectedRecordId === record.id) {
        setSelectedRecordId("");
      }
      await refreshAccountSummary();
      setToast({
        type: "success",
        message: recordCopy.deletedToast,
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error ? error.message : recordCopy.deleteFailed,
      });
    }
  };

  const handleRecordDragStart = (recordId) => {
    setDraggedRecordId(recordId);
  };

  const handleRecordDrop = (targetRecordId) => {
    if (!draggedRecordId || draggedRecordId === targetRecordId) {
      setDraggedRecordId("");
      return;
    }

    const nextRecords = moveRecord(records, draggedRecordId, targetRecordId);
    setRecords(nextRecords);
    setDraggedRecordId("");
    void persistRecordOrder(nextRecords);
  };

  const handleRecordDragEnd = () => {
    setDraggedRecordId("");
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#241813] xl:h-screen xl:overflow-hidden">
      <ActionToast toast={toast} />

      {isRecordTypeModalOpen ? (
        <RecordTypeModal
          onClose={() => setIsRecordTypeModalOpen(false)}
          onSelectText={handleCreateTextRecord}
          copy={recordCopy}
        />
      ) : null}

      <SavedPlaceDeleteConfirmModal
        pendingDelete={pendingSavedPlaceDelete}
        onCancel={cancelRemoveSavedPlace}
        onConfirm={confirmRemoveSavedPlace}
        messages={messages}
      />

      <HeaderBar
        searchInput={savedPlace?.name ?? searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleAddRecord}
        searchInputReadOnly
        actionButtonDisabled={authUser?.mode === "guest"}
        actionButtonLabel={recordCopy.addAction}
        actionButtonCompactLabel={recordCopy.addActionCompact}
        onHomeClick={handleGoHome}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        locale={locale}
        onLocaleChange={setLocale}
        onLogout={handleLogout}
        onLogoutWithKakaoAccount={handleLogoutWithKakaoAccount}
        authUser={authUser}
        accountNotice={accountNotice}
        onUpdateDisplayName={updateDisplayName}
        savedCafeCount={savedPlaces.length}
        recordCount={authUser?.recordCount ?? 0}
        messages={messages}
      />

      <Sidebar
        savedPlaces={savedPlaces}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onHomeClick={handleGoHome}
        onRemoveSavedPlace={handleRemoveSavedPlace}
        getPlaceHref={getPlaceHref}
        kakaoMapUrl="https://map.kakao.com/"
        lockedPlaceId={savedPlace?.id ?? ""}
        messages={messages}
      />

      <div className="mx-auto w-full max-w-[2200px] px-4 py-6 sm:px-6 xl:h-[calc(100vh-88px)] xl:px-8 xl:py-4">
        <main className="relative flex min-w-0 gap-6 xl:h-full xl:overflow-hidden">
          <DesktopSidebar
            savedPlaces={savedPlaces}
            isOpen={isSidebarOpen}
            onHomeClick={handleGoHome}
            onRemoveSavedPlace={handleRemoveSavedPlace}
            getPlaceHref={getPlaceHref}
            kakaoMapUrl="https://map.kakao.com/"
            lockedPlaceId={savedPlace?.id ?? ""}
            messages={messages}
          />

          <div className="min-w-0 flex-1 xl:flex xl:h-full xl:min-h-0 xl:gap-6 xl:overflow-hidden">
            <section className="min-w-0 flex-1 rounded-[32px] border border-[#e7dccf] bg-white p-6 shadow-[0_24px_60px_rgba(84,52,27,0.08)] sm:p-8 xl:min-h-0 xl:overflow-auto">
              {savedPlace ? (
                <div className="space-y-6">
                  <div className="rounded-[28px] bg-[linear-gradient(180deg,#f9f1e7_0%,#fdf9f4_100%)] px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
                      {messages.placeDetailCardLabel}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold text-[#241813]">
                      {savedPlace.name}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">
                      {savedPlace.roadAddress || savedPlace.address || messages.noAddress}
                    </p>
                    {savedPlace.phone ? (
                      <p className="mt-2 text-sm text-[#7a6456]">{savedPlace.phone}</p>
                    ) : null}
                  </div>

                  {recordLoadError ? (
                    <section className="rounded-[24px] border border-[#e7c9c2] bg-[#fff1ed] px-5 py-4 text-sm text-[#6f3126] shadow-[0_12px_30px_rgba(111,49,38,0.08)]">
                      {recordLoadError}
                    </section>
                  ) : null}

                  {isNotesLoading ? (
                    <section className="rounded-[28px] border border-[#eadfd3] bg-[#fcfaf7] p-5 text-sm text-[#6d584b]">
                      {recordCopy.loading}
                    </section>
                  ) : selectedRecord ? (
                    <section className="rounded-[28px] border border-[#eadfd3] bg-white p-5 shadow-[0_12px_30px_rgba(84,52,27,0.05)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
                          {recordCopy.editorTitle}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveRecord}
                            disabled={isSavingRecord}
                            className={`rounded-full px-4 py-2 text-sm font-medium ${
                              isSavingRecord
                                ? "cursor-not-allowed bg-[#b8a79b] text-white/80"
                                : "bg-[#2f221b] text-white"
                            }`}
                          >
                            {isSavingRecord
                              ? isEditingPersistedRecord
                                ? recordCopy.updatePending
                                : recordCopy.createPending
                              : isEditingPersistedRecord
                                ? recordCopy.updateLabel
                                : recordCopy.createLabel}
                          </button>
                          {!isEditingPersistedRecord ? (
                            <button
                              type="button"
                              onClick={handleCancelDraft}
                              disabled={isSavingRecord}
                              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                                isSavingRecord
                                  ? "cursor-not-allowed border-[#ddd1c5] bg-white text-[#b8a79b]"
                                  : "border-[#dccfbe] bg-white text-[#5f4b3f] hover:bg-[#fcfaf7]"
                              }`}
                            >
                              {recordCopy.cancelLabel}
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <label className="space-y-2 text-sm text-[#5f4b3f]">
                          <span className="font-medium text-[#352720]">{recordCopy.titleField}</span>
                          <input
                            type="text"
                            value={selectedRecord.title}
                            onChange={(event) =>
                              updateSelectedRecord("title", event.target.value)
                            }
                            placeholder={recordCopy.titlePlaceholder}
                            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
                          />
                        </label>
                        <label className="space-y-2 text-sm text-[#5f4b3f]">
                          <span className="font-medium text-[#352720]">{recordCopy.contentField}</span>
                          <textarea
                            value={selectedRecord.noteText}
                            onChange={(event) =>
                              updateSelectedRecord("noteText", event.target.value)
                            }
                            rows={7}
                            placeholder={recordCopy.contentPlaceholder}
                            className="w-full rounded-[22px] border border-[#dccfbe] bg-[#fcfaf7] px-4 py-3 text-[#352720] outline-none placeholder:text-[#a38b79]"
                          />
                        </label>
                      </div>
                    </section>
                  ) : (
                    <section className="rounded-[28px] border border-dashed border-[#d8c8b7] bg-[#fcfaf7] p-5">
                      <p className="text-base font-semibold text-[#352720]">
                        {recordCopy.emptyEditorTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#7a6456]">
                        {recordCopy.emptyEditorBody}
                      </p>
                    </section>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d8c8b7] bg-[#fcfaf7] px-4 py-8 text-sm text-[#7a6456]">
                  <p className="font-medium text-[#352720]">{messages.placeDetailMissingTitle}</p>
                  <p className="mt-2">{messages.placeDetailMissingBody}</p>
                </div>
              )}
            </section>

            {savedPlace ? (
              <RecordListPanel
                records={records}
                selectedRecordId={effectiveSelectedRecordId}
                draggedRecordId={draggedRecordId}
                onSelectRecord={setSelectedRecordId}
                onDragStart={handleRecordDragStart}
                onDrop={handleRecordDrop}
                onDragEnd={handleRecordDragEnd}
                onDeleteRecord={handleDeleteRecord}
                copy={recordCopy}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
