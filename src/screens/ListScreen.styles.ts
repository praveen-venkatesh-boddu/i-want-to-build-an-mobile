import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

export const listStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },

  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenH,
    paddingTop: 24,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent800,
    overflow: "hidden"
  },
  headerGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 40
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16
  },

  heroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 24
  },
  heroCount: {
    color: colors.text,
    fontSize: 76,
    // No explicit lineHeight: it clips digits top/bottom in RN's native text
    // layout when shorter than the glyph needs (unlike a browser).
    fontFamily: "IBMPlexSans_300Light", fontWeight: "300",
    fontVariant: ["tabular-nums"],
    letterSpacing: -3
  },
  heroLabel: {
    color: colors.accent300,
    fontSize: 17,
    fontFamily: "SpaceGrotesk_400Regular", fontWeight: "400",
    marginLeft: 10,
    paddingBottom: 6
  },

  buttonRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 24
  },
  button: {
    flex: 1,
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  buttonText: {
    fontSize: 13,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  startButton: {
    borderColor: colors.accent
  },
  startButtonText: {
    color: colors.accent
  },
  startButtonClear: {
    borderColor: colors.neutral800
  },
  startButtonClearText: {
    color: colors.neutral500
  },
  shareButton: {
    borderColor: colors.neutral800
  },
  shareButtonText: {
    color: colors.neutral300
  },

  outOfStockSection: {
    marginTop: 20
  },
  sectionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenH,
    paddingBottom: 13
  },
  sectionLabel: {
    color: colors.neutral500,
    fontSize: 11,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500",
    letterSpacing: 1
  },
  sectionLabelRight: {
    color: colors.neutral500,
    fontSize: 11
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screenH,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral900
  },
  rowPressed: {
    backgroundColor: colors.accentTint14
  },
  rowName: {
    color: colors.text,
    fontSize: 19,
    fontFamily: "SpaceGrotesk_400Regular", fontWeight: "400",
    letterSpacing: -0.2
  },
  rowDays: {
    color: colors.neutral500,
    fontSize: 12
  },

  emptyState: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 26
  },
  emptyHeading: {
    color: colors.neutral300,
    fontSize: 17,
    fontFamily: "SpaceGrotesk_400Regular", fontWeight: "400"
  },
  emptyBody: {
    color: colors.neutral500,
    fontSize: 13,
    marginTop: 6,
    maxWidth: 250
  },

  snoozedLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.screenH,
    marginTop: 12
  },
  snoozedText: {
    color: colors.neutral500,
    fontSize: 12
  },

  statPair: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: spacing.screenH,
    marginTop: 26,
    gap: 26
  },
  statBlock: {
    flex: 1
  },
  statDivider: {
    width: 1
  },
  statNumber: {
    fontSize: 40,
    // No explicit lineHeight — same native clipping risk as heroCount above.
    fontFamily: "IBMPlexSans_300Light", fontWeight: "300",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4
  }
});
