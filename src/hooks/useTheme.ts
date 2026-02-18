"use client";

import { useState, useEffect, useCallback } from "react";
import { themes, type ThemeName } from "@/types/theme";

const DEFAULT_THEME: ThemeName = "tokyoNight";

function getInitialTheme(): ThemeName {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem("terminal-theme") as ThemeName | null;
  return stored && themes[stored] ? stored : DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only apply initial theme on mount
  }, []);

  const setTheme = useCallback((name: string) => {
    if (name in themes) {
      const themeName = name as ThemeName;
      setThemeState(themeName);
      localStorage.setItem("terminal-theme", themeName);
      applyThemeToDOM(themeName);
    }
  }, []);

  return { theme, setTheme, themeConfig: themes[theme] };
}

function applyThemeToDOM(name: ThemeName) {
  const t = themes[name];
  const root = document.documentElement;
  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--bg-secondary", t.bgSecondary);
  root.style.setProperty("--bg-tertiary", t.bgTertiary);
  root.style.setProperty("--fg", t.fg);
  root.style.setProperty("--fg-muted", t.fgMuted);
  root.style.setProperty("--fg-dim", t.fgDim);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--accent-rgb", t.accentRgb);
  root.style.setProperty("--accent-secondary", t.accentSecondary);
  root.style.setProperty("--accent-secondary-rgb", t.accentSecondaryRgb);
  root.style.setProperty("--red", t.red);
  root.style.setProperty("--green", t.green);
  root.style.setProperty("--yellow", t.yellow);
  root.style.setProperty("--blue", t.blue);
  root.style.setProperty("--prompt-path", t.promptPath);
}
