import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";
import type { HomeView } from "../types/pantry";

type BottomNavBarProps = {
  view: HomeView;
  onSelectView: (view: HomeView) => void;
};

const isAddView = (v: HomeView) => v === "add" || v === "add-perishable" || v === "add-item";

export function BottomNavBar({ view, onSelectView }: BottomNavBarProps) {
  return (
    <View style={styles.bar}>

      <NavItem
        icon="home"
        label="Home"
        active={view === "home"}
        onPress={() => onSelectView("home")}
      />

      <NavItem
        icon="search"
        label="Find"
        active={view === "find"}
        onPress={() => onSelectView("find")}
      />

      <NavItem
        icon="add"
        label="Add"
        active={isAddView(view)}
        onPress={() => onSelectView("add")}
      />

      <NavItem
        icon="shopping-cart"
        label="Shopping"
        active={view === "shopping"}
        onPress={() => onSelectView("shopping")}
      />

    </View>
  );
}

// ── Shared nav item ─────────────────────────────────────────────────────
function NavItem({
  icon,
  label,
  active,
  onPress
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress} accessibilityLabel={label}>
      <View style={[styles.indicator, active && styles.indicatorActive]}>
        <MaterialIcons
          name={icon}
          size={24}
          color={active ? md3.onSecondaryContainer : md3.onSurfaceVariant}
        />
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainer,
    borderTopColor: md3.outlineVariant,
    borderTopWidth: 1,
    flexDirection: "row",
    height: 80,
    paddingHorizontal: spacing.sm
  },

  item: {
    alignItems: "center",
    flex: 1,
    gap: 4,
    justifyContent: "center"
  },

  // M3 active-state indicator pill
  indicator: {
    alignItems: "center",
    borderRadius: radii.round,
    height: 32,
    justifyContent: "center",
    width: 64
  },
  indicatorActive: {
    backgroundColor: md3.secondaryContainer
  },

  label: {
    color: md3.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5
  },
  labelActive: {
    color: md3.onSecondaryContainer,
    fontWeight: "600"
  }
});
