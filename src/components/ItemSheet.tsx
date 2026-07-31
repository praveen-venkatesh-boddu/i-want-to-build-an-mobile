import { Minus, Moon, PencilSimple, Plus } from "phosphor-react-native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { FadeRule } from "./FadeRule";

type ItemSheetProps = {
  item: PantryItem | null;
  onClose: () => void;
  onStep: (item: PantryItem, delta: number) => void;
  onToggleOpened: (item: PantryItem) => void;
  onSnooze: (item: PantryItem) => void;
  onUnsnooze: (item: PantryItem) => void;
  onEditDetails: (item: PantryItem) => void;
};

export function ItemSheet({
  item,
  onClose,
  onStep,
  onToggleOpened,
  onSnooze,
  onUnsnooze,
  onEditDetails
}: ItemSheetProps) {
  if (!item) return null;

  const isSnoozed = !!item.deferredUntil;
  const metaLine = [item.location, item.packageSize, item.opened ? "Opened" : "Unopened"]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.meta}>{metaLine}</Text>
          <FadeRule style={styles.rule} color={colors.neutral800} />

          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>In stock</Text>
            <View style={styles.stepper}>
              <Pressable
                style={[styles.stepCircle, styles.stepCircleMinus]}
                onPress={() => onStep(item, -1)}
                accessibilityLabel="Decrease quantity"
              >
                <Minus size={16} color={colors.neutral300} weight="regular" />
              </Pressable>
              <Text style={styles.stepValue}>{item.quantity}</Text>
              <Pressable
                style={[styles.stepCircle, styles.stepCirclePlus]}
                onPress={() => onStep(item, 1)}
                accessibilityLabel="Increase quantity"
              >
                <Plus size={16} color={colors.accent} weight="regular" />
              </Pressable>
            </View>
          </View>

          <View style={styles.chipRow}>
            <Pressable
              style={[styles.chip, item.opened && styles.chipActive]}
              onPress={() => onToggleOpened(item)}
            >
              <Text style={[styles.chipTextBold, item.opened && styles.chipTextActive]}>
                {item.opened ? "Opened" : "Unopened"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.chip}
              onPress={() => (isSnoozed ? onUnsnooze(item) : onSnooze(item))}
            >
              <Moon size={13} color={colors.neutral400} weight="regular" />
              <Text style={styles.chipText}>{isSnoozed ? "Un-snooze" : "Snooze 15 days"}</Text>
            </Pressable>

            <Pressable style={styles.chip} onPress={() => onEditDetails(item)}>
              <PencilSimple size={13} color={colors.neutral400} weight="regular" />
              <Text style={styles.chipText}>Edit details</Text>
            </Pressable>
          </View>

          <Pressable style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.scrim
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
    paddingHorizontal: spacing.screenH,
    paddingTop: 18,
    paddingBottom: 42
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral700,
    marginBottom: 18
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontFamily: "SpaceGrotesk_500Medium", fontWeight: "500",
    letterSpacing: -0.4
  },
  meta: {
    color: colors.neutral400,
    fontSize: 12,
    marginTop: 6,
    textTransform: "uppercase"
  },
  rule: {
    marginTop: 16,
    marginBottom: 16
  },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  stockLabel: {
    color: colors.neutral400,
    fontSize: 13
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1
  },
  stepCircleMinus: {
    borderColor: colors.neutral700
  },
  stepCirclePlus: {
    borderColor: colors.accent
  },
  stepValue: {
    color: colors.text,
    fontSize: 24,
    fontVariant: ["tabular-nums"],
    minWidth: 26,
    textAlign: "center"
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  chipText: {
    color: colors.neutral400,
    fontSize: 12
  },
  chipTextBold: {
    color: colors.neutral400,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  chipTextActive: {
    color: colors.accent300
  },

  doneButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 14,
    marginTop: 22
  },
  doneText: {
    color: colors.accent,
    fontSize: 15,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  }
});
