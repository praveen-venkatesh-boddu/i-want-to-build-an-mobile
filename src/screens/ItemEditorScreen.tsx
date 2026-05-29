import { MaterialIcons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { Field } from "../components/Field";
import { categories, getDefaultPackageSize, packageTypes } from "../constants/pantry";

const PKG_UNIT_OPTIONS = ["fl oz", "lb", "oz", "qt", "ct"] as const;
type PkgUnit = (typeof PKG_UNIT_OPTIONS)[number];

function parsePkgSize(value: string): { amount: string; unit: PkgUnit } {
  const trimmed = value.trim();
  for (const u of PKG_UNIT_OPTIONS) {
    if (trimmed === u) return { amount: "", unit: u };
    if (trimmed.endsWith(" " + u)) {
      return { amount: trimmed.slice(0, trimmed.length - u.length - 1).trim(), unit: u };
    }
  }
  const spaceIdx = trimmed.lastIndexOf(" ");
  if (spaceIdx > -1) return { amount: trimmed.slice(0, spaceIdx), unit: "lb" };
  return { amount: trimmed, unit: "lb" };
}
import { applyLookupResultToDraft, lookupProductByBarcode } from "../services/productLookup";
import { globalStyles, md3 } from "../styles/globalStyles";
import type { ItemDraft } from "../types/pantry";
import { BarcodeScannerScreen } from "./BarcodeScannerScreen";
import { itemEditorStyles as styles } from "./ItemEditorScreen.styles";

type ItemEditorScreenProps = {
  draft: ItemDraft;
  insideApp?: boolean;  // true → renders as a plain screen (no extra SafeAreaView)
  isEditing: boolean;
  onCancel: () => void;
  onChangeDraft: React.Dispatch<React.SetStateAction<ItemDraft>>;
  onRemove?: () => void;
  onSave: () => void;
};

export function ItemEditorScreen({
  draft,
  insideApp = false,
  isEditing,
  onCancel,
  onChangeDraft,
  onRemove,
  onSave
}: ItemEditorScreenProps) {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isPackageDropdownOpen, setPackageDropdownOpen] = useState(false);
  const [isPkgUnitDropdownOpen, setPkgUnitDropdownOpen] = useState(false);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isLookingUpBarcode, setLookingUpBarcode] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  const visibleCategories = categories.filter((category) =>
    category.toLowerCase().includes(categoryQuery.trim().toLowerCase())
  );

  function selectCategory(category: string) {
    onChangeDraft((current) => ({ ...current, category }));
    setCategoryDropdownOpen(false);
    setCategoryQuery("");
  }

  function selectPackageType(unit: string) {
    onChangeDraft((current) => ({
      ...current,
      unit,
      packageSize: getDefaultPackageSize(unit)
    }));
    setPackageDropdownOpen(false);
  }

  async function lookupBarcode(barcode: string) {
    setLookingUpBarcode(true);
    setScanMessage("Looking up product details...");

    try {
      const lookupResult = await lookupProductByBarcode(barcode);
      onChangeDraft((current) => applyLookupResultToDraft(current, barcode, lookupResult));
      setScanMessage(
        lookupResult
          ? "Product details found. Review the item, then save."
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

  const selectedPackageType = packageTypes.find((packageType) => packageType.value === draft.unit);

  function closeAllDropdowns() {
    setCategoryDropdownOpen(false);
    setPackageDropdownOpen(false);
    setPkgUnitDropdownOpen(false);
  }

  const Root = insideApp ? View : SafeAreaView;

  return (
    <Root style={insideApp ? { flex: 1, backgroundColor: "transparent" } : styles.modalSafeArea}>
      <Pressable style={styles.modalShell} onPress={closeAllDropdowns}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalShell}
      >
        <View style={styles.modalHeader}>
          <Pressable onPress={onCancel} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
          <Text style={styles.modalTitle}>{isEditing ? "Edit item" : "Add item"}</Text>
          <Pressable onPress={onSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.formContent}>
          <Field label="Name">
            <TextInput
              value={draft.name}
              onChangeText={(name) => onChangeDraft((current) => ({ ...current, name }))}
              placeholder="Rolled oats"
              placeholderTextColor={md3.onSurfaceVariant}
              style={globalStyles.textInput}
            />
          </Field>

          <Field label="Barcode">
            <View style={styles.barcodeRow}>
              <TextInput
                value={draft.barcode}
                onChangeText={(barcode) => {
                  onChangeDraft((current) => ({ ...current, barcode }));
                  setScanMessage("");
                }}
                placeholder="Scan or enter UPC"
                placeholderTextColor={md3.onSurfaceVariant}
                style={[globalStyles.textInput, styles.barcodeInput]}
              />
              <Pressable
                onPress={() => {
                  setCategoryDropdownOpen(false);
                  setPackageDropdownOpen(false);
                  setScannerOpen(true);
                  setScanMessage("");
                }}
                style={styles.scanButton}
              >
                <MaterialIcons name="qr-code-scanner" size={18} color={md3.onPrimary} />
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
                <MaterialIcons
                  name={isLookingUpBarcode ? "hourglass-empty" : "manage-search"}
                  size={18}
                  color={md3.onSecondaryContainer}
                />
                <Text style={styles.lookupButtonText}>
                  {isLookingUpBarcode ? "Looking up…" : "Lookup"}
                </Text>
              </Pressable>
            </View>
            {scanMessage ? <Text style={styles.scanMessage}>{scanMessage}</Text> : null}
          </Field>

          <Field label="Category">
            <Pressable
              onPress={() => {
                setCategoryDropdownOpen((isOpen) => !isOpen);
                setPackageDropdownOpen(false);
                setPkgUnitDropdownOpen(false);
              }}
              style={styles.dropdownButton}
            >
              <Text style={styles.dropdownText}>{draft.category}</Text>
              <MaterialIcons
                name={isCategoryDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={22}
                color={md3.onSurfaceVariant}
              />
            </Pressable>
          </Field>

          {isCategoryDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              <TextInput
                value={categoryQuery}
                onChangeText={setCategoryQuery}
                placeholder="Search categories"
                placeholderTextColor={md3.onSurfaceVariant}
                style={styles.dropdownSearchInput}
              />
              {visibleCategories.length === 0 ? (
                <View style={styles.dropdownEmptyState}>
                  <Text style={styles.dropdownEmptyText}>No matching categories</Text>
                </View>
              ) : (
                <ScrollView style={styles.dropdownOptionsList} nestedScrollEnabled>
                  {visibleCategories.map((category) => (
                    <Pressable
                      key={category}
                      onPress={() => selectCategory(category)}
                      style={[
                        styles.dropdownOption,
                        draft.category === category && styles.dropdownOptionActive
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          draft.category === category && styles.dropdownOptionTextActive
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : null}

          <View style={styles.packageDetailsRow}>
            <Field label="Quantity" style={styles.quantityField}>
              <TextInput
                value={draft.quantity}
                onChangeText={(quantity) =>
                  onChangeDraft((current) => {
                    const newQty = parseFloat(quantity);
                    const prevQty = parseFloat(current.quantity);
                    const opened =
                      current.opened &&
                      Number.isFinite(newQty) &&
                      Number.isFinite(prevQty) &&
                      newQty > prevQty
                        ? false
                        : current.opened;
                    return { ...current, quantity, opened };
                  })
                }
                keyboardType="decimal-pad"
                style={globalStyles.textInput}
              />
            </Field>
            <Field label="Package type" style={styles.packageTypeField}>
              <Pressable
                onPress={() => {
                  setPackageDropdownOpen((isOpen) => !isOpen);
                  setCategoryDropdownOpen(false);
                  setPkgUnitDropdownOpen(false);
                }}
                style={styles.dropdownButton}
              >
                <Text style={styles.dropdownText}>{selectedPackageType?.label ?? draft.unit}</Text>
                <MaterialIcons
                  name={isPackageDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={22}
                  color={md3.onSurfaceVariant}
                />
              </Pressable>
            </Field>
            <Field label="Package size" style={styles.packageSizeField}>
              {(() => {
                const { amount: pkgAmount, unit: pkgUnit } = parsePkgSize(draft.packageSize);
                return (
                  <View style={styles.pkgSizeRow}>
                    <TextInput
                      value={pkgAmount}
                      onChangeText={(amount) =>
                        onChangeDraft((current) => ({
                          ...current,
                          packageSize: `${amount} ${pkgUnit}`
                        }))
                      }
                      keyboardType="decimal-pad"
                      style={styles.pkgAmountInput}
                      returnKeyType="done"
                    />
                    <Pressable
                      onPress={() => {
                        setCategoryDropdownOpen(false);
                        setPackageDropdownOpen(false);
                        setPkgUnitDropdownOpen((open) => !open);
                      }}
                      style={styles.pkgUnitTrigger}
                    >
                      <Text style={styles.pkgUnitText}>{pkgUnit}</Text>
                      <MaterialIcons
                        name={isPkgUnitDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={18}
                        color={md3.onSurfaceVariant}
                      />
                    </Pressable>
                  </View>
                );
              })()}
            </Field>
          </View>

          {isPackageDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              <ScrollView style={styles.dropdownOptionsList} nestedScrollEnabled>
                {packageTypes.map((packageType) => (
                  <Pressable
                    key={packageType.value}
                    onPress={() => selectPackageType(packageType.value)}
                    style={[
                      styles.dropdownOption,
                      draft.unit === packageType.value && styles.dropdownOptionActive
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        draft.unit === packageType.value && styles.dropdownOptionTextActive
                      ]}
                    >
                      {packageType.label}
                    </Text>

                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {isPkgUnitDropdownOpen ? (
            <View style={styles.dropdownMenu}>
              <ScrollView style={styles.dropdownOptionsList} nestedScrollEnabled>
                {PKG_UNIT_OPTIONS.map((u) => {
                  const { amount: pkgAmount, unit: pkgUnit } = parsePkgSize(draft.packageSize);
                  return (
                    <Pressable
                      key={u}
                      onPress={() => {
                        onChangeDraft((current) => ({
                          ...current,
                          packageSize: `${pkgAmount} ${u}`
                        }));
                        setPkgUnitDropdownOpen(false);
                      }}
                      style={[styles.dropdownOption, pkgUnit === u && styles.dropdownOptionActive]}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          pkgUnit === u && styles.dropdownOptionTextActive
                        ]}
                      >
                        {u}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <Field label="Location">
            <TextInput
              value={draft.location}
              onChangeText={(location) => onChangeDraft((current) => ({ ...current, location }))}
              placeholder="Upper shelf"
              placeholderTextColor={md3.onSurfaceVariant}
              style={globalStyles.textInput}
            />
          </Field>

          <Field label="Expires on">
            <TextInput
              value={draft.expiresOn}
              onChangeText={(expiresOn) =>
                onChangeDraft((current) => ({ ...current, expiresOn }))
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor={md3.onSurfaceVariant}
              style={globalStyles.textInput}
            />
          </Field>

          <Field label="Notes">
            <TextInput
              value={draft.notes}
              onChangeText={(notes) => onChangeDraft((current) => ({ ...current, notes }))}
              placeholder="Recipe ideas, brand, opened date"
              placeholderTextColor={md3.onSurfaceVariant}
              style={[globalStyles.textInput, styles.notesInput]}
              multiline
            />
          </Field>

          <Pressable
            onPress={() => onChangeDraft((current) => ({ ...current, opened: !current.opened }))}
            style={styles.openedToggle}
          >
            <View style={[styles.checkbox, draft.opened && styles.checkboxActive]}>
              {draft.opened ? (
                <MaterialIcons name="check" size={16} color={md3.onPrimary} />
              ) : null}
            </View>
            <Text style={styles.openedToggleText}>This item is already opened</Text>
          </Pressable>

          {isEditing && onRemove ? (
            <Pressable onPress={onRemove} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete item</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
      </Pressable>

      <Modal animationType="slide" visible={isScannerOpen} presentationStyle="fullScreen">
        <BarcodeScannerScreen
          onCancel={() => setScannerOpen(false)}
          onScanned={handleBarcodeScanned}
        />
      </Modal>
    </Root>
  );
}
