export const THEME_STORAGE_KEY = "theme";
export const THEME_OPTIONS = ["light", "dark", "system"];

export const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const resolveTheme = (theme) => (theme === "system" ? getSystemTheme() : theme);

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", resolveTheme(theme));
};
