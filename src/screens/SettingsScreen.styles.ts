import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

export const settingsStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },
  titleBlock: {
    paddingHorizontal: spacing.screenH
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    paddingBottom: 14
  },
  backLabel: {
    color: colors.neutral400,
    fontSize: 13
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36,
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500",
    letterSpacing: -1
  },
  subtitle: {
    color: colors.neutral400,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
    marginBottom: 18,
    maxWidth: 290
  },

  list: {
    paddingBottom: 30
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: spacing.screenH,
    paddingBottom: 10
  },
  sectionHeaderTopped: {
    marginTop: 30
  },
  sectionLabel: {
    color: colors.neutral500,
    fontSize: 11,
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  sectionRule: {
    flex: 1
  },

  shelfRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 62,
    paddingHorizontal: spacing.screenH,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  moveColumn: {
    flexDirection: "column",
    marginRight: 6
  },
  moveButton: {
    width: 24,
    height: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  moveButtonDisabled: {
    opacity: 0.25
  },
  rowTap: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    height: "100%"
  },
  rowBody: {
    flex: 1,
    minWidth: 0
  },
  rowNameLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  rowName: {
    color: colors.text,
    fontSize: 15
  },
  rowNameHidden: {
    color: colors.neutral500
  },
  defaultBadge: {
    borderWidth: 1,
    borderColor: colors.accent700,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  defaultBadgeText: {
    color: colors.accent200,
    fontSize: 9,
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  rowMeta: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 3
  },
  rowZone: {
    color: colors.neutral500,
    fontSize: 11
  },

  addShelfRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.screenH,
    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  addShelfText: {
    color: colors.accent200,
    fontSize: 15
  },

  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: spacing.screenH,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  notifBody: {
    flex: 1
  },
  notifName: {
    color: colors.text,
    fontSize: 15
  },
  notifMeta: {
    color: colors.neutral500,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3
  },

  switchTrack: {
    width: 42,
    height: 24,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: 3,
    justifyContent: "center"
  },
  switchTrackOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  switchTrackOff: {
    borderColor: colors.neutral700,
    backgroundColor: "transparent"
  },
  switchKnob: {
    width: 16,
    height: 16,
    borderRadius: radii.round
  },
  switchKnobOn: {
    backgroundColor: colors.accent,
    alignSelf: "flex-end"
  },
  switchKnobOff: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start"
  },

  footnote: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral900,
    paddingHorizontal: spacing.screenH,
    paddingTop: 16,
    paddingBottom: 30,
    color: colors.neutral500,
    fontSize: 12,
    lineHeight: 18
  }
});
