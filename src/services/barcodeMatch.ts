/**
 * Suggests catalog barcodes for items that were typed in by hand.
 *
 * Careful, because a wrong link is worse than a missing one: it sends every later scan of that
 * barcode to the wrong item. Only an exact-words match with a compatible size is offered pre-ticked. Nothing here writes anything — it only
 * proposes, and the review screen applies what the person accepts.
 */
import type { PantryItem } from "../types/pantry";
import type { SwadCatalogEntry } from "./swadMapping";

export type MatchTier =
  /** One candidate, same words, no size or category conflict. Pre-ticked in the review. */
  | "clear"
  /** Several candidates, or only a near match. The person picks one or skips. */
  | "choose";

export type BarcodeSuggestion = {
  item: PantryItem;
  tier: MatchTier;
  candidates: SwadCatalogEntry[];
};

/** Words that say nothing about which product it is. */
const NOISE = new Set([
  "a", "an", "the", "of", "and", "with", "in", "for", "brand", "pure", "premium", "fresh",
  "organic", "org", "natural", "small", "large", "big", "pack", "pkt", "pouch", "bag", "jar", "bottle"
]);

const SIZE_TOKEN = /^\d+(\.\d+)?(oz|lb|lbs|g|gm|gms|kg|ml|l|ltr|lt|gal|qt|pt|ct|pc|pcs)?$/;

/** Lowercased significant words: no punctuation, sizes, filler, or plural "s". */
export function nameTokens(name: string): string[] {
  const words = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['\u2019]/g, "")
    .replace(/&/g, " and ")
    .replace(/(\d)\s*(fl\s*)?(oz|lbs?|gms?|g|kg|ml|ltr|lt|l|gal|qt|pt|ct|pcs?)\b/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const tokens = words
    .filter((word) => !NOISE.has(word) && !SIZE_TOKEN.test(word))
    .map((word) => (word.length > 3 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word));

  return [...new Set(tokens)];
}

type Measure = { kind: "mass" | "volume" | "count"; amount: number };

const UNIT_FACTORS: Record<string, [Measure["kind"], number]> = {
  oz: ["mass", 28.3495],
  lb: ["mass", 453.592],
  lbs: ["mass", 453.592],
  g: ["mass", 1],
  gm: ["mass", 1],
  gms: ["mass", 1],
  kg: ["mass", 1000],
  ml: ["volume", 1],
  l: ["volume", 1000],
  ltr: ["volume", 1000],
  lt: ["volume", 1000],
  gal: ["volume", 3785.41],
  qt: ["volume", 946.353],
  pt: ["volume", 473.176],
  ct: ["count", 1],
  pc: ["count", 1],
  pcs: ["count", 1]
};

/** "10 lb" → { mass, 4535.9 g }. Null when there is no size or it can't be read. */
export function parseMeasure(text: string | undefined): Measure | null {
  const match = (text ?? "").toLowerCase().match(/([\d.]+)\s*(fl\s*)?(oz|lbs?|gms?|g|kg|ml|ltr|lt|l|gal|qt|pt|ct|pcs?)\b/);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const isFluid = Boolean(match[2]);
  const key = match[3];
  const [kind, factor] = UNIT_FACTORS[key];
  if (isFluid && key === "oz") return { kind: "volume", amount: amount * 29.5735 };
  return { kind, amount: amount * factor };
}

/** Same kind of measure and within 3%. When either side is unknown there is nothing to disagree about. */
function sizesConflict(a: Measure | null, b: Measure | null): boolean {
  if (!a || !b || a.kind !== b.kind) return false;
  return Math.abs(a.amount - b.amount) / Math.max(a.amount, b.amount) > 0.03;
}

function sameWords(a: string[], b: string[]): boolean {
  return a.length > 0 && a.length === b.length && a.every((word) => b.includes(word));
}

/** Share of words in common, 0–1. Needs at least two shared words (or all of a one-word name). */
function overlap(a: string[], b: string[]): number {
  const shared = a.filter((word) => b.includes(word)).length;
  const needed = Math.min(2, a.length, b.length);
  if (shared < needed || shared === 0) return 0;
  return shared / new Set([...a, ...b]).size;
}

const NEAR = 0.75;
const MAX_CANDIDATES = 3;

export function suggestBarcodes(items: PantryItem[], catalog: SwadCatalogEntry[]): BarcodeSuggestion[] {
  const taken = new Set(items.map((item) => item.barcode.trim()).filter(Boolean));
  const pool = catalog
    .filter((entry) => !taken.has(entry.barcode))
    .map((entry) => ({ entry, tokens: nameTokens(entry.name), measure: parseMeasure(entry.packageSize) }));

  const suggestions: BarcodeSuggestion[] = [];

  for (const item of items) {
    if (item.barcode.trim()) continue;
    const tokens = nameTokens(item.name);
    if (tokens.length === 0) continue;
    const itemMeasure = parseMeasure(item.packageSize);

    // A size mismatch only demotes a match: forms fill in a default size nobody chose, so an item
    // with identical words must still be offered. It just never comes pre-ticked.
    const scored = pool
      .map((candidate) => ({
        entry: candidate.entry,
        exact: sameWords(tokens, candidate.tokens),
        score: overlap(tokens, candidate.tokens),
        conflict: sizesConflict(itemMeasure, candidate.measure)
      }))
      .filter((candidate) => (candidate.exact || candidate.score >= NEAR) && (candidate.exact || !candidate.conflict))
      .sort(
        (x, y) =>
          Number(y.exact && !y.conflict) - Number(x.exact && !x.conflict) ||
          Number(y.exact) - Number(x.exact) ||
          y.score - x.score
      );

    if (scored.length === 0) continue;

    const top = scored[0];
    const categoryAgrees = !item.category || item.category === top.entry.category;
    const isClear = scored.length === 1 && top.exact && !top.conflict && categoryAgrees;

    suggestions.push({
      item,
      tier: isClear ? "clear" : "choose",
      candidates: scored.slice(0, MAX_CANDIDATES).map((candidate) => candidate.entry)
    });
  }

  // Clear matches first so the quick wins are at the top of the review.
  return suggestions.sort((x, y) => Number(y.tier === "clear") - Number(x.tier === "clear"));
}
