export type PantryItem = {
  id: string;
  addedOn: string;       // ISO date "YYYY-MM-DD"
  name: string;
  category: string;
  quantity: number;
  unit: string;
  packageSize: string;
  location: string;
  expiresOn: string;
  barcode: string;
  notes: string;
  opened: boolean;
  deferredUntil?: string; // ISO date — item hidden from the buy list until this date ("snoozed")
  par?: number;            // target stock — drives the shelves gauge and the run's "wanted" amount
  addedBy?: string;        // household member who added the item, shown on run rows
  ranOutOn?: string;       // ISO date set when quantity hits 0 — drives the List screen's "how long" column
};

export type ItemDraft = Omit<PantryItem, "id" | "quantity" | "opened"> & {
  quantity: string;
  opened: boolean;
};

export type FilterKey = "all" | "expiring" | "low" | "opened";

export type Screen = "list" | "run" | "shelves" | "expiring" | "search" | "scan" | "settings";

export type PantryStats = {
  total: number;
  expiring: number;
  low: number;
};

export type ShelfIconKey = "jar" | "cube" | "drop" | "snowflake" | "spray" | "layers";

export type ShelfZone = "Grocery" | "Household";

export type Shelf = {
  id: string;
  name: string;
  icon: ShelfIconKey;
  zone: ShelfZone;
  hidden: boolean;
};

export type NotifSettings = {
  expiry: boolean;
  low: boolean;
};
