"use client";

import React from "react";
import { SlidersHorizontal, RefreshCw, AlertTriangle, Check, Loader2 } from "lucide-react";

export type AuthFormMode = "login" | "register" | "otp" | "forgot";

interface V2AuthPreviewToolbarProps {
  currentMode: AuthFormMode;
  onModeChange: (mode: AuthFormMode) => void;
  isLoading: boolean;
  onToggleLoading: () => void;
  hasError: boolean;
  onToggleError: () => void;
  isSuccess: boolean;
  onToggleSuccess: () => void;
  onReset: () => void;
}

export function V2AuthPreviewToolbar({
  currentMode,
  onModeChange,
  isLoading,
  onToggleLoading,
  hasError,
  onToggleError,
  isSuccess,
  onToggleSuccess,
  onReset,
}: V2AuthPreviewToolbarProps) {
  return (
    <aside
      aria-label="UI Visual Mock State Debugger"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[calc(100%-2rem)] p-2 sm:p-2.5 rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs text-zinc-200"
    >
      {/* Label Badge */}
      <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-xl">
        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-mono text-[11px] font-bold tracking-wider text-zinc-300 uppercase">
          V2 MOCK PREVIEW
        </span>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            currentMode === "login"
              ? "bg-cyan-500 text-cyan-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          1. Login
        </button>

        <button
          type="button"
          onClick={() => onModeChange("register")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            currentMode === "register"
              ? "bg-cyan-500 text-cyan-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          2. Register
        </button>

        <button
          type="button"
          onClick={() => onModeChange("otp")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            currentMode === "otp"
              ? "bg-cyan-500 text-cyan-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          3. OTP (2FA)
        </button>

        <button
          type="button"
          onClick={() => onModeChange("forgot")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            currentMode === "forgot"
              ? "bg-cyan-500 text-cyan-950 font-bold shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          4. Recovery
        </button>
      </div>

      {/* State Modifier Toggles */}
      <div className="flex items-center gap-1.5">
        {/* Loading Toggle */}
        <button
          type="button"
          onClick={onToggleLoading}
          aria-pressed={isLoading}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium border flex items-center gap-1.5 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            isLoading
              ? "bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Loader2 className={`w-3 h-3 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          <span>Loading</span>
        </button>

        {/* Error Toggle */}
        <button
          type="button"
          onClick={onToggleError}
          aria-pressed={hasError}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium border flex items-center gap-1.5 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            hasError
              ? "bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Error</span>
        </button>

        {/* Success Toggle */}
        <button
          type="button"
          onClick={onToggleSuccess}
          aria-pressed={isSuccess}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-medium border flex items-center gap-1.5 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            isSuccess
              ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Success</span>
        </button>

        {/* Reset State */}
        <button
          type="button"
          onClick={onReset}
          title="Reset debug states"
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
