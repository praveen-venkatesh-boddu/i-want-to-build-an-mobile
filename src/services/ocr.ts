/**
 * The one place that talks to ML Kit.
 *
 * Everything downstream works on normalised `OcrBlock`s, so if the OCR library is
 * ever swapped — for a Vision Camera frame processor, or a model call — this file
 * is the only one that changes.
 *
 * Requires a dev build: ML Kit is native and will not run in Expo Go.
 *     npx expo install @react-native-ml-kit/text-recognition
 *     npx expo prebuild
 */

import type { OcrBlock } from "../types/label";

type TextRecognitionModule = {
  recognize: (imageUri: string) => Promise<{ blocks?: LooseBlock[] }>;
};

// A static `import` here evaluates the native binding immediately, which throws
// (and takes the whole app down with it, since this loads before any screen is on
// screen) whenever the ML Kit binary isn't linked — e.g. in Expo Go. Loading it
// lazily behind a try/catch confines the failure to `recognizeLabel` below.
let textRecognition: TextRecognitionModule | null | undefined;

function getTextRecognition(): TextRecognitionModule | null {
  if (textRecognition === undefined) {
    try {
      textRecognition = require("@react-native-ml-kit/text-recognition").default as TextRecognitionModule;
    } catch {
      textRecognition = null;
    }
  }
  return textRecognition;
}

/**
 * ML Kit wrappers disagree about how a bounding box is spelled. Some emit
 * `{ x, y, width, height }`, others `{ left, top, right, bottom }`, and some
 * older builds omit the frame entirely. Accept all of them here so nothing
 * downstream has to care.
 */
type LooseFrame = {
  x?: number;
  y?: number;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
};

type LooseBlock = {
  text?: string;
  frame?: LooseFrame | null;
  boundingBox?: LooseFrame | null;
};

/**
 * Reads a captured photo and returns blocks positioned 0–1 across the image.
 *
 * Normalising here rather than in the extractor means the scoring weights are
 * resolution-independent — a 4032px photo and a 1024px one score identically.
 */
export async function recognizeLabel(
  imageUri: string,
  imageWidth: number,
  imageHeight: number
): Promise<OcrBlock[]> {
  const textRecognition = getTextRecognition();
  if (!textRecognition) {
    throw new Error("Label reading requires a dev build — ML Kit is not available in Expo Go.");
  }

  const recognised = await textRecognition.recognize(imageUri);
  const blocks = (recognised?.blocks ?? []) as LooseBlock[];

  const safeWidth = imageWidth > 0 ? imageWidth : 1;
  const safeHeight = imageHeight > 0 ? imageHeight : 1;

  return blocks
    .map((block) => toOcrBlock(block, safeWidth, safeHeight))
    .filter((block): block is OcrBlock => block !== null);
}

function toOcrBlock(block: LooseBlock, imageWidth: number, imageHeight: number): OcrBlock | null {
  const text = (block.text ?? "").replace(/\s+/g, " ").trim();
  if (!text) return null;

  const frame = block.frame ?? block.boundingBox ?? null;
  if (!frame) {
    // No geometry means no size or position signal. Keep the text — the category
    // and size sweeps still read it — but score it as a small, low block.
    return { text, x: 0, y: 1, w: 0, h: 0 };
  }

  const left = frame.x ?? frame.left ?? 0;
  const top = frame.y ?? frame.top ?? 0;
  const width = frame.width ?? (frame.right !== undefined ? frame.right - left : 0);
  const height = frame.height ?? (frame.bottom !== undefined ? frame.bottom - top : 0);

  return {
    text,
    x: clamp01(left / imageWidth),
    y: clamp01(top / imageHeight),
    w: clamp01(width / imageWidth),
    h: clamp01(height / imageHeight)
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
