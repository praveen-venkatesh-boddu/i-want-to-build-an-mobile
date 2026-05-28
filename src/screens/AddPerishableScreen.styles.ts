import { StyleSheet } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";

export const addPerishableStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: md3.background
  },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainerLow,
    borderBottomColor: md3.outlineVariant,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: 14
  },
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    paddingVertical: 6
  },
  backLabel: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  headerTitle: {
    color: md3.onSurface,
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0
  },
  saveButton: {
    backgroundColor: md3.primary,
    borderRadius: radii.round,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10
  },
  saveButtonText: {
    color: md3.onPrimary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },

  // ── Form ──────────────────────────────────────────────────────────────
  formScroll: {
    flex: 1
  },
  formContent: {
    padding: spacing.xl,
    paddingBottom: 48,
    gap: spacing.xl
  },

  fieldGroup: {
    gap: spacing.sm
  },
  fieldLabel: {
    color: md3.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  textInput: {
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outline,
    borderRadius: radii.md,
    borderWidth: 1,
    color: md3.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14
  },

  // ── Quantity row ──────────────────────────────────────────────────────
  quantityRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  quantityInput: {
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outline,
    borderRadius: radii.md,
    borderWidth: 1,
    color: md3.onSurface,
    fontSize: 18,
    fontWeight: "500",
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlign: "center",
    width: 88
  },

  // ── Chip row (unit / location / expires-in) ───────────────────────────
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    backgroundColor: "transparent",
    borderColor: md3.outlineVariant,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: md3.secondaryContainer,
    borderColor: "transparent"
  },
  chipText: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  chipTextActive: {
    color: md3.onSecondaryContainer,
    fontWeight: "600"
  }
});
