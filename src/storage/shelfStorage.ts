import { kv } from "./kv";

import type { NotifSettings, Shelf } from "../types/pantry";

const SHELVES_STORAGE_KEY = "pantry-pocket-shelves";
const SETTINGS_STORAGE_KEY = "pantry-pocket-settings";

export type StoredSettings = {
  defaultShelfId: string | null;
  notif: NotifSettings;
};

export async function loadShelves(): Promise<Shelf[] | null> {
  const stored = await kv.getItem(SHELVES_STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Shelf[]) : null;
}

export function saveShelves(shelves: Shelf[]) {
  return kv.setItem(SHELVES_STORAGE_KEY, JSON.stringify(shelves));
}

export async function loadSettings(): Promise<StoredSettings | null> {
  const stored = await kv.getItem(SETTINGS_STORAGE_KEY);
  return stored ? (JSON.parse(stored) as StoredSettings) : null;
}

export function saveSettings(settings: StoredSettings) {
  return kv.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
