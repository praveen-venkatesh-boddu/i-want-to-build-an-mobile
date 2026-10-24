import React, { useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

import { colors } from "../styles/globalStyles";
import { checkPasscode, getPasscode, setPasscode } from "../storage/kv";

/** Web only: enter the passcode that unlocks syncing to Cloudflare. */
export function SyncPasscode() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "bad">("idle");
  const connected = !!getPasscode();

  if (Platform.OS !== "web") return null;

  async function connect() {
    if (!value.trim()) return;
    setStatus("busy");
    if (await checkPasscode(value.trim())) {
      setPasscode(value.trim());
      window.location.reload(); // reload so everything loads from the server
    } else {
      setStatus("bad");
    }
  }

  function disconnect() {
    setPasscode("");
    window.location.reload();
  }

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
      <Text style={{ color: colors.neutral500, fontSize: 11, letterSpacing: 1.4, marginBottom: 10 }}>
        SYNC &amp; BACKUP
      </Text>
      {connected ? (
        <>
          <Text style={{ color: colors.neutral300, fontSize: 14, lineHeight: 20 }}>
            Synced to Cloudflare. Your pantry is backed up and shared across devices using this passcode.
          </Text>
          <Pressable onPress={disconnect} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.accent, fontSize: 14 }}>Turn off sync on this device</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={{ color: colors.neutral400, fontSize: 13, lineHeight: 19, marginBottom: 10 }}>
            Enter your passcode to back up and sync. Until then, data stays on this device only.
          </Text>
          <TextInput
            value={value}
            onChangeText={(t) => { setValue(t); setStatus("idle"); }}
            placeholder="Passcode"
            placeholderTextColor={colors.neutral500}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              color: colors.text, fontSize: 15, paddingVertical: 10, paddingHorizontal: 12,
              borderWidth: 1, borderColor: colors.neutral800, borderRadius: 10
            }}
          />
          {status === "bad" ? (
            <Text style={{ color: "#e07a6a", fontSize: 13, marginTop: 8 }}>
              That passcode didn't work, or the server isn't set up yet.
            </Text>
          ) : null}
          <Pressable onPress={connect} disabled={status === "busy"} style={{ marginTop: 12 }}>
            <Text style={{ color: colors.accent, fontSize: 14 }}>
              {status === "busy" ? "Checking…" : "Connect"}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
