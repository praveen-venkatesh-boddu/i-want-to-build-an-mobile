import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

export const matchStyles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.bg },
  titleBlock: { paddingHorizontal: spacing.screenH },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8, paddingBottom: 14 },
  backLabel: { color: colors.neutral400, fontSize: 13 },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500",
    letterSpacing: -0.8
  },
  subtitle: { color: colors.neutral400, fontSize: 13, lineHeight: 19, marginTop: 12, marginBottom: 16 },

  undoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.screenH,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  undoText: { color: colors.accent300, fontSize: 13, flex: 1 },
  undoButton: { paddingLeft: 14 },
  undoButtonText: { color: colors.accent300, fontSize: 13, textDecorationLine: "underline" },

  list: { paddingBottom: 110 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: spacing.screenH,
    paddingBottom: 10,
    marginTop: 8
  },
  sectionLabel: {
    color: colors.neutral500,
    fontSize: 11,
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  sectionRule: { flex: 1, height: 1, backgroundColor: colors.neutral800 },

  card: {
    marginHorizontal: spacing.screenH,
    marginBottom: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    backgroundColor: colors.surface,
    overflow: "hidden"
  },
  itemName: { color: colors.text, fontSize: 15, paddingHorizontal: 14, paddingTop: 12 },
  itemMeta: { color: colors.neutral500, fontSize: 11, paddingHorizontal: 14, paddingTop: 3, paddingBottom: 10 },

  candidate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  candidatePicked: { backgroundColor: colors.accentTint14 },
  indicator: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral600
  },
  indicatorBox: { borderRadius: 5 },
  indicatorRound: { borderRadius: 10 },
  indicatorOn: { borderColor: colors.accent, backgroundColor: colors.accent },
  candidateBody: { flex: 1 },
  candidateName: { color: colors.neutral200, fontSize: 14 },
  candidateMeta: { color: colors.neutral500, fontSize: 11, marginTop: 2, fontVariant: ["tabular-nums"] },

  empty: { paddingHorizontal: spacing.screenH, paddingTop: 24 },
  emptyTitle: { color: colors.neutral200, fontSize: 15 },
  emptyBody: { color: colors.neutral500, fontSize: 13, lineHeight: 19, marginTop: 6 },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.screenH,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900,
    backgroundColor: colors.bg
  },
  applyButton: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  applyButtonDisabled: { opacity: 0.4 },
  applyText: { color: colors.accent300, fontSize: 15 }
});
