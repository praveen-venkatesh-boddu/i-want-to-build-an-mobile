import { StyleSheet } from "react-native";

import { elevation, md3, radii, spacing } from "../styles/globalStyles";
// Header styles removed — now handled by ScreenHeader component

export const addChoiceStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: md3.background
  },

  // ── Option cards ──────────────────────────────────────────────────────
  optionList: {
    flex: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm
  },

  optionCard: {
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outlineVariant,
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
    ...elevation.level1
  },

  optionIconWrap: {
    alignItems: "center",
    backgroundColor: md3.secondaryContainer,
    borderRadius: radii.lg,
    height: 56,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 56
  },
  optionIconWrapAlt: {
    backgroundColor: md3.primaryContainer
  },

  optionTitle: {
    color: md3.onSurface,
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 0.15
  },
  optionDescription: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
    lineHeight: 20,
    marginTop: 6
  },

  optionFooter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: spacing.lg
  },
  optionFooterLabel: {
    color: md3.primary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  }
});
