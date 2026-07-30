import { MagnifyingGlass, X } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { colors } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { daysUntil } from "../utils/date";
import { searchStyles as s } from "./SearchScreen.styles";

type SearchScreenProps = {
  items: PantryItem[];
  query: string;
  onChangeQuery: (query: string) => void;
  onOpenItem: (item: PantryItem) => void;
};

export function SearchScreen({ items, query, onChangeQuery, onOpenItem }: SearchScreenProps) {
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? items.filter((item) =>
          [item.name, item.category, item.location, item.packageSize].join(" ").toLowerCase().includes(q)
        )
      : items;

    return [...matched].sort((a, b) =>
      q ? daysUntil(a.expiresOn) - daysUntil(b.expiresOn) : b.addedOn.localeCompare(a.addedOn)
    );
  }, [items, query]);

  const summary = query.trim()
    ? `${results.length} ${results.length === 1 ? "match" : "matches"} for “${query.trim()}”`
    : "Everything, newest shelf first";

  return (
    <View style={s.shell}>
      <View style={s.header}>
        <MagnifyingGlass size={17} color={colors.neutral500} weight="regular" />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Name, category, shelf…"
          placeholderTextColor={colors.neutral500}
          style={s.input}
          autoFocus
        />
        {query.length > 0 ? (
          <Pressable onPress={() => onChangeQuery("")} accessibilityLabel="Clear search">
            <X size={14} color={colors.neutral500} weight="regular" />
          </Pressable>
        ) : null}
      </View>
      <View style={s.accentRule} />

      <Text style={s.summary}>{summary}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {results.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [s.row, pressed && s.rowPressed]}
            onPress={() => onOpenItem(item)}
          >
            <View style={s.rowMain}>
              <Text style={s.rowName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={s.rowMeta} numberOfLines={1}>
                {item.location} · {item.category} · {item.packageSize}
              </Text>
            </View>
            <Text style={s.rowQty}>
              {item.quantity} {item.unit}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
