import { StyleSheet } from "react-native";

import { colors, radii, space } from "../styles/globalStyles";

export const itemEditorStyles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  modalShell: {
    flex: 1
  },

  // ── Modal header ──────────────────────────────────────────────────────
  modalHeader: {
    alignItems: "center",
    backgroundColor: colors.bg,
    borderBottomColor: colors.neutral800,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: space.xl,
    paddingTop: 14,
    paddingVertical: 14
  },
  modalTitle: {
    color: colors.neutral400,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase"
  },

  secondaryButton: {
    paddingVertical: 10,
    minWidth: 60
  },
  secondaryButtonText: {
    color: colors.neutral400,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },
  headerSpacer: {
    minWidth: 60
  },

  // ── Form ──────────────────────────────────────────────────────────────
  formContent: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: 32
  },
  field: {
    marginBottom: space.lg
  },
  fieldLabel: {
    color: colors.neutral400,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase"
  },

  // ── Edit kicker (context banner shown only while editing) ──────────────
  kickerBlock: {
    marginBottom: space.lg
  },
  kickerLabel: {
    color: colors.accent,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 1.8,
    textTransform: "uppercase"
  },
  kickerSubtitle: {
    color: colors.neutral400,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: 320
  },

  // ── Bordered card (barcode) ─────────────────────────────────────────────
  card: {
    borderColor: colors.neutral800,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: space.lg,
    padding: 13
  },
  cardLabel: {
    color: colors.neutral500,
    fontSize: 9,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 1.4,
    marginBottom: 10,
    textTransform: "uppercase"
  },
  barcodeRow: {
    flexDirection: "row",
    gap: space.sm
  },
  barcodeInput: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    fontFamily: "SpaceGrotesk_400Regular"
  },

  scanButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: space.md
  },
  scanButtonText: {
    color: colors.neutral300,
    fontSize: 13,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },

  lookupButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: space.sm
  },
  lookupButtonDisabled: {
    opacity: 0.38
  },
  lookupButtonText: {
    color: colors.neutral300,
    fontSize: 13,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },
  scanMessage: {
    color: colors.accent300,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.2,
    marginTop: space.sm
  },

  // ── Section header (eyebrow + fade rule + status) ───────────────────────
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: space.md,
    marginBottom: space.md
  },
  sectionHeaderLabel: {
    color: colors.neutral500,
    fontSize: 11,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 1.6,
    textTransform: "uppercase"
  },
  sectionHeaderRule: {
    flex: 1
  },
  sectionHeaderStatus: {
    fontSize: 11
  },

  // ── Name field (big heading input) ──────────────────────────────────────
  nameInput: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "SpaceGrotesk_500Medium", fontWeight: "500",
    letterSpacing: -0.6,
    padding: 0
  },
  nameRule: {
    height: 1,
    marginTop: 11
  },
  nameHint: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 9
  },
  /** An uncertain read says so in the accent, so it reads as "check me". */
  nameHintUnsure: {
    color: colors.accent300
  },

  // ── Runner-up names from a label read ───────────────────────────────────
  candidateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 11
  },
  candidateChip: {
    backgroundColor: colors.accentTint14,
    borderColor: colors.accent800,
    borderRadius: radii.md,
    borderWidth: 1,
    maxWidth: "100%",
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  candidateChipText: {
    color: colors.accent200,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },

  // ── Generic label + control row (Quantity / Goes on / Category / Expires) ─
  fieldRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: space.lg,
    marginTop: space.lg
  },
  fieldRowTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: space.lg,
    marginTop: space.lg
  },
  fieldRowLabel: {
    color: colors.neutral500,
    fontSize: 12,
    width: 68
  },
  fieldRowLabelTop: {
    color: colors.neutral500,
    fontSize: 12,
    paddingTop: 7,
    width: 68
  },

  // ── Quantity stepper ─────────────────────────────────────────────────────
  stepperRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: space.lg
  },
  stepCircle: {
    alignItems: "center",
    borderRadius: radii.round,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34
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

  // ── Chips (shared: shelves, categories, expiry, package type) ───────────
  chipsWrap: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },
  chip: {
    backgroundColor: "transparent",
    borderColor: colors.neutral800,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  chipActive: {
    backgroundColor: colors.accentTint14,
    borderColor: colors.accent
  },
  chipText: {
    color: colors.neutral400,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  chipTextActive: {
    color: colors.accent100
  },
  chipSmall: {
    backgroundColor: "transparent",
    borderColor: colors.neutral800,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  chipTextSmall: {
    color: colors.neutral400,
    fontSize: 11,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },

  fieldNote: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 9
  },

  // ── "Add details" disclosure ─────────────────────────────────────────────
  detailsToggle: {
    alignItems: "center",
    borderTopColor: colors.neutral900,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: space.xxl - 6,
    paddingTop: space.lg
  },
  detailsToggleLabel: {
    color: colors.accent200,
    fontSize: 13
  },
  detailsToggleHint: {
    color: colors.neutral500,
    fontSize: 11,
    marginLeft: "auto"
  },
  detailsSection: {
    flexDirection: "column",
    gap: space.md + 2,
    paddingTop: space.lg
  },
  detailsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: space.lg
  },
  detailsInput: {
    borderBottomColor: colors.neutral800,
    borderBottomWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 14,
    paddingBottom: 7
  },
  detailsPkgTypeRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },

  // ── Checkbox / Toggle ─────────────────────────────────────────────────
  openedToggle: {
    alignItems: "center",
    flexDirection: "row",
    gap: space.md,
    paddingTop: 2
  },
  checkbox: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.neutral700,
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 17,
    justifyContent: "center",
    width: 17
  },
  checkboxActive: {
    backgroundColor: colors.accentTint14,
    borderColor: colors.accent
  },
  openedToggleText: {
    color: colors.neutral300,
    fontSize: 13
  },

  footnote: {
    color: colors.neutral500,
    fontSize: 12,
    lineHeight: 18,
    marginTop: space.xl
  },

  deleteButton: {
    alignItems: "center",
    borderColor: colors.danger,
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: space.xxl,
    paddingVertical: 14
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },

  // ── Sticky footer / Save ────────────────────────────────────────────────
  footer: {
    backgroundColor: colors.bg,
    borderTopColor: colors.neutral800,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingBottom: 30,
    paddingHorizontal: space.xl,
    paddingTop: space.md
  },
  saveButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  }
});
