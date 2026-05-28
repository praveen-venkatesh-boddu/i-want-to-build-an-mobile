import { MaterialIcons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  BarcodeType,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { md3 } from "../styles/globalStyles";
import { barcodeScannerStyles as styles } from "./BarcodeScannerScreen.styles";

type BarcodeScannerScreenProps = {
  onCancel: () => void;
  onScanned: (barcode: string) => void;
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

export function BarcodeScannerScreen({ onCancel, onScanned }: BarcodeScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);

  function handleScanned(result: BarcodeScanningResult) {
    if (hasScanned || !result.data) {
      return;
    }

    setHasScanned(true);
    onScanned(result.data);
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
        barcodeScannerSettings={{ barcodeTypes: supportedBarcodeTypes }}
        facing="back"
        onBarcodeScanned={hasScanned ? undefined : handleScanned}
        style={styles.camera}
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Pressable onPress={onCancel} style={styles.closeButton} accessibilityLabel="Close scanner">
            <MaterialIcons name="close" size={22} color={md3.surfaceContainerLowest} />
          </Pressable>
        </View>
        <View style={styles.scanFrame}>
          <View style={styles.scanFrameInner} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Scan barcode</Text>
          <Text style={styles.footerText}>Center the barcode inside the frame.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
