import { StyleSheet } from "react-native";

import { colors, radii, shadowMd, space } from "../styles/globalStyles";

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
    backgroundColor: colors.surface,
    borderBottomColor: colors.neutral800,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: space.xl,
    paddingVertical: 14
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0
  },

  secondaryButton: {
    paddingHorizontal: space.sm,
    paddingVertical: 10
  },
  secondaryButtonText: {
    color: colors.neutral400,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },

  saveButton: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: space.xl,
    paddingVertical: 10
  },
  saveButtonText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },

  // ── Form ──────────────────────────────────────────────────────────────
  formContent: {
    padding: space.xl,
    paddingBottom: 40
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
  notesInput: {
    minHeight: 86,
    textAlignVertical: "top"
  },
  barcodeRow: {
    flexDirection: "row",
    gap: space.md
  },
  barcodeInput: {
    flex: 1
  },

  scanButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: space.lg
  },
  scanButtonText: {
    color: colors.neutral300,
    fontSize: 14,
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
    minHeight: 48,
    paddingHorizontal: space.md
  },
  lookupButtonDisabled: {
    opacity: 0.38
  },
  lookupButtonText: {
    color: colors.neutral300,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.1
  },
  scanMessage: {
    color: colors.accent300,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 0.4,
    marginTop: space.sm
  },
  packageDetailsRow: {
    flexDirection: "row",
    gap: space.md
  },
  quantityField: {
    flex: 0.75
  },
  packageTypeField: {
    flex: 1.2
  },
  packageSizeField: {
    flex: 1.3
  },
  pkgSizeRow: {
    backgroundColor: colors.surface,
    borderColor: colors.neutral800,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden"
  },
  pkgAmountInput: {
    borderRightColor: colors.neutral800,
    borderRightWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  pkgUnitTrigger: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: 70
  },
  pkgUnitText: {
    color: colors.text,
    fontSize: 15
  },

  // ── Dropdown ──────────────────────────────────────────────────────────
  dropdownButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.neutral800,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  dropdownText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400"
  },

  dropdownMenu: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginBottom: space.lg,
    marginTop: -space.sm,
    maxHeight: 260,
    overflow: "hidden",
    ...shadowMd
  },
  dropdownSearchInput: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.neutral800,
    borderBottomWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  dropdownEmptyState: {
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  dropdownEmptyText: {
    color: colors.neutral400,
    fontSize: 14,
    fontWeight: "400"
  },
  dropdownOptionsList: {
    maxHeight: 208
  },
  dropdownOption: {
    alignItems: "center",
    borderBottomColor: colors.neutral800,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  dropdownOptionActive: {
    backgroundColor: colors.accentTint14
  },
  dropdownOptionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "400"
  },
  dropdownOptionMeta: {
    color: colors.neutral400,
    fontSize: 13,
    fontWeight: "400"
  },
  dropdownOptionTextActive: {
    color: colors.accent300,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },

  // ── Checkbox / Toggle ─────────────────────────────────────────────────
  openedToggle: {
    alignItems: "center",
    flexDirection: "row",
    gap: space.md,
    marginTop: space.xs
  },
  checkbox: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.neutral600,
    borderRadius: radii.sm,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  checkboxActive: {
    backgroundColor: colors.accent700,
    borderColor: colors.accent700
  },
  openedToggleText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400"
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
  }
});
