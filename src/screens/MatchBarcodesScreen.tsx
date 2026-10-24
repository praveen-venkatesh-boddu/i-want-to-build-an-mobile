import { ArrowLeft, Check } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { suggestBarcodes, type BarcodeSuggestion } from "../services/barcodeMatch";
import { getSwadCatalog } from "../services/swadCatalog";
import { colors } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { matchStyles as s } from "./MatchBarcodesScreen.styles";

export type BarcodeLink = { id: string; barcode: string };

type MatchBarcodesScreenProps = {
  items: PantryItem[];
  /** How many links the last Apply made, so the person can take them back. 0 hides the bar. */
  undoCount: number;
  onBack: () => void;
  onApply: (links: BarcodeLink[]) => void;
  onUndo: () => void;
};

export function MatchBarcodesScreen({ items, undoCount, onBack, onApply, onUndo }: MatchBarcodesScreenProps) {
  const suggestions = useMemo(() => suggestBarcodes(items, getSwadCatalog()), [items]);
  const withoutBarcode = useMemo(() => items.filter((item) => !item.barcode.trim()).length, [items]);

  // Only what the person has touched is stored; everything else falls back to the default
  // (clear matches ticked, "pick one" matches skipped).
  const [picked, setPicked] = useState<Record<string, string | null>>({});

  const chosenFor = (suggestion: BarcodeSuggestion): string | null => {
    const stored = picked[suggestion.item.id];
    if (stored !== undefined) return stored;
    return suggestion.tier === "clear" ? suggestion.candidates[0].barcode : null;
  };

  const toggle = (suggestion: BarcodeSuggestion, barcode: string) => {
    const now = chosenFor(suggestion);
    setPicked((current) => ({ ...current, [suggestion.item.id]: now === barcode ? null : barcode }));
  };

  const links: BarcodeLink[] = suggestions.flatMap((suggestion) => {
    const barcode = chosenFor(suggestion);
    return barcode ? [{ id: suggestion.item.id, barcode }] : [];
  });

  const clear = suggestions.filter((suggestion) => suggestion.tier === "clear");
  const choose = suggestions.filter((suggestion) => suggestion.tier === "choose");

  const renderGroup = (label: string, group: BarcodeSuggestion[]) =>
    group.length === 0 ? null : (
      <View key={label}>
        <View style={s.sectionHeader}>
          <Text style={s.sectionLabel}>
            {label} · {group.length}
          </Text>
          <View style={s.sectionRule} />
        </View>

        {group.map((suggestion) => {
          const chosen = chosenFor(suggestion);
          const meta = [suggestion.item.packageSize, suggestion.item.category, suggestion.item.location]
            .filter(Boolean)
            .join(" · ");

          return (
            <View key={suggestion.item.id} style={s.card}>
              <Text style={s.itemName} numberOfLines={1}>
                {suggestion.item.name}
              </Text>
              <Text style={s.itemMeta} numberOfLines={1}>
                {meta || "No details yet"}
              </Text>

              {suggestion.candidates.map((candidate) => {
                const on = chosen === candidate.barcode;
                return (
                  <Pressable
                    key={candidate.barcode}
                    style={[s.candidate, on && s.candidatePicked]}
                    onPress={() => toggle(suggestion, candidate.barcode)}
                    accessibilityRole={suggestion.tier === "clear" ? "checkbox" : "radio"}
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${candidate.name}, barcode ${candidate.barcode}`}
                  >
                    <View
                      style={[
                        s.indicator,
                        suggestion.tier === "clear" ? s.indicatorBox : s.indicatorRound,
                        on && s.indicatorOn
                      ]}
                    >
                      {on ? <Check size={12} color={colors.bg} weight="bold" /> : null}
                    </View>
                    <View style={s.candidateBody}>
                      <Text style={s.candidateName} numberOfLines={1}>
                        {candidate.name}
                      </Text>
                      <Text style={s.candidateMeta} numberOfLines={1}>
                        {[candidate.barcode, candidate.packageSize, candidate.category].filter(Boolean).join(" · ")}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </View>
    );

  return (
    <View style={s.shell}>
      <View style={s.titleBlock}>
        <Pressable style={s.backRow} onPress={onBack}>
          <ArrowLeft size={16} color={colors.neutral400} weight="regular" />
          <Text style={s.backLabel}>Settings</Text>
        </Pressable>
        <Text style={s.title}>Match{"\n"}barcodes</Text>
        <Text style={s.subtitle}>
          {withoutBarcode === 0
            ? "Every item already has a barcode."
            : `${withoutBarcode} ${withoutBarcode === 1 ? "item has" : "items have"} no barcode. ${
                suggestions.length === 0
                  ? "None of them match a catalog product closely enough."
                  : `${suggestions.length} ${suggestions.length === 1 ? "has" : "have"} a possible match in the Swad catalog. Tick the ones that are right.`
              }`}
        </Text>
      </View>

      {undoCount > 0 ? (
        <View style={s.undoBar}>
          <Text style={s.undoText}>
            Linked {undoCount} {undoCount === 1 ? "barcode" : "barcodes"}.
          </Text>
          <Pressable style={s.undoButton} onPress={onUndo} hitSlop={8}>
            <Text style={s.undoButtonText}>Undo</Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.list}>
        {renderGroup("Likely matches", clear)}
        {renderGroup("Pick one", choose)}

        {suggestions.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>Nothing to match</Text>
            <Text style={s.emptyBody}>
              Items match only when the name has the same words and the size agrees. Scanning an item
              adds its barcode automatically.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {suggestions.length > 0 ? (
        <View style={s.footer}>
          <Pressable
            style={[s.applyButton, links.length === 0 && s.applyButtonDisabled]}
            onPress={() => {
              onApply(links);
              setPicked({});
            }}
            disabled={links.length === 0}
          >
            <Text style={s.applyText}>
              {links.length === 0 ? "Nothing selected" : `Link ${links.length} ${links.length === 1 ? "barcode" : "barcodes"}`}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
