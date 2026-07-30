import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FadeRule } from "../components/FadeRule";
import { colors } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { daysUntil } from "../utils/date";
import { expiringStyles as s } from "./ExpiringScreen.styles";

type ExpiringScreenProps = {
  items: PantryItem[]; // already filtered to qty>0 && daysUntil<=7, sorted soonest first
  onOpenItem: (item: PantryItem) => void;
  onUseOne: (item: PantryItem) => void;
};

export function ExpiringScreen({ items, onOpenItem, onUseOne }: ExpiringScreenProps) {
  const subtitle =
    items.length === 0
      ? "Nothing is about to go off. Nice."
      : items.length === 1
        ? "One thing needs using this week."
        : `${items.length} things need using this week.`;

  return (
    <View style={s.shell}>
      <View style={s.titleBlock}>
        <Text style={s.title}>Use it{"\n"}or lose it</Text>
        <Text style={s.subtitle}>{subtitle}</Text>
      </View>
      <FadeRule color={colors.neutral800} />

      {items.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyText}>Nothing here needs your attention.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {items.map((item) => {
            const days = daysUntil(item.expiresOn);
            const urgent = days <= 3;
            const displayDays = Math.max(days, 0);
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [s.row, pressed && s.rowPressed]}
                onPress={() => onOpenItem(item)}
              >
                <View style={s.dayBlock}>
                  <Text style={[s.dayNumber, { color: urgent ? colors.accent : colors.neutral300 }]}>
                    {days <= 0 ? "0" : displayDays}
                  </Text>
                  <Text style={s.dayUnit}>{days < 0 ? "EXPIRED" : displayDays === 1 ? "DAY" : "DAYS"}</Text>
                </View>

                <View style={s.rowBody}>
                  <Text style={s.rowName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={s.rowMeta} numberOfLines={1}>
                    {item.category} · {item.location}
                  </Text>
                </View>

                <Pressable style={s.useButton} onPress={() => onUseOne(item)}>
                  <Text style={s.useButtonText}>Use 1</Text>
                </Pressable>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
