import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ActionSheet } from "./ActionSheet";

import { md3, radii } from "../styles/globalStyles";
import type { PantryItem, SnoozePeriod } from "../types/pantry";
import { daysUntil, formatShortDate } from "../utils/date";

type PantryCardProps = {
  item: PantryItem;
  onEdit: () => void;
  onUseOne: () => void;
  /** If provided, shows a "Snooze" button instead of "Use 1" (shopping list — active items). */
  onDefer?: (period: SnoozePeriod) => void;
  /** If provided, shows an "Un-snooze" button (shopping list — deferred items). */
  onUndefer?: () => void;
};

export function PantryCard({ item, onEdit, onUseOne, onDefer, onUndefer }: PantryCardProps) {
  const [snoozeSheetVisible, setSnoozeSheetVisible] = useState(false);
  const days = daysUntil(item.expiresOn);
  const isLow = item.quantity === 0 && item.opened;
  const isExpiring = item.expiresOn && days <= 7;
  const isDeferred = !!(item.deferredUntil);

  // Left strip colour
  const stripColor = isDeferred
    ? md3.surfaceContainerHigh
    : isLow
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

  const snoozeOptions = onDefer ? [
    { label: "15 Days", onPress: () => onDefer("15d") },
    { label: "1 Month", onPress: () => onDefer("1m") },
    { label: "2 Months", onPress: () => onDefer("2m") }
  ] : [];

  return (
    <>
    <View style={[s.card, isDeferred && s.cardDeferred]}>
      {/* Left status strip */}
      <View style={[s.strip, { backgroundColor: stripColor }]} />

      {/* Main content */}
      <View style={s.body}>
        <Text style={[s.name, isDeferred && s.nameDeferred]} numberOfLines={1}>{item.name}</Text>
        <Text style={s.meta} numberOfLines={1}>
          {item.quantity} {item.unit}
          {item.category ? `  ·  ${item.category}` : ""}
        </Text>
        {(expiryLabel || item.quantity === 0 || isDeferred) ? (
          <View style={s.tagsRow}>
            {expiryLabel ? (
              <View style={[s.tag, { backgroundColor: expiryPillBg }]}>
                <Text style={[s.tagText, { color: expiryPillText }]}>{expiryLabel}</Text>
              </View>
            ) : null}
            {item.quantity === 0 && !isDeferred ? (
              <View style={[s.tag, s.openedTag]}>
                <Text style={[s.tagText, s.openedTagText]}>Opened</Text>
              </View>
            ) : null}
            {isDeferred && item.deferredUntil ? (
              <View style={[s.tag, s.deferredTag]}>
                <MaterialIcons name="snooze" size={9} color={md3.onSurfaceVariant} />
                <Text style={[s.tagText, s.deferredTagText]}>
                  {formatShortDate(item.deferredUntil)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Right column */}
      <View style={s.right}>
        {onUndefer ? (
          <Pressable onPress={onUndefer} style={s.unsnoozePill}>
            <Text style={s.unsnoozeText}>Un-snooze</Text>
          </Pressable>
        ) : onDefer ? (
          <Pressable onPress={() => setSnoozeSheetVisible(true)} style={s.snoozePill}>
            <MaterialIcons name="snooze" size={12} color={md3.onSurface} />
            <Text style={s.snoozeText}>Snooze</Text>
          </Pressable>
        ) : (
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
        )}

        <Pressable onPress={onEdit} style={s.editPill}>
          <Text style={s.editText}>Edit</Text>
        </Pressable>
      </View>
    </View>

      <ActionSheet
        visible={snoozeSheetVisible}
        title="Snooze item"
        message={`Remind me to buy "${item.name}" in…`}
        options={snoozeOptions}
        onCancel={() => setSnoozeSheetVisible(false)}
      />
    </>
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
  cardDeferred: {
    opacity: 0.65
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
  nameDeferred: {
    color: md3.onSurfaceVariant
  },
  meta: {
    color: md3.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.2
  },

  // Tags row
  tagsRow: {
    alignItems: "center",
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
  deferredTag: {
    alignItems: "center",
    backgroundColor: md3.surfaceContainerHigh,
    flexDirection: "row",
    gap: 3
  },
  deferredTagText: {
    color: md3.onSurfaceVariant
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

  // Snooze pill (active shopping items)
  snoozePill: {
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
  snoozeText: {
    color: md3.onSurface,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3
  },

  // Un-snooze pill (deferred items)
  unsnoozePill: {
    alignItems: "center",
    borderColor: md3.outline,
    borderRadius: radii.round,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  unsnoozeText: {
    color: md3.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.3
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
