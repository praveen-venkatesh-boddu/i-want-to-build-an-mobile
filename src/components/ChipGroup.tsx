import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";

export type ChipOption = { label: string; value: string };

type ChipGroupProps = {
  options: ChipOption[];
  value: string;
  onSelect: (value: string) => void;
};

export function ChipGroup({ options, value, onSelect }: ChipGroupProps) {
  return (
    <View style={s.row}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[s.chip, value === opt.value && s.chipActive]}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={[s.chipText, value === opt.value && s.chipTextActive]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    backgroundColor: "transparent",
    borderColor: md3.outlineVariant,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  chipActive: {
    backgroundColor: md3.secondaryContainer,
    borderColor: "transparent"
  },
  chipText: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  chipTextActive: {
    color: md3.onSecondaryContainer,
    fontWeight: "600"
  }
});
