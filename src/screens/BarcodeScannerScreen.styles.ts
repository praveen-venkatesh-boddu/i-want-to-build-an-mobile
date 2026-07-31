import { StyleSheet } from "react-native";

import { colors, radii, space } from "../styles/globalStyles";

export const barcodeScannerStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },

  // ── Permission screen ─────────────────────────────────────────────────
  permissionContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: space.xl
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "400",
    textAlign: "center"
  },
  bodyText: {
    color: colors.neutral400,
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.5,
    lineHeight: 24,
    marginTop: space.sm,
    textAlign: "center"
  },

  primaryButton: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    marginTop: space.xl,
    paddingHorizontal: space.xl,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },

  secondaryButton: {
    marginTop: space.md,
    padding: space.sm
  },
  secondaryButtonText: {
    color: colors.neutral400,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
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
    paddingHorizontal: space.xl
  },

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
    borderColor: colors.accent,
    borderRadius: radii.lg,
    borderWidth: 3,
    height: 170,
    width: "78%"
  },

  footer: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: space.xl,
    paddingVertical: space.xl
  },
  footerTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    textAlign: "center"
  },
  footerText: {
    color: colors.neutral300,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
    marginTop: space.xs,
    textAlign: "center"
  }
});
