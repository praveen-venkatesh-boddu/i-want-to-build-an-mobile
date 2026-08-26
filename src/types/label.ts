/**
 * Types for the on-device label reader.
 *
 * Nothing in this file imports a native module, so everything that consumes it
 * can be exercised under plain Node — see `scripts/checkExtraction.ts`.
 */

/** A single text block from OCR, with its position on the label normalised to 0–1. */
export type OcrBlock = {
  text: string;
  /** Left edge, 0–1 across the image width. */
  x: number;
  /** Top edge, 0–1 down the image height. */
  y: number;
  /** Width, 0–1 of the image width. */
  w: number;
  /** Height, 0–1 of the image height. This is the size signal — the name is the big text. */
  h: number;
};

/** A scored candidate for the product name. */
export type Candidate = {
  text: string;
  score: number;
  /** Set when a reject pattern fired, for debugging from the scan log. */
  rejectedBy?: string;
};

/** What the reader returns. Every field the form needs, plus the evidence behind it. */
export type ExtractionResult = {
  /** Same shape every other lookup tier returns, so the form can't tell them apart. */
  result: {
    category?: string;
    name?: string;
    packageSize?: string;
    unit?: string;
  };
  /** 0–1. Drives the form's behaviour, and later decides whether to ask a model. */
  confidence: number;
  /** Runners-up, best first, already filtered of rejects. Rendered as tap-to-fix chips. */
  candidates: Candidate[];
  /**
   * The blocks this result came from, passed through untouched.
   *
   * Nothing reads this today. It is the hook for a future model call: refining a
   * low-confidence result means handing exactly this array to a model, which is
   * why it survives the extraction rather than being discarded.
   */
  blocks: OcrBlock[];
};

/** Which tier answered. Recorded on every scan so the log can be sliced by source. */
export type LookupSource = "history" | "off" | "opf" | "ocr" | "none";

/** One recorded scan. The gap between `guess` and `kept` is the whole point. */
export type ScanLogEntry = {
  id: string;
  /** ISO timestamp. */
  at: string;
  source: LookupSource;
  barcode?: string;
  /** Trimmed blocks — text and geometry only, never the image. */
  blocks?: Array<Pick<OcrBlock, "text" | "y" | "h">>;
  guess: ExtractionResult["result"];
  confidence?: number;
  /** What the user actually saved. */
  kept: ExtractionResult["result"];
  /** True when the saved name differs from the guessed one. */
  edited: boolean;
};
