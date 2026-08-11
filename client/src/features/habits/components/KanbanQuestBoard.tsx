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
  Coins,
  Tag,
  Kanban as KanbanIcon,
} from "lucide-react";
import { QuestRank, QuestStatus } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { KanbanQuestCard } from "./KanbanQuestCard";
import { CreateQuestModal } from "./CreateQuestModal";

const COLUMNS: Array<{ id: QuestStatus; title: string; color: string; badgeBg: string }> = [
  { id: "To Do", title: "TO DO (PENDING)", color: "border-slate-700 text-slate-300", badgeBg: "bg-slate-800" },
  { id: "In Progress", title: "IN PROGRESS (BATTLE)", color: "border-blue-500/40 text-blue-400", badgeBg: "bg-blue-950/80" },
  { id: "Review", title: "REVIEW (VERIFY)", color: "border-purple-500/40 text-purple-300", badgeBg: "bg-purple-950/80" },
  { id: "Completed", title: "COMPLETED (CLEARED)", color: "border-emerald-500/40 text-emerald-400", badgeBg: "bg-emerald-950/80" },
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
  const allTags = Array.from(
    new Set(quests.flatMap((q) => q.tags || []))
  );

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
  const totalExpPool = quests.reduce((sum, q) => sum + (q.expReward || 0), 0);
  const totalGoldPool = quests.reduce((sum, q) => sum + (q.goldReward || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header Bar */}
      <div className="bg-[#151C33] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <KanbanIcon className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              KANBAN QUEST ENGINE
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-3 text-slate-300">
            <span>
              TOTAL: <strong className="text-white font-bold">{totalQuests}</strong>
            </span>
            <span>•</span>
            <span>
              CLEARED: <strong className="text-emerald-400 font-bold">{clearedQuests}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-blue-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current" /> {totalExpPool} EXP POOL
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" /> {totalGoldPool}g GOLD
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#151C33]/90 border border-white/10 rounded-2xl p-3.5 shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quests by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B1020] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Rank Dropdown */}
          <select
            value={selectedRank || ""}
            onChange={(e) => setSelectedRank((e.target.value as QuestRank) || null)}
            className="bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
          >
            <option value="">All Ranks</option>
            <option value="S">S-Rank</option>
            <option value="A">A-Rank</option>
            <option value="B">B-Rank</option>
            <option value="C">C-Rank</option>
            <option value="D">D-Rank</option>
            <option value="F">F-Rank</option>
          </select>

          {/* Construct Quest Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase font-mono shadow-md flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Construct Quest
          </button>
        </div>
      </div>

      {/* Hashtag Chips Bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs">
          <span className="text-slate-500 uppercase text-[10px] shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" /> Tags:
          </span>

          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ${
              selectedTag === null
                ? "bg-blue-600 text-white border-blue-400"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
          >
            ALL TAGS
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ${
                selectedTag === tag
                  ? "bg-cyan-500 text-slate-950 border-cyan-300 font-extrabold"
                  : "bg-cyan-950/60 text-cyan-400 border-cyan-500/30 hover:border-cyan-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Empty State Banner for New Accounts */}
      {totalQuests === 0 && (
        <div className="bg-[#151C33] border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">No Active Quests Constructed</h3>
          <p className="text-xs text-slate-400 max-w-md font-sans">
            Your quest board is clean. Construct your first quest to start earning EXP, Gold, and Stat Points.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase font-mono shadow-lg flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            + CONSTRUCT QUEST
          </button>
        </div>
      )}

      {/* 4-Column Kanban Quest Board Swimlanes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colQuests = filteredQuests.filter((q) => q.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-[#0D1322] border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/10">
                <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </h3>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-white/10 text-white ${col.badgeBg}`}
                >
                  {colQuests.length}
                </span>
              </div>

              {/* Column Quests Stack */}
              <div className="space-y-3 flex-1">
                {colQuests.length === 0 ? (
                  <div className="h-36 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 font-mono text-[11px] uppercase">
                    No Quests in {col.id}
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
