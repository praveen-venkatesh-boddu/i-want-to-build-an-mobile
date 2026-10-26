import { kv } from "./kv";

import { getDefaultPackageSize, normalizeCategory } from "../constants/pantry";
import type { PantryItem } from "../types/pantry";
import { todayISO } from "../utils/date";

const STORAGE_KEY = "pantry-pocket-items";
const BASKET_STORAGE_KEY = "pantry-pocket-basket";

export async function loadPantryItems() {
  const storedItems = await kv.getItem(STORAGE_KEY);
  return storedItems ? normalizeStoredItems(JSON.parse(storedItems) as PantryItem[]) : null;
}

export function savePantryItems(items: PantryItem[]) {
  return kv.setItem(STORAGE_KEY, JSON.stringify(items));
}

/** The in-progress run's basket — persisted so a run survives the app being backgrounded mid-shop. */
export async function loadBasket(): Promise<Record<string, number> | null> {
  const stored = await kv.getItem(BASKET_STORAGE_KEY);
  if (!stored) return null;
  // Older versions stored `true` for a ticked item; treat that as one bought.
  const raw = JSON.parse(stored) as Record<string, number | boolean>;
  const basket: Record<string, number> = {};
  for (const [id, value] of Object.entries(raw)) {
    const count = typeof value === "number" ? value : value ? 1 : 0;
    if (count > 0) basket[id] = count;
  }
  return basket;
}

/** Item id → how many are in the basket (absent means not ticked). */
export function saveBasket(basket: Record<string, number>) {
  return kv.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
}

function normalizeStoredItems(items: PantryItem[]) {
  return items.map((item) => ({
    ...item,
    category: normalizeCategory(item.category),
    addedOn: item.addedOn ?? todayISO(),
    packageSize: item.packageSize ?? getDefaultPackageSize(item.unit),
    barcode: item.barcode ?? ""
  }));
}
