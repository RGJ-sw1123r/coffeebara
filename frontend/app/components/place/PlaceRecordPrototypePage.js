"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

import { useAppShell } from "../app/AppShellContext";
import HeaderBar from "../home/HeaderBar";
import { ActionToast } from "../home/StatusNotice";
import {
  DesktopSidebar,
  SavedPlaceDeleteConfirmModal,
  Sidebar,
} from "../home/Sidebar";
import {
  ACTIVE_RECORD_TYPE_CODES,
  createDraftRecord,
  getRecordTypeConfig,
  RECORD_TYPE_BEAN,
  RECORD_TYPE_TEXT,
} from "@/app/lib/record-types";

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
    id: `record-${persistedId}`,
    persistedId,
    localPersisted: false,
    recordType:
      record.recordType === RECORD_TYPE_BEAN ? RECORD_TYPE_BEAN : RECORD_TYPE_TEXT,
    displayOrder:
      typeof record.displayOrder === "number" && Number.isFinite(record.displayOrder)
        ? record.displayOrder
        : Number(record.displayOrder ?? index) || index,
    title: typeof record.title === "string" ? record.title : "",
    noteText: typeof record.noteText === "string" ? record.noteText : "",
    beanName: typeof record.beanName === "string" ? record.beanName : "",
    originCountry: typeof record.originCountry === "string" ? record.originCountry : "",
    originRegion: typeof record.originRegion === "string" ? record.originRegion : "",
    beanVariety: typeof record.beanVariety === "string" ? record.beanVariety : "",
    processType: typeof record.processType === "string" ? record.processType : "",
    roastLevel: typeof record.roastLevel === "string" ? record.roastLevel : "",
    roastDate: typeof record.roastDate === "string" ? record.roastDate : "",
    altitudeMeters:
      typeof record.altitudeMeters === "number" && Number.isFinite(record.altitudeMeters)
        ? String(record.altitudeMeters)
        : "",
    tastingNotes: typeof record.tastingNotes === "string" ? record.tastingNotes : "",
    purchaseDate: typeof record.purchaseDate === "string" ? record.purchaseDate : "",
    purchasePrice:
      typeof record.purchasePrice === "number" && Number.isFinite(record.purchasePrice)
        ? String(record.purchasePrice)
        : "",
    quantityGrams:
      typeof record.quantityGrams === "number" && Number.isFinite(record.quantityGrams)
        ? String(record.quantityGrams)
        : "",
    memo: typeof record.memo === "string" ? record.memo : "",
    attachments: Array.isArray(record.attachments) ? record.attachments : [],
    pendingLocalImages: [],
    pendingDeletedAttachmentIds: [],
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
    return "Image attachment tables are not ready yet, so image information could not be loaded.";
  }

  return "";
}

function buildRecordPayload(record) {
  const basePayload = {
    id: record.persistedId,
    recordType: record.recordType,
    displayOrder: record.displayOrder,
  };

  if (record.recordType === RECORD_TYPE_BEAN) {
    return {
      ...basePayload,
      beanName: record.beanName.trim(),
      originCountry: record.originCountry.trim(),
      originRegion: record.originRegion.trim(),
      beanVariety: record.beanVariety.trim(),
      processType: record.processType.trim(),
      roastLevel: record.roastLevel.trim(),
      roastDate: record.roastDate.trim(),
      altitudeMeters: record.altitudeMeters.trim(),
      tastingNotes: record.tastingNotes.trim(),
      purchaseDate: record.purchaseDate.trim(),
      purchasePrice: record.purchasePrice.trim(),
      quantityGrams: record.quantityGrams.trim(),
      memo: record.memo.trim(),
    };
  }

  return {
    ...basePayload,
    title: record.title.trim(),
    noteText: record.noteText.trim(),
  };
}

function createPendingLocalImage(file, index) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    file,
    previewUrl: URL.createObjectURL(file),
    name: file.name || "image",
    size: Number(file.size) || 0,
  };
}

function revokePendingLocalImages(images) {
  for (const image of images || []) {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl);
    }
  }
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.round(bytes / 1024)} KB`;
}

function isInteractiveCardElement(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      "button, input, textarea, select, label, a, [role='button'], [data-card-interactive='true']",
    ),
  );
}

function buildAttachmentImageUrl(recordId, attachmentId) {
  if (!recordId || !attachmentId) {
    return "";
  }

  return `/api/records/${encodeURIComponent(recordId)}/attachments/${encodeURIComponent(attachmentId)}`;
}

function isRecordSaved(record) {
  return Boolean(record?.persistedId || record?.localPersisted);
}

function getBeanRecordTitle(record, copy) {
  return record?.beanName?.trim() || copy.beanUntitled;
}

function getBeanRecordPreview(record, copy) {
  const previewParts = [
    record?.purchaseDate?.trim(),
    record?.originCountry?.trim(),
    record?.originRegion?.trim(),
    record?.tastingNotes?.trim(),
    record?.memo?.trim(),
  ].filter(Boolean);

  return previewParts[0] || copy.beanEmptyPreview;
}

function getRecordListTitle(record, copy) {
  if (record?.recordType === RECORD_TYPE_BEAN) {
    return getBeanRecordTitle(record, copy);
  }

  return record?.title?.trim() || copy.untitled;
}

function getRecordListPreview(record, copy) {
  if (record?.recordType === RECORD_TYPE_BEAN) {
    return getBeanRecordPreview(record, copy);
  }

  return record?.noteText?.trim() || copy.emptyPreview;
}

function getRecordTypeLabel(record, copy) {
  const config = getRecordTypeConfig(record?.recordType);
  return copy.recordTypeLabels[config.code] ?? config.code;
}

function getRecordPageCopy(messages) {
  const recordTypeLabels = Object.fromEntries(
    ACTIVE_RECORD_TYPE_CODES.map((recordType) => {
      const config = getRecordTypeConfig(recordType);
      return [recordType, messages[config.listLabelMessageKey] ?? config.code];
    }),
  );

  return {
    listTitle: messages.recordListTitle,
    listDescription: messages.recordListDescription,
    untitled: messages.recordUntitledPlaceholder,
    textUntitled: messages.recordTextUntitledPlaceholder ?? "Text record",
    emptyPreview: messages.recordEmptyPreview,
    beanUntitled: messages.recordBeanUntitledPlaceholder ?? "Bean record",
    beanEmptyPreview: messages.recordBeanEmptyPreview ?? "No bean details have been entered yet.",
    recordTypeLabels,
    menuAria: messages.recordMenuAriaLabel,
    deleteAction: messages.recordDeleteActionLabel,
    listEmpty: messages.recordEmptyState,
    modalEyebrow: messages.recordNewModalEyebrow,
    modalTitle: messages.recordNewModalTitle,
    modalBody: messages.recordNewModalBody,
    modalCloseAria: messages.recordNewModalCloseAriaLabel,
    modalOptions: ACTIVE_RECORD_TYPE_CODES.map((recordType) => {
      const config = getRecordTypeConfig(recordType);

      return {
        recordType,
        title: messages[config.modalTitleMessageKey] ?? recordType,
        body: messages[config.modalBodyMessageKey] ?? "",
      };
    }),
    loadFailed: messages.recordLoadFailed,
    titleRequired: messages.recordTitleRequired ?? "Enter a record title before saving.",
    contentRequired: messages.recordContentRequired,
    beanIdentityRequired:
      messages.recordBeanIdentityRequired ?? "Enter the bean name before saving.",
    beanPurchaseDateRequired:
      messages.recordBeanPurchaseDateRequired ?? "Select the purchase date before saving.",
    saveFailed: messages.recordSaveFailed,
    reloadFailed: messages.recordReloadFailed,
    createdToast: messages.recordCreatedToast,
    updatedToast: messages.recordUpdatedToast,
    beanSavedToast: messages.recordBeanSavedToast ?? "Bean record shell saved locally.",
    orderSaveFailed: messages.recordOrderSaveFailed,
    deletedToast: messages.recordDeletedToast,
    deleteFailed: messages.recordDeleteFailed,
    deleteModalEyebrow: messages.recordDeleteModalEyebrow ?? "Delete Record",
    deleteModalTitle: messages.recordDeleteModalTitle ?? "Delete this record?",
    deleteModalBody:
      messages.recordDeleteModalBody ??
      "This action removes the current card. Unsaved drafts will be discarded immediately.",
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
    beanSectionIdentity: messages.recordBeanSectionIdentity ?? "Bean identity",
    beanSectionPurchase: messages.recordBeanSectionPurchase ?? "Purchase context",
    beanSectionTasting: messages.recordBeanSectionTasting ?? "Package tasting notes",
    beanSectionMemo: messages.recordBeanSectionMemo ?? "Memo",
    beanSectionImages: messages.recordBeanSectionImages ?? "Images",
    beanFieldName: messages.recordBeanFieldName ?? "Bean name",
    beanFieldOriginCountry: messages.recordBeanFieldOriginCountry ?? "Origin country",
    beanFieldOriginRegion: messages.recordBeanFieldOriginRegion ?? "Origin region",
    beanFieldVariety: messages.recordBeanFieldVariety ?? "Bean variety",
    beanFieldProcessType: messages.recordBeanFieldProcessType ?? "Process type",
    beanFieldRoastLevel: messages.recordBeanFieldRoastLevel ?? "Roast level",
    beanFieldRoastDate: messages.recordBeanFieldRoastDate ?? "Roast date",
    beanFieldAltitudeMeters: messages.recordBeanFieldAltitudeMeters ?? "Altitude (m)",
    beanFieldTastingNotes: messages.recordBeanFieldTastingNotes ?? "Tasting notes",
    beanFieldPurchaseDate: messages.recordBeanFieldPurchaseDate ?? "Purchase date",
    beanFieldPurchasePrice: messages.recordBeanFieldPurchasePrice ?? "Purchase price",
    beanFieldQuantityGrams: messages.recordBeanFieldQuantityGrams ?? "Quantity (g)",
    beanFieldMemo: messages.recordBeanFieldMemo ?? "Memo",
    beanPlaceholderName: messages.recordBeanPlaceholderName ?? "Enter the bean name",
    beanPlaceholderOriginCountry:
      messages.recordBeanPlaceholderOriginCountry ?? "e.g. Ethiopia",
    beanPlaceholderOriginRegion:
      messages.recordBeanPlaceholderOriginRegion ?? "e.g. Yirgacheffe",
    beanPlaceholderVariety: messages.recordBeanPlaceholderVariety ?? "e.g. Heirloom",
    beanPlaceholderProcessType: messages.recordBeanPlaceholderProcessType ?? "e.g. Washed",
    beanPlaceholderRoastLevel: messages.recordBeanPlaceholderRoastLevel ?? "e.g. Light",
    beanPlaceholderAltitudeMeters:
      messages.recordBeanPlaceholderAltitudeMeters ?? "e.g. 1900",
    beanPlaceholderTastingNotes:
      messages.recordBeanPlaceholderTastingNotes ??
      "Notes shown by the cafe or on the package",
    beanPlaceholderPurchasePrice:
      messages.recordBeanPlaceholderPurchasePrice ?? "e.g. 18000",
    beanPlaceholderQuantityGrams:
      messages.recordBeanPlaceholderQuantityGrams ?? "e.g. 200",
    beanPlaceholderMemo:
      messages.recordBeanPlaceholderMemo ??
      "Leave a memo about why you bought this bean",
    beanAttachmentPlaceholderTitle:
      messages.recordBeanAttachmentPlaceholderTitle ?? "Image attachment area",
    beanAttachmentPlaceholderBody:
      messages.recordBeanAttachmentPlaceholderBody ??
      "Upload integration is not connected yet. This section reserves the future image flow.",
    beanImageDropzoneHint:
      messages.recordBeanImageDropzoneHint ??
      "Drag images here, or click to choose files from your device.",
    beanImageBrowseLabel:
      messages.recordBeanImageBrowseLabel ?? "Choose images",
    beanImagePendingLabel:
      messages.recordBeanImagePendingLabel ?? "Selected images",
    beanImageAttachedLabel:
      messages.recordBeanImageAttachedLabel ?? "Attached images",
    beanImagePendingDeleteLabel:
      messages.recordBeanImagePendingDeleteLabel ?? "Marked for deletion",
    beanImageRemoveLabel:
      messages.recordBeanImageRemoveLabel ?? "Remove",
    beanImageRestoreLabel:
      messages.recordBeanImageRestoreLabel ?? "Restore",
    beanImageLimitHint: messages.recordBeanImageLimitHint ?? "Up to {count} images can be staged.",
    beanImageSaveHint:
      messages.recordBeanImageSaveHint ?? "Save this bean record before uploading staged images.",
    beanImageDeleteSaveHint:
      messages.recordBeanImageDeleteSaveHint ?? "Image deletions are applied when you save this record.",
    attachmentUploadSucceeded:
      messages.recordAttachmentUploadSucceeded ?? "Record saved and images uploaded.",
    attachmentUploadFailed:
      messages.recordAttachmentUploadFailed ?? "The record was saved, but image upload failed.",
    attachmentDeleteSucceeded:
      messages.recordAttachmentDeleteSucceeded ?? "Image deleted.",
    attachmentDeleteFailed:
      messages.recordAttachmentDeleteFailed ?? "Failed to delete the image.",
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
          <p className="mt-2 text-sm text-[#6d584b]">{copy.listDescription}</p>
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
              const title = getRecordListTitle(record, copy);
              const notePreview = getRecordListPreview(record, copy);
              const isPlaceholderTitle =
                title === copy.untitled || title === copy.beanUntitled;

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
                            isPlaceholderTitle ? "text-[#9b8575]" : "text-[#241813]"
                          }`}
                        >
                          {title}
                        </p>
                        <span className="inline-flex shrink-0 items-center rounded-full border border-[#dccfbe] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f725d]">
                          {getRecordTypeLabel(record, copy)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-start gap-3">
                        <p className="min-w-0 flex-1 line-clamp-1 text-sm leading-6 text-[#5f4b3f]">
                          {notePreview}
                        </p>
                      </div>
                    </button>

                    <div data-record-menu-root="true" className="absolute bottom-4 right-4">
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

function RecordTypeModal({ onClose, onSelectRecordType, copy }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(36,24,19,0.45)] px-4">
      <div className="w-full max-w-[420px] rounded-[28px] border border-[#e7dccf] bg-white p-6 shadow-[0_24px_60px_rgba(84,52,27,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
              {copy.modalEyebrow}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#241813]">{copy.modalTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">{copy.modalBody}</p>
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

        <div className="mt-6 space-y-3">
          {copy.modalOptions.map((option) => (
            <button
              key={option.recordType}
              type="button"
              onClick={() => onSelectRecordType(option.recordType)}
              className="flex w-full items-center justify-between rounded-[22px] border border-[#dccfbe] bg-[#fcfaf7] px-5 py-4 text-left transition hover:border-[#cdb8a6] hover:bg-[#fffdf9]"
            >
              <span>
                <span className="block text-base font-semibold text-[#241813]">
                  {option.title}
                </span>
                <span className="mt-1 block text-sm text-[#6d584b]">{option.body}</span>
              </span>
              <span className="text-[#8f725d]">{">"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecordDeleteConfirmModal({ pendingDeleteRecord, onCancel, onConfirm, copy }) {
  if (!pendingDeleteRecord?.id) {
    return null;
  }

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(36,24,19,0.45)] px-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[460px] rounded-[30px] border border-[#e7dccf] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf5ee_100%)] p-6 shadow-[0_28px_70px_rgba(84,52,27,0.2)] sm:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
          {copy.deleteModalEyebrow}
        </p>
        <h2 className="mt-3 text-[22px] font-semibold leading-8 text-[#241813]">
          {copy.deleteModalTitle}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#5f4b3f]">{copy.deleteModalBody}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#6f3126] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5d281f]"
          >
            {copy.deleteAction}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#dccfbe] bg-white px-5 py-2.5 text-sm font-medium text-[#5f4b3f] transition hover:bg-[#fcfaf7]"
          >
            {copy.cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function BeanField({ label, children }) {
  return (
    <label className="space-y-2 text-sm text-[#5f4b3f]">
      <span className="font-medium text-[#352720]">{label}</span>
      {children}
    </label>
  );
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-1 text-[#c84c3a]">
        *
      </span>
      <span className="sr-only">required</span>
    </>
  );
}

function BeanImageDropzone({
  selectedRecord,
  updateSelectedRecord,
  onToggleAttachmentDeletion,
  copy,
}) {
  const beanConfig = getRecordTypeConfig(RECORD_TYPE_BEAN);
  const maxLocalImageCount = beanConfig.maxLocalImageCount ?? 0;
  const pendingLocalImages = selectedRecord.pendingLocalImages || [];
  const persistedAttachments = selectedRecord.attachments || [];
  const pendingDeletedAttachmentIds = selectedRecord.pendingDeletedAttachmentIds || [];
  const visiblePersistedAttachments = persistedAttachments.filter(
    (attachment) => !pendingDeletedAttachmentIds.includes(attachment.attachmentId),
  );
  const pendingDeletedAttachments = persistedAttachments.filter((attachment) =>
    pendingDeletedAttachmentIds.includes(attachment.attachmentId),
  );
  const remainingCount = Math.max(
    maxLocalImageCount - visiblePersistedAttachments.length - pendingLocalImages.length,
    0,
  );
  const imageLimitHint = copy.beanImageLimitHint.replace(
    "{count}",
    String(maxLocalImageCount),
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
    noClick: remainingCount === 0,
    noKeyboard: remainingCount === 0,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length || remainingCount === 0) {
        return;
      }

      const nextImages = acceptedFiles
        .slice(0, remainingCount)
        .map((file, index) => createPendingLocalImage(file, index));

      if (!nextImages.length) {
        return;
      }

      updateSelectedRecord("pendingLocalImages", [
        ...pendingLocalImages,
        ...nextImages,
      ]);
    },
  });

  const handleRemoveImage = (imageId) => {
    const targetImage = pendingLocalImages.find((image) => image.id === imageId);
    if (targetImage) {
      revokePendingLocalImages([targetImage]);
    }

    updateSelectedRecord(
      "pendingLocalImages",
      pendingLocalImages.filter((image) => image.id !== imageId),
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`rounded-[24px] border border-dashed px-5 py-6 transition ${
          isDragActive
            ? "border-[#8f725d] bg-[#f8f1e8]"
            : "border-[#d8c8b7] bg-[#fcfaf7]"
        } ${remainingCount === 0 ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <input {...getInputProps()} />
        <p className="text-sm leading-6 text-[#7a6456]">{copy.beanImageDropzoneHint}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#dccfbe] bg-white px-4 py-2 text-sm font-medium text-[#5f4b3f]">
            {copy.beanImageBrowseLabel}
          </span>
          <span className="text-xs text-[#8b7464]">{imageLimitHint}</span>
        </div>
      </div>

      {pendingLocalImages.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-[#352720]">
            {copy.beanImagePendingLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pendingLocalImages.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[22px] border border-[#eadfd3] bg-white"
              >
                <div className="relative aspect-[4/3] bg-[#f4ece3]">
                  <Image
                    src={image.previewUrl}
                    alt={image.name}
                    fill
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2 px-4 py-3">
                  <p className="truncate text-sm font-medium text-[#352720]">{image.name}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-[#8b7464]">{formatFileSize(image.size)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="text-xs font-medium text-[#8b3f32] hover:text-[#6f3126]"
                    >
                      {copy.beanImageRemoveLabel}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!selectedRecord.persistedId && pendingLocalImages.length > 0 ? (
        <p className="text-xs text-[#8b7464]">{copy.beanImageSaveHint}</p>
      ) : null}

      {visiblePersistedAttachments.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-[#352720]">
            {copy.beanImageAttachedLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visiblePersistedAttachments.map((attachment) => {
              const imageUrl = buildAttachmentImageUrl(
                selectedRecord.persistedId,
                attachment.attachmentId,
              );

              return (
                <div
                  key={attachment.attachmentId}
                  className="overflow-hidden rounded-[22px] border border-[#eadfd3] bg-white"
                >
                  <div className="relative aspect-[4/3] bg-[#f4ece3]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={attachment.originalFileName || "bean image"}
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2 px-4 py-3">
                    <p className="truncate text-sm font-medium text-[#352720]">
                      {attachment.originalFileName}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#8b7464]">
                        {formatFileSize(attachment.fileSize)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleAttachmentDeletion?.(attachment.attachmentId)}
                        className="rounded-full border border-[#ead6d0] bg-[#fff4f1] px-3 py-1.5 text-xs font-medium text-[#8b3f32] transition hover:bg-[#ffeae5] hover:text-[#6f3126]"
                      >
                        {copy.beanImageRemoveLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {pendingDeletedAttachments.length > 0 ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-[#352720]">
            {copy.beanImagePendingDeleteLabel}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pendingDeletedAttachments.map((attachment) => {
              const imageUrl = buildAttachmentImageUrl(
                selectedRecord.persistedId,
                attachment.attachmentId,
              );

              return (
                <div
                  key={attachment.attachmentId}
                  className="overflow-hidden rounded-[22px] border border-[#eadfd3] bg-white opacity-60"
                >
                  <div className="relative aspect-[4/3] bg-[#f4ece3]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={attachment.originalFileName || "bean image"}
                        fill
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2 px-4 py-3">
                    <p className="truncate text-sm font-medium text-[#352720]">
                      {attachment.originalFileName}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#8b7464]">
                        {formatFileSize(attachment.fileSize)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleAttachmentDeletion?.(attachment.attachmentId)}
                        className="rounded-full border border-[#dccfbe] bg-white px-3 py-1.5 text-xs font-medium text-[#5f4b3f] transition hover:bg-[#fcfaf7] hover:text-[#352720]"
                      >
                        {copy.beanImageRestoreLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-[#8b7464]">{copy.beanImageDeleteSaveHint}</p>
        </div>
      ) : null}
    </div>
  );
}

function BeanRecordEditor({
  selectedRecord,
  updateSelectedRecord,
  onToggleAttachmentDeletion,
  copy,
}) {
  return (
    <div className="mt-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
            {copy.beanSectionIdentity}
          </p>
        </div>

        <BeanField
          label={
            <>
              {copy.beanFieldName}
              <RequiredMark />
            </>
          }
        >
          <input
            type="text"
            value={selectedRecord.beanName}
            onChange={(event) => updateSelectedRecord("beanName", event.target.value)}
            placeholder={copy.beanPlaceholderName}
            required
            aria-required="true"
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldOriginCountry}>
          <input
            type="text"
            value={selectedRecord.originCountry}
            onChange={(event) => updateSelectedRecord("originCountry", event.target.value)}
            placeholder={copy.beanPlaceholderOriginCountry}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldOriginRegion}>
          <input
            type="text"
            value={selectedRecord.originRegion}
            onChange={(event) => updateSelectedRecord("originRegion", event.target.value)}
            placeholder={copy.beanPlaceholderOriginRegion}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldVariety}>
          <input
            type="text"
            value={selectedRecord.beanVariety}
            onChange={(event) => updateSelectedRecord("beanVariety", event.target.value)}
            placeholder={copy.beanPlaceholderVariety}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldProcessType}>
          <input
            type="text"
            value={selectedRecord.processType}
            onChange={(event) => updateSelectedRecord("processType", event.target.value)}
            placeholder={copy.beanPlaceholderProcessType}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldRoastLevel}>
          <input
            type="text"
            value={selectedRecord.roastLevel}
            onChange={(event) => updateSelectedRecord("roastLevel", event.target.value)}
            placeholder={copy.beanPlaceholderRoastLevel}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldRoastDate}>
          <input
            type="date"
            value={selectedRecord.roastDate}
            onChange={(event) => updateSelectedRecord("roastDate", event.target.value)}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none"
          />
        </BeanField>

        <BeanField label={copy.beanFieldAltitudeMeters}>
          <input
            type="number"
            min="0"
            value={selectedRecord.altitudeMeters}
            onChange={(event) => updateSelectedRecord("altitudeMeters", event.target.value)}
            placeholder={copy.beanPlaceholderAltitudeMeters}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
            {copy.beanSectionPurchase}
          </p>
        </div>

        <BeanField
          label={
            <>
              {copy.beanFieldPurchaseDate}
              <RequiredMark />
            </>
          }
        >
          <input
            type="date"
            value={selectedRecord.purchaseDate}
            onChange={(event) => updateSelectedRecord("purchaseDate", event.target.value)}
            required
            aria-required="true"
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none"
          />
        </BeanField>

        <BeanField label={copy.beanFieldPurchasePrice}>
          <input
            type="number"
            min="0"
            value={selectedRecord.purchasePrice}
            onChange={(event) => updateSelectedRecord("purchasePrice", event.target.value)}
            placeholder={copy.beanPlaceholderPurchasePrice}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>

        <BeanField label={copy.beanFieldQuantityGrams}>
          <input
            type="number"
            min="0"
            value={selectedRecord.quantityGrams}
            onChange={(event) => updateSelectedRecord("quantityGrams", event.target.value)}
            placeholder={copy.beanPlaceholderQuantityGrams}
            className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
          />
        </BeanField>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
          {copy.beanSectionTasting}
        </p>
        <input
          type="text"
          value={selectedRecord.tastingNotes}
          onChange={(event) => updateSelectedRecord("tastingNotes", event.target.value)}
          placeholder={copy.beanPlaceholderTastingNotes}
          className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
          {copy.beanSectionMemo}
        </p>
        <textarea
          value={selectedRecord.memo}
          onChange={(event) => updateSelectedRecord("memo", event.target.value)}
          rows={5}
          placeholder={copy.beanPlaceholderMemo}
          className="w-full rounded-[22px] border border-[#dccfbe] bg-[#fcfaf7] px-4 py-3 text-[#352720] outline-none placeholder:text-[#a38b79]"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f725d]">
          {copy.beanSectionImages}
        </p>
        <BeanImageDropzone
          selectedRecord={selectedRecord}
          updateSelectedRecord={updateSelectedRecord}
          onToggleAttachmentDeletion={onToggleAttachmentDeletion}
          copy={copy}
        />
      </div>
    </div>
  );
}

function TextRecordEditor({ selectedRecord, updateSelectedRecord, copy }) {
  return (
    <div className="mt-4 grid gap-4">
      <label className="space-y-2 text-sm text-[#5f4b3f]">
        <span className="font-medium text-[#352720]">
          {copy.titleField}
          <RequiredMark />
        </span>
        <input
          type="text"
          value={selectedRecord.title}
          onChange={(event) => updateSelectedRecord("title", event.target.value)}
          placeholder={copy.titlePlaceholder}
          required
          aria-required="true"
          className="h-11 w-full rounded-2xl border border-[#dccfbe] bg-[#fcfaf7] px-4 text-[#352720] outline-none placeholder:text-[#a38b79]"
        />
      </label>
      <label className="space-y-2 text-sm text-[#5f4b3f]">
        <span className="font-medium text-[#352720]">
          {copy.contentField}
          <RequiredMark />
        </span>
        <textarea
          value={selectedRecord.noteText}
          onChange={(event) => updateSelectedRecord("noteText", event.target.value)}
          rows={7}
          placeholder={copy.contentPlaceholder}
          required
          aria-required="true"
          className="w-full rounded-[22px] border border-[#dccfbe] bg-[#fcfaf7] px-4 py-3 text-[#352720] outline-none placeholder:text-[#a38b79]"
        />
      </label>
    </div>
  );
}

function RecordEditorCard({
  record,
  isActive,
  isSavingRecord,
  copy,
  onActivate,
  onSaveRecord,
  onCancelDraft,
  onDeleteRecord,
  onToggleAttachmentDeletion,
  updateSelectedRecord,
  cardRef,
}) {
  const isEditingPersistedRecord = isRecordSaved(record);
  const title = getRecordListTitle(record, copy);
  const preview = getRecordListPreview(record, copy);
  const isPlaceholderTitle = title === copy.untitled || title === copy.beanUntitled;
  const isBeanRecord = record.recordType === RECORD_TYPE_BEAN;
  const shouldShowBeanPreview = isBeanRecord && preview !== copy.beanEmptyPreview;
  const shouldShowActions = isActive;
  const shouldShowSaveAction = shouldShowActions;
  const shouldShowCancelAction = shouldShowActions && !isEditingPersistedRecord;
  const shouldShowDeleteAction = shouldShowActions && isEditingPersistedRecord;

  return (
    <section
      ref={cardRef}
      onClick={(event) => {
        if (isInteractiveCardElement(event.target)) {
          return;
        }

        onActivate();
      }}
      className={`rounded-[28px] border bg-white p-5 shadow-[0_12px_30px_rgba(84,52,27,0.05)] transition sm:p-6 ${
        isActive
          ? "border-[#2f221b] ring-1 ring-[#2f221b]/10"
          : "cursor-pointer border-[#eadfd3]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {isBeanRecord ? (
          <button type="button" onClick={onActivate} className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex shrink-0 items-center rounded-full border border-[#dccfbe] bg-[#fcfaf7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f725d]">
                {getRecordTypeLabel(record, copy)}
              </span>
              <p
                className={`min-w-0 flex-1 text-base font-semibold ${
                  isPlaceholderTitle ? "text-[#9b8575]" : "text-[#241813]"
                }`}
              >
                {title}
              </p>
            </div>
            {shouldShowBeanPreview ? (
              <p className="mt-2 text-sm leading-6 text-[#6d584b]">{preview}</p>
            ) : null}
          </button>
        ) : (
          <button type="button" onClick={onActivate} className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex shrink-0 items-center rounded-full border border-[#dccfbe] bg-[#fcfaf7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f725d]">
                {getRecordTypeLabel(record, copy)}
              </span>
              <p className="min-w-0 flex-1 text-base font-semibold text-[#241813]">
                {copy.textUntitled}
              </p>
            </div>
          </button>
        )}

        {shouldShowActions ? (
          <div className="flex flex-wrap items-center gap-2">
            {shouldShowSaveAction ? (
              <button
                type="button"
                onClick={onSaveRecord}
                disabled={isSavingRecord}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  isSavingRecord
                    ? "cursor-not-allowed bg-[#b8a79b] text-white/80"
                    : "bg-[#2f221b] text-white"
                }`}
              >
                {isSavingRecord
                  ? isEditingPersistedRecord
                    ? copy.updatePending
                    : copy.createPending
                  : isEditingPersistedRecord
                    ? copy.updateLabel
                    : copy.createLabel}
              </button>
            ) : null}
            {shouldShowCancelAction ? (
              <button
                type="button"
                onClick={onCancelDraft}
                disabled={isSavingRecord}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  isSavingRecord
                    ? "cursor-not-allowed border-[#ddd1c5] bg-white text-[#b8a79b]"
                    : "border-[#dccfbe] bg-white text-[#5f4b3f] hover:bg-[#fcfaf7]"
                }`}
              >
                {copy.cancelLabel}
              </button>
            ) : null}
            {shouldShowDeleteAction ? (
              <button
                type="button"
                onClick={onDeleteRecord}
                disabled={isSavingRecord}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  isSavingRecord
                    ? "cursor-not-allowed border-[#ead6d0] bg-white text-[#caa79f]"
                    : "border-[#ead6d0] bg-white text-[#8b3f32] hover:bg-[#fff4f1]"
                }`}
              >
                {copy.deleteAction}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {isBeanRecord ? (
        <BeanRecordEditor
          selectedRecord={record}
          updateSelectedRecord={updateSelectedRecord}
          onToggleAttachmentDeletion={onToggleAttachmentDeletion}
          copy={copy}
        />
      ) : (
        <TextRecordEditor
          selectedRecord={record}
          updateSelectedRecord={updateSelectedRecord}
          copy={copy}
        />
      )}
    </section>
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
  const recordLoadFailedMessageRef = useRef(recordCopy.loadFailed);
  const recordCardRefs = useRef(new Map());
  const previousRecordsRef = useRef([]);
  const [searchInput, setSearchInput] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [isRecordTypeModalOpen, setIsRecordTypeModalOpen] = useState(false);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [recordLoadError, setRecordLoadError] = useState("");
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [pendingDeleteRecord, setPendingDeleteRecord] = useState(null);
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

  useEffect(() => {
    recordLoadFailedMessageRef.current = recordCopy.loadFailed;
  }, [recordCopy.loadFailed]);

  useEffect(() => {
    const previousImageMap = new Map();
    for (const record of previousRecordsRef.current) {
      previousImageMap.set(record.id, record.pendingLocalImages || []);
    }

    const nextImageIds = new Set();
    for (const record of records) {
      for (const image of record.pendingLocalImages || []) {
        nextImageIds.add(image.id);
      }
    }

    for (const images of previousImageMap.values()) {
      const removedImages = images.filter((image) => !nextImageIds.has(image.id));
      revokePendingLocalImages(removedImages);
    }

    previousRecordsRef.current = records;
  }, [records]);

  useEffect(
    () => () => {
      for (const record of previousRecordsRef.current) {
        revokePendingLocalImages(record.pendingLocalImages || []);
      }
    },
    [],
  );

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
          `${RECORD_API_BASE_URL}/api/place-records/${encodeURIComponent(savedPlace.id)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error(
            await readErrorMessage(response, recordLoadFailedMessageRef.current),
          );
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
          error instanceof Error
            ? error.message
            : recordLoadFailedMessageRef.current;
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
  }, [authUser?.mode, savedPlace?.id]);

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

  const handleCreateRecord = (recordType) => {
    const nextRecord = createDraftRecord(recordType, records.length + 1);

    setIsRecordTypeModalOpen(false);
    setRecords((current) => [...current, nextRecord]);
    setSelectedRecordId(nextRecord.id);
    window.requestAnimationFrame(() => {
      const nextCard = recordCardRefs.current.get(nextRecord.id);
      nextCard?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

  const handleSelectRecord = (recordId, options = {}) => {
    const shouldScroll = options.scroll !== false;
    setSelectedRecordId(recordId);
    if (!shouldScroll) {
      return;
    }

    const nextCard = recordCardRefs.current.get(recordId);
    nextCard?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateRecord = (recordId, field, value) => {
    if (!recordId) {
      return;
    }

    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? {
              ...record,
              [field]: value,
            }
          : record,
      ),
    );
  };

  const handleToggleAttachmentDeletion = (recordId, attachmentId) => {
    if (!recordId || !attachmentId) {
      return;
    }

    setRecords((current) =>
      current.map((record) => {
        if (record.id !== recordId) {
          return record;
        }

        const pendingDeletedAttachmentIds = record.pendingDeletedAttachmentIds || [];
        const nextPendingDeletedAttachmentIds = pendingDeletedAttachmentIds.includes(attachmentId)
          ? pendingDeletedAttachmentIds.filter(
              (currentAttachmentId) => currentAttachmentId !== attachmentId,
            )
          : [...pendingDeletedAttachmentIds, attachmentId];

        return {
          ...record,
          pendingDeletedAttachmentIds: nextPendingDeletedAttachmentIds,
        };
      }),
    );
  };

  const handleSaveRecord = async (recordId) => {
    const targetRecord = records.find((record) => record.id === recordId);
    if (!savedPlace?.id || !targetRecord || authUser?.mode === "guest") {
      return;
    }

    const isEditingPersistedRecord = isRecordSaved(targetRecord);
    if (targetRecord.recordType === RECORD_TYPE_BEAN) {
      if (!targetRecord.beanName.trim()) {
        setToast({
          type: "error",
          message: recordCopy.beanIdentityRequired,
        });
        return;
      }

      if (!targetRecord.purchaseDate.trim()) {
        setToast({
          type: "error",
          message: recordCopy.beanPurchaseDateRequired,
        });
        return;
      }
    } else {
      if (!targetRecord.title.trim()) {
        setToast({
          type: "error",
          message: recordCopy.titleRequired,
        });
        return;
      }

      if (!targetRecord.noteText.trim()) {
        setToast({
          type: "error",
          message: recordCopy.contentRequired,
        });
        return;
      }
    }

    setIsSavingRecord(true);

    try {
      const response = await fetch(
        `${RECORD_API_BASE_URL}/api/place-records/${encodeURIComponent(savedPlace.id)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(buildRecordPayload(targetRecord)),
        },
      );

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, recordCopy.saveFailed));
      }

      const payload = await response.json().catch(() => null);
      const savedRecord = normalizeRecord(payload, targetRecord.displayOrder);

      if (!savedRecord) {
        throw new Error(recordCopy.reloadFailed);
      }

      let finalRecord = savedRecord;
      let nextToast = {
        type: "success",
        message: isEditingPersistedRecord ? recordCopy.updatedToast : recordCopy.createdToast,
      };
      let pendingDeletedAttachmentIdsToKeep = [...(targetRecord.pendingDeletedAttachmentIds || [])];
      let pendingLocalImagesToKeep = [...(targetRecord.pendingLocalImages || [])];

      if (
        savedRecord.recordType === RECORD_TYPE_BEAN &&
        savedRecord.persistedId &&
        pendingDeletedAttachmentIdsToKeep.length > 0
      ) {
        try {
          for (const attachmentId of [...pendingDeletedAttachmentIdsToKeep]) {
            const deleteResponse = await fetch(
              `${RECORD_API_BASE_URL}/api/records/${encodeURIComponent(savedRecord.persistedId)}/attachments/${encodeURIComponent(attachmentId)}`,
              {
                method: "DELETE",
                credentials: "include",
              },
            );

            if (!deleteResponse.ok) {
              throw new Error(
                await readErrorMessage(deleteResponse, recordCopy.attachmentDeleteFailed),
              );
            }

            const deletePayload = await deleteResponse.json().catch(() => null);
            const deletedRecord = normalizeRecord(deletePayload, finalRecord.displayOrder);
            if (!deletedRecord) {
              throw new Error(recordCopy.attachmentDeleteFailed);
            }

            finalRecord = deletedRecord;
            pendingDeletedAttachmentIdsToKeep = pendingDeletedAttachmentIdsToKeep.filter(
              (currentAttachmentId) => currentAttachmentId !== attachmentId,
            );
          }
        } catch (error) {
          nextToast = {
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : recordCopy.attachmentDeleteFailed,
          };
        }
      }

      if (
        nextToast.type !== "error" &&
        savedRecord.recordType === RECORD_TYPE_BEAN &&
        savedRecord.persistedId &&
        pendingLocalImagesToKeep.length
      ) {
        const uploadFormData = new FormData();
        for (const image of pendingLocalImagesToKeep) {
          if (image?.file) {
            uploadFormData.append("files", image.file);
          }
        }

        if (uploadFormData.getAll("files").length > 0) {
          try {
            const uploadResponse = await fetch(
              `${RECORD_API_BASE_URL}/api/records/${encodeURIComponent(savedRecord.persistedId)}/attachments`,
              {
                method: "POST",
                credentials: "include",
                body: uploadFormData,
              },
            );

            if (!uploadResponse.ok) {
              throw new Error(
                await readErrorMessage(uploadResponse, recordCopy.attachmentUploadFailed),
              );
            }

            const uploadPayload = await uploadResponse.json().catch(() => null);
            const uploadedRecord = normalizeRecord(uploadPayload, savedRecord.displayOrder);
            if (!uploadedRecord) {
              throw new Error(recordCopy.attachmentUploadFailed);
            }

            finalRecord = uploadedRecord;
            pendingLocalImagesToKeep = [];
            nextToast = {
              type: "success",
              message: recordCopy.attachmentUploadSucceeded,
            };
          } catch (error) {
            nextToast = {
              type: "error",
              message:
                error instanceof Error
                  ? error.message
                  : recordCopy.attachmentUploadFailed,
            };
          }
        }
      }

      setRecords((current) =>
        current.map((record) =>
          record.id === targetRecord.id || record.persistedId === finalRecord.persistedId
            ? {
                ...finalRecord,
                pendingLocalImages: pendingLocalImagesToKeep,
                pendingDeletedAttachmentIds: pendingDeletedAttachmentIdsToKeep,
              }
            : record,
        ),
      );
      setSelectedRecordId(finalRecord.id);
      await refreshAccountSummary();
      setToast(nextToast);
    } catch (error) {
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : recordCopy.saveFailed,
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
          fetch(
            `${RECORD_API_BASE_URL}/api/place-records/${encodeURIComponent(savedPlace.id)}`,
            {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
              body: JSON.stringify(buildRecordPayload(record)),
            },
          ),
        ),
      );

      const failedResponse = responses.find((response) => !response.ok);
      if (failedResponse) {
        throw new Error(await readErrorMessage(failedResponse, recordCopy.orderSaveFailed));
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : recordCopy.orderSaveFailed,
      });
    }
  };

  const handleCancelDraft = (recordId) => {
    const targetRecord = records.find((record) => record.id === recordId);
    if (!targetRecord || isRecordSaved(targetRecord)) {
      return;
    }

    setRecords((current) =>
      reindexRecords(current.filter((record) => record.id !== targetRecord.id)),
    );
    if (selectedRecordId === targetRecord.id) {
      setSelectedRecordId("");
    }
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
        `${RECORD_API_BASE_URL}/api/place-records/${encodeURIComponent(savedPlace.id)}/${record.persistedId}`,
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
        message: error instanceof Error ? error.message : recordCopy.deleteFailed,
      });
    }
  };

  const handleRequestDeleteRecord = (record) => {
    if (!record) {
      return;
    }

    setPendingDeleteRecord(record);
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
          onSelectRecordType={handleCreateRecord}
          copy={recordCopy}
        />
      ) : null}

      <SavedPlaceDeleteConfirmModal
        pendingDelete={pendingSavedPlaceDelete}
        onCancel={cancelRemoveSavedPlace}
        onConfirm={confirmRemoveSavedPlace}
        messages={messages}
      />

      <RecordDeleteConfirmModal
        pendingDeleteRecord={pendingDeleteRecord}
        onCancel={() => setPendingDeleteRecord(null)}
        onConfirm={() => {
          if (!pendingDeleteRecord) {
            return;
          }

          void handleDeleteRecord(pendingDeleteRecord);
          setPendingDeleteRecord(null);
        }}
        copy={recordCopy}
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
                  ) : records.length > 0 ? (
                    <div className="space-y-5">
                      {records.map((record) => (
                        <RecordEditorCard
                          key={record.id}
                          record={record}
                          isActive={effectiveSelectedRecordId === record.id}
                          isSavingRecord={isSavingRecord && effectiveSelectedRecordId === record.id}
                          copy={recordCopy}
                          onActivate={() =>
                            handleSelectRecord(record.id, {
                              scroll: false,
                            })
                          }
                          onSaveRecord={() => handleSaveRecord(record.id)}
                          onCancelDraft={() => handleCancelDraft(record.id)}
                          onDeleteRecord={() => handleRequestDeleteRecord(record)}
                          onToggleAttachmentDeletion={(attachmentId) =>
                            handleToggleAttachmentDeletion(record.id, attachmentId)
                          }
                          updateSelectedRecord={(field, value) =>
                            updateRecord(record.id, field, value)
                          }
                          cardRef={(node) => {
                            if (node) {
                              recordCardRefs.current.set(record.id, node);
                              return;
                            }

                            recordCardRefs.current.delete(record.id);
                          }}
                        />
                      ))}
                    </div>
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
                onSelectRecord={handleSelectRecord}
                onDragStart={handleRecordDragStart}
                onDrop={handleRecordDrop}
                onDragEnd={handleRecordDragEnd}
                onDeleteRecord={handleRequestDeleteRecord}
                copy={recordCopy}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
