/** Native: plain local storage. (The web build uses kv.web.ts, which also syncs to Cloudflare.) */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const kv = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value)
};
