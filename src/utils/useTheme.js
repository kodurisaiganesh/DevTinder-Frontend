import { useCallback, useEffect, useState } from "react";
import { THEME_STORAGE_KEY, applyTheme } from "./theme";

const useTheme = () => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || "system"
  );

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") return undefined;

    // Keep the resolved theme in sync when the OS preference changes.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);
  }, []);

  return [theme, setTheme];
};

export default useTheme;
