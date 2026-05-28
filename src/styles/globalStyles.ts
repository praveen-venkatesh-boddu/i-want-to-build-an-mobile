import { StyleSheet } from "react-native";

// Material Design 3 color tokens (green seed color)
export const md3 = {
  primary: "#006B54",
  onPrimary: "#FFFFFF",
  primaryContainer: "#85F8D2",
  onPrimaryContainer: "#002117",

  secondary: "#4C6358",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#CEE9DC",
  onSecondaryContainer: "#092019",

  tertiary: "#3D6374",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#C1E8FC",
  onTertiaryContainer: "#001F2B",

  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",

  background: "#F5FBF7",
  onBackground: "#171D1A",

  surface: "#F5FBF7",
  onSurface: "#171D1A",
  surfaceVariant: "#DBE5DE",
  onSurfaceVariant: "#3F4943",

  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#EFF5F0",
  surfaceContainer: "#E9EFE9",
  surfaceContainerHigh: "#E3E9E4",
  surfaceContainerHighest: "#DDE4DE",

  outline: "#6F7973",
  outlineVariant: "#BFC9C2",

  inverseSurface: "#2B322E",
  inverseOnSurface: "#ECF2ED",
  inversePrimary: "#68DBB6",

  // Non-standard: amber warning for expiry
  warningContainer: "#FFECD9",
  onWarningContainer: "#4D2600",
  warningContainerBorder: "#FFCC94",

  scrim: "rgba(0, 0, 0, 0.32)"
};

// Backward-compatible `colors` export mapped to M3 tokens
export const colors = {
  background: md3.background,
  border: md3.outlineVariant,
  borderSoft: md3.outlineVariant,
  card: md3.surfaceContainerLowest,
  danger: md3.error,
  dangerBackground: md3.errorContainer,
  dangerBorder: "#FFBAB1",
  muted: md3.onSurfaceVariant,
  mutedDark: md3.onSurface,
  primary: md3.primary,
  primarySoft: md3.primaryContainer,
  primaryText: md3.onPrimaryContainer,
  surface: md3.surfaceContainerLow,
  text: md3.onSurface,
  warning: md3.onWarningContainer,
  warningBackground: md3.warningContainer,
  warningCard: md3.warningContainer,
  warningBorder: md3.warningContainerBorder,
  white: md3.surfaceContainerLowest
};

// M3 shape scale
export const radii = {
  extraSmall: 4,
  sm: 8,
  md: 12,   // M3 Medium shape
  lg: 16,   // M3 Large shape
  xl: 28,   // M3 Extra-Large shape
  round: 9999
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32
};

// M3 elevation shadows (Android-style)
export const elevation = {
  level0: {},
  level1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1
  },
  level2: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 2
  },
  level3: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4
  }
};

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: md3.background
  },
  // M3 Outlined TextField style
  textInput: {
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outline,
    borderRadius: radii.md,
    borderWidth: 1,
    color: md3.onSurface,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12
  }
});
