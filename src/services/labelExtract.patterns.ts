/**
 * Tuning data for the label reader — reject patterns, category keywords and the
 * package-size grammar.
 *
 * Kept apart from the algorithm on purpose: this is the file you edit after a bad
 * scan, and a data-only diff is much easier to reason about than a logic one.
 * Every entry is named so `scanLog` can record *which* rule fired.
 */

export type NamedPattern = { name: string; re: RegExp };

/**
 * Text that is definitely not a product name. A match is a hard penalty rather
 * than a filter, so a label whose every block is rejected still returns its best
 * candidate instead of nothing.
 */
export const REJECT_PATTERNS: NamedPattern[] = [
  { name: "price", re: /^\s*[$£€]\s*\d/ },
  { name: "net-weight-label", re: /^\s*net\s*(wt|weight)/i },
  { name: "bare-measurement", re: /^\s*[\d.,]+\s*(fl\s*oz|oz|ml|l|g|kg|lb|lbs|ct|pk|count|pack)\s*$/i },
  { name: "long-digit-run", re: /\d{7,}/ },
  { name: "web-or-email", re: /(https?:\/\/|www\.|\.com|\.co\.uk|@)/i },
  {
    name: "boilerplate",
    re: /(nutrition\s*facts|ingredients?|distributed\s*by|manufactured|packed\s*for|best\s*before|use\s*by|sell\s*by|keep\s*refrigerated|store\s*in\s*a|shake\s*well|recyclable|please\s*recycle|customer\s*service|satisfaction\s*guaranteed|questions\s*or\s*comments)/i
  },
  {
    name: "certification",
    re: /^\s*(usda\s*organic|certified\s*organic|non[-\s]?gmo|kosher|halal|gluten[-\s]?free|fair\s*trade|bpa[-\s]?free|cruelty[-\s]?free|vegan)\s*$/i
  },
  { name: "warning", re: /^\s*(warning|caution|danger|keep out of reach)/i }
];

/** Measurements. Used both to reject a block as a name and to harvest `packageSize`. */
export const SIZE_PATTERN =
  /(\d+(?:[.,]\d+)?)\s*(fl\s*oz|fluid\s*ounces?|oz|ounces?|ml|millilit(?:re|er)s?|l\b|lit(?:re|er)s?|g\b|grams?|kg|kilograms?|lbs?\b|pounds?|ct\b|count|pk\b|pack)/i;

/**
 * Maps a measurement unit as printed onto the app's `PKG_UNIT_OPTIONS`
 * (`fl oz | lb | oz | qt | ct`), which is the vocabulary the editor's size field speaks.
 */
export const SIZE_UNIT_ALIASES: Array<{ match: RegExp; unit: string }> = [
  { match: /^(fl\s*oz|fluid\s*ounces?)$/i, unit: "fl oz" },
  { match: /^(oz|ounces?)$/i, unit: "oz" },
  { match: /^(lbs?|pounds?)$/i, unit: "lb" },
  { match: /^(ct|count|pk|pack)$/i, unit: "ct" },
  { match: /^(ml|millilit(re|er)s?)$/i, unit: "fl oz" },
  { match: /^(l|lit(re|er)s?)$/i, unit: "qt" },
  { match: /^(g|grams?)$/i, unit: "oz" },
  { match: /^(kg|kilograms?)$/i, unit: "lb" }
];

/** Rough conversions, applied when a label is metric but the app's field is imperial. */
export const SIZE_CONVERSIONS: Array<{ from: RegExp; factor: number }> = [
  { from: /^(ml|millilit(re|er)s?)$/i, factor: 1 / 29.5735 }, // ml  → fl oz
  { from: /^(l|lit(re|er)s?)$/i, factor: 1.05669 }, //            l   → qt
  { from: /^(g|grams?)$/i, factor: 1 / 28.3495 }, //              g   → oz
  { from: /^(kg|kilograms?)$/i, factor: 2.20462 } //              kg  → lb
];

/** Container words, swept across the whole label to fill the editor's package type. */
export const PACKAGE_TYPE_KEYWORDS: Array<{ keyword: RegExp; unit: string }> = [
  { keyword: /\bbottles?\b/i, unit: "bottles" },
  { keyword: /\bcans?\b/i, unit: "cans" },
  { keyword: /\bjars?\b/i, unit: "jars" },
  { keyword: /\bboxe?s?\b/i, unit: "boxes" },
  { keyword: /\bcartons?\b/i, unit: "cartons" },
  { keyword: /\bpouch(?:es)?\b/i, unit: "pouches" },
  { keyword: /\bbags?\b/i, unit: "bags" },
  { keyword: /\b(packs?|pk)\b/i, unit: "packs" },
  { keyword: /\btubes?\b/i, unit: "packs" },
  { keyword: /\brolls?\b/i, unit: "packs" }
];

/**
 * Keywords per category, checked against the whole label text.
 *
 * Order matters: the first category with a hit wins, so the specific and
 * unambiguous ones (Batteries, Laundry) sit above the broad ones (Staples).
 * Every value here must exist in `constants/pantry.ts` → `categories`.
 */
export const CATEGORY_KEYWORDS: Array<{ category: string; keywords: RegExp }> = [
  { category: "Batteries", keywords: /\b(alkaline|lithium|aaa?\b|\bd cell|9v|volts?|rechargeable batter)/i },
  { category: "Laundry", keywords: /\b(laundry|detergent pods|fabric softener|dryer sheets?|stain remover|bleach)\b/i },
  { category: "Cleaning", keywords: /\b(dish\s*(soap|washing)|all[-\s]?purpose cleaner|disinfect|degreas|glass cleaner|scouring|multi[-\s]?surface|toilet cleaner)\b/i },
  { category: "Paper Goods", keywords: /\b(paper towels?|toilet (paper|tissue)|facial tissues?|napkins?|paper plates?)\b/i },
  { category: "Toiletries", keywords: /\b(shampoo|conditioner|toothpaste|mouthwash|deodorant|body wash|hand soap|lotion|razor|floss|sunscreen)\b/i },
  { category: "First Aid", keywords: /\b(bandages?|band[-\s]?aid|antiseptic|ibuprofen|acetaminophen|paracetamol|gauze|first aid)\b/i },
  { category: "Baby Supplies", keywords: /\b(diapers?|nappies|baby wipes?|infant formula|baby food)\b/i },
  { category: "Pet Supplies", keywords: /\b(dog food|cat food|cat litter|pet treats?|kibble)\b/i },
  { category: "Office Supplies", keywords: /\b(printer paper|ballpoint|staples? \(|envelopes?|notebooks?|ink cartridge)\b/i },
  { category: "Hardware", keywords: /\b(screws?|nails?|duct tape|light bulbs?|batteries not|adhesive|sandpaper)\b/i },
  { category: "Frozen", keywords: /\b(frozen|keep frozen|ice cream)\b/i },
  { category: "Produce", keywords: /\b(fresh (fruit|vegetable)|organic (apples?|bananas?|spinach|kale|carrots?))\b/i },
  {
    category: "Cans",
    keywords: /\b(canned|tinned|in brine|in spring water|in tomato (sauce|juice)|condensed soup|(chopped|crushed|peeled|plum) tomatoes|baked beans|chick\s?peas|sweetcorn|coconut milk)\b/i
  },
  { category: "Spices", keywords: /\b(ground (cumin|cinnamon|pepper|paprika)|sea salt|seasoning|chili powder|oregano|turmeric)\b/i },
  { category: "Snacks", keywords: /\b(chips|crisps|crackers|cookies|biscuits|granola bars?|popcorn|pretzels?)\b/i },
  { category: "Staples", keywords: /\b(rice|pasta|flour|sugar|olive oil|cereal|oats|coffee|tea bags?|lentils|beans)\b/i }
];

/** Used when nothing matches. Deliberately not "Staples" — a bottle of bleach is not a staple. */
export const FALLBACK_CATEGORY = "Other";
