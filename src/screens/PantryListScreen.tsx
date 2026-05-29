import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { ChipGroup } from "../components/ChipGroup";
import { PantryCard } from "../components/PantryCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { filters } from "../constants/pantry";
import type { FilterKey, PantryItem } from "../types/pantry";
import { pantryListStyles as styles } from "./PantryListScreen.styles";

type PantryListScreenProps = {
  filter: FilterKey;
  items: PantryItem[];
  query: string;
  view: "find" | "shopping";
  onChangeFilter: (filter: FilterKey) => void;
  onChangeQuery: (query: string) => void;
  onEditItem: (item: PantryItem) => void;
  onUseOneItem: (item: PantryItem) => void;
  onGoHome: () => void;
};

export function PantryListScreen({
  filter,
  items,
  query,
  view,
  onChangeFilter,
  onChangeQuery,
  onEditItem,
  onUseOneItem,
  onGoHome
}: PantryListScreenProps) {
  const title = view === "shopping" ? "Shopping List" : "Find Item";
  const emptyTitle = view === "shopping" ? "Shopping list is clear" : "Nothing here yet";
  const emptyText =
    view === "shopping"
      ? "Items with quantity 1 or less will show up here."
      : "Add an item or clear your filters to see more.";

  const filterOptions = filters.map((f) => ({ label: f.label, value: f.key }));

  return (
    <View style={styles.appShell}>
      <ScreenHeader
        title={title}
        backLabel="Home"
        eyebrow="Home Stock"
        onBack={onGoHome}
      />

      <View style={styles.content}>
        {view === "find" ? (
          <>
            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder="Search item, category, location"
              placeholderTextColor="#9E9E9E"
              style={styles.searchInput}
            />
            <View style={styles.filterRow}>
              <ChipGroup
                options={filterOptions}
                value={filter}
                onSelect={(v) => onChangeFilter(v as FilterKey)}
              />
            </View>
          </>
        ) : null}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{emptyTitle}</Text>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          ) : (
            items.map((item) => (
              <PantryCard
                key={item.id}
                item={item}
                onEdit={() => onEditItem(item)}
                onUseOne={() => onUseOneItem(item)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
