import type { FilterKey, ItemDraft, PantryItem } from "../types/pantry";
import { oneYearFromTodayISO } from "../utils/date";

export const categories = [
  "Dairy",
  "Staples",
  "Produce",
  "Frozen",
  "Spices",
  "Snacks",
  "Medicine",
  "Stationery",
  "Toiletries",
  "Other"
];

/**
 * Categories the app used before the list was cut down, and where each one lives now.
 * Applied to saved items on load and to anything a lookup returns, so an old value never
 * leaves the editor with no chip lit.
 */
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  cans: "Staples",
  "first aid": "Medicine",
  "office supplies": "Stationery",
  cleaning: "Other",
  laundry: "Other",
  "paper goods": "Other",
  "pet supplies": "Other",
  "baby supplies": "Other",
  batteries: "Other",
  hardware: "Other",
  seasonal: "Other"
};

/** Maps any category text onto the current list; anything unknown becomes "Other". */
export function normalizeCategory(category: string | undefined | null): string {
  const value = (category ?? "").trim();
  if (!value) return "Other";
  const current = categories.find((known) => known.toLowerCase() === value.toLowerCase());
  return current ?? LEGACY_CATEGORY_MAP[value.toLowerCase()] ?? "Other";
}

// Categories treated as perishable for the home dashboard tile
export const PERISHABLE_CATEGORIES = ["Dairy", "Produce", "Frozen"];

export const packageTypes = [
  { label: "Bags", value: "bags", defaultSize: "10 lb" },
  { label: "Cans", value: "cans", defaultSize: "9 fl oz" },
  { label: "Boxes", value: "boxes", defaultSize: "16 oz" },
  { label: "Jars", value: "jars", defaultSize: "24 oz" },
  { label: "Bottles", value: "bottles", defaultSize: "32 fl oz" },
  { label: "Cartons", value: "cartons", defaultSize: "1 qt" },
  { label: "Pouches", value: "pouches", defaultSize: "6 oz" },
  { label: "Packs", value: "packs", defaultSize: "12 ct" },
  { label: "Items", value: "items", defaultSize: "1 ct" }
];

export function getDefaultPackageSize(unit: string) {
  return packageTypes.find((packageType) => packageType.value === unit)?.defaultSize ?? "";
}

export const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "expiring", label: "Expiring" },
  { key: "low", label: "Low" },
  { key: "opened", label: "Opened" }
];

export const starterItems: PantryItem[] = [
  {
    id: "starter-rice",
    addedOn: "2026-04-25",
    name: "Jasmine rice",
    category: "Staples",
    quantity: 2,
    unit: "bags",
    packageSize: "10 lb",
    location: "Pantry shelf",
    expiresOn: "2026-10-01",
    barcode: "",
    notes: "One open, one sealed",
    opened: true,
    par: 2,
    addedBy: "You"
  },
  {
    id: "starter-tomatoes",
    addedOn: "2026-05-11",
    name: "Crushed tomatoes",
    category: "Cans",
    quantity: 4,
    unit: "cans",
    packageSize: "9 fl oz",
    location: "Utility",
    expiresOn: "2026-05-30",
    barcode: "",
    notes: "Good for pasta night",
    opened: false,
    par: 4,
    addedBy: "You"
  },
  {
    id: "starter-spinach",
    addedOn: "2026-05-15",
    name: "Frozen spinach",
    category: "Frozen",
    quantity: 1,
    unit: "bags",
    packageSize: "10 lb",
    location: "Freezer drawer",
    expiresOn: "2026-05-24",
    barcode: "",
    notes: "",
    opened: false,
    par: 2,
    addedBy: "You"
  }
];

export function makeEmptyDraft(): ItemDraft {
  return {
    addedOn: "",
    name: "",
    category: "Staples",
    quantity: "1",
    unit: "bags",
    packageSize: "4 lb",
    location: "Storage",
    expiresOn: oneYearFromTodayISO(),
    barcode: "",
    notes: "",
    opened: false
  };
}
