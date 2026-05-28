import { StyleSheet } from "react-native";

import { elevation, md3, radii, spacing } from "../styles/globalStyles";

export const addChoiceStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: md3.background
  },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg
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
  title: {
    color: md3.onBackground,
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: 0
  },
  subtitle: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
    marginTop: 4
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
