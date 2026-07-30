import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { colors } from "../styles/globalStyles";

type FadeRuleProps = {
  /** Solid colour the rule fades in from/out to. Defaults to the section-rule tone. */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The signature detail: a 1px horizontal rule that fades to transparent over
 * the outer 48px of each side, rather than stopping cleanly.
 */
export function FadeRule({ color = colors.neutral800, style }: FadeRuleProps) {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      locations={[0, 0.12, 0.88, 1]}
      colors={["transparent", color, color, "transparent"]}
      style={[{ height: 1, width: "100%" }, style]}
    />
  );
}
