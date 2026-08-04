import { EyeSlash, Trash } from "phosphor-react-native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { SHELF_ICONS, SHELF_ICON_COMPONENTS, SHELF_ZONES } from "../constants/shelves";
import { colors, radii, spacing } from "../styles/globalStyles";
import type { Shelf, ShelfIconKey, ShelfZone } from "../types/pantry";
import { FadeRule } from "./FadeRule";

type ShelfSheetProps = {
  draft: Shelf | null;
  itemCount: number;
  isDefault: boolean;
  onChangeName: (name: string) => void;
  onPickIcon: (icon: ShelfIconKey) => void;
  onPickZone: (zone: ShelfZone) => void;
  onMakeDefault: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  onSave: () => void;
};

export function ShelfSheet({
  draft,
  itemCount,
  isDefault,
  onChangeName,
  onPickIcon,
  onPickZone,
  onMakeDefault,
  onToggleHidden,
  onDelete,
  onSave
}: ShelfSheetProps) {
  if (!draft) return null;

  const meta = itemCount === 0 ? "Empty shelf" : `${itemCount} ${itemCount === 1 ? "item lives" : "items live"} here`;
  const DraftIcon = SHELF_ICON_COMPONENTS[draft.icon];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onSave}>
      <Pressable style={styles.scrim} onPress={onSave}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.nameRow}>
            <DraftIcon size={19} color={colors.accent} weight="regular" />
            <TextInput
              value={draft.name}
              onChangeText={onChangeName}
              placeholder="Shelf name"
              placeholderTextColor={colors.neutral500}
              style={styles.nameInput}
            />
          </View>
          <Text style={styles.meta}>{meta}</Text>
          <FadeRule style={styles.rule} color={colors.neutral800} />

          <Text style={styles.sectionLabel}>Icon</Text>
          <View style={styles.iconRow}>
            {SHELF_ICONS.map((icon) => {
              const Icon = SHELF_ICON_COMPONENTS[icon];
              const active = draft.icon === icon;
              return (
                <Pressable
                  key={icon}
                  style={[styles.iconSwatch, active && styles.iconSwatchActive]}
                  onPress={() => onPickIcon(icon)}
                >
                  <Icon size={17} color={active ? colors.accent : colors.neutral400} weight="regular" />
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, styles.zoneLabel]}>Zone</Text>
          <View style={styles.zoneRow}>
            {SHELF_ZONES.map((zone) => {
              const active = draft.zone === zone;
              return (
                <Pressable
                  key={zone}
                  style={[styles.zoneChip, active && styles.zoneChipActive]}
                  onPress={() => onPickZone(zone)}
                >
                  <Text style={[styles.zoneChipText, active && styles.zoneChipTextActive]}>{zone}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.zoneHint}>Zones split the shopping run into sections.</Text>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionChip, isDefault && styles.actionChipActive]}
              onPress={onMakeDefault}
            >
              <Text style={[styles.actionChipText, isDefault && styles.actionChipTextActive]}>
                {isDefault ? "Default shelf" : "Make default"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionChip, draft.hidden && styles.actionChipActive]}
              onPress={onToggleHidden}
            >
              <EyeSlash size={13} color={draft.hidden ? colors.accent : colors.neutral400} weight="regular" />
              <Text style={[styles.actionChipText, draft.hidden && styles.actionChipTextActive]}>
                {draft.hidden ? "Hidden" : "Hide"}
              </Text>
            </Pressable>
            <Pressable style={styles.deleteChip} onPress={onDelete}>
              <Trash size={13} color={itemCount === 0 ? colors.neutral300 : colors.neutral600} weight="regular" />
              <Text style={[styles.deleteChipText, itemCount === 0 && styles.deleteChipTextEnabled]}>Delete</Text>
            </Pressable>
          </View>

          <Pressable style={styles.doneButton} onPress={onSave}>
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  nameInput: {
    flex: 1,
    color: colors.text,
    fontSize: 24,
    fontFamily: "SpaceGrotesk_500Medium",
    fontWeight: "500",
    letterSpacing: -0.4,
    padding: 0
  },
  meta: {
    color: colors.neutral400,
    fontSize: 12,
    marginTop: 9
  },
  rule: {
    marginTop: 18,
    marginBottom: 0
  },

  sectionLabel: {
    color: colors.neutral500,
    fontSize: 10,
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: 16
  },
  zoneLabel: {
    marginTop: 22
  },

  iconRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 11
  },
  iconSwatch: {
    width: 44,
    height: 40,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center"
  },
  iconSwatchActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },

  zoneRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 11
  },
  zoneChip: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  zoneChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  zoneChipText: {
    color: colors.neutral300,
    fontSize: 13,
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500"
  },
  zoneChipTextActive: {
    color: colors.accent100
  },
  zoneHint: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 9
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 22
  },
  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  actionChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTint14
  },
  actionChipText: {
    color: colors.neutral300,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500"
  },
  actionChipTextActive: {
    color: colors.accent100
  },
  deleteChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral800,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  deleteChipText: {
    color: colors.neutral600,
    fontSize: 12
  },
  deleteChipTextEnabled: {
    color: colors.neutral300
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
    fontFamily: "IBMPlexSans_500Medium",
    fontWeight: "500"
  }
});
