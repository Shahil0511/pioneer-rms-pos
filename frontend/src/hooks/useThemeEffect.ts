import { useEffect, useCallback } from "react";
import { useAppSelector } from "../store/hooks";

// Centralized theme constants
export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export const useThemeEffect = () => {
  const { mode: theme } = useAppSelector((state) => state.theme);

  // Apply theme changes to DOM efficiently
  const applyTheme = useCallback((mode: ThemeMode) => {
    try {
      document.documentElement.classList.toggle(
        "dark",
        mode === ThemeMode.DARK
      );
      localStorage.setItem("theme", mode);
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme as ThemeMode);
  }, [theme, applyTheme]);

  return { theme };
};

export default useThemeEffect;
