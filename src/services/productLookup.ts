import { getDefaultPackageSize, packageTypes } from "../constants/pantry";
import type { ItemDraft } from "../types/pantry";

type OpenFoodFactsResponse = {
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

type ProductLookupResult = {
  category?: string;
  name?: string;
  packageSize?: string;
  unit?: string;
};

export async function lookupProductByBarcode(barcode: string): Promise<ProductLookupResult | null> {
  const offResult = await lookupOpenFoodFacts(barcode);
  if (offResult) return offResult;
  return lookupUpcItemDb(barcode);
}

async function lookupOpenFoodFacts(barcode: string): Promise<ProductLookupResult | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
        barcode
      )}.json?fields=product_name,product_name_en,brands,quantity,categories`
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as OpenFoodFactsResponse;
    if (payload.status !== 1 || !payload.product) return null;

    const product = payload.product;
    const name = [product.product_name_en ?? product.product_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    const category = mapOpenFoodFactsCategory(product.categories ?? []);
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

    const rawName = [item.brand, item.title]
      .filter(Boolean)
      .join(" ")
      .trim();
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
    category: lookupResult.category ?? current.category,
    name: lookupResult.name ?? current.name,
    packageSize: lookupResult.packageSize ?? current.packageSize,
    unit: lookupResult.unit ?? current.unit
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

function mapOpenFoodFactsCategory(categoryTags: string[]) {
  const normalizedTags = categoryTags.join(" ").toLowerCase();

  if (matchesAny(normalizedTags, ["spice", "herb", "seasoning", "sauce", "condiment"])) return "Spices";
  if (matchesAny(normalizedTags, ["fruit", "vegetable", "produce"])) return "Produce";
  if (matchesAny(normalizedTags, ["frozen"])) return "Frozen";
  if (matchesAny(normalizedTags, ["snack", "chips", "crackers", "cookies", "confectionery"])) return "Snacks";
  if (matchesAny(normalizedTags, ["canned", "tin", "preserved-foods"])) return "Cans";
  return "Staples";
}

function mapUpcItemDbCategory(category: string) {
  const c = category.toLowerCase();

  if (matchesAny(c, ["food", "grocery", "beverage", "drink"])) return "Staples";
  if (matchesAny(c, ["frozen"])) return "Frozen";
  if (matchesAny(c, ["snack", "candy", "confection", "chip", "cookie"])) return "Snacks";
  if (matchesAny(c, ["spice", "herb", "sauce", "condiment", "seasoning"])) return "Spices";
  if (matchesAny(c, ["produce", "fruit", "vegetable"])) return "Produce";
  if (matchesAny(c, ["dairy", "egg", "cheese", "milk", "yogurt"])) return "Dairy";
  if (matchesAny(c, ["meat", "poultry", "seafood", "fish"])) return "Meat";
  if (matchesAny(c, ["health", "beauty", "personal care", "cleaning", "household", "paper"])) return "Household";
  return "Staples";
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
