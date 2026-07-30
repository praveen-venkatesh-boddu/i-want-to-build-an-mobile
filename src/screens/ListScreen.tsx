import { LinearGradient } from "expo-linear-gradient";
import { GearSix, Moon, UsersThree } from "phosphor-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FadeRule } from "../components/FadeRule";
import { colors } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { daysSince, formatShortDate } from "../utils/date";
import { listStyles as s } from "./ListScreen.styles";

type ListScreenProps = {
  buyList: PantryItem[];
  snoozedItems: PantryItem[];
  expiringCount: number;
  totalCount: number;
  shelvesCount: number;
  onStartRun: () => void;
  onOpenHousehold: () => void;
  onOpenSettings: () => void;
  onOpenItem: (item: PantryItem) => void;
  onGoExpiring: () => void;
  onGoShelves: () => void;
};

export function ListScreen({
  buyList,
  snoozedItems,
  expiringCount,
  totalCount,
  shelvesCount,
  onStartRun,
  onOpenHousehold,
  onOpenSettings,
  onOpenItem,
  onGoExpiring,
  onGoShelves
}: ListScreenProps) {
  const buyCount = buyList.length;
  const isClear = buyCount === 0;

  return (
    <View style={s.shell}>
      <View style={s.header}>
        <LinearGradient
          pointerEvents="none"
          colors={["transparent", "rgba(145,132,217,0.10)"]}
          style={s.headerGlow}
        />

        <View style={s.topRow}>
          <Text style={s.eyebrow}>Home Stock</Text>
          <View style={s.headerIcons}>
            <Pressable onPress={onOpenHousehold} accessibilityLabel="Household">
              <UsersThree size={17} color={colors.neutral400} weight="regular" />
            </Pressable>
            <Pressable onPress={onOpenSettings} accessibilityLabel="Settings">
              <GearSix size={17} color={colors.neutral400} weight="regular" />
            </Pressable>
          </View>
        </View>

        <View style={s.heroRow}>
          <Text style={s.heroCount}>{buyCount}</Text>
          <Text style={s.heroLabel}>{buyCount === 1 ? "thing to buy" : "things to buy"}</Text>
        </View>

        <View style={s.buttonRow}>
          <Pressable
            style={[s.button, isClear ? s.startButtonClear : s.startButton]}
            onPress={onStartRun}
          >
            <Text style={[s.buttonText, isClear ? s.startButtonClearText : s.startButtonText]}>
              {isClear ? "List is clear" : "Start a run"}
            </Text>
          </Pressable>
          <Pressable style={[s.button, s.shareButton]} onPress={onOpenHousehold}>
            <Text style={[s.buttonText, s.shareButtonText]}>Share list</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.outOfStockSection}>
          {isClear ? (
            <View style={s.emptyState}>
              <Text style={s.emptyHeading}>Nothing to buy.</Text>
              <Text style={s.emptyBody}>
                Anything you open and run out of turns up here on its own.
              </Text>
            </View>
          ) : (
            <>
              <View style={s.sectionLabelRow}>
                <Text style={s.sectionLabel}>OUT OF STOCK</Text>
                <Text style={s.sectionLabelRight}>how long</Text>
              </View>
              <FadeRule color={colors.neutral800} />

              {buyList.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [s.row, pressed && s.rowPressed]}
                  onPress={() => onOpenItem(item)}
                >
                  <Text style={s.rowName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={s.rowDays}>{daysSince(item.ranOutOn ?? "")}d</Text>
                </Pressable>
              ))}
            </>
          )}

          {snoozedItems.length > 0 ? (
            <View style={s.snoozedLine}>
              <Moon size={13} color={colors.neutral500} weight="regular" />
              <Text style={s.snoozedText}>
                {snoozedItems.length === 1
                  ? `${snoozedItems[0].name} is snoozed until ${formatShortDate(snoozedItems[0].deferredUntil!)}`
                  : `${snoozedItems.length} items snoozed`}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={s.statPair}>
          <Pressable style={s.statBlock} onPress={onGoExpiring}>
            <Text style={[s.statNumber, { color: colors.accent }]}>{expiringCount}</Text>
            <Text style={[s.statLabel, { color: colors.neutral400 }]}>go off this week</Text>
          </Pressable>

          <LinearGradient
            style={s.statDivider}
            colors={["transparent", colors.neutral800, "transparent"]}
          />

          <Pressable style={s.statBlock} onPress={onGoShelves}>
            <Text style={[s.statNumber, { color: colors.neutral300 }]}>{totalCount}</Text>
            <Text style={[s.statLabel, { color: colors.neutral400 }]}>
              items on {shelvesCount} {shelvesCount === 1 ? "shelf" : "shelves"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
