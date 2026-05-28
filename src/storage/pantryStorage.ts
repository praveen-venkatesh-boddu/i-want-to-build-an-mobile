import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDefaultPackageSize } from "../constants/pantry";
import type { PantryItem } from "../types/pantry";
import { todayISO } from "../utils/date";

const STORAGE_KEY = "pantry-pocket-items";

export async function loadPantryItems() {
  const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
  return storedItems ? normalizeStoredItems(JSON.parse(storedItems) as PantryItem[]) : null;
}

export function savePantryItems(items: PantryItem[]) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function normalizeStoredItems(items: PantryItem[]) {
  return items.map((item) => ({
    ...item,
    addedOn: item.addedOn ?? todayISO(),
    packageSize: item.packageSize ?? getDefaultPackageSize(item.unit),
    barcode: item.barcode ?? ""
  }));
}
