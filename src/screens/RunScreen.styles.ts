import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

export const runStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenH,
    paddingTop: 16
  },
  pauseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  pauseLabel: {
    color: colors.neutral400,
    fontSize: 13
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase"
  },

  countRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.screenH,
    marginTop: 18,
    gap: 10
  },
  countNumber: {
    color: colors.text,
    fontSize: 52,
    // No explicit lineHeight — clips in RN native text layout otherwise.
    // Uses the heading face (not the tabular numeral face) per the design.
    fontFamily: "SpaceGrotesk_300Light", fontWeight: "300",
    letterSpacing: -2
  },
  countLabel: {
    color: colors.neutral400,
    fontSize: 15,
    paddingBottom: 8
  },

  progressRow: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: spacing.screenH,
    marginTop: 16
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.neutral800
  },
  segmentTicked: {
    backgroundColor: colors.accent
  },

  list: {
    paddingTop: 22,
    paddingBottom: 16
  },
  groupLabel: {
    color: colors.neutral500,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    paddingHorizontal: spacing.screenH,
    paddingBottom: 8,
    marginTop: 18
  },
  groupLabelFirst: {
    marginTop: 0
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: spacing.screenH,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.neutral600,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxTicked: {
    backgroundColor: colors.accent700,
    borderColor: colors.accent700
  },
  rowBody: {
    flex: 1
  },
  rowName: {
    color: colors.text,
    fontSize: 16
  },
  rowNameTicked: {
    color: colors.neutral600,
    textDecorationLine: "line-through"
  },
  rowMeta: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 2
  },
  rowWanted: {
    color: colors.neutral500,
    fontSize: 13
  },

  emptyState: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 40
  },
  emptyHeading: {
    color: colors.text,
    fontSize: 19
  },
  emptyBody: {
    color: colors.neutral500,
    fontSize: 13,
    marginTop: 6
  },

  bottomBar: {
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900,
    paddingHorizontal: spacing.screenH,
    paddingTop: 16,
    paddingBottom: 18
  },
  finishButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 14
  },
  finishText: {
    color: colors.accent,
    fontSize: 15,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 16
  },
  scanText: {
    color: colors.neutral300,
    fontSize: 15
  }
});
