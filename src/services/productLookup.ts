import { categories, getDefaultPackageSize, packageTypes } from "../constants/pantry";
import type { ExtractionResult, LookupSource, OcrBlock } from "../types/label";
import type { ItemDraft, PantryItem } from "../types/pantry";
import { extractProduct } from "./labelExtract";
import { recognizeLabel } from "./ocr";

type OpenFactsResponse = {
  product?: {
    brands?: string;
    categories?: string[];
    product_name?: string;
    product_name_en?: string;
    quantity?: string;
  };
  status?: number;
};

type UpcItemDbResponse = {
  code?: string;
  items?: Array<{
    title?: string;
    brand?: string;
    category?: string;
    size?: string;
  }>;
};

export type ProductLookupResult = {
  category?: string;
  name?: string;
  packageSize?: string;
  unit?: string;
};

/** A lookup plus the evidence behind it, so the caller can log it and adapt the UI. */
export type LookupOutcome = {
  result: ProductLookupResult | null;
  source: LookupSource;
  /** 0–1, only meaningful when `source === "ocr"`. */
  confidence?: number;
  /** Alternative names, best first. Rendered as tap-to-fix chips. */
  candidates?: string[];
  /** OCR blocks, carried through for the scan log and any future model call. */
  blocks?: OcrBlock[];
};

/**
 * Barcode tiers, cheapest and most reliable first.
 *
 * `knownItems` is checked before any network call: someone restocking their usual
 * dish soap should never hit an API, and after a few weeks of use this becomes the
 * fastest and most accurate path in the app.
 */
export async function lookupProductByBarcode(
  barcode: string,
  knownItems: PantryItem[] = []
): Promise<LookupOutcome> {
  const remembered = findInHistory(barcode, knownItems);
  if (remembered) return { result: remembered, source: "history" };

  const food = await lookupOpenFacts(barcode, "https://world.openfoodfacts.org");
  if (food) return { result: food, source: "off" };

  // OpenFoodFacts is food only, but twelve of this app's eighteen categories are
  // not food. These siblings share the same API shape and cover the rest.
  const products = await lookupOpenFacts(barcode, "https://world.openproductsfacts.org");
  if (products) return { result: products, source: "opf" };

  const beauty = await lookupOpenFacts(barcode, "https://world.openbeautyfacts.org");
  if (beauty) return { result: beauty, source: "opf" };

  const upc = await lookupUpcItemDb(barcode);
  if (upc) return { result: upc, source: "opf" };

  return { result: null, source: "none" };
}

/**
 * Last tier: read the packaging.
 *
 * Runs entirely on-device — no network, no key, no per-scan cost — and works when
 * the barcode is damaged or the product simply isn't in any database.
 *
 * This is where a model would attach later. `extractProduct` already returns the
 * blocks and a confidence score, so refining a poor read means adding one branch
 * here and nothing anywhere else:
 *
 *     if (extracted.confidence < UNCERTAIN && aiEnabled) {
 *       return refineWithModel(extracted.blocks);
 *     }
 */
export async function lookupProductByPhoto(
  imageUri: string,
  imageWidth: number,
  imageHeight: number
): Promise<LookupOutcome> {
  try {
    const blocks = await recognizeLabel(imageUri, imageWidth, imageHeight);
    if (blocks.length === 0) {
      return { result: null, source: "ocr", confidence: 0, candidates: [], blocks: [] };
    }

    const extracted: ExtractionResult = extractProduct(blocks);

    return {
      result: {
        ...extracted.result,
        // Keep the extractor's guesses inside the app's own vocabulary.
        category: coerceCategory(extracted.result.category),
        unit: coerceUnit(extracted.result.unit)
      },
      source: "ocr",
      confidence: extracted.confidence,
      candidates: extracted.candidates.map((candidate) => candidate.text),
      blocks: extracted.blocks
    };
  } catch {
    return { result: null, source: "ocr", confidence: 0, candidates: [], blocks: [] };
  }
}

// ── Tier implementations ─────────────────────────────────────────────────────

/** The user's own shelves. Free, instant, and right by definition. */
function findInHistory(barcode: string, items: PantryItem[]): ProductLookupResult | null {
  const trimmed = barcode.trim();
  if (!trimmed) return null;

  const match = items.find((item) => item.barcode && item.barcode.trim() === trimmed);
  if (!match) return null;

  return {
    category: match.category,
    name: match.name,
    packageSize: match.packageSize,
    unit: match.unit
  };
}

/** OpenFoodFacts and its non-food siblings all speak the same API. */
async function lookupOpenFacts(barcode: string, origin: string): Promise<ProductLookupResult | null> {
  try {
    const response = await fetch(
      `${origin}/api/v2/product/${encodeURIComponent(
        barcode
      )}.json?fields=product_name,product_name_en,brands,quantity,categories`
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as OpenFactsResponse;
    if (payload.status !== 1 || !payload.product) return null;

    const product = payload.product;
    const name = (product.product_name_en ?? product.product_name ?? "").trim();
    const category = mapOpenFactsCategory(product.categories ?? []);
    const unit = inferPackageType(product.quantity ?? "");

    return {
      category,
      name: name || undefined,
      packageSize: product.quantity || (unit ? getDefaultPackageSize(unit) : undefined),
      unit
    };
  } catch {
    return null;
  }
}

async function lookupUpcItemDb(barcode: string): Promise<ProductLookupResult | null> {
  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as UpcItemDbResponse;
    const item = payload.items?.[0];
    if (!item) return null;

    const rawName = [item.brand, item.title].filter(Boolean).join(" ").trim();
    // Remove brand prefix duplication (e.g. "Tide Tide Pods" → "Tide Pods")
    const name = deduplicatePrefix(rawName);

    const category = mapUpcItemDbCategory(item.category ?? "");
    const unit = inferPackageType(item.size ?? "");

    return {
      category,
      name: name || undefined,
      packageSize: item.size || (unit ? getDefaultPackageSize(unit) : undefined),
      unit
    };
  } catch {
    return null;
  }
}

export function applyLookupResultToDraft(
  current: ItemDraft,
  barcode: string,
  lookupResult: ProductLookupResult | null
): ItemDraft {
  if (!lookupResult) {
    return { ...current, barcode };
  }

  return {
    ...current,
    barcode,
    category: coerceCategory(lookupResult.category) ?? current.category,
    name: lookupResult.name ?? current.name,
    packageSize: lookupResult.packageSize ?? current.packageSize,
    unit: coerceUnit(lookupResult.unit) ?? current.unit
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function inferPackageType(quantity: string) {
  const normalizedQuantity = quantity.toLowerCase();

  if (normalizedQuantity.includes("can")) return "cans";
  if (normalizedQuantity.includes("bag")) return "bags";
  if (normalizedQuantity.includes("box")) return "boxes";
  if (normalizedQuantity.includes("jar")) return "jars";
  if (normalizedQuantity.includes("bottle")) return "bottles";
  if (normalizedQuantity.includes("carton")) return "cartons";
  if (normalizedQuantity.includes("pouch")) return "pouches";
  if (normalizedQuantity.includes("pack")) return "packs";

  const hasKnownMeasure = /\d/.test(normalizedQuantity) && /(g|kg|lb|oz|ml|l|fl oz)/.test(normalizedQuantity);
  return hasKnownMeasure ? "items" : packageTypes[packageTypes.length - 1]?.value;
}

/**
 * Guards against a category the editor cannot render.
 *
 * The chips are built from `constants/pantry.ts` → `categories`, so a value
 * outside that list lights *no* chip and the user cannot tell why. Every tier
 * goes through here.
 */
function coerceCategory(category: string | undefined): string | undefined {
  if (!category) return undefined;
  const match = categories.find((known) => known.toLowerCase() === category.toLowerCase());
  return match ?? "Other";
}

/** The same guard for package type, against `packageTypes`. */
function coerceUnit(unit: string | undefined): string | undefined {
  if (!unit) return undefined;
  const match = packageTypes.find((known) => known.value.toLowerCase() === unit.toLowerCase());
  return match?.value ?? "items";
}

function mapOpenFactsCategory(categoryTags: string[]) {
  const normalizedTags = categoryTags.join(" ").toLowerCase();

  if (matchesAny(normalizedTags, ["spice", "herb", "seasoning", "sauce", "condiment"])) return "Spices";
  if (matchesAny(normalizedTags, ["fruit", "vegetable", "produce"])) return "Produce";
  if (matchesAny(normalizedTags, ["frozen"])) return "Frozen";
  if (matchesAny(normalizedTags, ["snack", "chips", "crackers", "cookies", "confectionery"])) return "Snacks";
  if (matchesAny(normalizedTags, ["canned", "tin", "preserved-foods"])) return "Cans";
  if (matchesAny(normalizedTags, ["beauty", "hygiene", "toiletr", "hair", "dental"])) return "Toiletries";
  if (matchesAny(normalizedTags, ["laundry"])) return "Laundry";
  if (matchesAny(normalizedTags, ["cleaning", "detergent", "household"])) return "Cleaning";
  if (matchesAny(normalizedTags, ["paper", "tissue"])) return "Paper Goods";
  if (matchesAny(normalizedTags, ["pet", "cat-", "dog-"])) return "Pet Supplies";
  if (matchesAny(normalizedTags, ["baby", "infant"])) return "Baby Supplies";
  if (matchesAny(normalizedTags, ["batter"])) return "Batteries";
  if (matchesAny(normalizedTags, ["beverage", "cereal", "pasta", "rice", "grocer"])) return "Staples";

  return "Other";
}

function mapUpcItemDbCategory(category: string) {
  const c = category.toLowerCase();

  // Every branch must return a value present in `categories`. "Dairy", "Meat" and
  // "Household" are not in that list and previously left the editor with no chip lit.
  if (matchesAny(c, ["frozen"])) return "Frozen";
  if (matchesAny(c, ["snack", "candy", "confection", "chip", "cookie"])) return "Snacks";
  if (matchesAny(c, ["spice", "herb", "sauce", "condiment", "seasoning"])) return "Spices";
  if (matchesAny(c, ["produce", "fruit", "vegetable", "dairy", "egg", "cheese", "milk", "yogurt", "meat", "poultry", "seafood", "fish"])) {
    return "Produce";
  }
  if (matchesAny(c, ["laundry"])) return "Laundry";
  if (matchesAny(c, ["cleaning", "cleaner", "detergent"])) return "Cleaning";
  if (matchesAny(c, ["paper", "tissue", "towel"])) return "Paper Goods";
  if (matchesAny(c, ["health", "beauty", "personal care", "hygiene"])) return "Toiletries";
  if (matchesAny(c, ["pet"])) return "Pet Supplies";
  if (matchesAny(c, ["baby", "infant"])) return "Baby Supplies";
  if (matchesAny(c, ["batter"])) return "Batteries";
  if (matchesAny(c, ["office", "stationer"])) return "Office Supplies";
  if (matchesAny(c, ["hardware", "tool"])) return "Hardware";
  if (matchesAny(c, ["food", "grocery", "beverage", "drink"])) return "Staples";

  // Not "Staples" — a bottle of bleach is not a staple.
  return "Other";
}

function deduplicatePrefix(text: string): string {
  const words = text.split(" ");
  if (words.length < 2) return text;
  const half = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, half).join(" ").toLowerCase();
  const secondStart = words.slice(half, half + Math.ceil(words.length / 4)).join(" ").toLowerCase();
  if (secondStart && firstHalf.endsWith(secondStart)) {
    return words.slice(0, words.length - Math.ceil(words.length / 4)).join(" ");
  }
  return text;
}

function matchesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}
