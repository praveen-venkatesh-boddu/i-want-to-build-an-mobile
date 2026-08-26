/**
 * Hand-written fixtures standing in for real OCR output, so the extractor can be
 * built and tuned before a device build exists.
 *
 * Replace these with real captures as soon as you have them: phase one of the
 * build dumps `OcrBlock[]` to the console, and pasting a real one in here is the
 * single most useful thing you can do for accuracy. `expectLowConfidence` marks
 * fixtures that *should* be uncertain — a reader that is confidently wrong is
 * worse than one that admits it doesn't know.
 */

import type { OcrBlock } from "../types/label";

export type Fixture = {
  label: string;
  blocks: OcrBlock[];
  expect: {
    name?: string;
    category?: string;
    packageSize?: string;
    unit?: string;
  };
  expectLowConfidence?: boolean;
};

export const FIXTURES: Fixture[] = [
  {
    label: "Dish soap — two-line title",
    blocks: [
      { text: "Fairy", x: 0.22, y: 0.11, w: 0.56, h: 0.13 },
      { text: "Ultra Dish Soap", x: 0.16, y: 0.26, w: 0.68, h: 0.08 },
      { text: "Original Scent", x: 0.3, y: 0.38, w: 0.4, h: 0.035 },
      { text: "Cuts through grease", x: 0.28, y: 0.45, w: 0.44, h: 0.028 },
      { text: "21 fl oz", x: 0.38, y: 0.83, w: 0.24, h: 0.032 },
      { text: "0 3 7 0 0 0 4 2 1 8 8 5", x: 0.3, y: 0.93, w: 0.4, h: 0.022 }
    ],
    expect: {
      name: "Fairy Ultra Dish Soap",
      category: "Cleaning",
      packageSize: "21 fl oz",
      unit: "bottles"
    }
  },
  {
    label: "Laundry pods — brand dominant",
    blocks: [
      { text: "Tide", x: 0.26, y: 0.08, w: 0.48, h: 0.15 },
      { text: "PODS Ultra Oxi", x: 0.14, y: 0.26, w: 0.72, h: 0.075 },
      { text: "Laundry Detergent", x: 0.24, y: 0.37, w: 0.52, h: 0.035 },
      { text: "42 ct", x: 0.42, y: 0.79, w: 0.16, h: 0.03 },
      { text: "Keep out of reach of children", x: 0.2, y: 0.9, w: 0.6, h: 0.018 }
    ],
    expect: {
      name: "Tide PODS Ultra Oxi",
      category: "Laundry",
      packageSize: "42 ct",
      unit: "packs"
    }
  },
  {
    label: "Paper towels — sparse label",
    blocks: [
      { text: "Bounty", x: 0.2, y: 0.14, w: 0.6, h: 0.14 },
      { text: "Select-A-Size", x: 0.24, y: 0.31, w: 0.52, h: 0.06 },
      { text: "Paper Towels", x: 0.28, y: 0.4, w: 0.44, h: 0.04 },
      { text: "6 rolls", x: 0.42, y: 0.72, w: 0.16, h: 0.03 }
    ],
    expect: {
      name: "Bounty Select-A-Size",
      category: "Paper Goods",
      unit: "packs"
    }
  },
  {
    label: "Batteries — measurement-heavy",
    blocks: [
      { text: "Duracell", x: 0.18, y: 0.1, w: 0.64, h: 0.12 },
      { text: "Coppertop AA", x: 0.22, y: 0.25, w: 0.56, h: 0.07 },
      { text: "Alkaline Batteries", x: 0.26, y: 0.35, w: 0.48, h: 0.032 },
      { text: "1.5V", x: 0.44, y: 0.55, w: 0.12, h: 0.028 },
      { text: "8 ct", x: 0.44, y: 0.78, w: 0.12, h: 0.03 }
    ],
    expect: {
      name: "Duracell Coppertop AA",
      category: "Batteries",
      packageSize: "8 ct",
      unit: "packs"
    }
  },
  {
    label: "Toothpaste — metric size",
    blocks: [
      { text: "Sensodyne", x: 0.14, y: 0.12, w: 0.72, h: 0.11 },
      { text: "Repair & Protect", x: 0.2, y: 0.26, w: 0.6, h: 0.055 },
      { text: "Whitening Toothpaste", x: 0.22, y: 0.35, w: 0.56, h: 0.03 },
      { text: "75 ml", x: 0.44, y: 0.81, w: 0.14, h: 0.026 }
    ],
    expect: {
      name: "Sensodyne Repair & Protect",
      category: "Toiletries",
      packageSize: "2.5 fl oz"
    }
  },
  {
    label: "Olive oil — metric litre",
    blocks: [
      { text: "Filippo Berio", x: 0.16, y: 0.1, w: 0.68, h: 0.1 },
      { text: "Extra Virgin Olive Oil", x: 0.12, y: 0.23, w: 0.76, h: 0.055 },
      { text: "Cold Pressed", x: 0.32, y: 0.33, w: 0.36, h: 0.028 },
      { text: "1 L", x: 0.45, y: 0.86, w: 0.1, h: 0.026 }
    ],
    expect: {
      name: "Filippo Berio Extra Virgin Olive Oil",
      category: "Staples",
      packageSize: "1.1 qt"
    }
  },
  {
    label: "Canned tomatoes — boilerplate heavy",
    blocks: [
      { text: "Cirio", x: 0.3, y: 0.13, w: 0.4, h: 0.11 },
      { text: "Chopped Tomatoes", x: 0.13, y: 0.27, w: 0.74, h: 0.06 },
      { text: "Ingredients: tomatoes, tomato juice, citric acid", x: 0.1, y: 0.56, w: 0.8, h: 0.02 },
      { text: "Best before end: see lid", x: 0.2, y: 0.62, w: 0.6, h: 0.018 },
      { text: "400 g", x: 0.43, y: 0.82, w: 0.14, h: 0.028 },
      { text: "Please recycle", x: 0.34, y: 0.9, w: 0.32, h: 0.016 }
    ],
    expect: {
      name: "Cirio Chopped Tomatoes",
      category: "Cans",
      // 400 g converts to 14.1 oz; sizes at or above 10 round to whole numbers,
      // which reads better in the editor's size field than a spurious decimal.
      packageSize: "14 oz"
    }
  },
  {
    label: "Cat litter — sack, name low on pack",
    blocks: [
      { text: "Catsan", x: 0.24, y: 0.09, w: 0.52, h: 0.13 },
      { text: "Hygiene Cat Litter", x: 0.16, y: 0.24, w: 0.68, h: 0.065 },
      { text: "Non-clumping", x: 0.32, y: 0.34, w: 0.36, h: 0.026 },
      { text: "10 L", x: 0.44, y: 0.8, w: 0.12, h: 0.03 }
    ],
    expect: {
      name: "Catsan Hygiene Cat Litter",
      category: "Pet Supplies"
    }
  },
  {
    label: "Store brand — price sticker and URL present",
    blocks: [
      { text: "$4.99", x: 0.06, y: 0.05, w: 0.2, h: 0.06 },
      { text: "Great Value", x: 0.2, y: 0.16, w: 0.6, h: 0.1 },
      { text: "Jasmine Rice", x: 0.24, y: 0.29, w: 0.52, h: 0.07 },
      { text: "Long grain", x: 0.36, y: 0.39, w: 0.28, h: 0.025 },
      { text: "www.greatvalue.com", x: 0.28, y: 0.88, w: 0.44, h: 0.018 },
      { text: "5 lb", x: 0.45, y: 0.76, w: 0.1, h: 0.03 }
    ],
    expect: {
      name: "Great Value Jasmine Rice",
      category: "Staples",
      packageSize: "5 lb",
      unit: "bags"
    }
  },
  {
    label: "Uniform type — should NOT be confident",
    blocks: [
      { text: "Premium Quality", x: 0.1, y: 0.2, w: 0.35, h: 0.04 },
      { text: "Natural Choice", x: 0.55, y: 0.2, w: 0.35, h: 0.04 },
      { text: "Family Favourite", x: 0.1, y: 0.3, w: 0.35, h: 0.04 },
      { text: "Everyday Value", x: 0.55, y: 0.3, w: 0.35, h: 0.04 }
    ],
    expect: {},
    expectLowConfidence: true
  }
];
