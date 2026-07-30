import React from "react";
import { Text, TextInput } from "react-native";

/**
 * expo-font loads Inter as separate static-weight families (Inter_300Light,
 * Inter_400Regular, Inter_500Medium) — there's no single "Inter" family with
 * a variable weight axis, so `fontWeight` alone won't pick the right file.
 * This patches every <Text>/<TextInput> to default to the regular weight;
 * screens that need 300 or 500 set `fontFamily` explicitly alongside their
 * `fontWeight` for the numerals/titles the design calls pixel-fidelity on.
 */
const DEFAULT_FONT_FAMILY = "Inter_400Regular";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextRender = (Text as any).render;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Text as any).render = function patchedTextRender(...args: any[]) {
  const origin = TextRender.apply(this, args);
  return React.cloneElement(origin, {
    style: [{ fontFamily: DEFAULT_FONT_FAMILY }, origin.props.style]
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextInputRender = (TextInput as any).render;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(TextInput as any).render = function patchedTextInputRender(...args: any[]) {
  const origin = TextInputRender.apply(this, args);
  return React.cloneElement(origin, {
    style: [{ fontFamily: DEFAULT_FONT_FAMILY }, origin.props.style]
  });
};
