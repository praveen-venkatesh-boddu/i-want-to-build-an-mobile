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

  const Root = insideApp ? View : SafeAreaView;

  return (
    <Root style={insideApp ? { flex: 1, backgroundColor: "transparent" } : styles.modalSafeArea}>
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
                onChangeText={(quantity) => onChangeDraft((current) => ({ ...current, quantity }))}
                keyboardType="decimal-pad"
                style={globalStyles.textInput}
              />
            </Field>
            <Field label="Package type" style={styles.packageTypeField}>
              <Pressable
                onPress={() => {
                  setPackageDropdownOpen((isOpen) => !isOpen);
                  setCategoryDropdownOpen(false);
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
              <TextInput
                value={draft.packageSize}
                onChangeText={(packageSize) =>
                  onChangeDraft((current) => ({ ...current, packageSize }))
                }
                placeholder="10 lb"
                placeholderTextColor={md3.onSurfaceVariant}
                style={globalStyles.textInput}
              />
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
                    <Text
                      style={[
                        styles.dropdownOptionMeta,
                        draft.unit === packageType.value && styles.dropdownOptionTextActive
                      ]}
                    >
                      {packageType.defaultSize}
                    </Text>
                  </Pressable>
                ))}
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

      <Modal animationType="slide" visible={isScannerOpen} presentationStyle="fullScreen">
        <BarcodeScannerScreen
          onCancel={() => setScannerOpen(false)}
          onScanned={handleBarcodeScanned}
        />
      </Modal>
    </Root>
  );
}
