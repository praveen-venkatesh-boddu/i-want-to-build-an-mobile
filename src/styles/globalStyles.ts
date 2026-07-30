import { StyleSheet } from "react-native";

// "Ledger" design tokens — dark-theme-only. See design_handoff_ledger_redesign/README.md.
export const colors = {
  bg: "#161826",
  surface: "#232532",
  text: "#e9e9ed",
  accent: "#9184d9",

  neutral100: "#f3f5fe",
  neutral200: "#e4e7f5",
  neutral300: "#cfd3e5",
  neutral400: "#b2b6ca",
  neutral500: "#9397ab",
  neutral600: "#75798c",
  neutral700: "#595d6c",
  neutral800: "#3f424d",
  neutral900: "#292b31",

  accent100: "#f5f4ff",
  accent200: "#e7e5fe",
  accent300: "#d2cefd",
  accent400: "#b5abfc",
  accent500: "#968ae0",
  accent600: "#796cbf",
  accent700: "#5d5294",
  accent800: "#423a6a",
  accent900: "#2b2741",

  accentTint14: "rgba(145,132,217,0.14)",
  accentGlowShadow: "#9184d9",
  scrim: "rgba(11,12,20,0.66)",

  // Not part of the Ledger spec (no destructive-action guidance given) — a
  // muted red kept for the item editor's delete action only.
  danger: "#e5484d"
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 14,
  sheet: 16,
  round: 9999
};

export const spacing = {
  screenH: 22,
  sectionGapMin: 20,
  sectionGapMax: 26,
  rowVMin: 12,
  rowVMax: 18
};

// Generic scale for dense form layouts (the item editor) that the Ledger spec
// doesn't define pixel-for-pixel — kept separate from `spacing` above.
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 32
};

export const type = {
  heroNumeral: { fontSize: 76, lineHeight: 65, fontFamily: "Inter_300Light", fontWeight: "300" as const, letterSpacing: -4 },
  screenTitle2Line: { fontSize: 34, lineHeight: 36, fontFamily: "Inter_500Medium", fontWeight: "500" as const, letterSpacing: -1 },
  screenTitle1Line: { fontSize: 27, lineHeight: 31, fontFamily: "Inter_500Medium", fontWeight: "500" as const, letterSpacing: -0.3 },
  sheetTitle: { fontSize: 24, fontFamily: "Inter_500Medium", fontWeight: "500" as const, letterSpacing: -0.4 },
  bigNumeralRun: { fontSize: 52, lineHeight: 52, fontFamily: "Inter_300Light", fontWeight: "300" as const, letterSpacing: -2 },
  bigNumeralStat: { fontSize: 40, lineHeight: 40, fontFamily: "Inter_300Light", fontWeight: "300" as const, letterSpacing: -1.5 },
  rowNameBuy: { fontSize: 19, fontWeight: "400" as const, letterSpacing: -0.2 },
  rowNameList: { fontSize: 16, fontWeight: "400" as const, letterSpacing: 0 },
  rowNameShelves: { fontSize: 15, fontWeight: "400" as const, letterSpacing: 0 },
  body: { fontSize: 14, fontWeight: "400" as const, letterSpacing: 0 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_500Medium", fontWeight: "500" as const, letterSpacing: 0.18, textTransform: "uppercase" as const },
  meta: { fontSize: 12, fontWeight: "400" as const, letterSpacing: 0.02 },
  numericMeta: { fontSize: 10, fontWeight: "400" as const, letterSpacing: 0.08, textTransform: "uppercase" as const }
};

// Elevation on a dark ground: an edge plus ambient darkness, not a drop shadow.
export const shadowSm = {
  borderWidth: 1,
  borderColor: colors.neutral800
};

export const shadowMd = {
  borderWidth: 1,
  borderColor: colors.neutral700,
  shadowColor: "#000",
  shadowOpacity: 0.55,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6
};

export const accentGlow = {
  shadowColor: colors.accentGlowShadow,
  shadowOpacity: 0.28,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 0 },
  elevation: 4
};

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  textInput: {
    backgroundColor: colors.surface,
    borderColor: colors.neutral800,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12
  }
});
