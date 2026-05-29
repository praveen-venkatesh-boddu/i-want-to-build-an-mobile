import { StyleSheet } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";
// Header styles removed — now handled by ScreenHeader component
// Chip styles removed — now handled by ChipGroup component

export const addPerishableStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: md3.background
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
  }
});
