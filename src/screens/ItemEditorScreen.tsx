import { Barcode, CaretRight, Check, HourglassMedium, MagnifyingGlass } from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { categories, getDefaultPackageSize, packageTypes } from "../constants/pantry";
import { CONFIDENT, UNCERTAIN } from "../services/labelExtract";
import {
  applyLookupResultToDraft,
  lookupProductByBarcode,
  type LookupOutcome
} from "../services/productLookup";
import { colors } from "../styles/globalStyles";
import type { ItemDraft, PantryItem, Shelf } from "../types/pantry";
import { addDaysToISO, addMonthsToISO, formatShortDate } from "../utils/date";
import { BarcodeScannerScreen } from "./BarcodeScannerScreen";
import { itemEditorStyles as styles } from "./ItemEditorScreen.styles";

/** How the draft's name got there — drives the hint and chips under the name field. */
export type NameProvenance = {
  source: LookupOutcome["source"];
  confidence?: number;
  /** Runners-up from a label read, offered as one-tap corrections. */
  candidates?: string[];
};

type ItemEditorScreenProps = {
  draft: ItemDraft;
  isEditing: boolean;
  shelves: Shelf[];
  /** Lets the in-editor scanner check the user's own shelves before any network call. */
  knownItems?: PantryItem[];
  /** Set when the draft was prefilled by a lookup rather than typed. */
  provenance?: NameProvenance;
  onCancel: () => void;
  onChangeDraft: React.Dispatch<React.SetStateAction<ItemDraft>>;
  onChangeProvenance?: (provenance: NameProvenance | undefined) => void;
  onRemove?: () => void;
  onSave: () => void;
};

type ExpiryPresetKey = "none" | "w" | "m" | "6m" | "y";
type ExpiryChoice = ExpiryPresetKey | "keep";

const EXPIRY_PRESETS: Array<{ key: ExpiryPresetKey; label: string; toISO: () => string }> = [
  { key: "none", label: "No date", toISO: () => "" },
  { key: "w", label: "1 week", toISO: () => addDaysToISO(7) },
  { key: "m", label: "1 month", toISO: () => addMonthsToISO(1) },
  { key: "6m", label: "6 months", toISO: () => addMonthsToISO(6) },
  { key: "y", label: "1 year", toISO: () => addMonthsToISO(12) }
];

function matchExpiryPreset(iso: string): ExpiryPresetKey | null {
  if (!iso) return "none";
  const preset = EXPIRY_PRESETS.find((p) => p.key !== "none" && p.toISO() === iso);
  return preset ? preset.key : null;
}

export function ItemEditorScreen({
  draft,
  isEditing,
  shelves,
  knownItems = [],
  provenance,
  onCancel,
  onChangeDraft,
  onChangeProvenance,
  onRemove,
  onSave
}: ItemEditorScreenProps) {
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isLookingUpBarcode, setLookingUpBarcode] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(isEditing);

  const [initialExpiresOn] = useState(draft.expiresOn);
  const [expiryChoice, setExpiryChoice] = useState<ExpiryChoice>(
    () => matchExpiryPreset(initialExpiresOn) ?? (initialExpiresOn ? "keep" : "none")
  );

  async function lookupBarcode(barcode: string) {
    setLookingUpBarcode(true);
    setScanMessage("Looking up product details...");
    try {
      const outcome = await lookupProductByBarcode(barcode, knownItems);
      onChangeDraft((current) => applyLookupResultToDraft(current, barcode, outcome.result));
      onChangeProvenance?.(outcome.result ? { source: outcome.source } : undefined);
      setScanMessage(
        outcome.result
          ? outcome.source === "history"
            ? "You already track this — details filled in from your shelves."
            : "Product details found. Review the item, then save."
          : "Barcode captured, but no product details were found. Enter the item details, then save."
      );
    } catch {
      onChangeDraft((current) => ({ ...current, barcode }));
      setScanMessage("Barcode captured, but lookup failed. Enter the item details, then save.");
    } finally {
      setLookingUpBarcode(false);
    }
  }

  function handleBarcodeScanned(barcode: string) {
    setScannerOpen(false);
    void lookupBarcode(barcode);
  }

  /** The label was read instead of the barcode — fill what we got, keep the evidence. */
  function handleLabelRead(outcome: LookupOutcome) {
    setScannerOpen(false);

    if (!outcome.result) {
      setScanMessage("Couldn't read that label. Try again in better light, or type it in.");
      return;
    }

    onChangeDraft((current) => applyLookupResultToDraft(current, current.barcode, outcome.result));
    onChangeProvenance?.({
      source: outcome.source,
      confidence: outcome.confidence,
      candidates: outcome.candidates
    });
    setScanMessage("");
  }

  /** Tapping a runner-up chip. Once corrected, the guess is no longer a guess. */
  function chooseCandidate(text: string) {
    onChangeDraft((current) => ({ ...current, name: text }));
    onChangeProvenance?.(provenance ? { ...provenance, confidence: 1, candidates: [] } : undefined);
  }

  function stepQuantity(delta: number) {
    onChangeDraft((current) => {
      const prevQty = Number.parseFloat(current.quantity) || 0;
      const nextQty = Math.max(0, prevQty + delta);
      const opened = current.opened && nextQty > prevQty ? false : current.opened;
      return { ...current, quantity: String(nextQty), opened };
    });
  }

  function selectPackageType(unit: string) {
    onChangeDraft((current) => ({
      ...current,
      unit,
      packageSize: getDefaultPackageSize(unit)
    }));
  }

  function pickExpiry(key: ExpiryChoice) {
    setExpiryChoice(key);
    if (key === "keep") {
      onChangeDraft((current) => ({ ...current, expiresOn: initialExpiresOn }));
      return;
    }
    const preset = EXPIRY_PRESETS.find((p) => p.key === key);
    onChangeDraft((current) => ({ ...current, expiresOn: preset ? preset.toISO() : "" }));
  }

  const openShelves = shelves.filter((shelf) => !shelf.hidden);
  const shelfChips: Shelf[] = draft.location && !openShelves.some((shelf) => shelf.name === draft.location)
    ? [...openShelves, { id: "__current", name: draft.location, icon: "cube", zone: "Household", hidden: false }]
    : openShelves;

  const keepChipLabel =
    initialExpiresOn && matchExpiryPreset(initialExpiresOn) === null
      ? `Keep ${formatShortDate(initialExpiresOn)}`
      : null;
  const expiryChips: Array<{ key: ExpiryChoice; label: string }> = [
    ...(keepChipLabel ? [{ key: "keep" as const, label: keepChipLabel }] : []),
    ...EXPIRY_PRESETS.map((p) => ({ key: p.key as ExpiryChoice, label: p.label }))
  ];
  const expiryNote =
    expiryChoice === "none"
      ? "Won't appear in expiring soon."
      : expiryChoice === "keep"
      ? "Keeping the date already on this item."
      : draft.expiresOn
      ? `Expires around ${formatShortDate(draft.expiresOn)}.`
      : "Pick one — a rough date still beats none.";

  const gaps: string[] = [];
  if (!draft.name.trim()) gaps.push("a name");

  const saveLabel = gaps.length
    ? `Needs ${gaps[0]}`
    : isEditing
    ? "Save changes"
    : `Save to ${draft.location ? draft.location.toLowerCase() : "shelf"}`;

  // ── Confidence, expressed as behaviour rather than a number ────────────────
  // A percentage is not something a user can act on. What they can act on is a
  // prefilled field that either sits quietly or arrives pre-selected and flagged.
  const readFromLabel = provenance?.source === "ocr";
  const isUnsure = readFromLabel && (provenance?.confidence ?? 0) < CONFIDENT;
  const hasNoGuess = readFromLabel && (provenance?.confidence ?? 0) < UNCERTAIN;

  const nameCandidates = (provenance?.candidates ?? [])
    .filter((candidate) => candidate && candidate !== draft.name)
    .slice(0, 3);

  const nameHint = (() => {
    if (hasNoGuess) return "Couldn't pick a name off the label — try one below, or type it.";
    if (isUnsure) return "Best guess from the label — worth a check.";
    if (readFromLabel) return "Read from the label.";
    if (provenance?.source === "history") return "Filled in from an item you already track.";
    if (provenance?.source === "off" || provenance?.source === "opf") {
      return "Filled in from the product database.";
    }
    return draft.name.trim() ? "Sounds good." : "Whatever you would call it out loud.";
  })();

  const nameRuleColor = draft.name.trim() && !isUnsure ? colors.neutral800 : colors.accent;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalShell}
      >
        <View style={styles.modalHeader}>
          <Pressable onPress={onCancel} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
          <Text style={styles.modalTitle}>{isEditing ? "Edit item" : "Add by hand"}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          {isEditing ? (
            <View style={styles.kickerBlock}>
              <Text style={styles.kickerLabel}>Editing · {draft.location || "no shelf"}</Text>
              <Text style={styles.kickerSubtitle}>
                {draft.barcode
                  ? "This item carries a barcode, so the next scan finds it straight away."
                  : "No barcode on this one yet — scan or type it in below and future scans will match it."}
              </Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Barcode</Text>
            <View style={styles.barcodeRow}>
              <TextInput
                value={draft.barcode}
                onChangeText={(barcode) => {
                  onChangeDraft((current) => ({ ...current, barcode }));
                  setScanMessage("");
                }}
                placeholder="Scan or enter UPC"
                placeholderTextColor={colors.neutral500}
                style={styles.barcodeInput}
              />
              <Pressable
                onPress={() => {
                  setScannerOpen(true);
                  setScanMessage("");
                }}
                style={styles.scanButton}
              >
                <Barcode size={16} color={colors.neutral300} weight="regular" />
                <Text style={styles.scanButtonText}>Scan</Text>
              </Pressable>
              <Pressable
                disabled={!draft.barcode || isLookingUpBarcode}
                onPress={() => void lookupBarcode(draft.barcode)}
                style={[
                  styles.lookupButton,
                  (!draft.barcode || isLookingUpBarcode) && styles.lookupButtonDisabled
                ]}
              >
                {isLookingUpBarcode ? (
                  <HourglassMedium size={16} color={colors.neutral300} weight="regular" />
                ) : (
                  <MagnifyingGlass size={16} color={colors.neutral300} weight="regular" />
                )}
              </Pressable>
            </View>
            {scanMessage ? <Text style={styles.scanMessage}>{scanMessage}</Text> : null}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderLabel}>The essentials</Text>
            <View style={[styles.sectionHeaderRule, { height: 1, backgroundColor: colors.neutral800 }]} />
            <Text
              style={[
                styles.sectionHeaderStatus,
                { color: gaps.length ? colors.neutral500 : colors.accent200 }
              ]}
            >
              {gaps.length ? `${gaps.length} field left` : "ready to save"}
            </Text>
          </View>

          <TextInput
            value={draft.name}
            onChangeText={(name) => onChangeDraft((current) => ({ ...current, name }))}
            placeholder="What is it?"
            placeholderTextColor={colors.neutral500}
            style={styles.nameInput}
            // An uncertain guess arrives selected, so typing replaces it in one gesture
            // instead of forcing the user to clear it first.
            selectTextOnFocus={isUnsure}
          />
          <View style={[styles.nameRule, { backgroundColor: nameRuleColor }]} />
          <Text style={[styles.nameHint, isUnsure && styles.nameHintUnsure]}>{nameHint}</Text>

          {nameCandidates.length > 0 ? (
            <View style={styles.candidateRow}>
              {nameCandidates.map((candidate) => (
                <Pressable
                  key={candidate}
                  onPress={() => chooseCandidate(candidate)}
                  style={styles.candidateChip}
                >
                  <Text style={styles.candidateChipText} numberOfLines={1}>
                    {candidate}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.fieldRow}>
            <Text style={styles.fieldRowLabel}>Quantity</Text>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() => stepQuantity(-1)}
                style={[styles.stepCircle, styles.stepCircleMinus]}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={{ color: colors.neutral300, fontSize: 16 }}>–</Text>
              </Pressable>
              <Text style={styles.stepValue}>{draft.quantity || "0"}</Text>
              <Pressable
                onPress={() => stepQuantity(1)}
                style={[styles.stepCircle, styles.stepCirclePlus]}
                accessibilityLabel="Increase quantity"
              >
                <Text style={{ color: colors.accent, fontSize: 16 }}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldRowTop}>
            <Text style={styles.fieldRowLabelTop}>Goes on</Text>
            <View style={styles.chipsWrap}>
              {shelfChips.map((shelf) => (
                <Pressable
                  key={shelf.id}
                  onPress={() => onChangeDraft((current) => ({ ...current, location: shelf.name }))}
                  style={[styles.chip, draft.location === shelf.name && styles.chipActive]}
                >
                  <Text style={[styles.chipText, draft.location === shelf.name && styles.chipTextActive]}>
                    {shelf.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldRowTop}>
            <Text style={styles.fieldRowLabelTop}>Category</Text>
            <View style={styles.chipsWrap}>
              {categories.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => onChangeDraft((current) => ({ ...current, category }))}
                  style={[styles.chip, draft.category === category && styles.chipActive]}
                >
                  <Text style={[styles.chipText, draft.category === category && styles.chipTextActive]}>
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldRowTop}>
            <Text style={styles.fieldRowLabelTop}>Expires</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.chipsWrap}>
                {expiryChips.map((chip) => (
                  <Pressable
                    key={chip.key}
                    onPress={() => pickExpiry(chip.key)}
                    style={[styles.chip, expiryChoice === chip.key && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, expiryChoice === chip.key && styles.chipTextActive]}>
                      {chip.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.fieldNote}>{expiryNote}</Text>
            </View>
          </View>

          <Pressable onPress={() => setDetailsOpen((open) => !open)} style={styles.detailsToggle}>
            <View style={{ transform: [{ rotate: detailsOpen ? "90deg" : "0deg" }] }}>
              <CaretRight size={13} color={colors.accent} weight="regular" />
            </View>
            <Text style={styles.detailsToggleLabel}>
              {detailsOpen ? "Hide the details" : "Add details"}
            </Text>
            <Text style={styles.detailsToggleHint}>optional</Text>
          </Pressable>

          {detailsOpen ? (
            <View style={styles.detailsSection}>
              <View style={styles.detailsRow}>
                <Text style={styles.fieldRowLabel}>Package</Text>
                <View style={styles.detailsPkgTypeRow}>
                  {packageTypes.map((packageType) => (
                    <Pressable
                      key={packageType.value}
                      onPress={() => selectPackageType(packageType.value)}
                      style={[styles.chipSmall, draft.unit === packageType.value && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipTextSmall,
                          draft.unit === packageType.value && styles.chipTextActive
                        ]}
                      >
                        {packageType.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.fieldRowLabel}>Size</Text>
                <TextInput
                  value={draft.packageSize}
                  onChangeText={(packageSize) => onChangeDraft((current) => ({ ...current, packageSize }))}
                  placeholder="e.g. 3.5 oz pouch"
                  placeholderTextColor={colors.neutral500}
                  style={styles.detailsInput}
                />
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.fieldRowLabel}>Note</Text>
                <TextInput
                  value={draft.notes}
                  onChangeText={(notes) => onChangeDraft((current) => ({ ...current, notes }))}
                  placeholder="Brand, recipe idea"
                  placeholderTextColor={colors.neutral500}
                  style={styles.detailsInput}
                />
              </View>
              <Pressable
                onPress={() => onChangeDraft((current) => ({ ...current, opened: !current.opened }))}
                style={styles.openedToggle}
              >
                <View style={[styles.checkbox, draft.opened && styles.checkboxActive]}>
                  {draft.opened ? <Check size={11} color={colors.accent} weight="bold" /> : null}
                </View>
                <Text style={styles.openedToggleText}>Already opened</Text>
              </Pressable>
            </View>
          ) : null}

          <Text style={styles.footnote}>
            {isEditing
              ? "Changes apply everywhere this item appears — the ledger, the run and the shopping list."
              : "You can fill in package size and notes any time from the item itself."}
          </Text>

          {isEditing && onRemove ? (
            <Pressable onPress={onRemove} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete item</Text>
            </Pressable>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={onSave}
            style={[
              styles.saveButton,
              { borderColor: gaps.length ? colors.neutral700 : colors.accent }
            ]}
          >
            <Text
              style={[styles.saveButtonText, { color: gaps.length ? colors.neutral400 : colors.accent }]}
            >
              {saveLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal animationType="slide" visible={isScannerOpen} presentationStyle="fullScreen">
        <BarcodeScannerScreen
          onCancel={() => setScannerOpen(false)}
          onScanned={handleBarcodeScanned}
          onLabelRead={handleLabelRead}
        />
      </Modal>
    </View>
  );
}
