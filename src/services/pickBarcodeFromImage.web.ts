/**
 * Testing aid, web dev server only: choose a picture of a barcode instead of using the camera,
 * so the scan flow can be exercised on a laptop. It is off in production builds (`__DEV__`).
 */
import { scanFromURLAsync, type BarcodeType } from "expo-camera";

export const IMAGE_TEST_ENABLED = __DEV__;

export type ImagePick = { barcode?: string; error?: string };

/** Opens the browser's file picker. Resolves null if the person closes it without choosing. */
export function pickBarcodeFromImage(types: BarcodeType[]): Promise<ImagePick | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);

      const url = URL.createObjectURL(file);
      try {
        const results = await scanFromURLAsync(url, types);
        const data = results[0]?.data;
        resolve(data ? { barcode: data } : { error: "No barcode found in that image." });
      } catch {
        resolve({ error: "Couldn't read that image." });
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}
