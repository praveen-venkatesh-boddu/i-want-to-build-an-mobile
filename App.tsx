import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { makeEmptyDraft, PERISHABLE_CATEGORIES, starterItems } from "./src/constants/pantry";
import { loadPantryItems, savePantryItems } from "./src/storage/pantryStorage";
import { globalStyles } from "./src/styles/globalStyles";
import { daysSince, daysUntil, todayISO } from "./src/utils/date";
import { BottomNavBar } from "./src/components/BottomNavBar";
import { AddChoiceScreen } from "./src/screens/AddChoiceScreen";
import { AddPerishableScreen } from "./src/screens/AddPerishableScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ItemEditorScreen } from "./src/screens/ItemEditorScreen";
import { PantryListScreen } from "./src/screens/PantryListScreen";
import type { FilterKey, HomeView, ItemDraft, PantryItem } from "./src/types/pantry";


export default function App() {
  const [items, setItems] = useState<PantryItem[]>(starterItems);
  const [homeView, setHomeView] = useState<HomeView>("home");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [draft, setDraft] = useState<ItemDraft>(makeEmptyDraft);

  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const editReturnView = useRef<HomeView>("find");
  const [hasLoaded, setHasLoaded] = useState(false);

  // ── Persistence ────────────────────────────────────────────────────────
  useEffect(() => {
    loadPantryItems()
      .then((stored) => { if (stored) setItems(stored); })
      .catch(() => Alert.alert("Storage issue", "Pantry Pocket could not load saved items."))
      .finally(() => setHasLoaded(true));
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    savePantryItems(items).catch(() =>
      Alert.alert("Storage issue", "Pantry Pocket could not save your latest changes.")
    );
  }, [hasLoaded, items]);

  // ── Derived data ───────────────────────────────────────────────────────
const shoppingItems = useMemo(
    () => items.filter((i) => i.quantity === 0 && i.opened).sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => {
        if (!q) return true;
        return [item.name, item.category, item.location, item.notes, item.unit, item.packageSize]
          .join(" ").toLowerCase().includes(q);
      })
      .filter((item) => {
        if (filter === "expiring") return daysUntil(item.expiresOn) <= 7;
        if (filter === "low") return item.quantity === 0 && item.opened;
        if (filter === "opened") return item.opened;
        return true;
      })
      .sort((a, b) => daysUntil(a.expiresOn) - daysUntil(b.expiresOn));
  }, [filter, items, query]);

  const expiringCount = useMemo(
    () => items.filter((i) => daysUntil(i.expiresOn) <= 7).length,
    [items]
  );
  const perishablesCount = useMemo(
    () => items.filter(
      (i) => PERISHABLE_CATEGORIES.includes(i.category) && daysSince(i.addedOn) > 7
    ).length,
    [items]
  );

  // ── Actions ────────────────────────────────────────────────────────────
  function openEditItem(item: PantryItem) {
    setDraft({
      addedOn: item.addedOn,
      name: item.name,
      category: item.category,
      quantity: String(item.quantity),
      unit: item.unit,
      packageSize: item.packageSize,
      location: item.location,
      expiresOn: item.expiresOn,
      barcode: item.barcode,
      notes: item.notes,
      opened: item.opened
    });
    setEditingItem(item);
    editReturnView.current = homeView;
    setHomeView("edit-item");
  }

  function saveNewItem() {
    const name = draft.name.trim();
    const quantity = Number(draft.quantity);
    if (!name) { Alert.alert("Name required", "Add a name before saving."); return; }
    if (!Number.isFinite(quantity) || quantity < 0) { Alert.alert("Quantity required", "Use 0 or higher."); return; }
    if (draft.expiresOn && Number.isNaN(Date.parse(`${draft.expiresOn}T00:00:00`))) {
      Alert.alert("Check the date", "Use YYYY-MM-DD for expiry dates."); return;
    }
    addItem({ id: `${Date.now()}`, addedOn: todayISO(), name, category: draft.category,
      quantity, unit: draft.unit.trim() || "item", packageSize: draft.packageSize.trim(),
      location: draft.location.trim() || "Storage", expiresOn: draft.expiresOn.trim(),
      barcode: draft.barcode.trim(), notes: draft.notes.trim(), opened: draft.opened });
    setHomeView("home");
  }

  function saveEditedItem() {
    if (!editingItem) return;
    const name = draft.name.trim();
    const quantity = Number(draft.quantity);
    if (!name) { Alert.alert("Name required", "Add a name before saving."); return; }
    if (!Number.isFinite(quantity) || quantity < 0) { Alert.alert("Quantity required", "Use 0 or higher."); return; }
    if (draft.expiresOn && Number.isNaN(Date.parse(`${draft.expiresOn}T00:00:00`))) {
      Alert.alert("Check the date", "Use YYYY-MM-DD for expiry dates."); return;
    }
    const updated: PantryItem = { id: editingItem.id, addedOn: editingItem.addedOn, name,
      category: draft.category, quantity, unit: draft.unit.trim() || "item",
      packageSize: draft.packageSize.trim(), location: draft.location.trim() || "Storage",
      expiresOn: draft.expiresOn.trim(), barcode: draft.barcode.trim(),
      notes: draft.notes.trim(), opened: draft.opened };
    setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
    setEditingItem(null);
    setHomeView(editReturnView.current);
  }

  function addItem(item: PantryItem) {
    setItems((prev) => [item, ...prev]);
  }

  function useOneItem(item: PantryItem) {
    const newQty = Math.max(0, item.quantity - 1);
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: newQty, opened: newQty === 0 ? true : i.opened }
          : i
      )
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setEditingItem(null);
    setHomeView(editReturnView.current);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  const screenItems = homeView === "shopping" ? shoppingItems : visibleItems;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.safeArea}>
        <StatusBar style="dark" />

        {/* ── Screens ── */}
        {homeView === "home" && (
          <HomeScreen
            shoppingItems={shoppingItems}
            expiringCount={expiringCount}
            perishablesCount={perishablesCount}
            onGoToShopping={() => setHomeView("shopping")}
            onGoToExpiring={() => { setFilter("expiring"); setHomeView("find"); }}
          />
        )}

        {(homeView === "find" || homeView === "shopping") && (
          <PantryListScreen
            filter={filter}
            items={screenItems}
            query={query}

            view={homeView}
            onChangeFilter={setFilter}
            onChangeQuery={setQuery}
            onEditItem={openEditItem}
            onUseOneItem={useOneItem}
            onGoHome={() => setHomeView("home")}
          />
        )}

        {homeView === "add" && (
          <AddChoiceScreen
            onGoBack={() => setHomeView("home")}
            onGoToPerishable={() => setHomeView("add-perishable")}
            onGoToScanLookup={() => {
              setDraft(makeEmptyDraft());
              setHomeView("add-item");
            }}
          />
        )}

        {homeView === "add-perishable" && (
          <AddPerishableScreen
            onGoBack={() => setHomeView("add")}
            onSave={(item) => { addItem(item); setHomeView("home"); }}
          />
        )}

        {homeView === "add-item" && (
          <ItemEditorScreen
            draft={draft}
            insideApp
            isEditing={false}
            onCancel={() => setHomeView("add")}
            onChangeDraft={setDraft}
            onSave={saveNewItem}
          />
        )}

        {homeView === "edit-item" && (
          <ItemEditorScreen
            draft={draft}
            insideApp
            isEditing
            onCancel={() => { setEditingItem(null); setHomeView(editReturnView.current); }}
            onChangeDraft={setDraft}
            onRemove={editingItem ? () => removeItem(editingItem.id) : undefined}
            onSave={saveEditedItem}
          />
        )}

        {/* ── Bottom nav — always visible ── */}
        <BottomNavBar view={homeView} onSelectView={setHomeView} />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}
