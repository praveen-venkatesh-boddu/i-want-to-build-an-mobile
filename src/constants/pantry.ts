import type { FilterKey, ItemDraft, PantryItem } from "../types/pantry";
import { oneYearFromTodayISO } from "../utils/date";

export const categories = [
  "Staples",
  "Produce",
  "Cans",
  "Frozen",
  "Snacks",
  "Spices",
  "Toiletries",
  "Cleaning",
  "Laundry",
  "Paper Goods",
  "First Aid",
  "Pet Supplies",
  "Baby Supplies",
  "Office Supplies",
  "Batteries",
  "Hardware",
  "Seasonal",
  "Other"
];

// Categories treated as perishable for the home dashboard tile
export const PERISHABLE_CATEGORIES = ["Produce", "Frozen"];

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

/** Fixed Shelves group order — groups with no matching rows are skipped, never rendered empty. */
export const PLACE_GROUPS = [
  "Pantry shelf",
  "Fridge",
  "Freezer drawer",
  "Under the sink",
  "Utility",
  "Bathroom"
] as const;

/** The three places offered as quick chips when a scanned item is added. */
export const SCAN_PLACE_CHIPS = ["Pantry shelf", "Fridge", "Freezer drawer"] as const;

/**
 * Maps a free-text `location` (the field predates the redesign's fixed six
 * place groups) to the closest canonical group, so every item still lands in
 * a Shelves section. Unrecognised locations fall back to "Utility".
 */
export function groupForLocation(location: string): (typeof PLACE_GROUPS)[number] {
  const normalized = location.toLowerCase();
  if (normalized.includes("fridge") || normalized.includes("refrigerat")) return "Fridge";
  if (normalized.includes("freezer")) return "Freezer drawer";
  if (normalized.includes("pantry")) return "Pantry shelf";
  if (normalized.includes("sink")) return "Under the sink";
  if (normalized.includes("bath")) return "Bathroom";
  return "Utility";
}

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
