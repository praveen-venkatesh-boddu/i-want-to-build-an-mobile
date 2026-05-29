import { StyleSheet } from "react-native";

import { elevation, md3, radii, spacing } from "../styles/globalStyles";

export const itemEditorStyles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: md3.background
  },
  modalShell: {
    flex: 1
  },

  // ── Modal header ──────────────────────────────────────────────────────
  modalHeader: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainerLow,
    borderBottomColor: md3.outlineVariant,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: 14
  },
  modalTitle: {
    // M3 Title Large
    color: md3.onSurface,
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 0
  },

  // M3 Text Button
  secondaryButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 10
  },
  secondaryButtonText: {
    // M3 Label Large
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // M3 Filled Button
  saveButton: {
    backgroundColor: md3.primary,
    borderRadius: radii.round,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10
  },
  saveButtonText: {
    // M3 Label Large
    color: md3.onPrimary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // ── Form ──────────────────────────────────────────────────────────────
  formContent: {
    padding: spacing.xl,
    paddingBottom: 40
  },
  field: {
    marginBottom: spacing.lg
  },
  fieldLabel: {
    // M3 Label Medium
    color: md3.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
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
    gap: spacing.md
  },
  barcodeInput: {
    flex: 1
  },

  // M3 Filled Button (primary action) — icon + label row
  scanButton: {
    alignItems: "center",
    backgroundColor: md3.primary,
    borderRadius: radii.round,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg
  },
  scanButtonText: {
    color: md3.onPrimary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // M3 Tonal Button (secondary action) — icon + label row
  lookupButton: {
    alignItems: "center",
    backgroundColor: md3.secondaryContainer,
    borderRadius: radii.round,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  lookupButtonDisabled: {
    opacity: 0.38
  },
  lookupButtonText: {
    color: md3.onSecondaryContainer,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  scanMessage: {
    color: md3.primary,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.4,
    marginTop: spacing.sm
  },
  packageDetailsRow: {
    flexDirection: "row",
    gap: spacing.md
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
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outline,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden"
  },
  pkgAmountInput: {
    borderRightColor: md3.outlineVariant,
    borderRightWidth: 1,
    color: md3.onSurface,
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
    color: md3.onSurface,
    fontSize: 15
  },

  // ── Dropdown ──────────────────────────────────────────────────────────
  // M3 Outlined TextField (dropdown trigger)
  dropdownButton: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outline,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  dropdownText: {
    // M3 Body Large
    color: md3.onSurface,
    fontSize: 16,
    fontWeight: "400"
  },
  // dropdownIcon is now a MaterialIcons component — no text style needed

  // M3 Menu surface
  dropdownMenu: {
    backgroundColor: md3.surfaceContainerLowest,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
    maxHeight: 260,
    overflow: "hidden",
    ...elevation.level2
  },
  dropdownSearchInput: {
    backgroundColor: md3.surfaceContainerLowest,
    borderBottomColor: md3.outlineVariant,
    borderBottomWidth: 1,
    color: md3.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  dropdownEmptyState: {
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  dropdownEmptyText: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "400"
  },
  dropdownOptionsList: {
    maxHeight: 208
  },
  dropdownOption: {
    alignItems: "center",
    borderBottomColor: md3.outlineVariant,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  dropdownOptionActive: {
    backgroundColor: md3.secondaryContainer
  },
  dropdownOptionText: {
    // M3 Body Large
    color: md3.onSurface,
    fontSize: 15,
    fontWeight: "400"
  },
  dropdownOptionMeta: {
    color: md3.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "400"
  },
  dropdownOptionTextActive: {
    color: md3.onSecondaryContainer,
    fontWeight: "500"
  },

  // ── Checkbox / Toggle ─────────────────────────────────────────────────
  openedToggle: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs
  },

  // M3 Checkbox style
  checkbox: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: md3.onSurfaceVariant,
    borderRadius: radii.extraSmall,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  checkboxActive: {
    backgroundColor: md3.primary,
    borderColor: md3.primary
  },
  // checkboxMark is now a MaterialIcons "check" icon — no text style needed
  openedToggleText: {
    // M3 Body Large
    color: md3.onSurface,
    fontSize: 16,
    fontWeight: "400"
  },

  // M3 Outlined destructive button (shown only when editing)
  deleteButton: {
    alignItems: "center",
    borderColor: md3.error,
    borderRadius: radii.round,
    borderWidth: 1,
    marginTop: spacing.xxl,
    paddingVertical: 14
  },
  deleteButtonText: {
    // M3 Label Large in error color
    color: md3.error,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  }
});
