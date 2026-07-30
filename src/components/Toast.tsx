import { Check } from "phosphor-react-native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii } from "../styles/globalStyles";

const DISMISS_AFTER_MS = 2600;

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, DISMISS_AFTER_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <View style={styles.toast} pointerEvents="none">
      <Check size={15} color={colors.accent} weight="regular" />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 112,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent800,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  message: {
    flex: 1,
    color: colors.text,
    fontSize: 13
  }
});
