import { StyleSheet } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";

export const shelvesStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },
  titleBlock: {
    paddingHorizontal: spacing.screenH,
    paddingTop: 10,
    paddingBottom: 14
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontFamily: "Inter_500Medium", fontWeight: "500",
    letterSpacing: -0.3
  },
  subtitle: {
    color: colors.neutral500,
    fontSize: 13,
    marginTop: 5
  },

  controlRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenH,
    paddingBottom: 4,
    gap: 10
  },
  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 13,
    paddingVertical: 11
  },
  searchPlaceholder: {
    color: colors.neutral500,
    fontSize: 14
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  filterButtonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  filterButtonText: {
    color: colors.neutral400,
    fontSize: 13,
    fontFamily: "Inter_500Medium", fontWeight: "500"
  },
  filterButtonTextActive: {
    color: colors.accent300
  },

  list: {
    paddingBottom: 24
  },

  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.screenH,
    paddingBottom: 10,
    marginTop: 22
  },
  groupHeaderFirst: {
    marginTop: 0
  },
  groupName: {
    color: colors.neutral300,
    fontSize: 12,
    fontFamily: "Inter_500Medium", fontWeight: "500",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  groupRule: {
    flex: 1
  },
  groupCount: {
    color: colors.neutral500,
    fontSize: 11
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: spacing.screenH,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  rowPressed: {
    backgroundColor: colors.accentTint14
  },
  rowName: {
    flex: 1,
    color: colors.text,
    fontSize: 15
  },
  rowNameOut: {
    color: colors.neutral400
  },
  rowMetaBlock: {
    alignItems: "flex-end"
  },
  rowMeta: {
    color: colors.neutral500,
    fontSize: 11
  },
  rowMetaExpiring: {
    color: colors.accent300
  },

  gaugeTrack: {
    width: 52,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.neutral800,
    overflow: "hidden"
  },
  gaugeFill: {
    height: 4,
    borderRadius: 4
  },

  qty: {
    width: 26,
    textAlign: "right",
    color: colors.neutral300,
    fontSize: 13
  },

  footnote: {
    marginTop: 8,
    paddingHorizontal: spacing.screenH,
    paddingTop: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900,
    color: colors.neutral500,
    fontSize: 12
  }
});
