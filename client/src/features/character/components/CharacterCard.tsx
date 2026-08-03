"use client";

import React from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Sparkles, UserCheck } from "lucide-react";

export function CharacterCard() {
  const { character } = useCharacterStore();

  return (
    <div className="saas-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-300 font-heading uppercase tracking-wider">
          Character Profile
        </h3>
        <span className="px-2.5 py-1 rounded-[14px] bg-blue-950/60 border border-blue-700/50 text-blue-300 text-[10px] font-mono">
          MVP Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-white shadow-md">
          <UserCheck className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white font-heading">
            {character?.name || "Shadow Monarch"}
          </h4>
          <p className="text-xs text-blue-400 font-medium flex items-center gap-1.5 mt-0.5 font-sans">
            <Sparkles className="w-3.5 h-3.5" />{" "}
            {character?.title || "Shadow Seeker"}
          </p>
        </div>
      </div>
    </div>
  );
}
