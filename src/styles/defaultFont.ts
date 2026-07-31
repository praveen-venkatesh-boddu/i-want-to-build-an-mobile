import React from "react";
import { Text, TextInput } from "react-native";

/**
 * expo-font loads each family as separate static-weight files (e.g.
 * IBMPlexSans_400Regular) — there's no single family name with a variable
 * weight axis, so `fontWeight` alone won't pick the right file. This patches
 * every <Text>/<TextInput> to default to the body font's regular weight;
 * screens that need Space Grotesk (headings) or another weight set
 * `fontFamily` explicitly alongside their `fontWeight`.
 */
const DEFAULT_FONT_FAMILY = "IBMPlexSans_400Regular";

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
