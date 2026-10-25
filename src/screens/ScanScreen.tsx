import {
  BarcodeScanningResult,
  BarcodeType,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { lookupProductByBarcode, type LookupOutcome } from "../services/productLookup";
import { colors } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { scanStyles as s } from "./ScanScreen.styles";

type ScanScreenProps = {
  /** Checked before any network call, so a restock of a known item never hits an API. */
  knownItems: PantryItem[];
  onClose: () => void;
  onAddManually: () => void;
  /**
   * Called once a code has been read and looked up, found or not. The caller opens the edit
   * form, so the person always lands on the same screen to confirm or fill in the details.
   * `skipped` is true when they gave up waiting for the lookup.
   */
  onScanned: (barcode: string, outcome: LookupOutcome, skipped: boolean) => void;
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

export function ScanScreen({ knownItems, onClose, onAddManually, onScanned }: ScanScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<"idle" | "looking">("idle");
  const [lookingFor, setLookingFor] = useState("");
  // Set synchronously, because the camera fires again before React has re-rendered.
  const busyRef = useRef(false);
  // Bumped on skip so a lookup that finishes late is ignored.
  const attemptRef = useRef(0);

  function handleScanned(result: BarcodeScanningResult) {
    return processBarcode(result.data);
  }

  async function processBarcode(barcode: string) {
    if (busyRef.current || step !== "idle" || !barcode) return;
    busyRef.current = true;
    const attempt = ++attemptRef.current;
    setLookingFor(barcode);
    setStep("looking");

    let outcome: LookupOutcome = { result: null, source: "none", unreachable: true };
    try {
      outcome = await lookupProductByBarcode(barcode, knownItems);
    } catch {
      // keep the "couldn't ask" outcome above
    }
    // The person skipped while this was running.
    if (attempt !== attemptRef.current) return;

    busyRef.current = false;
    setStep("idle");
    onScanned(barcode, outcome, false);
  }

  /** Stop waiting: go to the form with the barcode and nothing else. */
  function skipLookup() {
    attemptRef.current += 1;
    busyRef.current = false;
    setStep("idle");
    onScanned(lookingFor, { result: null, source: "none" }, true);
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
      {permission?.granted ? (
      <CameraView
        style={s.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: SUPPORTED_BARCODE_TYPES }}
        onBarcodeScanned={step === "idle" ? handleScanned : undefined}
      />
      ) : null}

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

            <View style={[s.bottomStack, { paddingBottom: Math.max(insets.bottom, 12) + 12 }]}>
            <View style={s.idleHint}>
              <Text style={s.idleHintText}>
                {permission?.granted ? "Tap the frame to scan a barcode" : "Camera access is off"}
              </Text>
            </View>

            <View style={s.fallbackRow}>
              <Pressable style={s.manualEntryLink} onPress={onAddManually}>
                <Text style={s.manualEntryLinkText}>Type it in by hand</Text>
              </Pressable>
            </View>
            </View>
          </>
        ) : null}

        {step === "looking" ? (
          <View style={s.lookingPanel} accessibilityLiveRegion="polite">
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={s.lookingTitle}>Looking it up…</Text>
            <Text style={s.lookingBarcode}>{lookingFor.split("").join(" ")}</Text>
            <Text style={s.lookingHint}>
              Checking your shelves, the Swad catalog, then online databases. This can take a few seconds.
            </Text>
            <Pressable style={s.lookingSkip} onPress={skipLookup} accessibilityLabel="Skip the lookup">
              <Text style={s.lookingSkipText}>Skip and type it in</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}
