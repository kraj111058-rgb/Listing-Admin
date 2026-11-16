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

/**
 * Formats an ISO date string or Date object to a readable date (e.g. "Nov 14, 2026").
 */
export function formatDate(
  date: string | Date | null | undefined,
  fallback: string = "-"
): string {
  if (!date) return fallback
  const d = new Date(date)
  if (isNaN(d.getTime())) return fallback
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}
