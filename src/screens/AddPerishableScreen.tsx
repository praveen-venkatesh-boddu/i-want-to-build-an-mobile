import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { md3 } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { todayISO } from "../utils/date";
import { addPerishableStyles as styles } from "./AddPerishableScreen.styles";

// ── Config ──────────────────────────────────────────────────────────────
const UNIT_OPTIONS = [
  { label: "Items", value: "items" },
  { label: "Bags", value: "bags" },
  { label: "Packs", value: "packs" },
  { label: "Cartons", value: "cartons" }
];

const LOCATION_OPTIONS = ["Fridge", "Freezer", "Counter", "Pantry"];

const EXPIRY_OPTIONS = [
  { label: "2 days", days: 2 },
  { label: "3 days", days: 3 },
  { label: "5 days", days: 5 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 }
];

function addDaysToISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

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
  const [expiresInDays, setExpiresInDays] = useState(7);

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
      expiresOn: addDaysToISO(expiresInDays),
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onGoBack}>
          <MaterialIcons name="chevron-left" size={24} color={md3.onSurfaceVariant} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Add Perishable</Text>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      {/* Form */}
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
            placeholderTextColor={md3.onSurfaceVariant}
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
            <View style={styles.chipRow}>
              {UNIT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.chip, unit === opt.value && styles.chipActive]}
                  onPress={() => setUnit(opt.value)}
                >
                  <Text style={[styles.chipText, unit === opt.value && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Storage Location</Text>
          <View style={styles.chipRow}>
            {LOCATION_OPTIONS.map((loc) => (
              <Pressable
                key={loc}
                style={[styles.chip, location === loc && styles.chipActive]}
                onPress={() => setLocation(loc)}
              >
                <Text style={[styles.chipText, location === loc && styles.chipTextActive]}>
                  {loc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Expires in */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Expires In</Text>
          <View style={styles.chipRow}>
            {EXPIRY_OPTIONS.map((opt) => (
              <Pressable
                key={opt.days}
                style={[styles.chip, expiresInDays === opt.days && styles.chipActive]}
                onPress={() => setExpiresInDays(opt.days)}
              >
                <Text
                  style={[styles.chipText, expiresInDays === opt.days && styles.chipTextActive]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
