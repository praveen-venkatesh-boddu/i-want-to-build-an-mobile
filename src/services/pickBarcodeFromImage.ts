import type { BarcodeType } from "expo-camera";

/** Native: there is no photo-upload shortcut, the camera is the way in. */
export const IMAGE_TEST_ENABLED = false;

export type ImagePick = { barcode?: string; error?: string };

export async function pickBarcodeFromImage(_types: BarcodeType[]): Promise<ImagePick | null> {
  return null;
}
