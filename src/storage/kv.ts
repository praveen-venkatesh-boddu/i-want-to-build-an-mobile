/** Native: plain local storage. (The web build uses kv.web.ts, which also syncs to Cloudflare.) */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const kv = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value)
};

// Passcode sync is a web-only feature; these keep shared imports compiling on native.
export const syncAvailable = false;
export const getPasscode = () => "";
export const setPasscode = (_value: string) => {};
export const checkPasscode = async (_value: string) => false;
