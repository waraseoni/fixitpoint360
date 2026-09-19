"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Palette, Check } from "lucide-react";
import { useTheme, COLOR_OPTIONS, type ThemeMode } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";

export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const { mode, resolvedMode, color, setMode, setColor } = useTheme();
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const currentColor = COLOR_OPTIONS.find((c) => c.id === color) || COLOR_OPTIONS[0];

  const modeIcons = {
    light: Sun,
    dark: Moon,
    system: Laptop,
  };

  const ActiveIcon = mode === "system" ? Laptop : resolvedMode === "dark" ? Moon : Sun;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs",
          open && "ring-2 ring-indigo-500/20 border-indigo-400 dark:border-indigo-500"
        )}
        aria-label="Select Theme"
        title="Theme & Colors"
      >
        <span
          className="h-3 w-3 rounded-full shrink-0 shadow-xs"
          style={{ backgroundColor: currentColor.primary }}
        />
        <ActiveIcon className="h-4 w-4 text-slate-600 dark:text-slate-300 shrink-0" />
        {!compact && (
          <span className="hidden md:inline-block capitalize">
            {t(mode === "light" ? "modeLight" : mode === "dark" ? "modeDark" : "modeSystem")}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Theme Mode Segment */}
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>{t("themeMode")}</span>
              <span className="text-[10px] lowercase text-slate-400 dark:text-slate-500">
                ({resolvedMode})
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              {(["light", "system", "dark"] as ThemeMode[]).map((m) => {
                const Icon = modeIcons[m];
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium transition-all",
                      active
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>
                      {t(m === "light" ? "modeLight" : m === "dark" ? "modeDark" : "modeSystem")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <div className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Palette className="h-3 w-3" />
              <span>{t("themeColor")}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border p-1.5 text-left text-xs transition-all",
                      isSelected
                        ? "border-slate-400 dark:border-slate-500 bg-slate-100/80 dark:bg-slate-800/80 font-medium"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full shadow-xs text-white"
                      style={{ backgroundColor: c.primary }}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </span>
                    <span className="truncate text-[11px]">
                      {c.name[lang]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

