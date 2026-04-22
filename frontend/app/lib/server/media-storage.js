import { createHash, randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_STORAGE_ROOT = "E:/storage";
const ALLOWED_IMAGE_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MEDIA_OWNER_TYPE_CAFE_RECORD = "CAFE_RECORD";
const OWNER_PREFIX = {
  [MEDIA_OWNER_TYPE_CAFE_RECORD]: "cafe-record",
};

export const MEDIA_UPLOAD_POLICY = {
  maxFilesPerRequest: 5,
  maxAttachmentsPerRecord: 5,
  maxAttachmentsPerViewSpotRecord: 30,
  maxFileSizeBytes: 15 * 1024 * 1024,
  maxRequestSizeBytes: 100 * 1024 * 1024,
};

function getStorageRoot() {
  return path.resolve(process.env.APP_MEDIA_STORAGE_ROOT?.trim() || DEFAULT_STORAGE_ROOT);
}

function normalizeExtension(fileName) {
  const extension = path.extname(fileName || "")
    .slice(1)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return extension || "bin";
}

function ownerPrefix(ownerType) {
  return OWNER_PREFIX[ownerType] || "misc";
}

export function createStorageKey(ownerType, originalFileName, now = new Date(), uuid = randomUUID()) {
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const extension = normalizeExtension(originalFileName);

  return path
    .join(ownerPrefix(ownerType), year, month, day, `${uuid}.${extension}`)
    .replaceAll("\\", "/");
}

export function resolveStoragePath(storageKey) {
  const root = getStorageRoot();
  const resolved = path.resolve(root, storageKey);

  if (!resolved.startsWith(root)) {
    throw new Error("Resolved storage path escapes the configured storage root.");
  }

  return resolved;
}

export async function persistUploadFile(file, ownerType) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageKey = createStorageKey(ownerType, file.name);
  const storagePath = resolveStoragePath(storageKey);

  await mkdir(path.dirname(storagePath), { recursive: true });
  await writeFile(storagePath, buffer);

  return {
    storageKey,
    storagePath,
    buffer,
    fileSize: buffer.length,
    checksum: createHash("sha256").update(buffer).digest("hex"),
  };
}

export async function cleanupStoredFiles(paths) {
  for (const filePath of paths) {
    if (!filePath) {
      continue;
    }

    try {
      await unlink(filePath);
    } catch {
      // Best-effort cleanup.
    }
  }
}

export function normalizeContentType(contentType) {
  return typeof contentType === "string" ? contentType.trim().toLowerCase() : "";
}

export function isAllowedImageContentType(contentType) {
  return ALLOWED_IMAGE_CONTENT_TYPES.has(normalizeContentType(contentType));
}
