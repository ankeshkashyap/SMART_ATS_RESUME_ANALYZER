import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
