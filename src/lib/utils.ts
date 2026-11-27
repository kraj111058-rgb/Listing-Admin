import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts up to 2 uppercase initials from a name (e.g. "Rajesh Kothari" -> "RK").
 */
export function getInitials(name: string): string {
  if (!name) return ""
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/**
 * Auto-generates a URL-friendly slug from a text string.
 */
export function generateSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface FormatDateOptions {
  fallback?: string
  showTime?: boolean
}

/**
 * Formats an ISO date string or Date object to a readable date & 12-hour AM/PM time
 * (e.g. "Nov 26, 2026 · 05:20 PM").
 */
export function formatDate(
  date: string | Date | null | undefined,
  optionsOrFallback: string | FormatDateOptions = "-"
): string {
  const { fallback = "-", showTime = true } =
    typeof optionsOrFallback === "string"
      ? { fallback: optionsOrFallback }
      : optionsOrFallback

  if (!date) return fallback
  const d = new Date(date)
  if (isNaN(d.getTime())) return fallback

  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  if (!showTime) return datePart

  const timePart = d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s+/g, " ")
    .toUpperCase()

  return `${datePart} · ${timePart}`
}
