import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { md3 } from "../styles/globalStyles";
import type { PantryItem } from "../types/pantry";
import { homeStyles as styles } from "./HomeScreen.styles";

type HomeScreenProps = {
  shoppingItems: PantryItem[];      // all items with qty <= 1
  expiringCount: number;            // items expiring within 7 days
  perishablesCount: number;         // perishable category items added > 7 days ago
  onGoToShopping: () => void;
  onGoToExpiring: () => void;
};

const SHOPPING_PREVIEW_LIMIT = 5;

export function HomeScreen({
  shoppingItems,
  expiringCount,
  perishablesCount,
  onGoToShopping,
  onGoToExpiring
}: HomeScreenProps) {
  const preview = shoppingItems.slice(0, SHOPPING_PREVIEW_LIMIT);
  const overflow = shoppingItems.length - SHOPPING_PREVIEW_LIMIT;

  return (
    <View style={styles.shell}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Home Stock</Text>
        <Text style={styles.title}>Home Inventory</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Big shopping list tile ── */}
        <Pressable style={styles.shoppingTile} onPress={onGoToShopping}>
          <View style={styles.shoppingTileHeader}>
            <Text style={styles.shoppingTileTitle}>Shopping List</Text>
            {shoppingItems.length > 0 && (
              <View style={styles.shoppingTileCount}>
                <Text style={styles.shoppingTileCountText}>{shoppingItems.length}</Text>
              </View>
            )}
          </View>

          {shoppingItems.length === 0 ? (
            <View style={styles.shoppingEmpty}>
              <Text style={styles.shoppingEmptyText}>All stocked up ✓</Text>
            </View>
          ) : (
            preview.map((item) => (
              <View key={item.id} style={styles.shoppingRow}>
                <Text style={styles.shoppingRowName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.shoppingRowQty}>
                  {item.quantity} {item.unit}
                </Text>
              </View>
            ))
          )}

          {overflow > 0 && (
            <View style={styles.shoppingTileFooter}>
              <Text style={styles.shoppingTileFooterText}>+{overflow} more</Text>
              <MaterialIcons name="arrow-forward" size={16} color={md3.onSecondaryContainer} />
            </View>
          )}

          {shoppingItems.length > 0 && overflow <= 0 && (
            <View style={styles.shoppingTileFooter}>
              <Text style={styles.shoppingTileFooterText}>View all</Text>
              <MaterialIcons name="arrow-forward" size={16} color={md3.onSecondaryContainer} />
            </View>
          )}
        </Pressable>

        {/* ── Two small info tiles ── */}
        <View style={styles.smallTileRow}>

          {/* Expiring soon — tappable, navigates to Find with expiring filter */}
          <Pressable
            style={[styles.smallTile, styles.expiringTile]}
            onPress={onGoToExpiring}
          >
            <Text style={[styles.smallTileBigNumber, styles.expiringNumber]}>
              {expiringCount}
            </Text>
            <Text style={[styles.smallTileLabel, styles.expiringLabel]}>
              Expiring Soon
            </Text>
            <Text style={[styles.smallTileHint, styles.expiringHint]}>
              within 7 days
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={16}
              color={md3.onWarningContainer}
              style={styles.smallTileArrow}
            />
          </Pressable>

          {/* Perishables */}
          <View style={[styles.smallTile, styles.perishableTile]}>
            <Text style={[styles.smallTileBigNumber, styles.perishableNumber]}>
              {perishablesCount}
            </Text>
            <Text style={[styles.smallTileLabel, styles.perishableLabel]}>
              Perishables
            </Text>
            <Text style={[styles.smallTileHint, styles.perishableHint]}>
              added over a week ago
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
