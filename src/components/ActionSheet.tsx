import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { md3, radii, spacing } from "../styles/globalStyles";

export type ActionSheetOption = {
  label: string;
  onPress: () => void;
};

type ActionSheetProps = {
  visible: boolean;
  title: string;
  message?: string;
  options: ActionSheetOption[];
  onCancel: () => void;
};

export function ActionSheet({ visible, title, message, options, onCancel }: ActionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {/* Backdrop — tap to cancel */}
      <Pressable style={s.backdrop} onPress={onCancel}>
        {/* Sheet — stop backdrop press propagating through the sheet */}
        <Pressable style={s.sheet} onPress={() => {}}>
          <View style={s.header}>
            <Text style={s.title}>{title}</Text>
            {message ? <Text style={s.message}>{message}</Text> : null}
          </View>

          <View style={s.divider} />

          {options.map((opt, i) => (
            <React.Fragment key={opt.label}>
              <Pressable
                style={({ pressed }) => [s.option, pressed && s.optionPressed]}
                onPress={() => { opt.onPress(); onCancel(); }}
              >
                <Text style={s.optionText}>{opt.label}</Text>
              </Pressable>
              {i < options.length - 1 ? <View style={s.optionDivider} /> : null}
            </React.Fragment>
          ))}

          <View style={s.cancelDivider} />

          <Pressable
            style={({ pressed }) => [s.option, pressed && s.optionPressed]}
            onPress={onCancel}
          >
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.45)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: md3.surfaceContainerLowest,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: "hidden",
    paddingBottom: spacing.xl
  },

  // Title block
  header: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg
  },
  title: {
    color: md3.onSurface,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.1,
    textAlign: "center"
  },
  message: {
    color: md3.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0.2,
    marginTop: 6,
    textAlign: "center"
  },

  divider: {
    backgroundColor: md3.outlineVariant,
    height: 1
  },
  optionDivider: {
    backgroundColor: md3.outlineVariant,
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.xl
  },
  cancelDivider: {
    backgroundColor: md3.outlineVariant,
    height: 6
  },

  // Option row
  option: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: 16
  },
  optionPressed: {
    backgroundColor: md3.surfaceContainerLow
  },
  optionText: {
    color: md3.primary,
    fontSize: 16,
    fontWeight: "500"
  },

  // Cancel row
  cancelText: {
    color: md3.onSurfaceVariant,
    fontSize: 16,
    fontWeight: "500"
  }
});
