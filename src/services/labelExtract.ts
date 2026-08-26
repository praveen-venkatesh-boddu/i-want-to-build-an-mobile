/**
 * Turns OCR text blocks into a product guess.
 *
 * This module is deliberately pure — no native imports, no I/O, no React. It runs
 * under plain Node, which means it can be developed and tuned against saved
 * fixtures on a laptop instead of through a rebuild-to-device loop.
 * See `scripts/checkExtraction.ts`.
 *
 * The public signature is fixed by design. Adding a model later means branching in
 * the *caller* on `confidence`, not changing anything in here:
 *
 *     const extracted = extractProduct(blocks);
 *     if (extracted.confidence < THRESHOLD && aiEnabled) {
 *       return refineWithModel(extracted.blocks);
 *     }
 *     return extracted.result;
 */

import type { Candidate, ExtractionResult, OcrBlock } from "../types/label";
import {
  CATEGORY_KEYWORDS,
  FALLBACK_CATEGORY,
  PACKAGE_TYPE_KEYWORDS,
  REJECT_PATTERNS,
  SIZE_CONVERSIONS,
  SIZE_PATTERN,
  SIZE_UNIT_ALIASES
} from "./labelExtract.patterns";

// ── Scoring weights ──────────────────────────────────────────────────────────
// Cap height dominates: on almost any package the product name is the largest
// type on the front. Everything else breaks ties.
const W_HEIGHT = 3;
const W_POSITION = 1;
const W_WORDS = 1;
const W_CENTRED = 0.5;
const W_CASE = 0.5;
const REJECT_PENALTY = 4;

/** The most a block can score before penalties — used to normalise confidence. */
const MAX_SCORE = W_HEIGHT + W_POSITION + W_WORDS + W_CENTRED + W_CASE;

/** Above this, prefill silently. Below `UNCERTAIN`, don't guess a name at all. */
export const CONFIDENT = 0.65;
export const UNCERTAIN = 0.35;

/** Vertical gap (in multiples of the taller block's height) that still counts as one title. */
const JOIN_GAP = 1.5;

// ── Entry point ──────────────────────────────────────────────────────────────

export function extractProduct(blocks: OcrBlock[]): ExtractionResult {
  const usable = blocks.filter((block) => block.text.trim().length > 0);

  if (usable.length === 0) {
    return { result: {}, confidence: 0, candidates: [], blocks };
  }

  const fullText = usable.map((block) => block.text).join("\n");
  const tallest = Math.max(...usable.map((block) => block.h));

  const scored = usable
    .map((block) => scoreBlock(block, tallest))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];

  // Brand and product often sit on two lines — "TIDE" above "Ultra Oxi Pods".
  // If the runner-up is stacked directly under the winner, they are one title.
  const joined = shouldJoin(top, second);
  const name = joined && second ? joinBlocks(top, second) : top.block.text.trim();

  // When the runner-up was absorbed into the name, it is no longer a rival — so
  // the margin is measured against the next block down. Without this, a correct
  // two-line title scores *worse* than a one-line one, which is backwards.
  const rival = joined ? scored[2] : second;

  const packageSize = findPackageSize(usable);

  return {
    result: {
      name: name || undefined,
      category: findCategory(fullText),
      packageSize: packageSize?.label,
      unit: findPackageType(fullText, packageSize?.rawUnit)
    },
    confidence: confidenceOf(top, rival),
    candidates: toCandidates(scored, joined ? name : undefined),
    // Passed through untouched — this is the input a model call would take.
    blocks
  };
}

// ── Name scoring ─────────────────────────────────────────────────────────────

type Scored = {
  block: OcrBlock;
  score: number;
  rejectedBy?: string;
};

function scoreBlock(block: OcrBlock, tallest: number): Scored {
  const text = block.text.trim();
  const rejectedBy = firstRejectReason(text);

  const score =
    W_HEIGHT * heightScore(block, tallest) +
    W_POSITION * positionScore(block) +
    W_WORDS * wordCountScore(text) +
    W_CENTRED * centredScore(block) +
    W_CASE * caseScore(text) -
    (rejectedBy ? REJECT_PENALTY : 0);

  return { block, score, rejectedBy };
}

/** Dominant signal: how tall this block is relative to the biggest text on the label. */
function heightScore(block: OcrBlock, tallest: number): number {
  if (tallest <= 0) return 0;
  return clamp01(block.h / tallest);
}

/**
 * Names live in the upper-middle of the front panel. Net weight, barcodes and
 * legal text sit near the bottom. Peaks at y = 0.3 and tapers both ways.
 */
function positionScore(block: OcrBlock): number {
  const centre = block.y + block.h / 2;
  return clamp01(1 - Math.abs(centre - 0.3) / 0.7);
}

/** Two to five words is the sweet spot; single words and long sentences taper off. */
function wordCountScore(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words >= 2 && words <= 5) return 1;
  if (words === 1) return 0.55;
  if (words === 6 || words === 7) return 0.6;
  return 0.15;
}

/** Front-of-pack names are usually centred on their panel. */
function centredScore(block: OcrBlock): number {
  const centre = block.x + block.w / 2;
  return clamp01(1 - Math.abs(centre - 0.5) * 2);
}

/** Title Case and short ALL CAPS read as names. A sentence ending in a full stop does not. */
function caseScore(text: string): number {
  if (/[.!?]\s*$/.test(text)) return 0;

  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length === 0) return 0;

  const upperRatio = (text.match(/[A-Z]/g) ?? []).length / letters.length;
  const words = text.split(/\s+/).filter(Boolean);

  // Short ALL CAPS — the classic brand lockup.
  if (upperRatio > 0.85 && words.length <= 4) return 1;

  // Title Case — most words start with a capital.
  const capitalised = words.filter((word) => /^[A-Z]/.test(word)).length;
  if (words.length > 0 && capitalised / words.length >= 0.6) return 0.85;

  return 0.3;
}

function firstRejectReason(text: string): string | undefined {
  if (text.length < 3) return "too-short";

  const symbols = (text.match(/[\d\W_]/g) ?? []).length;
  if (symbols / text.length > 0.6) return "mostly-symbols";

  const hit = REJECT_PATTERNS.find((pattern) => pattern.re.test(text));
  return hit?.name;
}

// ── Two-line titles ──────────────────────────────────────────────────────────

function shouldJoin(top: Scored, second: Scored | undefined): second is Scored {
  if (!second || second.rejectedBy || top.rejectedBy) return false;

  const a = top.block;
  const b = second.block;

  // Vertically adjacent: the gap between them is under 1.5 line-heights.
  const gap = b.y > a.y ? b.y - (a.y + a.h) : a.y - (b.y + b.h);
  if (gap < 0 || gap > Math.max(a.h, b.h) * JOIN_GAP) return false;

  // Horizontally overlapping by at least half the narrower block.
  const overlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  if (overlap < Math.min(a.w, b.w) * 0.5) return false;

  // Only join when the second line is a real contender, not incidental text.
  return second.score > top.score * 0.45;
}

function joinBlocks(top: Scored, second: Scored): string {
  const ordered = top.block.y <= second.block.y ? [top.block, second.block] : [second.block, top.block];
  return ordered
    .map((block) => block.text.trim())
    .join(" ")
    .replace(/\s+/g, " ");
}

// ── Confidence ───────────────────────────────────────────────────────────────

/**
 * Two things make a guess trustworthy: it scored well outright, *and* it beat the
 * runner-up clearly. A label whose top two blocks tie is a label we are guessing on.
 */
function confidenceOf(top: Scored, second: Scored | undefined): number {
  if (top.rejectedBy || top.score <= 0) return 0;

  const absolute = clamp01(top.score / MAX_SCORE);
  const margin = second && second.score > 0 ? clamp01((top.score - second.score) / top.score) : 1;

  return clamp01(0.6 * absolute + 0.4 * margin);
}

/**
 * Runners-up for the tap-to-fix chips. When a joined title was produced, it leads
 * the list — otherwise the chips would offer only its two halves, which is never
 * what the user wants.
 */
function toCandidates(scored: Scored[], joinedName?: string): Candidate[] {
  const rest = scored
    .filter((entry) => !entry.rejectedBy)
    .map((entry) => ({
      text: entry.block.text.trim(),
      score: Math.round(entry.score * 1000) / 1000
    }));

  if (!joinedName) return rest.slice(0, 4);
  return [{ text: joinedName, score: rest[0]?.score ?? 0 }, ...rest].slice(0, 4);
}

// ── Package size ─────────────────────────────────────────────────────────────

type FoundSize = { label: string; rawUnit: string };

/**
 * Net contents are printed in a legally standardised format, which makes this by
 * far the most reliable field. Prefers a block that reads *only* as a measurement
 * over one where a number happens to appear mid-sentence.
 */
function findPackageSize(blocks: OcrBlock[]): FoundSize | undefined {
  const standalone = blocks.find((block) =>
    /^\s*(net\s*(wt|weight)\s*:?\s*)?[\d.,]+\s*[a-z\s]+\.?\s*$/i.test(block.text.trim())
  );

  const ordered = standalone ? [standalone, ...blocks.filter((b) => b !== standalone)] : blocks;

  for (const block of ordered) {
    const match = SIZE_PATTERN.exec(block.text);
    if (!match) continue;

    const amount = Number.parseFloat(match[1].replace(",", "."));
    const rawUnit = match[2].replace(/\s+/g, " ").trim();
    if (!Number.isFinite(amount)) continue;

    return { label: normaliseSize(amount, rawUnit), rawUnit };
  }

  return undefined;
}

/** Converts a printed measurement onto the app's `PKG_UNIT_OPTIONS` vocabulary. */
function normaliseSize(amount: number, rawUnit: string): string {
  const conversion = SIZE_CONVERSIONS.find((entry) => entry.from.test(rawUnit));
  const alias = SIZE_UNIT_ALIASES.find((entry) => entry.match.test(rawUnit));

  const value = conversion ? amount * conversion.factor : amount;
  const unit = alias?.unit ?? "oz";
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;

  return `${rounded} ${unit}`;
}

// ── Package type & category ──────────────────────────────────────────────────

/**
 * Container word if the label names one; otherwise inferred from the measurement.
 *
 * Note the anchored alternatives below. An unanchored `l` alternative matches the
 * "l" in "lb", which silently turned every pound-weight sack into a bottle.
 */
function findPackageType(fullText: string, rawUnit: string | undefined): string | undefined {
  const named = PACKAGE_TYPE_KEYWORDS.find((entry) => entry.keyword.test(fullText));
  if (named) return named.unit;

  if (!rawUnit) return undefined;
  if (/^(ct|count|pk|pack)$/i.test(rawUnit)) return "packs";
  if (/^(fl\s*oz|fluid\s*ounces?|ml|millilit(?:re|er)s?|l|lit(?:re|er)s?)$/i.test(rawUnit)) return "bottles";
  if (/^(lbs?|pounds?|kg|kilograms?)$/i.test(rawUnit)) return "bags";

  return "items";
}

/** First matching category wins — the list is ordered specific to broad. */
function findCategory(fullText: string): string {
  const hit = CATEGORY_KEYWORDS.find((entry) => entry.keywords.test(fullText));
  return hit?.category ?? FALLBACK_CATEGORY;
}

// ── Utilities ────────────────────────────────────────────────────────────────

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
