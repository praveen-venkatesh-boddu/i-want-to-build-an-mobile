import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../styles/globalStyles";
import { FadeRule } from "./FadeRule";

type HouseholdSheetProps = {
  visible: boolean;
  onClose: () => void;
  onInvite: () => void;
};

export function HouseholdSheet({ visible, onClose, onInvite }: HouseholdSheetProps) {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <Text style={styles.title}>Your household</Text>
          <Text style={styles.body}>
            Everyone sees the same list, live. Ticking an item shows up on their phone.
          </Text>
          <FadeRule style={styles.rule} color={colors.neutral800} />

          <View style={styles.memberRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>YO</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>You</Text>
              <Text style={styles.memberStatus}>this device</Text>
            </View>
          </View>

          <Pressable style={styles.inviteButton} onPress={onInvite}>
            <Text style={styles.inviteText}>Invite someone</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.scrim
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
    paddingHorizontal: spacing.screenH,
    paddingTop: 18,
    paddingBottom: 42
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral700,
    marginBottom: 18
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontFamily: "SpaceGrotesk_500Medium", fontWeight: "500",
    letterSpacing: -0.4
  },
  body: {
    color: colors.neutral400,
    fontSize: 12,
    marginTop: 8
  },
  rule: {
    marginTop: 16,
    marginBottom: 16
  },

  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent800
  },
  avatarText: {
    color: colors.accent100,
    fontSize: 12,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    color: colors.text,
    fontSize: 15
  },
  memberStatus: {
    color: colors.neutral500,
    fontSize: 11,
    marginTop: 2
  },

  inviteButton: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 13,
    marginTop: 18
  },
  inviteText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "IBMPlexSans_500Medium", fontWeight: "500"
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 13
  },
  closeText: {
    color: colors.neutral500,
    fontSize: 14
  }
});
