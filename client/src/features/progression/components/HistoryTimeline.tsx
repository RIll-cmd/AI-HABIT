"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, History, Sparkles } from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { EconomyLog } from "../types";

interface HistoryTimelineProps {
  logs?: EconomyLog[];
  isLoading?: boolean;
}

export function HistoryTimeline({ logs = [], isLoading }: HistoryTimelineProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-[#151C33] border border-slate-800 rounded-xl p-5 animate-pulse space-y-3">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-10 bg-slate-800/50 rounded" />
        <div className="h-10 bg-slate-800/50 rounded" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#151C33] border border-slate-800/80 rounded-xl p-5 shadow-lg relative">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <CurrencyIcon type="GOLD" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Economy & Gold Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Transaction History & Resource Logs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
          <History className="w-3 h-3 text-slate-500" />
          <span>{logs.length} Log Entries</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
          <Sparkles className="w-6 h-6 text-slate-600 opacity-40" />
          <span>No gold transactions logged yet. Complete missions to earn gold!</span>
        </div>
      ) : (
        <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
          {logs.map((log) => {
            const isPositive = log.amount >= 0;
            const formattedDate = new Date(log.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={log.id} className="relative flex items-start justify-between gap-3 text-xs group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#151C33] ${
                    isPositive ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />

                <div className="flex-1">
                  <p className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {log.reason}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formattedDate}
                    </span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {log.source}
                    </span>
                  </div>
                </div>

                <div
                  className={`font-mono font-bold text-xs flex items-center gap-0.5 shrink-0 px-2 py-1 rounded-md ${
                    isPositive
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-400" />
                  )}
                  {isPositive ? `+${log.amount}` : log.amount} Gold
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
