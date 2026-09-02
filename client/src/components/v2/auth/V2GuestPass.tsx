"use client";

import React from "react";
import { UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface V2GuestPassProps {
  onGuestEntry?: () => void;
  isLoading?: boolean;
}

export function V2GuestPass({ onGuestEntry, isLoading = false }: V2GuestPassProps) {
  return (
    <div className="w-full pt-4 border-t border-zinc-800/80">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium text-zinc-300">Fast Evaluation</span>
          <span className="font-mono text-[11px] text-zinc-500">Sandbox Mode</span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onGuestEntry}
          disabled={isLoading}
          className="w-full min-h-[44px] bg-zinc-900/60 hover:bg-zinc-800/90 text-zinc-200 hover:text-white border-zinc-700/70 hover:border-zinc-500/80 rounded-xl transition-all duration-200 flex items-center justify-between px-4 group cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm">Explore as Guest Hunter</span>
          </div>

          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all" />
        </Button>

        <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
          Instant guest profile with preloaded telemetry, habits, and workouts. No password required.
        </p>
      </div>
    </div>
  );
}
