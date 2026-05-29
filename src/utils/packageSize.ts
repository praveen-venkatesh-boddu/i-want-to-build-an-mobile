export const PKG_UNIT_OPTIONS = ["fl oz", "lb", "oz", "qt", "ct"] as const;
export type PkgUnit = (typeof PKG_UNIT_OPTIONS)[number];

export function parsePkgSize(value: string): { amount: string; unit: PkgUnit } {
  const trimmed = value.trim();
  for (const u of PKG_UNIT_OPTIONS) {
    if (trimmed === u) return { amount: "", unit: u };
    if (trimmed.endsWith(" " + u)) {
      return { amount: trimmed.slice(0, trimmed.length - u.length - 1).trim(), unit: u };
    }
  }
  const spaceIdx = trimmed.lastIndexOf(" ");
  if (spaceIdx > -1) return { amount: trimmed.slice(0, spaceIdx), unit: "lb" };
  return { amount: trimmed, unit: "lb" };
}
