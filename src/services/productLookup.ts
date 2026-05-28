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

type ProductLookupResult = {
  category?: string;
  name?: string;
  packageSize?: string;
  unit?: string;
};

export async function lookupProductByBarcode(barcode: string): Promise<ProductLookupResult | null> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
      barcode
    )}.json?fields=product_name,product_name_en,brands,quantity,categories`
  );

  if (!response.ok) {
    throw new Error("Product lookup failed");
  }

  const payload = (await response.json()) as OpenFoodFactsResponse;
  if (payload.status !== 1 || !payload.product) {
    return null;
  }

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

function inferPackageType(quantity: string) {
  const normalizedQuantity = quantity.toLowerCase();

  if (normalizedQuantity.includes("can")) {
    return "cans";
  }
  if (normalizedQuantity.includes("bag")) {
    return "bags";
  }
  if (normalizedQuantity.includes("box")) {
    return "boxes";
  }
  if (normalizedQuantity.includes("jar")) {
    return "jars";
  }
  if (normalizedQuantity.includes("bottle")) {
    return "bottles";
  }
  if (normalizedQuantity.includes("carton")) {
    return "cartons";
  }
  if (normalizedQuantity.includes("pouch")) {
    return "pouches";
  }
  if (normalizedQuantity.includes("pack")) {
    return "packs";
  }

  const hasKnownMeasure = /\d/.test(normalizedQuantity) && /(g|kg|lb|oz|ml|l|fl oz)/.test(normalizedQuantity);
  return hasKnownMeasure ? "items" : packageTypes[packageTypes.length - 1]?.value;
}

function mapOpenFoodFactsCategory(categoryTags: string[]) {
  const normalizedTags = categoryTags.join(" ").toLowerCase();

  if (matchesAny(normalizedTags, ["spice", "herb", "seasoning", "sauce", "condiment"])) {
    return "Spices";
  }
  if (matchesAny(normalizedTags, ["fruit", "vegetable", "produce"])) {
    return "Produce";
  }
  if (matchesAny(normalizedTags, ["frozen"])) {
    return "Frozen";
  }
  if (matchesAny(normalizedTags, ["snack", "chips", "crackers", "cookies", "confectionery"])) {
    return "Snacks";
  }
  if (matchesAny(normalizedTags, ["canned", "tin", "preserved-foods"])) {
    return "Cans";
  }

  return "Staples";
}

function matchesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}
