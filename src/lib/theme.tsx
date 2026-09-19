"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeColor = "indigo" | "emerald" | "violet" | "cyan" | "rose" | "amber";

export interface ColorOption {
  id: ThemeColor;
  name: { en: string; hi: string };
  primary: string;
  hover: string;
  ring: string;
  previewBg: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  softBg: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: "indigo",
    name: { en: "Classic Indigo", hi: "क्लासिक इंडिगो" },
    primary: "#4f46e5",
    hover: "#4338ca",
    ring: "#6366f1",
    previewBg: "bg-indigo-600",
    gradient: "from-indigo-600 via-indigo-500 to-cyan-500",
    badgeBg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    softBg: "bg-indigo-50 dark:bg-indigo-950/40",
  },
  {
    id: "emerald",
    name: { en: "Emerald Green", hi: "एमराल्ड हरा" },
    primary: "#059669",
    hover: "#047857",
    ring: "#10b981",
    previewBg: "bg-emerald-600",
    gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    id: "violet",
    name: { en: "Royal Violet", hi: "रॉयल बैंगनी" },
    primary: "#7c3aed",
    hover: "#6d28d9",
    ring: "#8b5cf6",
    previewBg: "bg-violet-600",
    gradient: "from-violet-600 via-purple-500 to-pink-500",
    badgeBg: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    badgeText: "text-violet-700 dark:text-violet-300",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    id: "cyan",
    name: { en: "Ocean Cyan", hi: "ओशन स्यान" },
    primary: "#0891b2",
    hover: "#0e7490",
    ring: "#06b6d4",
    previewBg: "bg-cyan-600",
    gradient: "from-cyan-600 via-teal-500 to-blue-500",
    badgeBg: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
  },
  {
    id: "rose",
    name: { en: "Crimson Rose", hi: "क्रिमसन रोज़" },
    primary: "#e11d48",
    hover: "#be123c",
    ring: "#f43f5e",
    previewBg: "bg-rose-600",
    gradient: "from-rose-600 via-pink-500 to-orange-500",
    badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    badgeText: "text-rose-700 dark:text-rose-300",
    softBg: "bg-rose-50 dark:bg-rose-950/40",
  },
  {
    id: "amber",
    name: { en: "Warm Amber", hi: "वॉर्म एम्बर" },
    primary: "#d97706",
    hover: "#b45309",
    ring: "#f59e0b",
    previewBg: "bg-amber-600",
    gradient: "from-amber-600 via-orange-500 to-yellow-500",
    badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    badgeText: "text-amber-700 dark:text-amber-300",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
  },
];

interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MODE_STORAGE_KEY = "fixitpoint360-theme-mode";
const COLOR_STORAGE_KEY = "fixitpoint360-theme-color";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    if (savedMode && (savedMode === "light" || savedMode === "dark" || savedMode === "system")) {
      return savedMode;
    }
  } catch {}
  return "system";
}

function getInitialColor(): ThemeColor {
  if (typeof window === "undefined") return "indigo";
  try {
    const savedColor = localStorage.getItem(COLOR_STORAGE_KEY) as ThemeColor | null;
    if (savedColor && COLOR_OPTIONS.some((c) => c.id === savedColor)) {
      return savedColor;
    }
  } catch {}
  return "indigo";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [color, setColorState] = useState<ThemeColor>(getInitialColor);
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolvedMode: "light" | "dark" = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedMode === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    root.setAttribute("data-theme", color);
  }, [resolvedMode, color]);


  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, newMode);
    } catch {}
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    try {
      localStorage.setItem(COLOR_STORAGE_KEY, newColor);
    } catch {}
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedMode,
        color,
        setMode,
        setColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      mode: "system" as ThemeMode,
      resolvedMode: "light" as "light" | "dark",
      color: "indigo" as ThemeColor,
      setMode: () => {},
      setColor: () => {},
    };
  }
  return context;
}

export function getColorConfig(colorId: ThemeColor): ColorOption {
  return COLOR_OPTIONS.find((c) => c.id === colorId) || COLOR_OPTIONS[0];
}


