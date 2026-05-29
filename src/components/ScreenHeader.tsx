import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";

type RightAction = { label: string; onPress: () => void };

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
  /** Label next to the back chevron. Defaults to "Back". */
  backLabel?: string;
  /**
   * "stacked" (default) – back button above the title, used on home-style screens.
   * "bar" – single horizontal row with back | title | optional action, used on form screens.
   */
  variant?: "stacked" | "bar";
  /** Small uppercase label shown above the title (stacked only). */
  eyebrow?: string;
  /** Muted line shown below the title (stacked only). */
  subtitle?: string;
  /** Optional primary-action button shown on the right (bar only). */
  rightAction?: RightAction;
};

export function ScreenHeader({
  title,
  onBack,
  backLabel = "Back",
  variant = "stacked",
  eyebrow,
  subtitle,
  rightAction
}: ScreenHeaderProps) {
  if (variant === "bar") {
    return (
      <View style={s.bar}>
        <Pressable style={s.barBack} onPress={onBack}>
          <MaterialIcons name="chevron-left" size={24} color={md3.onSurfaceVariant} />
          <Text style={s.barBackLabel}>{backLabel}</Text>
        </Pressable>

        <Text style={s.barTitle}>{title}</Text>

        {rightAction ? (
          <Pressable style={s.barAction} onPress={rightAction.onPress}>
            <Text style={s.barActionText}>{rightAction.label}</Text>
          </Pressable>
        ) : (
          <View style={s.barActionPlaceholder} />
        )}
      </View>
    );
  }

  return (
    <View style={s.stacked}>
      <Pressable style={s.stackedBack} onPress={onBack}>
        <MaterialIcons name="chevron-left" size={26} color={md3.primary} />
        <Text style={s.stackedBackLabel}>{backLabel}</Text>
      </Pressable>
      {eyebrow ? <Text style={s.eyebrow}>{eyebrow}</Text> : null}
      <Text style={s.stackedTitle}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  // ── Stacked variant ───────────────────────────────────────────────────
  stacked: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md
  },
  stackedBack: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 4,
    marginBottom: spacing.sm,
    paddingVertical: 4
  },
  stackedBackLabel: {
    color: md3.primary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  eyebrow: {
    color: md3.primary,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  stackedTitle: {
    color: md3.onBackground,
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: 0,
    marginTop: 2
  },
  subtitle: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.25,
    marginTop: 4
  },

  // ── Bar variant ───────────────────────────────────────────────────────
  bar: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainerLow,
    borderBottomColor: md3.outlineVariant,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: 14
  },
  barBack: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    paddingVertical: 6
  },
  barBackLabel: {
    color: md3.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  barTitle: {
    color: md3.onSurface,
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0
  },
  barAction: {
    backgroundColor: md3.primary,
    borderRadius: radii.round,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10
  },
  barActionText: {
    color: md3.onPrimary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.1
  },
  barActionPlaceholder: {
    minWidth: 56
  }
});
