import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDefaultPackageSize } from "../constants/pantry";
import type { PantryItem } from "../types/pantry";
import { todayISO } from "../utils/date";

const STORAGE_KEY = "pantry-pocket-items";
const BASKET_STORAGE_KEY = "pantry-pocket-basket";

export async function loadPantryItems() {
  const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
  return storedItems ? normalizeStoredItems(JSON.parse(storedItems) as PantryItem[]) : null;
}

export function savePantryItems(items: PantryItem[]) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/** The in-progress run's basket — persisted so a run survives the app being backgrounded mid-shop. */
export async function loadBasket(): Promise<Record<string, boolean> | null> {
  const stored = await AsyncStorage.getItem(BASKET_STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Record<string, boolean>) : null;
}

export function saveBasket(basket: Record<string, boolean>) {
  return AsyncStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket));
}

function normalizeStoredItems(items: PantryItem[]) {
  return items.map((item) => ({
    ...item,
    addedOn: item.addedOn ?? todayISO(),
    packageSize: item.packageSize ?? getDefaultPackageSize(item.unit),
    barcode: item.barcode ?? ""
  }));
}
