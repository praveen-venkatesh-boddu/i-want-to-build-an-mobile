import { StyleSheet } from "react-native";

import { elevation, md3, radii, spacing } from "../styles/globalStyles";

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

  // ── Header with back chevron ──────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 4,
    marginBottom: spacing.sm,
    paddingVertical: 4
  },
  backLabel: {
    color: md3.primary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  eyebrow: {
    color: md3.primary,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  title: {
    color: md3.onBackground,
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: 0,
    marginTop: 2
  },

  // ── Stats row ─────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.sm
  },
  statCard: {
    backgroundColor: md3.surfaceContainerLow,
    borderRadius: radii.md,
    flex: 1,
    padding: 14,
    ...elevation.level1
  },
  statWarning: {
    backgroundColor: md3.warningContainer
  },
  statDanger: {
    backgroundColor: md3.errorContainer
  },
  statValue: {
    color: md3.onSurface,
    fontSize: 24,
    fontWeight: "600"
  },
  statLabel: {
    color: md3.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: 2
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  filterButton: {
    backgroundColor: "transparent",
    borderColor: md3.outlineVariant,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  filterButtonActive: {
    backgroundColor: md3.secondaryContainer,
    borderColor: "transparent"
  },
  filterButtonText: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  filterButtonTextActive: {
    color: md3.onSecondaryContainer
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
  },

});
