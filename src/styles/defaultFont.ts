import { Text, TextInput } from "react-native";

/**
 * expo-font loads each family as separate static-weight files (e.g.
 * IBMPlexSans_400Regular) — there's no single family name with a variable
 * weight axis, so `fontWeight` alone won't pick the right file. This patches
 * every <Text>/<TextInput> to default to the body font's regular weight;
 * screens that need Space Grotesk (headings) or another weight set
 * `fontFamily` explicitly alongside their `fontWeight`.
 *
 * The default has to be spliced into `props.style` *before* the original
 * component renders, not wrapped around its output afterward: on web,
 * react-native-web's own base style sets a `font: '14px System'` shorthand
 * that sits later in the rendered element's style array than anything we
 * add after the fact, so a post-render wrap always loses to it. Injecting
 * into the incoming style prop instead puts our default in the same slot
 * the caller's own style occupies, which is the one position that beats
 * react-native-web's base style while still losing to an explicit
 * `fontFamily` set by the caller.
 */
const DEFAULT_FONT_FAMILY = "IBMPlexSans_400Regular";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextRender = (Text as any).render;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Text as any).render = function patchedTextRender(props: any, ref: any) {
  return TextRender({ ...props, style: [{ fontFamily: DEFAULT_FONT_FAMILY }, props.style] }, ref);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextInputRender = (TextInput as any).render;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(TextInput as any).render = function patchedTextInputRender(props: any, ref: any) {
  return TextInputRender({ ...props, style: [{ fontFamily: DEFAULT_FONT_FAMILY }, props.style] }, ref);
};
