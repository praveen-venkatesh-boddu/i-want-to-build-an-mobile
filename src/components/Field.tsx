import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

import { itemEditorStyles as styles } from "../screens/ItemEditorScreen.styles";

type FieldProps = {
  children: React.ReactNode;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function Field({ children, label, style }: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}
