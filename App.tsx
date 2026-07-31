import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  useFonts
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import "./src/styles/interFont";
import { BottomNavBar } from "./src/components/BottomNavBar";
import { HouseholdSheet } from "./src/components/HouseholdSheet";
import { ItemSheet } from "./src/components/ItemSheet";
import { Toast } from "./src/components/Toast";
import { filters, groupForLocation, makeEmptyDraft, starterItems } from "./src/constants/pantry";
import {
  cancelDeferReminder,
  requestNotificationPermissions,
  scheduleDeferReminder
} from "./src/services/notifications";
import { ExpiringScreen } from "./src/screens/ExpiringScreen";
import { ItemEditorScreen } from "./src/screens/ItemEditorScreen";
import { ListScreen } from "./src/screens/ListScreen";
import { RunScreen } from "./src/screens/RunScreen";
import { ScanScreen } from "./src/screens/ScanScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { ShelvesScreen } from "./src/screens/ShelvesScreen";
import { loadBasket, loadPantryItems, savePantryItems, saveBasket } from "./src/storage/pantryStorage";
import { globalStyles } from "./src/styles/globalStyles";
import { addDaysToISO, daysSince, daysUntil, todayISO } from "./src/utils/date";
import type { FilterKey, ItemDraft, PantryItem, Screen } from "./src/types/pantry";

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_300Light, Inter_400Regular, Inter_500Medium });

  const [items, setItems] = useState<PantryItem[]>(starterItems);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [basket, setBasket] = useState<Record<string, boolean>>({});
  const [basketLoaded, setBasketLoaded] = useState(false);

  const [screen, setScreen] = useState<Screen>("list");
  const [running, setRunning] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [householdOpen, setHouseholdOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [draft, setDraft] = useState<ItemDraft>(makeEmptyDraft);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  // ── Permissions & persistence ────────────────────────────────────────────
  useEffect(() => {
    void requestNotificationPermissions();
  }, []);

  useEffect(() => {
    loadPantryItems()
      .then((stored) => { if (stored) setItems(stored); })
      .catch(() => Alert.alert("Storage issue", "Home Stock could not load saved items."))
      .finally(() => setHasLoaded(true));
    loadBasket()
      .then((stored) => { if (stored) setBasket(stored); })
      .catch(() => {})
      .finally(() => setBasketLoaded(true));
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    savePantryItems(items).catch(() =>
      Alert.alert("Storage issue", "Home Stock could not save your latest changes.")
    );
  }, [hasLoaded, items]);

  useEffect(() => {
    if (!basketLoaded) return;
    void saveBasket(basket);
  }, [basketLoaded, basket]);

  // ── Derived data ───────────────────────────────────────────────────────
  const today = todayISO();

  const buyList = useMemo(
    () =>
      items
        .filter((i) => i.quantity === 0 && i.opened && (!i.deferredUntil || i.deferredUntil <= today))
        .sort((a, b) => daysSince(b.ranOutOn ?? "") - daysSince(a.ranOutOn ?? "")),
    [items, today]
  );

  const snoozedItems = useMemo(
    () =>
      items
        .filter((i) => i.quantity === 0 && i.opened && i.deferredUntil && i.deferredUntil > today)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [items, today]
  );

  const expiringItems = useMemo(
    () =>
      items
        .filter((i) => i.quantity > 0 && daysUntil(i.expiresOn) <= 7)
        .sort((a, b) => daysUntil(a.expiresOn) - daysUntil(b.expiresOn)),
    [items]
  );

  const shelvesCount = useMemo(
    () => new Set(items.map((i) => groupForLocation(i.location))).size,
    [items]
  );

  const runSource = useMemo(
    () => [...buyList, ...items.filter((i) => basket[i.id] && i.deferredUntil && i.deferredUntil > today)],
    [buyList, items, basket, today]
  );

  const shelvesFiltered = useMemo(() => {
    return items
      .filter((item) => {
        if (filter === "expiring") return daysUntil(item.expiresOn) <= 7;
        if (filter === "low") return item.quantity === 0 && item.opened;
        if (filter === "opened") return item.opened;
        return true;
      })
      .sort((a, b) => daysUntil(a.expiresOn) - daysUntil(b.expiresOn));
  }, [filter, items]);

  const sheetItem = useMemo(() => items.find((i) => i.id === sheetId) ?? null, [items, sheetId]);

  // ── Item sheet actions ────────────────────────────────────────────────
  function stepItem(item: PantryItem, delta: number) {
    const newQty = Math.max(0, item.quantity + delta);
    if (newQty > 0 && item.deferredUntil) void cancelDeferReminder(item.id);
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== item.id) return i;
        if (newQty === 0) {
          return { ...i, quantity: 0, opened: true, ranOutOn: i.quantity > 0 ? today : i.ranOutOn };
        }
        return { ...i, quantity: newQty, deferredUntil: undefined, ranOutOn: undefined };
      })
    );
  }

  function toggleOpened(item: PantryItem) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, opened: !i.opened } : i)));
  }

  function snoozeItem(item: PantryItem) {
    const deferredUntil = addDaysToISO(15);
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, deferredUntil } : i)));
    void scheduleDeferReminder(item.id, item.name, deferredUntil);
    flashToast(`${item.name} snoozed for 15 days.`);
    setSheetId(null);
  }

  function unsnoozeItem(item: PantryItem) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, deferredUntil: undefined } : i)));
    void cancelDeferReminder(item.id);
  }

  function editDetails(item: PantryItem) {
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
    setSheetId(null);
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
    setItems((prev) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? {
              ...i,
              name,
              category: draft.category,
              quantity,
              unit: draft.unit.trim() || "item",
              packageSize: draft.packageSize.trim(),
              location: draft.location.trim() || "Storage",
              expiresOn: draft.expiresOn.trim(),
              barcode: draft.barcode.trim(),
              notes: draft.notes.trim(),
              opened: draft.opened
            }
          : i
      )
    );
    setEditingItem(null);
  }

  function removeItem(id: string) {
    void cancelDeferReminder(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setEditingItem(null);
  }

  // ── Run actions ────────────────────────────────────────────────────────
  function startRun() {
    if (buyList.length === 0) {
      flashToast("Nothing to buy — your list is clear.");
      return;
    }
    setRunning(true);
    setScreen("run");
  }

  function toggleBasket(item: PantryItem) {
    setBasket((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
  }

  function finishRun() {
    const tickedIds = runSource.filter((i) => basket[i.id]).map((i) => i.id);
    setItems((prev) =>
      prev.map((i) =>
        tickedIds.includes(i.id)
          ? {
              ...i,
              quantity: Math.max(1, (i.par ?? 1) - i.quantity),
              opened: false,
              deferredUntil: undefined,
              ranOutOn: undefined
            }
          : i
      )
    );
    setBasket({});
    setRunning(false);
    setScreen("list");
    const n = tickedIds.length;
    flashToast(`${n} ${n === 1 ? "item" : "items"} restocked. Shelves updated.`);
  }

  function backHomeFromEmptyRun() {
    setBasket({});
    setRunning(false);
    setScreen("list");
  }

  // ── Scan actions ───────────────────────────────────────────────────────
  function addFromScan(input: {
    name: string;
    category: string;
    packageSize: string;
    unit: string;
    barcode: string;
    location: string;
    quantity: number;
  }) {
    const incomingKey = input.name.trim().toLowerCase();
    setItems((prev) => {
      const existing = prev.find((i) => i.name.trim().toLowerCase() === incomingKey);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + input.quantity } : i
        );
      }
      const newItem: PantryItem = {
        id: `${Date.now()}`,
        addedOn: todayISO(),
        name: input.name,
        category: input.category || "Staples",
        quantity: input.quantity,
        unit: input.unit || "items",
        packageSize: input.packageSize,
        location: input.location,
        expiresOn: "",
        barcode: input.barcode,
        notes: "",
        opened: false,
        par: Math.max(1, input.quantity),
        addedBy: "You"
      };
      return [newItem, ...prev];
    });
    setScreen("shelves");
    flashToast(`${input.name} added to ${input.location.toLowerCase()}.`);
  }

  // ── Misc ───────────────────────────────────────────────────────────────
  function flashToast(message: string) {
    setToast(message);
  }

  function cycleFilter() {
    const idx = filters.findIndex((f) => f.key === filter);
    setFilter(filters[(idx + 1) % filters.length].key);
  }

  const ready = fontsLoaded && hasLoaded && basketLoaded;
  const showNavBar = screen !== "run" && screen !== "scan";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.safeArea}>
        <StatusBar style="light" />

        {!ready ? null : editingItem ? (
          <ItemEditorScreen
            draft={draft}
            isEditing
            onCancel={() => setEditingItem(null)}
            onChangeDraft={setDraft}
            onRemove={() => removeItem(editingItem.id)}
            onSave={saveEditedItem}
          />
        ) : (
          <>
            {screen === "list" && (
              <ListScreen
                buyList={buyList}
                snoozedItems={snoozedItems}
                expiringCount={expiringItems.length}
                totalCount={items.length}
                shelvesCount={shelvesCount}
                onStartRun={startRun}
                onOpenHousehold={() => setHouseholdOpen(true)}
                onOpenSettings={() => flashToast("Settings isn't built yet.")}
                onOpenItem={(item) => setSheetId(item.id)}
                onGoExpiring={() => setScreen("expiring")}
                onGoShelves={() => setScreen("shelves")}
                onSeeMoreOutOfStock={() => {
                  setFilter("low");
                  setScreen("shelves");
                }}
              />
            )}

            {screen === "shelves" && (
              <ShelvesScreen
                allItems={items}
                filteredItems={shelvesFiltered}
                filter={filter}
                onCycleFilter={cycleFilter}
                onGoSearch={() => setScreen("search")}
                onOpenItem={(item) => setSheetId(item.id)}
              />
            )}

            {screen === "run" && (
              <RunScreen
                runItems={runSource}
                basket={basket}
                onToggleBasket={toggleBasket}
                onPause={() => setScreen("list")}
                onFinish={finishRun}
                onNothingTicked={() => flashToast("Tick something into the basket first.")}
                onBackHome={backHomeFromEmptyRun}
                onScan={() => setScreen("scan")}
              />
            )}

            {screen === "expiring" && (
              <ExpiringScreen
                items={expiringItems}
                onOpenItem={(item) => setSheetId(item.id)}
                onUseOne={(item) => {
                  stepItem(item, -1);
                  flashToast(`Used one ${item.name.toLowerCase()}.`);
                }}
              />
            )}

            {screen === "search" && (
              <SearchScreen
                items={items}
                query={query}
                onChangeQuery={setQuery}
                onOpenItem={(item) => setSheetId(item.id)}
              />
            )}

            {screen === "scan" && (
              <ScanScreen
                onClose={() => setScreen(running ? "run" : "list")}
                onAddToShelf={addFromScan}
              />
            )}

            {showNavBar && <BottomNavBar screen={screen} onSelectScreen={setScreen} />}

            <ItemSheet
              item={sheetItem}
              onClose={() => setSheetId(null)}
              onStep={stepItem}
              onToggleOpened={toggleOpened}
              onSnooze={snoozeItem}
              onUnsnooze={unsnoozeItem}
              onEditDetails={editDetails}
            />

            <HouseholdSheet
              visible={householdOpen}
              onClose={() => setHouseholdOpen(false)}
              onInvite={() => {
                setHouseholdOpen(false);
                flashToast("Invites aren't set up yet.");
              }}
            />
          </>
        )}

        {ready ? <Toast message={toast} onDismiss={() => setToast("")} /> : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
