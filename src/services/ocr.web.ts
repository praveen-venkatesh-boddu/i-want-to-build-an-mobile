/**
 * Web build of the label reader. ML Kit is native-only, so in the browser we use
 * tesseract.js (WASM), loaded on demand so it doesn't weigh down the first load.
 * Output is normalised to the same OcrBlock shape the extractor expects.
 */
import type { OcrBlock } from "../types/label";

export async function recognizeLabel(
  imageUri: string,
  imageWidth: number,
  imageHeight: number
): Promise<OcrBlock[]> {
  const Tesseract: any = await import("tesseract.js");
  const { data } = await Tesseract.recognize(imageUri, "eng");

  const w = imageWidth > 0 ? imageWidth : 1;
  const h = imageHeight > 0 ? imageHeight : 1;
  const clamp = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

  const lines: any[] = data?.lines ?? [];
  return lines
    .map((line) => {
      const text = String(line.text ?? "").replace(/\s+/g, " ").trim();
      const b = line.bbox;
      if (!text || !b) return null;
      return { text, x: clamp(b.x0 / w), y: clamp(b.y0 / h), w: clamp((b.x1 - b.x0) / w), h: clamp((b.y1 - b.y0) / h) };
    })
    .filter((b): b is OcrBlock => b !== null);
}
