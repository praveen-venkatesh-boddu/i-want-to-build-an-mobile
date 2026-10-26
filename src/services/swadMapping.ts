/**
 * Turns one row of Swad's public product list into this app's vocabulary.
 *
 * Pure and dependency-free so the fetch script and the tests can share it. The
 * app only ever sees the result (`src/data/swadCatalog.json`), never Swad's shape.
 */

export type SwadProduct = {
  barcode?: string | null;
  name?: string | null;
  category?: string | null;
  product_sizes?: string | null;
};

export type SwadCatalogEntry = {
  barcode: string;
  name: string;
  /** One of `categories` in constants/pantry.ts. */
  category: string;
  /** One of `packageTypes[].value` in constants/pantry.ts. */
  unit: string;
  /** Only set when the product lists exactly one size; otherwise the barcode can't say which. */
  packageSize?: string;
};

/** Swad's own category (lowercased) → this app's category. */
const CATEGORY_MAP: Record<string, string> = {
  "atta / flours": "Staples",
  "besan / flour": "Staples",
  flours: "Staples",
  "organic / flour": "Staples",
  "cooking oil": "Staples",
  "cooking oils": "Staples",
  ghee: "Staples",
  "dals & beans": "Staples",
  "organic / dals and beans": "Staples",
  rice: "Staples",
  "organic / rice": "Staples",
  poha: "Staples",
  "organic / poha": "Staples",
  "south indian": "Staples",
  "organic / south indian": "Staples",
  "sakar/sugar": "Staples",
  "gud / jaggery": "Staples",
  tamarind: "Staples",
  "coconut items": "Staples",
  "ready to eat": "Staples",

  spices: "Spices",
  "organic / spices": "Spices",
  "patel spices": "Spices",
  paste: "Spices",
  "sauce / chutney": "Spices",
  "pickles / condiments": "Spices",
  "patak pickles": "Spices",

  snacks: "Snacks",
  chakri: "Snacks",
  "chikki/ladu": "Snacks",
  "far far": "Snacks",
  "khakhra/khichya": "Snacks",
  "khari and toast": "Snacks",
  papad: "Snacks",
  mukhwas: "Snacks",
  "mamra / dhani": "Snacks",
  "dry fruit / nuts": "Snacks",
  nuts: "Snacks",

  "mango pulp": "Staples",
  "pooja products": "Other"
};

/** Unit by Swad category; anything else is a dry-goods pouch (bag when large). */
const JAR_CATEGORIES = new Set(["ghee", "paste", "sauce / chutney", "pickles / condiments", "patak pickles"]);
const BOTTLE_CATEGORIES = new Set(["cooking oil", "cooking oils"]);

/** A few products ship with no category at all; infer from the name. */
function categoryFromName(name: string): { category: string; swadKey: string } {
  const n = name.toLowerCase();
  if (/glycerin|castor|neem|eucl|nilgiri/.test(n)) return { category: "Toiletries", swadKey: "" };
  if (/\boil\b|ghee/.test(n)) return { category: "Staples", swadKey: "cooking oil" };
  if (/hing|masala|spice/.test(n)) return { category: "Spices", swadKey: "spices" };
  return { category: "Other", swadKey: "" };
}

const UNIT_ALIASES: Record<string, { unit: string; ounces?: number }> = {
  oz: { unit: "oz", ounces: 1 },
  lb: { unit: "lb", ounces: 16 },
  lbs: { unit: "lb", ounces: 16 },
  g: { unit: "g", ounces: 0.035274 },
  gm: { unit: "g", ounces: 0.035274 },
  kg: { unit: "kg", ounces: 35.274 },
  ml: { unit: "ml" },
  l: { unit: "L" },
  lt: { unit: "L" },
  ltr: { unit: "L" },
  gal: { unit: "gal" },
  gallon: { unit: "gal" },
  pc: { unit: "ct" },
  pcs: { unit: "ct" },
  box: { unit: "box" }
};

type ParsedSize = { text: string; ounces?: number; isCount: boolean; isVolume: boolean };

function parseSize(raw: string): ParsedSize | null {
  const match = raw.trim().match(/^([\d.]+)\s*([A-Za-z]+)/);
  if (!match) return null;
  const alias = UNIT_ALIASES[match[2].toLowerCase()];
  if (!alias) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return {
    text: `${match[1]} ${alias.unit}`,
    ounces: alias.ounces ? amount * alias.ounces : undefined,
    isCount: alias.unit === "ct" || alias.unit === "box",
    isVolume: alias.unit === "ml" || alias.unit === "L" || alias.unit === "gal"
  };
}

function titleCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/\borg\.?(?=\s|$)/g, "organic")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|[\s/(&-])([a-z])/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** Returns null for rows we can't use (no name, or a barcode that isn't a plain 8–12 digit code). */
export function mapSwadProduct(product: SwadProduct): SwadCatalogEntry | null {
  // A few rows are padded ("0000000000" + code) or prefixed with a word; the code is still inside.
  let barcode = String(product.barcode ?? "").replace(/\D/g, "");
  if (barcode.length > 12) barcode = barcode.replace(/^0+/, "");
  const rawName = String(product.name ?? "").trim();
  if (!/^\d{8,12}$/.test(barcode) || !rawName) return null;

  const swadKey = String(product.category ?? "").trim().toLowerCase();
  let category = CATEGORY_MAP[swadKey];
  let unitKey = swadKey;
  if (!category) {
    const guess = categoryFromName(rawName);
    category = guess.category;
    unitKey = guess.swadKey;
  }

  const sizes = String(product.product_sizes ?? "")
    .split(",")
    .map(parseSize)
    .filter((size): size is ParsedSize => size !== null);

  const isLiquid = BOTTLE_CATEGORIES.has(unitKey);
  let unit: string;
  if (JAR_CATEGORIES.has(unitKey)) unit = "jars";
  else if (isLiquid) unit = "bottles";
  else if (swadKey === "mango pulp") unit = "cans";
  else if (swadKey === "pooja products" || sizes.some((size) => size.isCount)) unit = "items";
  else if (sizes.some((size) => size.isVolume)) unit = "bottles";
  else if (sizes.some((size) => (size.ounces ?? 0) >= 32)) unit = "bags";
  else unit = "pouches";

  const entry: SwadCatalogEntry = { barcode, name: titleCase(rawName), category, unit };

  if (sizes.length === 1) {
    entry.packageSize = isLiquid && sizes[0].text.endsWith(" oz") ? `${sizes[0].text.slice(0, -3)} fl oz` : sizes[0].text;
  }
  return entry;
}

export function buildSwadCatalog(products: SwadProduct[]): {
  entries: SwadCatalogEntry[];
  skipped: number;
  duplicates: number;
} {
  const seen = new Set<string>();
  const entries: SwadCatalogEntry[] = [];
  let skipped = 0;
  let duplicates = 0;

  for (const product of products) {
    const entry = mapSwadProduct(product);
    if (!entry) {
      skipped += 1;
    } else if (seen.has(entry.barcode)) {
      duplicates += 1;
    } else {
      seen.add(entry.barcode);
      entries.push(entry);
    }
  }
  return { entries, skipped, duplicates };
}
