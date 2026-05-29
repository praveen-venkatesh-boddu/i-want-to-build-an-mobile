import { StyleSheet } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";
// Header styles removed — now handled by ScreenHeader component
// Filter-button/chip styles removed — now handled by ChipGroup component

export const pantryListStyles = StyleSheet.create({

  // ── Shell ─────────────────────────────────────────────────────────────
  appShell: {
    flex: 1,
    backgroundColor: md3.background
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl
  },

  // ── Search & filters ──────────────────────────────────────────────────
  searchInput: {
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outline,
    borderRadius: radii.md,
    borderWidth: 1,
    color: md3.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  filterRow: {
    marginTop: spacing.md
  },

  // ── Item list ─────────────────────────────────────────────────────────
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainerLow,
    borderRadius: radii.lg,
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  emptyTitle: {
    color: md3.onSurface,
    fontSize: 20,
    fontWeight: "500"
  },
  emptyText: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    textAlign: "center"
  }
});
