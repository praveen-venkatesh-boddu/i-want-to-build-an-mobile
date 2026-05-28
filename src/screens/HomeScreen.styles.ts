import { StyleSheet } from "react-native";

import { elevation, md3, radii, spacing } from "../styles/globalStyles";

export const homeStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: md3.background
  },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md
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
    fontSize: 32,
    fontWeight: "400",
    letterSpacing: 0,
    marginTop: 2
  },

  // ── Scroll content ────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md
  },

  // ── Shopping list big tile ────────────────────────────────────────────
  shoppingTile: {
    backgroundColor: md3.secondaryContainer,
    borderRadius: radii.xl,
    overflow: "hidden",
    padding: spacing.xl,
    ...elevation.level1
  },
  shoppingTileHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  shoppingTileTitle: {
    color: md3.onSecondaryContainer,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 0
  },
  shoppingTileCount: {
    alignItems: "center",
    backgroundColor: md3.secondary,
    borderRadius: radii.round,
    height: 28,
    justifyContent: "center",
    minWidth: 28,
    paddingHorizontal: 8
  },
  shoppingTileCountText: {
    color: md3.onSecondary,
    fontSize: 13,
    fontWeight: "600"
  },

  // Individual row inside the tile
  shoppingRow: {
    alignItems: "center",
    borderTopColor: md3.outline + "33",   // 20 % opacity
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10
  },
  shoppingRowName: {
    color: md3.onSecondaryContainer,
    flex: 1,
    fontSize: 15,
    fontWeight: "400"
  },
  shoppingRowQty: {
    color: md3.onSecondaryContainer,
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.75
  },

  // "All clear" state
  shoppingEmpty: {
    alignItems: "center",
    paddingVertical: spacing.lg
  },
  shoppingEmptyText: {
    color: md3.onSecondaryContainer,
    fontSize: 15,
    fontWeight: "400",
    opacity: 0.75
  },

  // Footer "View all →" or "+n more →"
  shoppingTileFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "flex-end",
    marginTop: spacing.md
  },
  shoppingTileFooterText: {
    color: md3.onSecondaryContainer,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.1
  },

  // ── Small tiles row ───────────────────────────────────────────────────
  smallTileRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm
  },

  smallTile: {
    borderRadius: radii.xl,
    flex: 1,
    padding: spacing.xl,
    ...elevation.level1
  },
  expiringTile: {
    backgroundColor: md3.warningContainer
  },
  perishableTile: {
    backgroundColor: md3.tertiaryContainer
  },

  smallTileBigNumber: {
    fontSize: 40,
    fontWeight: "300",
    letterSpacing: -1,
    lineHeight: 44
  },
  expiringNumber: {
    color: md3.onWarningContainer
  },
  perishableNumber: {
    color: md3.onTertiaryContainer
  },

  smallTileLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: spacing.sm
  },
  expiringLabel: {
    color: md3.onWarningContainer
  },
  perishableLabel: {
    color: md3.onTertiaryContainer
  },

  smallTileHint: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
    opacity: 0.7
  },
  smallTileArrow: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
    opacity: 0.7
  },
  expiringHint: {
    color: md3.onWarningContainer
  },
  perishableHint: {
    color: md3.onTertiaryContainer
  }
});
