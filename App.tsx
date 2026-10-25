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
import { ItemEditorScreen, type NameProvenance } from "./src/screens/ItemEditorScreen";
import { ListScreen } from "./src/screens/ListScreen";
import { MatchBarcodesScreen, type BarcodeLink } from "./src/screens/MatchBarcodesScreen";
import { RunScreen } from "./src/screens/RunScreen";
import { ScanScreen } from "./src/screens/ScanScreen";
import { SearchScreen } from "./src/screens/SearchScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ShelvesScreen } from "./src/screens/ShelvesScreen";
import { recordScan } from "./src/services/scanLog";
import { applyLookupResultToDraft, type LookupOutcome } from "./src/services/productLookup";
import { loadBasket, loadPantryItems, savePantryItems, saveBasket } from "./src/storage/pantryStorage";
import { loadShelves, loadSettings, saveShelves, saveSettings } from "./src/storage/shelfStorage";
import { globalStyles } from "./src/styles/globalStyles";
import { addDaysToISO, daysSince, daysUntil, todayISO } from "./src/utils/date";
import type { FilterKey, ItemDraft, NotifSettings, PantryItem, Screen, Shelf } from "./src/types/pantry";
import type { OcrBlock } from "./src/types/label";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
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
  const [lastLinks, setLastLinks] = useState<BarcodeLink[]>([]);
  const [running, setRunning] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [householdOpen, setHouseholdOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [draft, setDraft] = useState<ItemDraft>(makeEmptyDraft);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // How the open draft got prefilled, plus the evidence behind it. Drives the
  // editor's confidence behaviour and everything the scan log records.
  const [provenance, setProvenance] = useState<NameProvenance | undefined>(undefined);
  const [pendingScan, setPendingScan] = useState<{
    guess: LookupOutcome["result"];
    blocks?: OcrBlock[];
  } | null>(null);

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
    // Opening an existing item is not a scan — clear any prior lookup evidence so
    // the editor doesn't show a stale "read from the label" hint.
    setProvenance(undefined);
    setPendingScan(null);
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

  function startAddItem() {
    const def = openShelves.find((sh) => sh.id === defaultShelfId) ?? openShelves[0];
    setDraft({ ...makeEmptyDraft(), location: def ? def.name : "Storage" });
    setProvenance(undefined);
    setPendingScan(null);
    setIsAddingItem(true);
  }

  function closeItemEditor() {
    setEditingItem(null);
    setIsAddingItem(false);
    setProvenance(undefined);
    setPendingScan(null);
  }

  /**
   * Records what the reader guessed against what the user kept.
   *
   * The gap between the two is the whole reason for running the deterministic
   * version for a week — see `services/scanLog.ts`.
   */
  function logScan(kept: PantryItem) {
    if (!provenance) return;

    void recordScan({
      source: provenance.source,
      barcode: kept.barcode || undefined,
      blocks: pendingScan?.blocks,
      guess: pendingScan?.guess ?? {},
      confidence: provenance.confidence,
      kept: {
        name: kept.name,
        category: kept.category,
        packageSize: kept.packageSize,
        unit: kept.unit
      }
    });
  }

  function saveNewItem() {
    const name = draft.name.trim();
    const quantity = Number(draft.quantity);
    if (!name) { Alert.alert("Name required", "Add a name before saving."); return; }
    if (!Number.isFinite(quantity) || quantity < 0) { Alert.alert("Quantity required", "Use 0 or higher."); return; }
    if (draft.expiresOn && Number.isNaN(Date.parse(`${draft.expiresOn}T00:00:00`))) {
      Alert.alert("Check the date", "Use YYYY-MM-DD for expiry dates."); return;
    }
    const newItem: PantryItem = {
      id: `${Date.now()}`,
      addedOn: today,
      name,
      category: draft.category,
      quantity,
      unit: draft.unit.trim() || "item",
      packageSize: draft.packageSize.trim(),
      location: draft.location.trim() || "Storage",
      expiresOn: draft.expiresOn.trim(),
      barcode: draft.barcode.trim(),
      notes: draft.notes.trim(),
      opened: draft.opened,
      par: Math.max(1, quantity),
      addedBy: "You"
    };
    logScan(newItem);
    setItems((prev) => [newItem, ...prev]);
    setIsAddingItem(false);
    setProvenance(undefined);
    setPendingScan(null);
    flashToast(`${name} added to ${newItem.location.toLowerCase()}.`);
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
  /**
   * Every scan ends on the edit form, found or not, so the person confirms or fills in the details
   * there. An item we already track opens in edit mode instead of becoming a duplicate.
   */
  function startAddFromScan(barcode: string, outcome: LookupOutcome, skipped: boolean) {
    const code = barcode.trim();
    const byBarcode = code ? items.find((i) => i.barcode.trim() === code) : undefined;
    const foundName = outcome.result?.name?.trim().toLowerCase();
    // A name match only counts for an item with no barcode yet; one that carries a different
    // barcode is a different product that happens to share a name.
    const byName =
      !byBarcode && foundName
        ? items.find((i) => i.name.trim().toLowerCase() === foundName && !i.barcode.trim())
        : undefined;
    const existing = byBarcode ?? byName;

    if (existing) {
      editDetails(existing);
      if (byName) setDraft((current) => ({ ...current, barcode: code }));
      setScreen("list");
      flashToast(
        byBarcode ? "Already on your shelves — update it here." : "Already on your shelves — barcode added, save to link it."
      );
      return;
    }

    const def = openShelves.find((sh) => sh.id === defaultShelfId) ?? openShelves[0];
    setDraft(
      applyLookupResultToDraft(
        { ...makeEmptyDraft(), location: def ? def.name : "Storage" },
        code,
        outcome.result
      )
    );
    setProvenance(outcome.result ? { source: outcome.source } : undefined);
    setPendingScan(null);
    setIsAddingItem(true);
    setScreen("list");
    flashToast(
      outcome.result
        ? "Found it — check the details and save."
        : skipped
          ? "Barcode saved — fill in the details."
          : outcome.unreachable
            ? "Couldn't reach the product databases — fill in the details."
            : "Not in any catalog — fill in the details."
    );
  }

  // ── Barcode matching ───────────────────────────────────────────────────
  /** Links accepted on the Match barcodes screen: only fills an empty barcode, never overwrites one. */
  function applyBarcodeLinks(links: BarcodeLink[]) {
    // Decide once, from the current items, which links are still valid.
    const taken = new Set(items.map((item) => item.barcode.trim()).filter(Boolean));
    const accepted: BarcodeLink[] = [];
    for (const link of links) {
      const target = items.find((item) => item.id === link.id);
      if (target && !target.barcode.trim() && !taken.has(link.barcode)) {
        taken.add(link.barcode);
        accepted.push(link);
      }
    }

    const byId = new Map(accepted.map((link) => [link.id, link.barcode]));
    setItems((prev) => prev.map((item) => (byId.has(item.id) ? { ...item, barcode: byId.get(item.id)! } : item)));
    setLastLinks(accepted);
    flashToast(
      accepted.length === 0
        ? "Nothing linked."
        : `Linked ${accepted.length} ${accepted.length === 1 ? "barcode" : "barcodes"}.`
    );
  }

  function undoBarcodeLinks() {
    const byId = new Map(lastLinks.map((link) => [link.id, link.barcode]));
    // Only clear a barcode that is still the one we set, in case it was edited since.
    setItems((prev) => prev.map((item) => (byId.get(item.id) === item.barcode ? { ...item, barcode: "" } : item)));
    flashToast(`Undid ${lastLinks.length} ${lastLinks.length === 1 ? "link" : "links"}.`);
    setLastLinks([]);
  }

  // ── Misc ───────────────────────────────────────────────────────────────
  function flashToast(message: string) {
    setToast(message);
  }

  function cycleFilter() {
    const idx = filters.findIndex((f) => f.key === filter);
    setFilter(filters[(idx + 1) % filters.length].key);
  }

  const ready = (fontsLoaded || !!fontError) && hasLoaded && basketLoaded && shelvesLoaded && settingsLoaded;
  const showNavBar =
    screen !== "run" && screen !== "scan" && screen !== "settings" && screen !== "matchBarcodes";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.safeArea} edges={screen === "scan" ? [] : ["top", "bottom", "left", "right"]}>
        <StatusBar style="light" />

        {!ready ? null : editingItem || isAddingItem ? (
          <ItemEditorScreen
            draft={draft}
            isEditing={!!editingItem}
            shelves={shelves}
            knownItems={items}
            provenance={provenance}
            onCancel={closeItemEditor}
            onChangeDraft={setDraft}
            onChangeProvenance={setProvenance}
            onRemove={editingItem ? () => removeItem(editingItem.id) : undefined}
            onSave={editingItem ? saveEditedItem : saveNewItem}
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
                onAddItem={startAddItem}
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
                onAddItem={startAddItem}
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
                knownItems={items}
                onClose={() => setScreen(running ? "run" : "list")}
                onScanned={startAddFromScan}
                onAddManually={startAddItem}
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
                onMatchBarcodes={() => setScreen("matchBarcodes")}
              />
            )}

            {screen === "matchBarcodes" && (
              <MatchBarcodesScreen
                items={items}
                undoCount={lastLinks.length}
                onBack={() => setScreen("settings")}
                onApply={applyBarcodeLinks}
                onUndo={undoBarcodeLinks}
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
