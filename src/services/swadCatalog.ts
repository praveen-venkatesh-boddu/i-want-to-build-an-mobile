import catalog from "../data/swadCatalog.json";
import type { ProductLookupResult } from "./productLookup";
import type { SwadCatalogEntry } from "./swadMapping";

let index: Map<string, SwadCatalogEntry> | null = null;

function getIndex() {
  if (!index) {
    index = new Map((catalog as SwadCatalogEntry[]).map((entry) => [entry.barcode, entry]));
  }
  return index;
}

/**
 * Swad prints a 10-digit code in its catalog, but a scanner reports the full
 * 12-digit UPC-A (number system + those 10 digits + check digit) or a 13-digit EAN
 * with a leading 0. Try the code as read, then the 10-digit core inside it.
 */
function candidateKeys(barcode: string): string[] {
  const digits = barcode.replace(/\D/g, "");
  const keys = [digits];
  const upc = digits.length === 13 && digits.startsWith("0") ? digits.slice(1) : digits;
  if (upc.length === 12) keys.push(upc.slice(1, 11));
  return keys;
}

/** Bundled, offline, instant. Returns null for anything that isn't a Swad product. */
export function findInSwadCatalog(barcode: string): ProductLookupResult | null {
  const lookup = getIndex();
  for (const key of candidateKeys(barcode)) {
    const entry = lookup.get(key);
    if (entry) {
      return {
        name: entry.name,
        category: entry.category,
        unit: entry.unit,
        packageSize: entry.packageSize
      };
    }
  }
  return null;
}

/** The whole catalog, for features that match by name rather than by scanned code. */
export function getSwadCatalog(): SwadCatalogEntry[] {
  return catalog as SwadCatalogEntry[];
}
