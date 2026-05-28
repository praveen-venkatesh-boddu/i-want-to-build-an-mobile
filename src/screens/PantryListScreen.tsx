import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { filters } from "../constants/pantry";
import { md3 } from "../styles/globalStyles";
import { PantryCard } from "../components/PantryCard";
import { Stat } from "../components/Stat";
import type { FilterKey, HomeView, PantryItem, PantryStats } from "../types/pantry";
import { pantryListStyles as styles } from "./PantryListScreen.styles";

type PantryListScreenProps = {
  filter: FilterKey;
  items: PantryItem[];
  query: string;
  stats: PantryStats;
  view: "find" | "shopping";
  onChangeFilter: (filter: FilterKey) => void;
  onChangeQuery: (query: string) => void;
  onEditItem: (item: PantryItem) => void;
  onGoHome: () => void;
};

export function PantryListScreen({
  filter,
  items,
  query,
  stats,
  view,
  onChangeFilter,
  onChangeQuery,
  onEditItem,
  onGoHome
}: PantryListScreenProps) {
  const title = view === "shopping" ? "Shopping List" : "Find Item";
  const emptyTitle = view === "shopping" ? "Shopping list is clear" : "Nothing here yet";
  const emptyText =
    view === "shopping"
      ? "Items with quantity 1 or less will show up here."
      : "Add an item or clear your filters to see more.";

  return (
    <View style={styles.appShell}>

      {/* ── Header with back chevron ── */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onGoHome}>
          <MaterialIcons name="chevron-left" size={26} color={md3.primary} />
          <Text style={styles.backLabel}>Home</Text>
        </Pressable>
        <Text style={styles.eyebrow}>Home Stock</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* ── Content ── */}
      <View style={styles.content}>
        {view === "find" ? (
          <>
            <View style={styles.statsRow}>
              <Stat label="Items" value={stats.total} />
              <Stat label="Expiring" value={stats.expiring} tone="warning" />
              <Stat label="Low" value={stats.low} tone="danger" />
            </View>

            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder="Search item, category, location"
              placeholderTextColor={md3.onSurfaceVariant}
              style={styles.searchInput}
            />

            <View style={styles.filterRow}>
              {filters.map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => onChangeFilter(option.key)}
                  style={[
                    styles.filterButton,
                    filter === option.key && styles.filterButtonActive
                  ]}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filter === option.key && styles.filterButtonTextActive
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
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
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
