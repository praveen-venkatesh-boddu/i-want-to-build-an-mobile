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
  deferredUntil?: string; // ISO date — item hidden from active shopping list until this date
};

export type ItemDraft = Omit<PantryItem, "id" | "quantity" | "opened"> & {
  quantity: string;
  opened: boolean;
};

export type FilterKey = "all" | "expiring" | "low" | "opened";

export type SnoozePeriod = "15d" | "1m" | "2m";

export type HomeView = "home" | "find" | "shopping" | "add" | "add-perishable" | "add-item" | "edit-item";

export type PantryStats = {
  total: number;
  expiring: number;
  low: number;
};
