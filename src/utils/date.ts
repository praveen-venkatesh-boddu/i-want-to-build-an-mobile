export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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
  if (!dateValue) {
    return 9999;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(expiry.getTime())) {
    return 9999;
  }

  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

export function getStatusLabel(days: number, dateValue: string) {
  if (!dateValue) {
    return "No date";
  }
  if (days < 0) {
    return "Expired";
  }
  if (days === 0) {
    return "Today";
  }
  if (days === 1) {
    return "Tomorrow";
  }
  if (days <= 7) {
    return `${days} days`;
  }
  return dateValue;
}
