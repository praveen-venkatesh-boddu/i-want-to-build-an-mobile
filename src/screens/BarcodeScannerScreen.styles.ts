import { StyleSheet } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";

export const barcodeScannerStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: md3.background
  },

  // ── Permission screen ─────────────────────────────────────────────────
  permissionContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl
  },
  title: {
    // M3 Headline Small
    color: md3.onSurface,
    fontSize: 24,
    fontWeight: "400",
    textAlign: "center"
  },
  bodyText: {
    // M3 Body Large
    color: md3.onSurfaceVariant,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.5,
    lineHeight: 24,
    marginTop: spacing.sm,
    textAlign: "center"
  },

  // M3 Filled Button
  primaryButton: {
    backgroundColor: md3.primary,
    borderRadius: radii.round,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: md3.onPrimary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // M3 Text Button
  secondaryButton: {
    marginTop: spacing.md,
    padding: spacing.sm
  },
  secondaryButtonText: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // ── Scanner ───────────────────────────────────────────────────────────
  scannerShell: {
    flex: 1,
    backgroundColor: "#000000"
  },
  camera: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between"
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg
  },

  // Icon-only close button (40dp touch target)
  closeButton: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: radii.round,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  scanFrame: {
    alignItems: "center",
    justifyContent: "center"
  },
  scanFrameInner: {
    borderColor: md3.primaryContainer,
    borderRadius: radii.lg,
    borderWidth: 3,
    height: 170,
    width: "78%"
  },

  // M3 Surface (scrim-backed footer)
  footer: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl
  },
  footerTitle: {
    // M3 Title Large
    color: md3.surfaceContainerLowest,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center"
  },
  footerText: {
    // M3 Body Medium
    color: md3.outlineVariant,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
    marginTop: spacing.xs,
    textAlign: "center"
  }
});
