import { StyleSheet } from "react-native";

import { colors, spacing } from "../styles/globalStyles";

export const searchStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.screenH,
    paddingTop: 14,
    paddingBottom: 14
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 21,
    fontWeight: "400",
    letterSpacing: -0.3,
    padding: 0
  },
  accentRule: {
    height: 1,
    backgroundColor: colors.accent
  },
  summary: {
    color: colors.neutral500,
    fontSize: 11,
    paddingHorizontal: spacing.screenH,
    paddingVertical: 12
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenH,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900
  },
  rowPressed: {
    backgroundColor: colors.accentTint14
  },
  rowMain: {
    flex: 1,
    marginRight: 12
  },
  rowName: {
    color: colors.text,
    fontSize: 17
  },
  rowMeta: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 2
  },
  rowQty: {
    color: colors.neutral400,
    fontSize: 15
  }
});
