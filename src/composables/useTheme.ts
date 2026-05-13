import { useDark, useToggle } from "@vueuse/core";
export const useTheme = () => {
  const isDark = useDark({
    selector: "html",
    valueLight: "light",
    valueDark: "dark",
  });
  return { isDark, toggle: useToggle(isDark) };
};
