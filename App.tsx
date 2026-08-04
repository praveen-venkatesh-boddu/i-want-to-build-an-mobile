import { IBMPlexSans_300Light, IBMPlexSans_400Regular, IBMPlexSans_500Medium } from "@expo-google-fonts/ibm-plex-sans";
import { SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import "./src/styles/defaultFont";
import { BottomNavBar } from "./src/components/BottomNavBar";
import { HouseholdSheet } from "./src/components/HouseholdSheet";
import { ItemSheet } from "./src/components/ItemSheet";
import { ShelfSheet } from "./src/components/ShelfSheet";
import { Toast } from "./src/components/Toast";
import { filters, makeEmptyDraft, starterItems } from "./src/constants/pantry";
import { DEFAULT_SHELF_ID, SHELF_SEED } from "./src/constants/shelves";
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
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ShelvesScreen } from "./src/screens/ShelvesScreen";
import { loadBasket, loadPantryItems, savePantryItems, saveBasket } from "./src/storage/pantryStorage";
import { loadShelves, loadSettings, saveShelves, saveSettings } from "./src/storage/shelfStorage";
import { globalStyles } from "./src/styles/globalStyles";
import { addDaysToISO, daysSince, daysUntil, todayISO } from "./src/utils/date";
import type { FilterKey, ItemDraft, NotifSettings, PantryItem, Screen, Shelf } from "./src/types/pantry";

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium
  });

  const [items, setItems] = useState<PantryItem[]>(starterItems);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [basket, setBasket] = useState<Record<string, boolean>>({});
  const [basketLoaded, setBasketLoaded] = useState(false);

  const [shelves, setShelves] = useState<Shelf[]>(SHELF_SEED);
  const [shelvesLoaded, setShelvesLoaded] = useState(false);
  const [defaultShelfId, setDefaultShelfId] = useState<string | null>(DEFAULT_SHELF_ID);
  const [notif, setNotif] = useState<NotifSettings>({ expiry: true, low: false });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [shelfDraft, setShelfDraft] = useState<Shelf | null>(null);

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
    loadShelves()
      .then((stored) => { if (stored) setShelves(stored); })
      .catch(() => {})
      .finally(() => setShelvesLoaded(true));
    loadSettings()
      .then((stored) => {
        if (stored) {
          setDefaultShelfId(stored.defaultShelfId);
          setNotif(stored.notif);
        }
      })
      .catch(() => {})
      .finally(() => setSettingsLoaded(true));
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

  useEffect(() => {
    if (!shelvesLoaded) return;
    void saveShelves(shelves);
  }, [shelvesLoaded, shelves]);

  useEffect(() => {
    if (!settingsLoaded) return;
    void saveSettings({ defaultShelfId, notif });
  }, [settingsLoaded, defaultShelfId, notif]);

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

  const openShelves = useMemo(() => shelves.filter((sh) => !sh.hidden), [shelves]);

  const shelvedItems = useMemo(() => {
    const openNames = new Set(openShelves.map((sh) => sh.name));
    return items.filter((i) => openNames.has(i.location));
  }, [items, openShelves]);

  const shelvesCount = openShelves.length;

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

  const committedShelf = useMemo(
    () => (shelfDraft ? shelves.find((sh) => sh.id === shelfDraft.id) ?? null : null),
    [shelfDraft, shelves]
  );
  const shelfDraftItemCount = useMemo(
    () => (committedShelf ? items.filter((i) => i.location === committedShelf.name).length : 0),
    [committedShelf, items]
  );

  // ── Shelf & settings actions ─────────────────────────────────────────────
  function openShelfSheet(shelf: Shelf) {
    setShelfDraft({ ...shelf });
  }

  function addShelf() {
    const shelf: Shelf = { id: `shelf${Date.now()}`, name: "", icon: "cube", zone: "Household", hidden: false };
    setShelves((prev) => [...prev, shelf]);
    setShelfDraft(shelf);
  }

  function moveShelf(id: string, direction: number) {
    setShelves((prev) => {
      const from = prev.findIndex((sh) => sh.id === id);
      const to = from + direction;
      if (from === -1 || to < 0 || to >= prev.length) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function makeDefaultShelf() {
    if (!shelfDraft) return;
    if (shelfDraft.hidden) {
      flashToast("Unhide the shelf before making it the default.");
      return;
    }
    setDefaultShelfId(shelfDraft.id);
  }

  function toggleShelfHidden() {
    if (!shelfDraft) return;
    const next = !shelfDraft.hidden;
    if (next && defaultShelfId === shelfDraft.id) {
      flashToast("That was the default shelf — pick a new one.");
      setDefaultShelfId(null);
    }
    setShelfDraft((prev) => (prev ? { ...prev, hidden: next } : prev));
  }

  function deleteShelfDraft() {
    if (!shelfDraft || !committedShelf) return;
    if (shelfDraftItemCount > 0) {
      flashToast(
        `Move its ${shelfDraftItemCount} ${shelfDraftItemCount === 1 ? "item" : "items"} somewhere else first.`
      );
      return;
    }
    const name = committedShelf.name || "That shelf";
    setShelves((prev) => prev.filter((sh) => sh.id !== shelfDraft.id));
    setDefaultShelfId((prev) => (prev === shelfDraft.id ? null : prev));
    setShelfDraft(null);
    flashToast(`${name} deleted.`);
  }

  function saveShelfDraft() {
    if (!shelfDraft) return;
    const oldName = committedShelf?.name ?? "";
    const name = shelfDraft.name.trim() || oldName || "New shelf";
    const clash = shelves.some((sh) => sh.id !== shelfDraft.id && sh.name.toLowerCase() === name.toLowerCase());
    const finalName = clash ? `${name} 2` : name;
    setShelves((prev) => prev.map((sh) => (sh.id === shelfDraft.id ? { ...shelfDraft, name: finalName } : sh)));
    if (oldName && oldName !== finalName) {
      setItems((prev) => prev.map((i) => (i.location === oldName ? { ...i, location: finalName } : i)));
    }
    setShelfDraft(null);
  }

  function toggleNotif(key: keyof NotifSettings) {
    setNotif((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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

  const ready = fontsLoaded && hasLoaded && basketLoaded && shelvesLoaded && settingsLoaded;
  const showNavBar = screen !== "run" && screen !== "scan" && screen !== "settings";

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
                totalCount={shelvedItems.length}
                shelvesCount={shelvesCount}
                onStartRun={startRun}
                onOpenHousehold={() => setHouseholdOpen(true)}
                onOpenSettings={() => setScreen("settings")}
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
                shelves={shelves}
                filter={filter}
                onCycleFilter={cycleFilter}
                onGoSearch={() => setScreen("search")}
                onOpenItem={(item) => setSheetId(item.id)}
              />
            )}

            {screen === "run" && (
              <RunScreen
                runItems={runSource}
                shelves={shelves}
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
                shelves={shelves}
                defaultShelfId={defaultShelfId}
                onClose={() => setScreen(running ? "run" : "list")}
                onAddToShelf={addFromScan}
              />
            )}

            {screen === "settings" && (
              <SettingsScreen
                shelves={shelves}
                defaultShelfId={defaultShelfId}
                notif={notif}
                items={items}
                onBack={() => setScreen("list")}
                onOpenShelf={openShelfSheet}
                onAddShelf={addShelf}
                onMoveShelf={moveShelf}
                onToggleNotif={toggleNotif}
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

            <ShelfSheet
              draft={shelfDraft}
              itemCount={shelfDraftItemCount}
              isDefault={!!shelfDraft && shelfDraft.id === defaultShelfId}
              onChangeName={(name) => setShelfDraft((prev) => (prev ? { ...prev, name } : prev))}
              onPickIcon={(icon) => setShelfDraft((prev) => (prev ? { ...prev, icon } : prev))}
              onPickZone={(zone) => setShelfDraft((prev) => (prev ? { ...prev, zone } : prev))}
              onMakeDefault={makeDefaultShelf}
              onToggleHidden={toggleShelfHidden}
              onDelete={deleteShelfDraft}
              onSave={saveShelfDraft}
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
