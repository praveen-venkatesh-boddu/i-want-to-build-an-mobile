import React from "react";
import { Text, View } from "react-native";

import { pantryListStyles as styles } from "../screens/PantryListScreen.styles";

type StatProps = {
  label: string;
  value: number;
  tone?: "neutral" | "warning" | "danger";
};

export function Stat({ label, value, tone = "neutral" }: StatProps) {
  return (
    <View
      style={[
        styles.statCard,
        tone === "warning" && styles.statWarning,
        tone === "danger" && styles.statDanger
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
