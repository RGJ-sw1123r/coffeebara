"use client";

export function formatCount(value) {
  const normalizedValue =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : Number(value) || 0;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(normalizedValue);
}
