import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

export const expiringStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },
  titleBlock: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 14,
    paddingBottom: 16
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontFamily: "SpaceGrotesk_500Medium", fontWeight: "500",
    letterSpacing: -1
  },
  subtitle: {
    color: colors.neutral400,
    fontSize: 13,
    marginTop: 8
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: spacing.screenH,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral900
  },
  rowPressed: {
    backgroundColor: colors.accentTint14
  },
  dayBlock: {
    width: 52,
    alignItems: "center"
  },
  dayNumber: {
    fontSize: 32,
    fontFamily: "IBMPlexSans_300Light", fontWeight: "300",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5
  },
  dayUnit: {
    color: colors.neutral500,
    fontSize: 9,
    letterSpacing: 1.1,
    marginTop: 2
  },
  rowBody: {
    flex: 1
  },
  rowName: {
    color: colors.text,
    fontSize: 19,
    fontFamily: "SpaceGrotesk_400Regular", fontWeight: "400"
  },
  rowMeta: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase"
  },
  useButton: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  useButtonText: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },

  emptyState: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 32
  },
  emptyText: {
    color: colors.neutral500,
    fontSize: 14
  }
});
