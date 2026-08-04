import { ArrowLeft, CaretDown, CaretUp, EyeSlash, Plus } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { SHELF_ICON_COMPONENTS } from "../constants/shelves";
import { colors } from "../styles/globalStyles";
import type { NotifSettings, PantryItem, Shelf } from "../types/pantry";
import { settingsStyles as s } from "./SettingsScreen.styles";

type SettingsScreenProps = {
  shelves: Shelf[];
  defaultShelfId: string | null;
  notif: NotifSettings;
  items: PantryItem[];
  onBack: () => void;
  onOpenShelf: (shelf: Shelf) => void;
  onAddShelf: () => void;
  onMoveShelf: (id: string, direction: number) => void;
  onToggleNotif: (key: keyof NotifSettings) => void;
};

const NOTIF_ROWS: Array<{ key: keyof NotifSettings; name: string; meta: string }> = [
  { key: "expiry", name: "Expiry warnings", meta: "A nudge three days before something goes off." },
  { key: "low", name: "Low stock", meta: "When an item drops below its par level." }
];

export function SettingsScreen({
  shelves,
  defaultShelfId,
  notif,
  items,
  onBack,
  onOpenShelf,
  onAddShelf,
  onMoveShelf,
  onToggleNotif
}: SettingsScreenProps) {
  const hiddenCount = useMemo(() => shelves.filter((shelf) => shelf.hidden).length, [shelves]);
  const countByName = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => map.set(item.location, (map.get(item.location) ?? 0) + 1));
    return map;
  }, [items]);
  const defaultShelfName = shelves.find((shelf) => shelf.id === defaultShelfId)?.name.toLowerCase() ?? "no shelf";

  return (
    <View style={s.shell}>
      <View style={s.titleBlock}>
        <Pressable style={s.backRow} onPress={onBack}>
          <ArrowLeft size={16} color={colors.neutral400} weight="regular" />
          <Text style={s.backLabel}>Settings</Text>
        </Pressable>
        <Text style={s.title}>Your{"\n"}shelves</Text>
        <Text style={s.subtitle}>
          {shelves.length} {shelves.length === 1 ? "shelf" : "shelves"} in the order they appear on the
          Shelves tab{hiddenCount ? `, ${hiddenCount} hidden` : ""}.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionLabel}>Order &amp; naming</Text>
          <View style={s.sectionRule} />
        </View>

        {shelves.map((shelf, index) => {
          const ShelfIcon = SHELF_ICON_COMPONENTS[shelf.icon];
          const count = countByName.get(shelf.name) ?? 0;
          const isDefault = shelf.id === defaultShelfId;
          const meta =
            (count === 0 ? "empty" : `${count} ${count === 1 ? "item" : "items"}`) +
            (shelf.hidden ? " · hidden from Shelves" : "");

          return (
            <View key={shelf.id} style={s.shelfRow}>
              <View style={s.moveColumn}>
                <Pressable
                  style={[s.moveButton, index === 0 && s.moveButtonDisabled]}
                  onPress={() => onMoveShelf(shelf.id, -1)}
                  disabled={index === 0}
                  accessibilityLabel={`Move ${shelf.name} up`}
                >
                  <CaretUp size={13} color={colors.neutral500} weight="bold" />
                </Pressable>
                <Pressable
                  style={[s.moveButton, index === shelves.length - 1 && s.moveButtonDisabled]}
                  onPress={() => onMoveShelf(shelf.id, 1)}
                  disabled={index === shelves.length - 1}
                  accessibilityLabel={`Move ${shelf.name} down`}
                >
                  <CaretDown size={13} color={colors.neutral500} weight="bold" />
                </Pressable>
              </View>

              <Pressable style={s.rowTap} onPress={() => onOpenShelf(shelf)}>
                <ShelfIcon size={17} color={shelf.hidden ? colors.neutral600 : colors.accent} weight="regular" />
                <View style={s.rowBody}>
                  <View style={s.rowNameLine}>
                    <Text style={[s.rowName, shelf.hidden && s.rowNameHidden]} numberOfLines={1}>
                      {shelf.name || "Untitled shelf"}
                    </Text>
                    {isDefault ? (
                      <View style={s.defaultBadge}>
                        <Text style={s.defaultBadgeText}>default</Text>
                      </View>
                    ) : null}
                    {shelf.hidden ? <EyeSlash size={13} color={colors.neutral500} weight="regular" /> : null}
                  </View>
                  <Text style={s.rowMeta}>{meta}</Text>
                </View>
                <Text style={s.rowZone}>{shelf.zone}</Text>
              </Pressable>
            </View>
          );
        })}

        <Pressable style={s.addShelfRow} onPress={onAddShelf}>
          <Plus size={15} color={colors.accent} weight="regular" />
          <Text style={s.addShelfText}>Add a shelf</Text>
        </Pressable>

        <View style={[s.sectionHeader, s.sectionHeaderTopped]}>
          <Text style={s.sectionLabel}>Notifications</Text>
          <View style={s.sectionRule} />
        </View>

        {NOTIF_ROWS.map((row) => {
          const on = notif[row.key];
          return (
            <Pressable key={row.key} style={s.notifRow} onPress={() => onToggleNotif(row.key)}>
              <View style={s.notifBody}>
                <Text style={s.notifName}>{row.name}</Text>
                <Text style={s.notifMeta}>{row.meta}</Text>
              </View>
              <View style={[s.switchTrack, on ? s.switchTrackOn : s.switchTrackOff]}>
                <View style={[s.switchKnob, on ? s.switchKnobOn : s.switchKnobOff]} />
              </View>
            </Pressable>
          );
        })}

        <Text style={s.footnote}>
          New and scanned items land on {defaultShelfName}. A shelf has to be empty before it can be
          deleted.
        </Text>
      </ScrollView>
    </View>
  );
}
