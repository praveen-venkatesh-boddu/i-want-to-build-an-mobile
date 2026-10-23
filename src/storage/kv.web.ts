/**
 * Web: local-first storage that mirrors to Cloudflare D1 via /api/kv.
 *
 *  - Reads ask the server first (so a new device or cleared browser gets your data back),
 *    and fall back to the local copy when offline or signed out.
 *  - Writes land locally at once, then are pushed to the server (debounced).
 *  - Last write wins. Fine for one person; two devices editing at the same moment can overwrite each other.
 *  - If the server has nothing yet but this device does, the local copy seeds the server.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_DELAY_MS = 800;
const FETCH_TIMEOUT_MS = 5000;
const timers: Record<string, ReturnType<typeof setTimeout>> = {};

async function api(key: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`/api/kv/${encodeURIComponent(key)}`, {
      credentials: "same-origin",
      redirect: "manual", // an expired Access session redirects to a login page: treat as offline
      ...init,
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
