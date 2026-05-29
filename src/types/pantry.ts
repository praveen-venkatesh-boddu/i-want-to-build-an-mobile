export type PantryItem = {
  id: string;
  addedOn: string;  // ISO date "YYYY-MM-DD"
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
};

export type ItemDraft = Omit<PantryItem, "id" | "quantity" | "opened"> & {
  quantity: string;
  opened: boolean;
};

export type FilterKey = "all" | "expiring" | "low" | "opened";

export type HomeView = "home" | "find" | "shopping" | "add" | "add-perishable" | "add-item" | "edit-item";

export type PantryStats = {
  total: number;
  expiring: number;
  low: number;
};
