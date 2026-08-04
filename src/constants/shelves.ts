import { Cube, Drop, Jar, Snowflake, SprayBottle, Stack } from "phosphor-react-native";

import type { Shelf, ShelfIconKey, ShelfZone } from "../types/pantry";

export const DEFAULT_SHELF_ID = "pantry";

export const SHELF_ICONS: ShelfIconKey[] = ["jar", "cube", "drop", "snowflake", "spray", "layers"];

export const SHELF_ZONES: ShelfZone[] = ["Grocery", "Household"];

export const SHELF_ICON_COMPONENTS: Record<ShelfIconKey, typeof Cube> = {
  jar: Jar,
  cube: Cube,
  drop: Drop,
  snowflake: Snowflake,
  spray: SprayBottle,
  layers: Stack
};

export const SHELF_SEED: Shelf[] = [
  { id: "pantry", name: "Pantry shelf", icon: "jar", zone: "Grocery", hidden: false },
  { id: "fridge", name: "Fridge", icon: "drop", zone: "Grocery", hidden: false },
  { id: "freezer", name: "Freezer drawer", icon: "snowflake", zone: "Grocery", hidden: false },
  { id: "sink", name: "Under the sink", icon: "spray", zone: "Household", hidden: false },
  { id: "utility", name: "Utility", icon: "cube", zone: "Household", hidden: false },
  { id: "bath", name: "Bathroom", icon: "drop", zone: "Household", hidden: false }
];
