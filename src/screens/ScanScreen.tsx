import {
  BarcodeScanningResult,
  BarcodeType,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Minus, Plus, X } from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FadeRule } from "../components/FadeRule";
import { SCAN_PLACE_CHIPS } from "../constants/pantry";
import { lookupProductByBarcode } from "../services/productLookup";
import { colors } from "../styles/globalStyles";
import { scanStyles as s } from "./ScanScreen.styles";

type ScanScreenProps = {
  onClose: () => void;
  onAddToShelf: (input: {
    name: string;
    category: string;
    packageSize: string;
    unit: string;
    barcode: string;
    location: string;
    quantity: number;
  }) => void;
};

const SUPPORTED_BARCODE_TYPES: BarcodeType[] = [
  "ean13",
  "ean8",
  "upc_a",
  "upc_e",
  "code128",
  "code39",
  "code93",
  "itf14",
  "codabar",
  "qr"
];

type FoundState = {
  barcode: string;
  name: string;
  category: string;
  packageSize: string;
  unit: string;
};

export function ScanScreen({ onClose, onAddToShelf }: ScanScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<"idle" | "found">("idle");
  const [found, setFound] = useState<FoundState | null>(null);
  const [qty, setQty] = useState(1);
  const [place, setPlace] = useState<string>(SCAN_PLACE_CHIPS[0]);

  async function handleScanned(result: BarcodeScanningResult) {
    if (step !== "idle" || !result.data) return;
    const barcode = result.data;
    const lookup = await lookupProductByBarcode(barcode);
    setFound({
      barcode,
      name: lookup?.name ?? "",
      category: lookup?.category ?? "Staples",
      packageSize: lookup?.packageSize ?? "",
      unit: lookup?.unit ?? "items"
    });
    setQty(1);
    setPlace(SCAN_PLACE_CHIPS[0]);
    setStep("found");
  }

  function rescan() {
    setFound(null);
    setStep("idle");
  }

  function addToShelf() {
    if (!found || !found.name.trim()) {
      Alert.alert("Name required", "Add a name before adding this to the shelf.");
      return;
    }
    onAddToShelf({
      name: found.name.trim(),
      category: found.category,
      packageSize: found.packageSize,
      unit: found.unit,
      barcode: found.barcode,
      location: place,
      quantity: qty
    });
  }

  if (!permission || !permission.granted) {
    return (
      <View style={s.permissionShell}>
        <Text style={s.permissionTitle}>Camera access needed</Text>
        <Text style={s.permissionBody}>Allow camera access to scan item barcodes.</Text>
        {permission ? (
          <Pressable style={s.permissionButton} onPress={requestPermission}>
            <Text style={s.permissionButtonText}>Allow camera</Text>
          </Pressable>
        ) : null}
        <Pressable style={s.permissionCancel} onPress={onClose}>
          <Text style={s.permissionCancelText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.shell}>
      <CameraView
        style={s.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: SUPPORTED_BARCODE_TYPES }}
        onBarcodeScanned={step === "idle" ? handleScanned : undefined}
      />

      <View style={s.overlay}>
        <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable style={s.closeButton} onPress={onClose} accessibilityLabel="Close scanner">
            <X size={16} color={colors.neutral200} weight="regular" />
          </Pressable>
          <Text style={s.topEyebrow}>Scan to add</Text>
          <View style={s.topBarSpacer} />
        </View>

        {step === "idle" ? (
          <>
            <View style={s.viewfinder}>
              <View style={[s.bracket, s.bracketTopLeft]} />
              <View style={[s.bracket, s.bracketTopRight]} />
              <View style={[s.bracket, s.bracketBottomLeft]} />
              <View style={[s.bracket, s.bracketBottomRight]} />
              <LinearGradient
                colors={["transparent", colors.accent, "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.scanLine}
              />
            </View>

            <View style={s.idleHint}>
              <Text style={s.idleHintText}>Tap the frame to scan a barcode</Text>
            </View>
          </>
        ) : null}

        {step === "found" && found ? (
          <View style={s.foundPanel}>
            <Text style={s.foundEyebrow}>
              FOUND · {found.barcode.split("").join(" ")}
            </Text>
            <TextInput
              value={found.name}
              onChangeText={(name) => setFound({ ...found, name })}
              placeholder="Item name"
              placeholderTextColor={colors.neutral500}
              style={s.productName}
            />
            <Text style={s.productSubtitle}>
              {[found.category, found.packageSize].filter(Boolean).join(" · ")}
            </Text>
            <FadeRule style={s.rule} color={colors.neutral800} />

            <View style={s.qtyRow}>
              <Text style={s.qtyLabel}>Quantity</Text>
              <View style={s.stepper}>
                <Pressable
                  style={[s.stepCircle, s.stepCircleMinus]}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  accessibilityLabel="Decrease quantity"
                >
                  <Minus size={15} color={colors.neutral300} weight="regular" />
                </Pressable>
                <Text style={s.stepValue}>{qty}</Text>
                <Pressable
                  style={[s.stepCircle, s.stepCirclePlus]}
                  onPress={() => setQty((q) => q + 1)}
                  accessibilityLabel="Increase quantity"
                >
                  <Plus size={15} color={colors.accent} weight="regular" />
                </Pressable>
              </View>
            </View>

            <View style={s.goesOnRow}>
              <Text style={s.goesOnLabel}>Goes on</Text>
              <View style={s.placeChips}>
                {SCAN_PLACE_CHIPS.map((chip) => (
                  <Pressable
                    key={chip}
                    style={[s.placeChip, place === chip && s.placeChipActive]}
                    onPress={() => setPlace(chip)}
                  >
                    <Text style={[s.placeChipText, place === chip && s.placeChipTextActive]}>
                      {chip}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.actionsRow}>
              <Pressable style={s.addButton} onPress={addToShelf}>
                <Text style={s.addButtonText}>Add to shelf</Text>
              </Pressable>
              <Pressable style={s.rescanButton} onPress={rescan}>
                <Text style={s.rescanButtonText}>Rescan</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
