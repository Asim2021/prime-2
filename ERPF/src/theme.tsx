import { createTheme, CSSVariablesResolver, rem } from "@mantine/core";

import focusClasses from "./mantineStyles/focus.module.css";

const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  focusRing: "auto",
  focusClassName: focusClasses.focus,
  headings: { fontFamily: "Inter, sans-serif" },
  primaryColor: "cyan",
  colors: {},
  other: {
    erpPink: "#D5006C",
    erpPinkDark: "#AF0059",
    danger: "#EB0000",
    sidebarWidth: rem(220),
    sidebarCollapseWidth: rem(74),
  },
});

export const resolver: CSSVariablesResolver = (t) => ({
  variables: {
    "--mantine-icon-0": t.other.icon18,
    "--mantine-icon-1": t.other.icon20,
    "--mantine-icon-2": t.other.icon22,
    "--mantine-icon-3": t.other.icon24,
    "--mantine-sidebar": t.other.sidebarWidth,
    "--mantine-sidebar-collapse": t.other.sidebarCollapseWidth,
  },
  light: {},
  dark: {},
});

export default theme;
