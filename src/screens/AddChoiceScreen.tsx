import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { ScreenHeader } from "../components/ScreenHeader";
import { md3 } from "../styles/globalStyles";
import { addChoiceStyles as styles } from "./AddChoiceScreen.styles";

type AddChoiceScreenProps = {
  onGoBack: () => void;
  onGoToPerishable: () => void;
  onGoToScanLookup: () => void;
};

export function AddChoiceScreen({
  onGoBack,
  onGoToPerishable,
  onGoToScanLookup
}: AddChoiceScreenProps) {
  return (
    <View style={styles.shell}>
      <ScreenHeader
        title="Add Item"
        backLabel="Home"
        subtitle="Choose how you want to add an item."
        onBack={onGoBack}
      />

      <View style={styles.optionList}>

        <Pressable style={styles.optionCard} onPress={onGoToPerishable}>
          <View style={styles.optionIconWrap}>
            <MaterialIcons name="eco" size={28} color={md3.onSecondaryContainer} />
          </View>
          <Text style={styles.optionTitle}>Perishables</Text>
          <Text style={styles.optionDescription}>
            Quickly add fresh vegetables, fruits, and produce with a simple expiry picker.
          </Text>
          <View style={styles.optionFooter}>
            <Text style={styles.optionFooterLabel}>Quick add</Text>
            <MaterialIcons name="arrow-forward" size={16} color={md3.primary} />
          </View>
        </Pressable>

        <Pressable style={styles.optionCard} onPress={onGoToScanLookup}>
          <View style={[styles.optionIconWrap, styles.optionIconWrapAlt]}>
            <MaterialIcons name="qr-code-scanner" size={28} color={md3.onPrimaryContainer} />
          </View>
          <Text style={styles.optionTitle}>Scan & Lookup</Text>
          <Text style={styles.optionDescription}>
            Scan a barcode or search by name to auto-fill product details.
          </Text>
          <View style={styles.optionFooter}>
            <Text style={styles.optionFooterLabel}>Full form</Text>
            <MaterialIcons name="arrow-forward" size={16} color={md3.primary} />
          </View>
        </Pressable>

      </View>
    </View>
  );
}
