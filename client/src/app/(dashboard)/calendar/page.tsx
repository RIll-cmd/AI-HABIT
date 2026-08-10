"use client";

import React, { useState, useEffect } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Flame,
  Shield,
  Zap,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";

interface Snapshot {
  id: string;
  date: string;
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

export default function CalendarPage() {
  const { character, refetch } = useCharacterStore();
  const [snapshots, setSnapshots] = useState<Record<string, Snapshot>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isBuyingShield, setIsBuyingShield] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const fetchSnapshots = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/habits/${character?.id || "char-id-123"}/calendar-snapshots`
      );
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, Snapshot> = {};
        (data.snapshots || []).forEach((sn: any) => {
          const dateKey = new Date(sn.date).toISOString().split("T")[0];
          map[dateKey] = sn;
        });
        setSnapshots(map);
      }
    } catch (e) {
      console.error("Failed to fetch calendar snapshots", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, [character?.id]);

  const handleSimulateDecay = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/habits/${character?.id || "char-id-123"}/decay/simulate`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(
          data.shieldUsed
            ? "🛡️ Midnight Decay: Streak Freeze Shield auto-activated! Streak preserved."
            : "Midnight Decay Simulation executed! Habit decay evaluated."
        );
        await refetch();
        await fetchSnapshots();
      } else {
        toast.error("Decay simulation failed.");
      }
    } catch (e) {
      toast.error("Network error during decay simulation.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleBuyShield = async () => {
    if ((character?.gold || 0) < 300) {
      toast.error("Insufficient Gold. Streak Freeze Shield costs 300 Gold.");
      return;
    }

    setIsBuyingShield(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/habits/${character?.id || "char-id-123"}/buy-streak-freeze`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        playBuffSFX();
        toast.success(`Purchased 1 Streak Freeze Shield 🛡️! (Total: ${data.streakFreezes})`);
        await refetch();
      } else {
        toast.error("Failed to purchase Streak Freeze Shield.");
      }
    } catch (e) {
      toast.error("Network error purchasing shield.");
    } finally {
      setIsBuyingShield(false);
    }
  };

  // Generate 52 weeks (364 days) grid leading up to today
  const today = new Date();
  const daysGrid: { dateStr: string; dateObj: Date; snapshot?: Snapshot }[] = [];

  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    daysGrid.push({
      dateStr,
      dateObj: d,
      snapshot: snapshots[dateStr],
    });
  }

  // Calculate summary metrics
  const activeDaysCount = Object.keys(snapshots).length;
  const streakFreezes = character?.streakFreezes || 0;

  const getCellColor = (rate?: number) => {
    if (rate === undefined || rate === null) return "bg-slate-900/40 border-slate-800/40";
    if (rate === 0) return "bg-slate-900/60 border-slate-800/60";
    if (rate <= 33) return "bg-cyan-950/80 border-cyan-800/50 shadow-sm";
    if (rate <= 66) return "bg-cyan-700/80 border-cyan-600/50 shadow-sm";
    if (rate < 100) return "bg-cyan-500 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]";
    return "bg-cyan-300 border-white shadow-[0_0_12px_#06b6d4]";
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-[24px] bg-[#0B1020]/90 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              Activity Contribution Heatmap Grid
            </h2>
            <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-mono font-bold text-xs uppercase px-2.5 py-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              365-DAY GRID
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Track daily completion density, unbroken habit streaks, and active Streak Freeze protection shields.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto justify-end">
          <Badge className="bg-purple-950/80 text-purple-300 border border-purple-500/50 font-mono text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 shadow-md">
            <Shield className="w-4 h-4 text-purple-400" />
            Shields: {streakFreezes} / 3
          </Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={handleBuyShield}
            disabled={isBuyingShield || streakFreezes >= 3}
            className="border-purple-500/40 text-purple-300 hover:bg-purple-950/40 font-mono text-xs"
          >
            {isBuyingShield ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Plus className="w-3.5 h-3.5 mr-1 text-purple-400" />}
            Buy Shield (300g)
          </Button>

          <Button
            size="sm"
            onClick={handleSimulateDecay}
            disabled={isSimulating}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider px-4 shadow-lg shadow-cyan-950/50"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1.5" />}
            Simulate Midnight
          </Button>
        </div>
      </div>

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0F1629] border-slate-800">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" /> Active Logged Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">{activeDaysCount} Days</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1629] border-slate-800">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Active Habit Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-amber-400">🔥 7 Days</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1629] border-slate-800">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Best Habit Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-300">⚡ 14 Days</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F1629] border-slate-800">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Protection Shields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">🛡️ {streakFreezes} Active</div>
          </CardContent>
        </Card>
      </div>

      {/* 52-WEEK CONTRIBUTIONS HEATMAP GRID CARD */}
      <Card className="bg-[#0B1020]/90 border border-slate-800 p-6 shadow-2xl overflow-hidden">
        <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <CardTitle className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              365-Day Contribution Density
            </CardTitle>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-slate-900/60 border border-slate-800" />
            <div className="w-3 h-3 rounded-sm bg-cyan-950 border border-cyan-800" />
            <div className="w-3 h-3 rounded-sm bg-cyan-700" />
            <div className="w-3 h-3 rounded-sm bg-cyan-500" />
            <div className="w-3 h-3 rounded-sm bg-cyan-300 border border-white" />
            <span>More</span>
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-slate-400 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Loading Heatmap Snapshots...</span>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              {/* Heatmap Grid Container: 52 Columns x 7 Rows */}
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[720px] justify-start">
                {daysGrid.map((day, idx) => {
                  const rate = day.snapshot?.completionRate;
                  const isHovered = hoveredDate === day.dateStr;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDate(day.dateStr)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-all duration-150 relative ${getCellColor(
                        rate
                      )} ${isHovered ? "scale-125 z-20 border-white shadow-lg" : ""}`}
                    >
                      {/* Hover Tooltip Popup */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl bg-slate-950 border border-cyan-500/60 text-slate-100 text-xs font-mono shadow-2xl z-30 pointer-events-none">
                          <div className="font-bold text-cyan-300 border-b border-slate-800 pb-1 mb-1">
                            {day.dateStr}
                          </div>
                          {day.snapshot ? (
                            <div className="space-y-0.5 text-[11px]">
                              <div>Completed: <strong className="text-emerald-400">{day.snapshot.completedCount}</strong> / {day.snapshot.totalCount}</div>
                              <div>Rate: <strong className="text-cyan-400">{day.snapshot.completionRate}%</strong></div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-500 italic">No activity snapshot logged.</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
