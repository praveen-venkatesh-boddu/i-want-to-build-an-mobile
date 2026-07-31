import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

const BRACKET = 34;

export const scanStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#000"
  },
  camera: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    ...StyleSheet.absoluteFillObject
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenH,
    paddingVertical: 8
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(233,233,237,0.25)",
    alignItems: "center",
    justifyContent: "center"
  },
  topEyebrow: {
    color: colors.neutral300,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  topBarSpacer: {
    width: 34
  },

  viewfinder: {
    position: "absolute",
    top: 230,
    left: 52,
    right: 52,
    height: 150
  },
  bracket: {
    position: "absolute",
    width: BRACKET,
    height: BRACKET,
    borderColor: colors.accent
  },
  bracketTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 6
  },
  bracketTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 6
  },
  bracketBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 6
  },
  bracketBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 6
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4
  },

  idleHint: {
    position: "absolute",
    left: spacing.screenH,
    right: spacing.screenH,
    bottom: 48,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.round,
    paddingVertical: 10,
    alignItems: "center"
  },
  idleHintText: {
    color: colors.accent300,
    fontSize: 13,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },

  foundPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
    paddingHorizontal: spacing.screenH,
    paddingTop: 22,
    paddingBottom: 46
  },
  foundEyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 1.8
  },
  productName: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "SpaceGrotesk_500Medium", fontWeight: "500",
    letterSpacing: -0.6,
    marginTop: 8,
    padding: 0
  },
  productSubtitle: {
    color: colors.neutral400,
    fontSize: 13,
    marginTop: 2
  },
  rule: {
    marginTop: 16,
    marginBottom: 16
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  qtyLabel: {
    width: 64,
    color: colors.neutral500,
    fontSize: 12
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  stepCircleMinus: {
    borderColor: colors.neutral700
  },
  stepCirclePlus: {
    borderColor: colors.accent
  },
  stepValue: {
    color: colors.text,
    fontSize: 22,
    fontVariant: ["tabular-nums"],
    minWidth: 24,
    textAlign: "center"
  },

  goesOnRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 8
  },
  goesOnLabel: {
    width: 64,
    color: colors.neutral500,
    fontSize: 12
  },
  placeChips: {
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    gap: 8
  },
  placeChip: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 11,
    paddingVertical: 6
  },
  placeChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  placeChipText: {
    color: colors.neutral400,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  placeChipTextActive: {
    color: colors.accent300
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22
  },
  addButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 14
  },
  addButtonText: {
    color: colors.accent,
    fontSize: 15,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  rescanButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 18,
    paddingVertical: 14
  },
  rescanButtonText: {
    color: colors.neutral300,
    fontSize: 15
  },

  permissionShell: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screenH
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 19,
    fontFamily: "SpaceGrotesk_500Medium", fontWeight: "500",
    textAlign: "center"
  },
  permissionBody: {
    color: colors.neutral400,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8
  },
  permissionButton: {
    marginTop: 22,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  permissionButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  permissionCancel: {
    marginTop: 14
  },
  permissionCancelText: {
    color: colors.neutral500,
    fontSize: 13
  }
});
