import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Target,
  Flame,
  Zap,
  Tag,
  Kanban as KanbanIcon,
  Sparkles,
  Layers,
  Check,
  RotateCcw,
  X,
} from "lucide-react";
import { QuestRank, QuestStatus } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { KanbanQuestCard } from "./KanbanQuestCard";
import { CreateQuestModal } from "./CreateQuestModal";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { playUIMenuSFX } from "@/utils/audio";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

const COLUMNS: Array<{
  id: QuestStatus;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  headerBg: string;
  badgeBg: string;
  dotColor: string;
}> = [
  {
    id: "To Do",
    title: "TO DO",
    subtitle: "Pending Directives",
    color: "text-slate-300",
    borderColor: "border-slate-700/60 hover:border-slate-600",
    headerBg: "bg-slate-900/60 border-slate-700/50",
    badgeBg: "bg-slate-800 text-slate-300 border-slate-700",
    dotColor: "bg-slate-400",
  },
  {
    id: "In Progress",
    title: "IN PROGRESS",
    subtitle: "Active Operations",
    color: "text-cyan-300",
    borderColor: "border-cyan-500/30 hover:border-cyan-400/50",
    headerBg: "bg-cyan-950/40 border-cyan-500/30",
    badgeBg: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
    dotColor: "bg-cyan-400",
  },
  {
    id: "Review",
    title: "REVIEW",
    subtitle: "Verification Phase",
    color: "text-purple-300",
    borderColor: "border-purple-500/30 hover:border-purple-400/50",
    headerBg: "bg-purple-950/40 border-purple-500/30",
    badgeBg: "bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
    dotColor: "bg-purple-400",
  },
  {
    id: "Completed",
    title: "COMPLETED",
    subtitle: "Directives Cleared",
    color: "text-emerald-300",
    borderColor: "border-emerald-500/30 hover:border-emerald-400/50",
    headerBg: "bg-emerald-950/40 border-emerald-500/30",
    badgeBg: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    dotColor: "bg-emerald-400",
  },
];

export const KanbanQuestBoard: React.FC = () => {
  const {
    quests,
    searchQuery,
    selectedTag,
    selectedRank,
    setSearchQuery,
    setSelectedTag,
    setSelectedRank,
  } = useKanbanMissionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract all unique hashtags from quests
  const allTags = Array.from(new Set(quests.flatMap((q) => q.tags || [])));

  // Filter quests
  const filteredQuests = quests.filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || (q.tags && q.tags.includes(selectedTag));
    const matchesRank = !selectedRank || q.rank === selectedRank;

    return matchesSearch && matchesTag && matchesRank;
  });

  const totalQuests = quests.length;
  const clearedQuests = quests.filter((q) => q.status === "Completed").length;
  const inProgressQuests = quests.filter((q) => q.status === "In Progress").length;
  const totalExpPool = quests.reduce((sum, q) => sum + (q.expReward || 0), 0);
  const totalGoldPool = quests.reduce((sum, q) => sum + (q.goldReward || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================= */}
      {/* TELEMETRY HUD BAR */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 rounded-[22px] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs backdrop-blur-xl relative overflow-hidden">
        {/* Floating Runes & Ambient Particles */}
        <FloatingRuneField density="low" />

        <div className="flex items-center gap-4 flex-wrap z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <KanbanIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white uppercase tracking-wider block">
                DIRECTIVE SWIMLANES
              </span>
              <span className="text-[10px] text-slate-400">Tactical Status Queue</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Stats Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>TOTAL:</span>
              <strong className="text-white font-bold">{totalQuests}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>ACTIVE:</span>
              <strong className="text-cyan-200 font-bold">{inProgressQuests}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>CLEARED:</span>
              <strong className="text-emerald-200 font-bold">{clearedQuests}</strong>
            </div>
          </div>
        </div>

        {/* Currency Rewards Pool */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <CurrencyIcon type="EXP" size="xs" />
            <span className="text-cyan-300 font-bold">+{totalExpPool.toLocaleString()} EXP POOL</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <CurrencyIcon type="GOLD" size="xs" />
            <span className="text-amber-300 font-bold">+{totalGoldPool.toLocaleString()}g GOLD</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTER & SEARCH TOOLBAR */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/20 rounded-[22px] p-3.5 sm:p-4 shadow-lg backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter directives by title, description, or tactical category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060B18] border border-cyan-500/20 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] font-mono transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Rank Dropdown */}
          <select
            value={selectedRank || ""}
            onChange={(e) => {
              playUIMenuSFX();
              setSelectedRank((e.target.value as QuestRank) || null);
            }}
            className="bg-[#060B18] border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer transition-all"
          >
            <option value="">All Threat Ranks</option>
            <option value="S">S-Rank (Legendary)</option>
            <option value="A">A-Rank (Epic)</option>
            <option value="B">B-Rank (Elite)</option>
            <option value="C">C-Rank (Standard)</option>
            <option value="D">D-Rank (Apprentice)</option>
            <option value="F">F-Rank (Novice)</option>
          </select>

          {/* Construct Quest Button */}
          <button
            onClick={() => {
              playUIMenuSFX();
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase font-mono shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center gap-2 shrink-0 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Construct Quest</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HASHTAG CHIPS BAR */}
      {/* ========================================================= */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs custom-scrollbar">
          <span className="text-slate-400 uppercase text-[10px] shrink-0 flex items-center gap-1 font-bold">
            <Tag className="w-3 h-3 text-cyan-400" /> TAGS:
          </span>

          <button
            onClick={() => {
              playUIMenuSFX();
              setSelectedTag(null);
            }}
            className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all shrink-0 cursor-pointer ${
              selectedTag === null
                ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
            }`}
          >
            ALL TAGS ({quests.length})
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                playUIMenuSFX();
                setSelectedTag(selectedTag === tag ? null : tag);
              }}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all shrink-0 cursor-pointer ${
                selectedTag === tag
                  ? "bg-purple-500 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)] font-extrabold"
                  : "bg-[#0A1024] text-cyan-300 border-cyan-500/25 hover:border-cyan-400 hover:bg-cyan-950/40"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* EMPTY STATE BANNER */}
      {/* ========================================================= */}
      {totalQuests === 0 && (
        <div className="bg-gradient-to-br from-[#0C1226]/90 via-[#080E20]/90 to-[#050914]/95 border-2 border-dashed border-cyan-500/30 rounded-[24px] p-10 text-center flex flex-col items-center justify-center space-y-3 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold font-heading text-white tracking-tight">
            NO ACTIVE QUESTS CONSTRUCTED
          </h3>
          <p className="text-xs text-slate-400 max-w-md font-sans">
            Your directive board is clear. Initialize your first quest to start accumulating EXP, Gold bounties, and attribute masteries.
          </p>
          <button
            onClick={() => {
              playUIMenuSFX();
              setIsModalOpen(true);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase font-mono shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 mt-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ CONSTRUCT FIRST QUEST</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4-COLUMN KANBAN SWIMLANES */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colQuests = filteredQuests.filter((q) => q.status === col.id);

          return (
            <div
              key={col.id}
              className={`bg-gradient-to-br from-[#0B1124]/95 via-[#070D1E]/95 to-[#040814]/98 border ${col.borderColor} rounded-[24px] p-4 shadow-2xl flex flex-col min-h-[550px] transition-all duration-300 backdrop-blur-xl relative overflow-hidden`}
            >
              {/* Subtle Floating Runes & Ambient Energy in Swimlane */}
              <FloatingRuneField density="low" className="opacity-35" />

              {/* Top Column Header */}
              <div
                className={`flex items-center justify-between mb-4 p-3 rounded-2xl border ${col.headerBg} backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <div>
                    <h3 className={`text-xs font-mono font-black tracking-wider ${col.color}`}>
                      {col.title}
                    </h3>
                    <span className="text-[9px] font-mono text-slate-400 block -mt-0.5">
                      {col.subtitle}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${col.badgeBg}`}
                >
                  {colQuests.length}
                </span>
              </div>

              {/* Column Quests Stack */}
              <div className="space-y-3.5 flex-1">
                {colQuests.length === 0 ? (
                  <div className="h-40 border border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center text-slate-500 font-mono text-[11px] uppercase p-4 text-center">
                    <span className="text-slate-600 mb-1">EMPTY SWIMLANE</span>
                    <span className="text-[10px] text-slate-600 font-sans">No tasks in {col.id}</span>
                  </div>
                ) : (
                  colQuests.map((quest) => (
                    <KanbanQuestCard key={quest.id} quest={quest} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Construct Quest */}
      <CreateQuestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

