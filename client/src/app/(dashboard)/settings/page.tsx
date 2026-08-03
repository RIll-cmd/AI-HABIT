"use client";

import React from "react";
import { Settings, Sliders, Moon } from "lucide-react";
import { useThemeStore, ThemeMode } from "@/store/useThemeStore";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">Configure platform preferences and theme controls.</p>
        </div>
      </div>

      <div className="saas-card p-6 max-w-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-heading">Theme Palette</h3>
              <p className="text-xs text-slate-400">Current theme: <strong className="text-blue-400 uppercase">{theme}</strong></p>
            </div>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
            className="saas-input text-xs"
          >
            <option value="dark">Dark SaaS (#0B1020)</option>
            <option value="light">Light Mode</option>
            <option value="system">System Default</option>
          </select>
        </div>
      </div>
    </div>
  );
}

