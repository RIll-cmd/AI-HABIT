"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  User,
  Bot,
  Target,
  Flame,
  Package,
  BarChart3,
  Lock,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldAlert,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useHabitStore } from "@/features/habits/store";
import { useProgressionStore } from "@/features/progression/store";
import { MissionCard } from "@/features/habits/components/MissionCard";
import dynamic from "next/dynamic";
import {
  HistoryTimeline,
  RankAscensionModal,
} from "@/features/progression/components";

const WeeklyExpChart = dynamic(
  () => import("@/features/progression/components/WeeklyExpChart").then((mod) => mod.WeeklyExpChart),
  { ssr: false }
);
import { useProgressionEvents } from "@/features/progression/hooks";
import { calculateLevelData } from "@/features/progression/utils";
import { playSystemOpen } from "@/features/audio/useSystemAudio";

export function DashboardOverview() {
  const { character, loadCharacter } = useCharacterStore();
  const { todayMissions, loadTodayMissions, executeMissionCompletion, isLoading } =
    useHabitStore();
  const {
    goldLogs,
    weeklyExpData,
    loadGoldHistory,
    loadWeeklyAnalytics,
    isLoading: isAnalyticsLoading,
  } = useProgressionStore();

  const { isRankModalOpen, closeRankModal, rankModalData } = useProgressionEvents();

  useEffect(() => {
    loadCharacter("char-id-123");
    loadTodayMissions("char-id-123");
    loadWeeklyAnalytics("char-id-123");
    loadGoldHistory("char-id-123");
  }, [loadCharacter, loadTodayMissions, loadWeeklyAnalytics, loadGoldHistory]);

  const name = character?.name || "Cyrill";
  const title = character?.title || "Wanderer";
  const levelData = calculateLevelData(character?.exp || 0);

  const totalMissionsCount = todayMissions.length;
  const completedMissionsCount = todayMissions.filter(
    (m) => m.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">
      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
              Ascendant Dashboard
            </h1>
            <Badge variant="default" className="text-[10px] font-mono bg-blue-600">
              SYSTEM ONLINE
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Good Morning,{" "}
            <span className="text-blue-400 font-semibold">{name}</span> ({title}
            ). Your daily habit engine is calibrated.
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          asChild
          className="text-xs font-bold shadow-md shadow-blue-600/30"
        >
          <Link href="/missions/create">
            <Plus className="w-3.5 h-3.5 mr-1" /> New Habit Mission
          </Link>
        </Button>
      </div>

      {/* PROGRESSION ENGINE ANALYTICS & TIMELINE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyExpChart data={weeklyExpData} isLoading={isAnalyticsLoading} />
        </div>
        <div className="lg:col-span-1">
          <HistoryTimeline logs={goldLogs} isLoading={isAnalyticsLoading} />
        </div>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: CHARACTER OVERVIEW */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Hunter Identity</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Core Character Status
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-blue-400 border-blue-500/30 bg-blue-500/10"
            >
              RANK {character?.rank || "F"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#0B1020] border border-white/10">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Current Level
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  Level {levelData.currentLevel}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Power Score
                </span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {character?.power || 97}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">EXP Progress</span>
                <span className="text-blue-400 font-semibold">
                  {levelData.currentExpInLevel} / {levelData.expToNextLevel} EXP (
                  {levelData.progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${levelData.progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full text-xs text-slate-400 hover:text-white"
            >
              <Link href="/profile">
                View Full Matrix <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* CARD 2: AI SYSTEM PANEL */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>AI System Panel</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                AIRA System Administrator
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="text-[10px] font-mono text-purple-300 bg-purple-950/50"
            >
              AIRA v1.0
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="p-3.5 rounded-[14px] bg-[#0B1020] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>AIRA Vector Analyzer Online</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                &quot;Welcome back, Ascendant {name}. Today you have{" "}
                <strong className="text-purple-300">
                  {totalMissionsCount - completedMissionsCount} pending missions
                </strong>{" "}
                ready for execution.&quot;
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0 mt-auto">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs border-white/10 bg-white/5 hover:bg-white/10"
              onClick={() => playSystemOpen()}
            >
              <Link href="/aira">
                Open AIRA Interface <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* CARD 3: TODAY'S MISSIONS (HABIT ENGINE CORE FEED) */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Today&apos;s Missions</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Daily Quest Board
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`text-[10px] font-mono ${
                completedMissionsCount > 0
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : "text-slate-400 border-white/10"
              }`}
            >
              {completedMissionsCount} / {totalMissionsCount} Done
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Loading today&apos;s missions...
              </div>
            ) : todayMissions.length > 0 ? (
              todayMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onComplete={(id, habit, completionType) =>
                    executeMissionCompletion(id, habit, completionType)
                  }
                />
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <p>No active missions for today.</p>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="text-xs font-bold"
                >
                  <Link href="/missions/create">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Forge Habit Mission
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full text-xs border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Link href="/missions/create">
                Forge Additional Habit <Plus className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* CARD 4: TOWER ACCESS */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Ascension Tower</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Dungeon Raids & Boss Fights
              </CardDescription>
            </div>
            <Badge variant="destructive" className="text-[10px] font-mono">
              LOCKED
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="p-4 rounded-[14px] bg-[#0B1020] border border-amber-500/20 text-center py-5">
              <Lock className="w-8 h-8 text-amber-500/60 mx-auto mb-2" />
              <p className="text-xs font-bold text-amber-300">Floor 1 Locked</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Requires Character Level 5
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="w-full text-xs opacity-50 cursor-not-allowed"
            >
              Unlock at Level 5
            </Button>
          </CardFooter>
        </Card>

        {/* CARD 5: INVENTORY PREVIEW */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                <span>Hunter Inventory</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Equipment & Artifact Vault
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-slate-400 border-white/10"
            >
              EMPTY
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="p-4 rounded-[14px] bg-[#0B1020] border border-white/10 text-center py-5">
              <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-300">Vault Empty</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Complete quests or shop to acquire gear
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full text-xs text-slate-400 hover:text-white"
            >
              <Link href="/inventory">
                Open Armory <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* CARD 6: RECENT ACTIVITY & ANALYTICS */}
        <Card className="bg-[#151C33] border-white/10 shadow-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Recent Activity & Analytics</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Attribute Tracking Log
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-slate-400 border-white/10"
            >
              TIMELINE
            </Badge>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="p-3.5 rounded-[14px] bg-[#0B1020] border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">
                  {completedMissionsCount > 0
                    ? `${completedMissionsCount} habit missions completed today`
                    : "Data collection active..."}
                </p>
                <p className="text-[10px] text-slate-500">
                  {completedMissionsCount > 0
                    ? "Habit strength scores and EXP history updated."
                    : "Complete a daily mission to log progression."}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full text-xs text-slate-400 hover:text-white"
            >
              <Link href="/analytics">
                View Full Analytics <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* RANK ASCENSION MODAL */}
      <RankAscensionModal
        isOpen={isRankModalOpen}
        onClose={closeRankModal}
        oldRank={rankModalData.oldRank}
        newRank={rankModalData.newRank}
      />
    </div>
  );
}
