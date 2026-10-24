/**
 * Web: local-first storage that mirrors to Cloudflare D1 via /api/kv.
 *
 *  - Reads ask the server first (so a new device or cleared browser gets your data back),
 *    and fall back to the local copy when offline or signed out.
 *  - Writes land locally at once, then are pushed to the server (debounced).
 *  - Sync needs the passcode (set in Settings); without it the app is local-only.
 *  - Last write wins. Fine for one person; two devices editing at the same moment can overwrite each other.
 *  - If the server has nothing yet but this device does, the local copy seeds the server.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_DELAY_MS = 800;
const FETCH_TIMEOUT_MS = 5000;
const PASSCODE_KEY = "pantry-pocket-passcode";
const timers: Record<string, ReturnType<typeof setTimeout>> = {};

export function getPasscode(): string {
  try { return localStorage.getItem(PASSCODE_KEY) ?? ""; } catch { return ""; }
}

export function setPasscode(value: string): void {
  try {
    if (value) localStorage.setItem(PASSCODE_KEY, value);
    else localStorage.removeItem(PASSCODE_KEY);
  } catch { /* storage blocked: sync just stays off */ }
}

/** True if the server accepts this passcode. */
export async function checkPasscode(value: string): Promise<boolean> {
  try {
    const res = await fetch("/api/kv/_check", { headers: { "x-pantry-key": value }, cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

async function api(key: string, init?: RequestInit): Promise<Response> {
  const passcode = getPasscode();
  if (!passcode) throw new Error("no passcode"); // sync is off until one is set (Settings)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`/api/kv/${encodeURIComponent(key)}`, {
      credentials: "same-origin",
      redirect: "manual", // an expired Access session redirects to a login page: treat as offline
      ...init,
      headers: { ...(init?.headers as Record<string, string>), "x-pantry-key": passcode },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

async function push(key: string, value: string): Promise<void> {
  try {
    await api(key, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value })
    });
  } catch {
    // Offline or signed out: the local copy is still safe and will be pushed on the next change.
  }
}

export const syncAvailable = true;

export const kv = {
  async getItem(key: string): Promise<string | null> {
    const local = await AsyncStorage.getItem(key);
    try {
      const res = await api(key);
      if (res.ok) {
        const { value } = (await res.json()) as { value: string };
        if (typeof value === "string") {
          await AsyncStorage.setItem(key, value);
          return value;
        }
      } else if (res.status === 404 && local !== null) {
        void push(key, local); // first sync from this device
      }
    } catch {
      // fall through to the local copy
    }
    return local;
  },

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
    clearTimeout(timers[key]);
    timers[key] = setTimeout(() => void push(key, value), PUSH_DELAY_MS);
  }
};
