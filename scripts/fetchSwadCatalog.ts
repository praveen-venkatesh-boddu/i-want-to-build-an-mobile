/// <reference types="node" />
/**
 * Downloads Swad's public product list once and writes the app's compact catalog.
 *
 *   npm run fetch:swad
 *
 * One GET, no login. Re-run it when you want a refresh; the app itself never calls Swad.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildSwadCatalog, type SwadProduct } from "../src/services/swadMapping";

const SOURCE = "https://www.swadfoods.com/api/all_products";
const OUTPUT = join(__dirname, "..", "src", "data", "swadCatalog.json");

async function main() {
  const response = await fetch(SOURCE, {
    headers: { Accept: "application/json", "User-Agent": "HomeStock personal catalog import" }
  });
  if (!response.ok) throw new Error(`Swad responded ${response.status}`);

  const products = (await response.json()) as SwadProduct[];
  if (!Array.isArray(products) || products.length === 0) throw new Error("Unexpected response shape");

  const { entries, skipped, duplicates } = buildSwadCatalog(products);
  writeFileSync(OUTPUT, JSON.stringify(entries) + "\n");

  const byCategory: Record<string, number> = {};
  for (const entry of entries) byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1;

  console.log(`Read ${products.length} products → wrote ${entries.length} (skipped ${skipped}, duplicate barcodes ${duplicates})`);
  console.log(byCategory);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
