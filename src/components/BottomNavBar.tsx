import {
  Barcode,
  ClockCountdown,
  ListDashes,
  MagnifyingGlass,
  Stack
} from "phosphor-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { accentGlow, colors } from "../styles/globalStyles";
import type { Screen } from "../types/pantry";

type BottomNavBarProps = {
  screen: Screen;
  onSelectScreen: (screen: Screen) => void;
};

const TAB_HEIGHT = 66;
const SCAN_CIRCLE = 46;

export function BottomNavBar({ screen, onSelectScreen }: BottomNavBarProps) {
  // No safe-area handling here: BottomNavBar always renders inside App.tsx's
  // outer SafeAreaView, which already pads the bottom inset for the whole
  // screen. Adding it again here doubled the gap below the icon row.
  return (
    <View style={styles.bar}>
      <NavItem icon={ListDashes} active={screen === "list"} onPress={() => onSelectScreen("list")} label="List" />
      <NavItem icon={Stack} active={screen === "shelves"} onPress={() => onSelectScreen("shelves")} label="Shelves" />

      <Pressable
        style={styles.scanSlot}
        onPress={() => onSelectScreen("scan")}
        accessibilityLabel="Scan"
      >
        <View style={[styles.scanCircle, accentGlow]}>
          <Barcode size={21} color={colors.accent} weight="regular" />
        </View>
      </Pressable>

      <NavItem icon={ClockCountdown} active={screen === "expiring"} onPress={() => onSelectScreen("expiring")} label="Expiring" />
      <NavItem icon={MagnifyingGlass} active={screen === "search"} onPress={() => onSelectScreen("search")} label="Search" />
    </View>
  );
}

function NavItem({
  icon: Icon,
  active,
  onPress,
  label
}: {
  icon: React.ComponentType<{ size: number; color: string; weight?: "regular" }>;
  active: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <Icon size={22} color={active ? colors.accent : colors.neutral600} weight="regular" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral900,
    paddingTop: 0
  },
  item: {
    flex: 1,
    height: TAB_HEIGHT,
    alignItems: "center",
    justifyContent: "center"
  },
  itemPressed: {
    backgroundColor: colors.accentTint14
  },
  scanSlot: {
    flex: 1,
    height: TAB_HEIGHT,
    alignItems: "center",
    justifyContent: "center"
  },
  scanCircle: {
    width: SCAN_CIRCLE,
    height: SCAN_CIRCLE,
    borderRadius: SCAN_CIRCLE / 2,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  }
});
