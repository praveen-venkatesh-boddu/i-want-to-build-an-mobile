function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function todayISO(): string {
  return formatDate(new Date());
}

export function addDaysToISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function oneYearFromTodayISO(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return formatDate(d);
}

export function daysSince(dateValue: string): number {
  if (!dateValue) return 0;
  const added = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(added.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - added.getTime()) / 86400000);
}

export function daysUntil(dateValue: string) {
  if (!dateValue) return 9999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(expiry.getTime())) return 9999;
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

export function addMonthsToISO(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return formatDate(d);
}

/** "Jun 3" or "Jan 15, 2027" (adds year when different from current). */
export function formatShortDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" })
  });
}

export function getStatusLabel(days: number, dateValue: string) {
  if (!dateValue) return "No date";
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days} days`;
  return dateValue;
}

/**
 * Typing aid for an MM/YY (or MM/YYYY) box: keeps digits only and inserts the slash.
 * A lone 2–9 becomes "0N/" so "3" reads as March, not as the start of month 3x.
 */
export function formatMonthYearInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  if (digits.length === 1 && digits >= "2") return `0${digits}/`;
  if (digits.length <= 2) return raw.endsWith("/") && digits.length === 2 ? `${digits}/` : digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** "03/27" or "03/2027" → "2027-03-31": a printed month means the end of that month. Null if not a valid month/year. */
export function parseMonthYear(text: string): string | null {
  const match = text.trim().match(/^(\d{2})\/(\d{2}|\d{4})$/);
  if (!match) return null;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return null;
  const year = match[2].length === 2 ? 2000 + Number(match[2]) : Number(match[2]);
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

/** "Mar 2027" for an ISO date. */
export function formatMonthYear(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
