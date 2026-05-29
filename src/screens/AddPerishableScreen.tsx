import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { ChipGroup } from "../components/ChipGroup";
import { ScreenHeader } from "../components/ScreenHeader";
import type { PantryItem } from "../types/pantry";
import { addDaysToISO, todayISO } from "../utils/date";
import { addPerishableStyles as styles } from "./AddPerishableScreen.styles";

// ── Config ──────────────────────────────────────────────────────────────
const UNIT_OPTIONS = [
  { label: "Items", value: "items" },
  { label: "Bags", value: "bags" },
  { label: "Packs", value: "packs" },
  { label: "Cartons", value: "cartons" }
];

const LOCATION_OPTIONS = ["Fridge", "Freezer", "Counter", "Pantry"].map((loc) => ({
  label: loc,
  value: loc
}));

const EXPIRY_OPTIONS = [
  { label: "2 days", value: "2" },
  { label: "3 days", value: "3" },
  { label: "5 days", value: "5" },
  { label: "1 week", value: "7" },
  { label: "2 weeks", value: "14" }
];

// ── Component ────────────────────────────────────────────────────────────
type AddPerishableScreenProps = {
  onGoBack: () => void;
  onSave: (item: PantryItem) => void;
};

export function AddPerishableScreen({ onGoBack, onSave }: AddPerishableScreenProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("items");
  const [location, setLocation] = useState("Fridge");
  const [expiresInDays, setExpiresInDays] = useState("7");

  function handleSave() {
    const trimmedName = name.trim();
    const qty = Number(quantity);

    if (!trimmedName) {
      Alert.alert("Name required", "Enter a name for this item before saving.");
      return;
    }
    if (!Number.isFinite(qty) || qty < 0) {
      Alert.alert("Quantity required", "Use a quantity of 0 or higher.");
      return;
    }

    const item: PantryItem = {
      id: `${Date.now()}`,
      addedOn: todayISO(),
      name: trimmedName,
      category: "Produce",
      quantity: qty,
      unit,
      packageSize: "",
      location,
      expiresOn: addDaysToISO(Number(expiresInDays)),
      barcode: "",
      notes: "",
      opened: false
    };

    onSave(item);
  }

  return (
    <KeyboardAvoidingView
      style={styles.shell}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader
        variant="bar"
        title="Add Perishable"
        backLabel="Back"
        onBack={onGoBack}
        rightAction={{ label: "Save", onPress: handleSave }}
      />

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Spinach, Bananas, Tomatoes"
            placeholderTextColor="#9E9E9E"
            style={styles.textInput}
            autoFocus
            returnKeyType="done"
          />
        </View>

        {/* Quantity + Unit */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              style={styles.quantityInput}
              returnKeyType="done"
            />
            <ChipGroup options={UNIT_OPTIONS} value={unit} onSelect={setUnit} />
          </View>
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Storage Location</Text>
          <ChipGroup options={LOCATION_OPTIONS} value={location} onSelect={setLocation} />
        </View>

        {/* Expires in */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Expires In</Text>
          <ChipGroup options={EXPIRY_OPTIONS} value={expiresInDays} onSelect={setExpiresInDays} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
