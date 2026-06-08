/**
 * Formats a date (ISO string or Date) for display in the visitor's locale,
 * e.g. "8 June 2026 at 14:00". Returns "" for missing/invalid input.
 */
export function formatDate(value: string | Date | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}
