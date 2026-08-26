import {
  BarcodeScanningResult,
  BarcodeType,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Minus, Plus, X } from "phosphor-react-native";
import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FadeRule } from "../components/FadeRule";
import {
  lookupProductByBarcode,
  lookupProductByPhoto,
  type LookupOutcome
} from "../services/productLookup";
import { colors } from "../styles/globalStyles";
import type { PantryItem, Shelf } from "../types/pantry";
import { scanStyles as s } from "./ScanScreen.styles";

type ScanScreenProps = {
  shelves: Shelf[];
  defaultShelfId: string | null;
  /** Checked before any network call, so a restock of a known item never hits an API. */
  knownItems: PantryItem[];
  onClose: () => void;
  onAddManually: () => void;
  /** Hands a label read back to the app, which opens the editor prefilled. */
  onLabelRead: (outcome: LookupOutcome) => void;
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

/** Default shelf first, then the rest in order, capped at 3 — plus the currently
 * selected place if it'd otherwise fall outside that set. */
function scanChips(shelves: Shelf[], defaultShelfId: string | null, currentPlace: string): Shelf[] {
  const open = shelves.filter((shelf) => !shelf.hidden);
  const def = open.find((shelf) => shelf.id === defaultShelfId);
  const ordered = def ? [def, ...open.filter((shelf) => shelf !== def)] : open;
  const shown = ordered.slice(0, 3);
  const current = open.find((shelf) => shelf.name === currentPlace);
  if (current && !shown.includes(current)) shown[shown.length - 1] = current;
  return shown;
}

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

export function ScanScreen({
  shelves,
  defaultShelfId,
  knownItems,
  onClose,
  onAddManually,
  onLabelRead,
  onAddToShelf
}: ScanScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<"idle" | "found">("idle");
  const [found, setFound] = useState<FoundState | null>(null);
  const [qty, setQty] = useState(1);
  const [isReading, setReading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const defaultShelfName = useMemo(() => {
    const open = shelves.filter((shelf) => !shelf.hidden);
    const def = open.find((shelf) => shelf.id === defaultShelfId);
    return (def ?? open[0])?.name ?? "";
  }, [shelves, defaultShelfId]);
  const [place, setPlace] = useState<string>(defaultShelfName);
  const chips = useMemo(() => scanChips(shelves, defaultShelfId, place), [shelves, defaultShelfId, place]);

  async function handleScanned(result: BarcodeScanningResult) {
    if (step !== "idle" || isReading || !result.data) return;
    const barcode = result.data;
    const { result: lookup } = await lookupProductByBarcode(barcode, knownItems);
    setFound({
      barcode,
      name: lookup?.name ?? "",
      category: lookup?.category ?? "Other",
      packageSize: lookup?.packageSize ?? "",
      unit: lookup?.unit ?? "items"
    });
    setQty(1);
    setPlace(defaultShelfName);
    setStep("found");
  }

  /** Photograph the packaging and read it on-device — no barcode needed. */
  async function readLabel() {
    if (!cameraRef.current || isReading) return;

    setReading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!photo?.uri) return;

      onLabelRead(await lookupProductByPhoto(photo.uri, photo.width, photo.height));
    } catch {
      onLabelRead({ result: null, source: "ocr", confidence: 0, candidates: [], blocks: [] });
    } finally {
      setReading(false);
    }
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
        ref={cameraRef}
        style={s.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: SUPPORTED_BARCODE_TYPES }}
        onBarcodeScanned={step === "idle" && !isReading ? handleScanned : undefined}
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

            <View style={s.fallbackRow}>
              <Pressable
                style={[s.readLabelButton, isReading && s.readLabelButtonBusy]}
                onPress={readLabel}
                disabled={isReading}
                accessibilityLabel="Read the label instead"
              >
                {isReading ? <ActivityIndicator size="small" color={colors.accent} /> : null}
                <Text style={s.readLabelText}>
                  {isReading ? "Reading the label…" : "Read the label instead"}
                </Text>
              </Pressable>

              <Pressable style={s.manualEntryLink} onPress={onAddManually}>
                <Text style={s.manualEntryLinkText}>Type it in by hand</Text>
              </Pressable>
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
                {chips.map((chip) => (
                  <Pressable
                    key={chip.id}
                    style={[s.placeChip, place === chip.name && s.placeChipActive]}
                    onPress={() => setPlace(chip.name)}
                  >
                    <Text style={[s.placeChipText, place === chip.name && s.placeChipTextActive]}>
                      {chip.name}
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
