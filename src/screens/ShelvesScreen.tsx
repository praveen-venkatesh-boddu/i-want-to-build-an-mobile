import { Cube, Drop, Funnel, MagnifyingGlass, Snowflake } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FadeRule } from "../components/FadeRule";
import { PLACE_GROUPS, groupForLocation } from "../constants/pantry";
import { colors } from "../styles/globalStyles";
import type { FilterKey, PantryItem } from "../types/pantry";
import { daysUntil, formatShortDate } from "../utils/date";
import { shelvesStyles as s } from "./ShelvesScreen.styles";

type ShelvesScreenProps = {
  allItems: PantryItem[];
  filteredItems: PantryItem[];
  filter: FilterKey;
  onCycleFilter: () => void;
  onGoSearch: () => void;
  onOpenItem: (item: PantryItem) => void;
};

const FILTER_LABEL: Record<FilterKey, string> = {
  all: "Filter",
  expiring: "Expiring",
  low: "Low",
  opened: "Opened"
};

const GROUP_ICON: Record<(typeof PLACE_GROUPS)[number], typeof Cube> = {
  "Pantry shelf": Cube,
  Fridge: Drop,
  "Freezer drawer": Snowflake,
  "Under the sink": Drop,
  Utility: Cube,
  Bathroom: Drop
};

export function ShelvesScreen({
  allItems,
  filteredItems,
  filter,
  onCycleFilter,
  onGoSearch,
  onOpenItem
}: ShelvesScreenProps) {
  const placeCount = useMemo(() => {
    const groups = new Set(allItems.map((item) => groupForLocation(item.location)));
    return groups.size;
  }, [allItems]);

  const groups = useMemo(() => {
    return PLACE_GROUPS.map((place) => ({
      place,
      rows: filteredItems.filter((item) => groupForLocation(item.location) === place)
    })).filter((group) => group.rows.length > 0);
  }, [filteredItems]);

  return (
    <View style={s.shell}>
      <View style={s.titleBlock}>
        <Text style={s.title}>Shelves</Text>
        <Text style={s.subtitle}>
          {allItems.length} {allItems.length === 1 ? "item" : "items"} across {placeCount}{" "}
          {placeCount === 1 ? "place" : "places"}
        </Text>
      </View>

      <View style={s.controlRow}>
        <Pressable style={s.searchField} onPress={onGoSearch}>
          <MagnifyingGlass size={16} color={colors.neutral500} weight="regular" />
          <Text style={s.searchPlaceholder}>Search</Text>
        </Pressable>

        <Pressable
          style={[s.filterButton, filter !== "all" && s.filterButtonActive]}
          onPress={onCycleFilter}
        >
          <Funnel size={15} color={filter !== "all" ? colors.accent300 : colors.neutral400} weight="regular" />
          <Text style={[s.filterButtonText, filter !== "all" && s.filterButtonTextActive]}>
            {FILTER_LABEL[filter]}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {groups.map((group, groupIndex) => {
          const GroupIcon = GROUP_ICON[group.place];
          const hasExpiringSoon = group.rows.some(
            (item) => item.quantity > 0 && daysUntil(item.expiresOn) <= 7
          );

          return (
            <View key={group.place}>
              <View style={[s.groupHeader, groupIndex === 0 && s.groupHeaderFirst]}>
                <GroupIcon size={15} color={hasExpiringSoon ? colors.accent : colors.neutral400} weight="regular" />
                <Text style={s.groupName}>{group.place}</Text>
                <FadeRule style={s.groupRule} color={colors.neutral800} />
                <Text style={s.groupCount}>{group.rows.length}</Text>
              </View>

              {group.rows.map((item) => (
                <ShelfRow key={item.id} item={item} onPress={() => onOpenItem(item)} />
              ))}
            </View>
          );
        })}

        <Text style={s.footnote}>
          {filteredItems.length} of {allItems.length} items · tap a row to change stock, snooze or edit.
        </Text>
      </ScrollView>
    </View>
  );
}

function ShelfRow({ item, onPress }: { item: PantryItem; onPress: () => void }) {
  const days = daysUntil(item.expiresOn);
  const isExpiring = item.quantity > 0 && days <= 7;
  const isOut = item.quantity === 0;

  const par = item.par ?? 1;
  const fillRatio = isOut ? 0 : Math.min(1, item.quantity / par);

  let meta: string;
  let metaAccent = false;
  if (isOut) {
    meta = item.deferredUntil ? `snoozed until ${formatShortDate(item.deferredUntil)}` : "on the list";
  } else if (isExpiring) {
    meta = days <= 0 ? "Expired" : `${days} ${days === 1 ? "day" : "days"} left`;
    metaAccent = true;
  } else {
    meta = [item.category, item.packageSize].filter(Boolean).join(" · ");
  }

  return (
    <Pressable
      style={({ pressed }) => [s.row, pressed && s.rowPressed]}
      onPress={onPress}
    >
      <Text style={[s.rowName, isOut && s.rowNameOut]} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={s.rowMetaBlock}>
        <Text style={[s.rowMeta, metaAccent && s.rowMetaExpiring]} numberOfLines={1}>
          {meta}
        </Text>
      </View>

      <View style={s.gaugeTrack}>
        <View
          style={[
            s.gaugeFill,
            {
              width: `${fillRatio * 100}%`,
              backgroundColor: isExpiring ? colors.accent : colors.neutral500
            }
          ]}
        />
      </View>

      <Text style={s.qty}>{item.quantity}</Text>
    </Pressable>
  );
}
