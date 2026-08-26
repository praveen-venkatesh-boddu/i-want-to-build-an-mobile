import {
  BarcodeScanningResult,
  BarcodeType,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import { TextAa, X } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { lookupProductByPhoto, type LookupOutcome } from "../services/productLookup";
import { colors, space } from "../styles/globalStyles";
import { barcodeScannerStyles as styles } from "./BarcodeScannerScreen.styles";

type BarcodeScannerScreenProps = {
  onCancel: () => void;
  onScanned: (barcode: string) => void;
  /**
   * Called when the label was read instead of the barcode. Omit to hide the
   * affordance entirely.
   */
  onLabelRead?: (outcome: LookupOutcome) => void;
};

const supportedBarcodeTypes: BarcodeType[] = [
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

export function BarcodeScannerScreen({ onCancel, onScanned, onLabelRead }: BarcodeScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [isReading, setReading] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const insets = useSafeAreaInsets();

  function handleScanned(result: BarcodeScanningResult) {
    if (hasScanned || isReading || !result.data) {
      return;
    }

    setHasScanned(true);
    onScanned(result.data);
  }

  /**
   * Photograph the packaging and read it on-device.
   *
   * `skipProcessing` is deliberately not set: it disables the orientation fix, and
   * ML Kit needs the image the right way up to find text.
   */
  async function readLabel() {
    if (!cameraRef.current || isReading || !onLabelRead) return;

    setReading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!photo?.uri) return;

      const outcome = await lookupProductByPhoto(photo.uri, photo.width, photo.height);
      onLabelRead(outcome);
    } catch {
      onLabelRead({ result: null, source: "ocr", confidence: 0, candidates: [], blocks: [] });
    } finally {
      setReading(false);
    }
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContent}>
          <Text style={styles.title}>Preparing camera</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.permissionContent}>
          <Text style={styles.title}>Camera access needed</Text>
          <Text style={styles.bodyText}>Allow camera access to scan item barcodes.</Text>
          <Pressable onPress={requestPermission} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Allow camera</Text>
          </Pressable>
          <Pressable onPress={onCancel} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.scannerShell}>
      <CameraView
        ref={cameraRef}
        barcodeScannerSettings={{ barcodeTypes: supportedBarcodeTypes }}
        facing="back"
        onBarcodeScanned={hasScanned || isReading ? undefined : handleScanned}
        style={styles.camera}
      />
      <View style={styles.overlay}>
        <View style={[styles.header, { paddingTop: insets.top + space.sm }]}>
          <Pressable onPress={onCancel} style={styles.closeButton} accessibilityLabel="Close scanner">
            <X size={20} color={colors.text} weight="regular" />
          </Pressable>
        </View>
        <View style={styles.scanFrame}>
          <View style={styles.scanFrameInner} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Scan barcode</Text>
          <Text style={styles.footerText}>Center the barcode inside the frame.</Text>

          {onLabelRead ? (
            <Pressable
              onPress={readLabel}
              disabled={isReading}
              style={[styles.readLabelButton, isReading && styles.readLabelButtonBusy]}
              accessibilityLabel="Read the label instead"
            >
              {isReading ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <TextAa size={16} color={colors.accent} weight="regular" />
              )}
              <Text style={styles.readLabelText}>
                {isReading ? "Reading the label…" : "No barcode? Read the label"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
