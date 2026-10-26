import { ArrowLeft, Barcode, Check, Minus, Plus } from "phosphor-react-native";
import React, { useMemo, useRef, useState } from "react";
import { Animated, Modal, PanResponder, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { colors } from "../styles/globalStyles";
import type { PantryItem, Shelf, ShelfZone } from "../types/pantry";
import { daysSince } from "../utils/date";
import { runStyles as s } from "./RunScreen.styles";

type RunScreenProps = {
  runItems: PantryItem[];
  shelves: Shelf[];
  basket: Record<string, number>;
  /** Puts `quantity` of the item in the basket; 0 takes it back out. */
  onSetBasketQuantity: (item: PantryItem, quantity: number) => void;
  onSnooze: (item: PantryItem, days: number, label: string) => void;
  onPause: () => void;
  onFinish: () => void;
  onNothingTicked: () => void;
  onBackHome: () => void;
  onScan: () => void;
};

export function RunScreen({
  runItems,
  shelves,
  basket,
  onSetBasketQuantity,
  onSnooze,
  onPause,
  onFinish,
  onNothingTicked,
  onBackHome,
  onScan
}: RunScreenProps) {
  const tickedCount = runItems.filter((item) => basket[item.id]).length;
  const remaining = runItems.length - tickedCount;
  const isEmptyRun = runItems.length === 0;

  // Ticking an item asks how many were bought first.
  const [asking, setAsking] = useState<PantryItem | null>(null);
  const [askText, setAskText] = useState("1");
  const askCount = Math.max(0, Math.floor(Number(askText) || 0));

  function openAsk(item: PantryItem) {
    setAskText(String(wantedFor(item)));
    setAsking(item);
  }

  function confirmAsk() {
    if (!asking || askCount < 1) return;
    onSetBasketQuantity(asking, askCount);
    setAsking(null);
  }

  const groups = useMemo(() => {
    const zoneByLocation = new Map(shelves.map((shelf) => [shelf.name, shelf.zone]));
    const zoneFor = (item: PantryItem): ShelfZone => zoneByLocation.get(item.location) ?? "Household";
    const grocery = runItems.filter((item) => zoneFor(item) === "Grocery");
    const household = runItems.filter((item) => zoneFor(item) === "Household");
    return [
      { label: "Grocery", rows: grocery },
      { label: "Household", rows: household }
    ].filter((group) => group.rows.length > 0);
  }, [runItems, shelves]);

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
            <View key={item.id} style={[s.segment, !!basket[item.id] && s.segmentTicked]} />
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
                  bought={basket[item.id] ?? 0}
                  onPress={() => (basket[item.id] ? onSetBasketQuantity(item, 0) : openAsk(item))}
                  onSnooze={(days, label) => onSnooze(item, days, label)}
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

      <Modal transparent animationType="fade" visible={!!asking} onRequestClose={() => setAsking(null)}>
        <View style={s.modalScrim}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>How many {asking?.unit ?? "items"}?</Text>
            <Text style={s.modalSub} numberOfLines={1}>
              {asking?.name}
              {asking?.packageSize ? ` · ${asking.packageSize}` : ""}
            </Text>
            <View style={s.modalStepper}>
              <Pressable
                style={s.modalStepButton}
                accessibilityLabel="One fewer"
                onPress={() => setAskText(String(Math.max(0, askCount - 1)))}
              >
                <Minus size={18} color={colors.neutral200} weight="bold" />
              </Pressable>
              <TextInput
                style={s.modalInput}
                value={askText}
                onChangeText={(text) => setAskText(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                selectTextOnFocus
                accessibilityLabel="Number bought"
              />
              <Pressable
                style={s.modalStepButton}
                accessibilityLabel="One more"
                onPress={() => setAskText(String(askCount + 1))}
              >
                <Plus size={18} color={colors.neutral200} weight="bold" />
              </Pressable>
            </View>
            <View style={s.modalActions}>
              <Pressable style={s.modalCancel} onPress={() => setAsking(null)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[s.modalConfirm, askCount < 1 && s.modalConfirmDisabled]}
                disabled={askCount < 1}
                onPress={confirmAsk}
              >
                <Text style={s.modalConfirmText}>Add to basket</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const SNOOZE_OPTIONS = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 }
];
const REVEAL_WIDTH = 264;

function wantedFor(item: PantryItem) {
  return Math.max(1, (item.par ?? 1) - item.quantity);
}

function RunRow({
  item,
  ticked,
  bought,
  onPress,
  onSnooze
}: {
  item: PantryItem;
  ticked: boolean;
  bought: number;
  onPress: () => void;
  onSnooze: (days: number, label: string) => void;
}) {
  const wanted = ticked ? bought : wantedFor(item);
  const meta = ticked
    ? `in the basket · ${item.addedBy ?? "You"}`
    : `ran out ${daysSince(item.ranOutOn ?? "")}d ago · added by ${item.addedBy ?? "You"}`;

  const offset = useRef(new Animated.Value(0)).current;
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);

  function settle(toOpen: boolean) {
    openRef.current = toOpen;
    setOpen(toOpen);
    Animated.spring(offset, { toValue: toOpen ? REVEAL_WIDTH : 0, useNativeDriver: true, bounciness: 0 }).start();
  }

  const pan = useRef(
    PanResponder.create({
      // Only take over for a clearly horizontal drag, so the list still scrolls vertically.
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderMove: (_e, g) => {
        const start = openRef.current ? REVEAL_WIDTH : 0;
        offset.setValue(Math.min(REVEAL_WIDTH, Math.max(0, start + g.dx)));
      },
      onPanResponderRelease: (_e, g) => {
        const start = openRef.current ? REVEAL_WIDTH : 0;
        settle(start + g.dx > REVEAL_WIDTH / 3);
      },
      onPanResponderTerminate: () => settle(openRef.current)
    })
  ).current;

  return (
    <View style={s.swipeShell}>
      <View style={s.snoozeUnderlay} pointerEvents={open ? "auto" : "none"}>
        {SNOOZE_OPTIONS.map((option) => (
          <Pressable
            key={option.label}
            style={s.snoozeChip}
            accessibilityLabel={`Snooze ${item.name} for ${option.label}`}
            onPress={() => onSnooze(option.days, option.label)}
          >
            <Text style={s.snoozeChipText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
      <Animated.View style={[s.swipeFront, { transform: [{ translateX: offset }] }]} {...pan.panHandlers}>
        <Pressable style={s.row} onPress={open ? () => settle(false) : onPress}>
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
      </Animated.View>
    </View>
  );
}
