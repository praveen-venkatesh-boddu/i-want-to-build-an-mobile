import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { md3, radii } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { daysUntil } from "../utils/date";

type PantryCardProps = {
  item: PantryItem;
  onEdit: () => void;
  onUseOne: () => void;
};

export function PantryCard({ item, onEdit, onUseOne }: PantryCardProps) {
  const days = daysUntil(item.expiresOn);
  const isLow = item.quantity === 0 && item.opened;
  const isExpiring = item.expiresOn && days <= 7;

  // Left strip colour
  const stripColor = isLow
    ? md3.errorContainer
    : isExpiring
      ? md3.warningContainer
      : md3.primaryContainer;

  // Expiry pill
  const expiryLabel = !item.expiresOn
    ? null
    : days <= 0
      ? "Expired"
      : days <= 7
        ? `${days}d left`
        : `${days}d`;

  const expiryPillBg = isExpiring ? md3.warningContainer : md3.primaryContainer;
  const expiryPillText = isExpiring ? md3.onWarningContainer : md3.onPrimaryContainer;

  return (
    <View style={s.card}>
      {/* Left status strip */}
      <View style={[s.strip, { backgroundColor: stripColor }]} />

      {/* Main content */}
      <View style={s.body}>
        <Text style={s.name} numberOfLines={1}>{item.name}</Text>
        <Text style={s.meta} numberOfLines={1}>
          {item.quantity} {item.unit}
          {item.category ? `  ·  ${item.category}` : ""}
        </Text>
        {(expiryLabel || item.quantity === 0) ? (
          <View style={s.tagsRow}>
            {expiryLabel ? (
              <View style={[s.tag, { backgroundColor: expiryPillBg }]}>
                <Text style={[s.tagText, { color: expiryPillText }]}>{expiryLabel}</Text>
              </View>
            ) : null}
            {item.quantity === 0 ? (
              <View style={[s.tag, s.openedTag]}>
                <Text style={[s.tagText, s.openedTagText]}>Opened</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Right column: use-one button + edit button */}
      <View style={s.right}>
        <Pressable
          onPress={onUseOne}
          style={s.useOnePill}
          disabled={item.quantity === 0}
        >
          <MaterialIcons
            name="remove"
            size={12}
            color={item.quantity === 0 ? md3.onSurfaceVariant : md3.onSurface}
          />
          <Text style={[s.useOneText, item.quantity === 0 && s.useOneTextDisabled]}>Use 1</Text>
        </Pressable>

        <Pressable onPress={onEdit} style={s.editPill}>
          <Text style={s.editText}>Edit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    alignItems: "stretch",
    backgroundColor: md3.surfaceContainerLowest,
    borderColor: md3.outlineVariant,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 84,
    overflow: "hidden"
  },

  // 4 px coloured left strip
  strip: {
    marginVertical: 12,
    marginLeft: 8,
    borderRadius: radii.extraSmall,
    width: 4
  },

  // Centre text block
  body: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 12,
    paddingVertical: 14,
    gap: 4
  },
  name: {
    color: md3.onSurface,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1
  },
  meta: {
    color: md3.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.2
  },

  // Tags row (expiry + opened)
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2
  },
  tag: {
    alignSelf: "flex-start",
    borderRadius: radii.round,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.4
  },
  openedTag: {
    backgroundColor: md3.tertiaryContainer
  },
  openedTagText: {
    color: md3.onTertiaryContainer
  },

  // Right column
  right: {
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: 84
  },

  // Use-one pill
  useOnePill: {
    alignItems: "center",
    borderColor: md3.outline,
    borderRadius: radii.round,
    borderWidth: 1,
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  useOneText: {
    color: md3.onSurface,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3
  },
  useOneTextDisabled: {
    color: md3.onSurfaceVariant
  },

  // Edit pill
  editPill: {
    alignItems: "center",
    borderColor: md3.outline,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  editText: {
    color: md3.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3
  }
});
