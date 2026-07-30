import { ArrowLeft, Barcode, Check } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { groupForLocation } from "../constants/pantry";
import { colors } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { daysSince } from "../utils/date";
import { runStyles as s } from "./RunScreen.styles";

type RunScreenProps = {
  runItems: PantryItem[];
  basket: Record<string, boolean>;
  onToggleBasket: (item: PantryItem) => void;
  onPause: () => void;
  onFinish: () => void;
  onNothingTicked: () => void;
  onBackHome: () => void;
  onScan: () => void;
};

const GROCERY_PLACES = new Set(["Fridge", "Freezer drawer", "Pantry shelf"]);

export function RunScreen({
  runItems,
  basket,
  onToggleBasket,
  onPause,
  onFinish,
  onNothingTicked,
  onBackHome,
  onScan
}: RunScreenProps) {
  const tickedCount = runItems.filter((item) => basket[item.id]).length;
  const remaining = runItems.length - tickedCount;
  const isEmptyRun = runItems.length === 0;

  const groups = useMemo(() => {
    const grocery = runItems.filter((item) => GROCERY_PLACES.has(groupForLocation(item.location)));
    const household = runItems.filter((item) => !GROCERY_PLACES.has(groupForLocation(item.location)));
    return [
      { label: "Grocery", rows: grocery },
      { label: "Household", rows: household }
    ].filter((group) => group.rows.length > 0);
  }, [runItems]);

  let finishLabel: string;
  let onFinishPress: () => void;
  if (isEmptyRun) {
    finishLabel = "Back home";
    onFinishPress = onBackHome;
  } else if (tickedCount === 0) {
    finishLabel = "Nothing ticked yet";
    onFinishPress = onNothingTicked;
  } else {
    finishLabel = `Finish run · ${tickedCount} in`;
    onFinishPress = onFinish;
  }

  return (
    <View style={s.shell}>
      <View style={s.topRow}>
        <Pressable style={s.pauseButton} onPress={onPause}>
          <ArrowLeft size={15} color={colors.neutral400} weight="regular" />
          <Text style={s.pauseLabel}>Pause</Text>
        </Pressable>
        <Text style={s.eyebrow}>On a run</Text>
      </View>

      <View style={s.countRow}>
        <Text style={s.countNumber}>{remaining}</Text>
        <Text style={s.countLabel}>of {runItems.length} left to buy</Text>
      </View>

      {!isEmptyRun ? (
        <View style={s.progressRow}>
          {runItems.map((item) => (
            <View key={item.id} style={[s.segment, basket[item.id] && s.segmentTicked]} />
          ))}
        </View>
      ) : null}

      {isEmptyRun ? (
        <View style={s.emptyState}>
          <Text style={s.emptyHeading}>Basket's full.</Text>
          <Text style={s.emptyBody}>
            Nothing left on the list. Finish up and everything goes back on its shelf.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
          {groups.map((group, groupIndex) => (
            <View key={group.label}>
              <Text style={[s.groupLabel, groupIndex === 0 && s.groupLabelFirst]}>{group.label}</Text>
              {group.rows.map((item) => (
                <RunRow
                  key={item.id}
                  item={item}
                  ticked={!!basket[item.id]}
                  onPress={() => onToggleBasket(item)}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={s.bottomBar}>
        <Pressable style={s.finishButton} onPress={onFinishPress}>
          <Text style={s.finishText}>{finishLabel}</Text>
        </Pressable>
        <Pressable style={s.scanButton} onPress={onScan}>
          <Barcode size={16} color={colors.neutral300} weight="regular" />
          <Text style={s.scanText}>Scan</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RunRow({ item, ticked, onPress }: { item: PantryItem; ticked: boolean; onPress: () => void }) {
  const wanted = Math.max(1, (item.par ?? 1) - item.quantity);
  const meta = ticked
    ? `in the basket · ${item.addedBy ?? "You"}`
    : `ran out ${daysSince(item.ranOutOn ?? "")}d ago · added by ${item.addedBy ?? "You"}`;

  return (
    <Pressable style={s.row} onPress={onPress}>
      <View style={[s.checkbox, ticked && s.checkboxTicked]}>
        {ticked ? <Check size={12} color={colors.accent100} weight="bold" /> : null}
      </View>
      <View style={s.rowBody}>
        <Text style={[s.rowName, ticked && s.rowNameTicked]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={s.rowMeta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      <Text style={s.rowWanted}>
        {wanted} {item.unit}
      </Text>
    </Pressable>
  );
}
