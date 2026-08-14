import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  ListTodo,
  CheckSquare,
  Square,
  Trash2,
  Pencil,
} from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { KanbanQuest, QuestRank, QuestStatus } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { EditQuestModal } from "./EditQuestModal";
import { playUIMenuSFX } from "@/utils/audio";

export interface KanbanQuestCardProps {
  quest: KanbanQuest;
}

const RANK_CONFIG: Record<
  QuestRank,
  {
    badgeBg: string;
    textColor: string;
    borderColor: string;
    glowBorder: string;
    accentLine: string;
    label: string;
  }
> = {
  S: {
    badgeBg: "bg-amber-950/80",
    textColor: "text-amber-300",
    borderColor: "border-amber-500/60",
    glowBorder: "group-hover:border-amber-400/80 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]",
    accentLine: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500",
    label: "S-RANK",
  },
  A: {
    badgeBg: "bg-purple-950/80",
    textColor: "text-purple-300",
    borderColor: "border-purple-500/60",
    glowBorder: "group-hover:border-purple-400/80 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    accentLine: "bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500",
    label: "A-RANK",
  },
  B: {
    badgeBg: "bg-blue-950/80",
    textColor: "text-blue-300",
    borderColor: "border-blue-500/60",
    glowBorder: "group-hover:border-blue-400/80 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
    accentLine: "bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500",
    label: "B-RANK",
  },
  C: {
    badgeBg: "bg-cyan-950/80",
    textColor: "text-cyan-300",
    borderColor: "border-cyan-500/50",
    glowBorder: "group-hover:border-cyan-400/70 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
    accentLine: "bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500",
    label: "C-RANK",
  },
  D: {
    badgeBg: "bg-emerald-950/80",
    textColor: "text-emerald-300",
    borderColor: "border-emerald-500/50",
    glowBorder: "group-hover:border-emerald-400/70 group-hover:shadow-[0_0_20px_rgba(10,185,129,0.25)]",
    accentLine: "bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500",
    label: "D-RANK",
  },
  F: {
    badgeBg: "bg-slate-900",
    textColor: "text-slate-400",
    borderColor: "border-slate-700",
    glowBorder: "group-hover:border-slate-500",
    accentLine: "bg-slate-700",
    label: "F-RANK",
  },
};

const STATUS_NEXT: Record<QuestStatus, QuestStatus | null> = {
  "To Do": "In Progress",
  "In Progress": "Review",
  Review: "Completed",
  Completed: null,
};

const STATUS_PREV: Record<QuestStatus, QuestStatus | null> = {
  "To Do": null,
  "In Progress": "To Do",
  Review: "In Progress",
  Completed: "Review",
};

export const KanbanQuestCard: React.FC<KanbanQuestCardProps> = ({ quest }) => {
  const { updateQuestStatus, toggleSubtask, deleteQuest } = useKanbanMissionStore();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const rankStyle = RANK_CONFIG[quest.rank] || RANK_CONFIG.C;

  const totalSubtasks = quest.subtasks?.length || 0;
  const completedSubtasks = quest.subtasks ? quest.subtasks.filter((st) => st.isCompleted).length : 0;
  const autoProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const progressPercent =
    quest.progressOverride !== undefined
      ? quest.progressOverride
      : quest.status === "Completed"
      ? 100
      : autoProgress;

  let dueDateLabel: string | null = null;
  let isOverdue = false;
  if (quest.dueDate) {
    const dueTime = new Date(quest.dueDate).getTime();
    const diffHours = Math.round((dueTime - Date.now()) / (1000 * 60 * 60));
    if (diffHours < 0) {
      dueDateLabel = `OVERDUE (${Math.abs(diffHours)}h)`;
      isOverdue = true;
    } else if (diffHours <= 24) {
      dueDateLabel = `DUE IN ${diffHours}h`;
    } else {
      dueDateLabel = `DUE IN ${Math.round(diffHours / 24)}d`;
    }
  }

  const isCompleted = quest.status === "Completed";

  return (
    <div
      className={`bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border rounded-2xl p-4 shadow-xl transition-all duration-300 relative overflow-hidden group backdrop-blur-xl ${rankStyle.glowBorder} ${
        isCompleted
          ? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
          : "border-cyan-500/15"
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          isCompleted ? "bg-emerald-400" : rankStyle.accentLine
        }`}
      />

      <div className="flex items-start justify-between gap-2 mb-2.5 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] font-black uppercase tracking-wider ${rankStyle.badgeBg} ${rankStyle.textColor} ${rankStyle.borderColor} shadow-sm`}
          >
            {rankStyle.label}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
            {quest.category}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              playUIMenuSFX();
              setIsEditOpen(true);
            }}
            title="Edit Quest / Directive"
            className="text-slate-400 hover:text-cyan-300 transition-colors p-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              playUIMenuSFX();
              deleteQuest(quest.id);
            }}
            title="Delete Directive"
            className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-950/40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-bold text-white font-heading leading-snug mb-1.5 line-clamp-2">
        {quest.title}
      </h4>

      {quest.description && (
        <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-3 leading-relaxed">
          {quest.description}
        </p>
      )}

      {quest.tags && quest.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {quest.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9.5px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/25 px-2 py-0.5 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="my-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <button
            onClick={() => {
              playUIMenuSFX();
              setShowSubtasks(!showSubtasks);
            }}
            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">
              Checklist ({completedSubtasks}/{totalSubtasks})
            </span>
          </button>
          <span className="text-cyan-300 font-bold font-mono">{progressPercent}%</span>
        </div>

        <div className="w-full h-2 bg-[#060B18] rounded-full overflow-hidden border border-white/5 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 shadow-sm ${
              isCompleted
                ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                : progressPercent >= 100
                ? "bg-emerald-400"
                : "bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {showSubtasks && totalSubtasks > 0 && (
        <div className="my-2.5 p-3 rounded-xl bg-[#060B18]/90 border border-cyan-500/20 space-y-2 shadow-inner">
          {quest.subtasks.map((st) => (
            <div
              key={st.id}
              onClick={() => {
                playUIMenuSFX();
                toggleSubtask(quest.id, st.id);
              }}
              className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-0.5"
            >
              {st.isCompleted ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 hover:text-cyan-400 shrink-0 transition-colors" />
              )}
              <span className={st.isCompleted ? "line-through text-slate-500" : "font-sans"}>
                {st.title}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2.5 border-t border-cyan-500/10 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            suppressHydrationWarning
            className="flex items-center gap-1 text-[11px] text-cyan-300 font-mono font-bold bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-lg shadow-sm"
          >
            <CurrencyIcon type="EXP" size="xs" />
            <span>+{quest.expReward} EXP</span>
          </div>
          {quest.goldReward > 0 && (
            <div
              suppressHydrationWarning
              className="flex items-center gap-1 text-[11px] text-amber-300 font-mono font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-lg shadow-sm"
            >
              <CurrencyIcon type="GOLD" size="xs" />
              <span>+{quest.goldReward}g</span>
            </div>
          )}
        </div>

        {dueDateLabel && (
          <div
            className={`flex items-center gap-1 font-bold font-mono text-[10px] px-2 py-0.5 rounded-md border ${
              isOverdue
                ? "text-rose-300 bg-rose-950/60 border-rose-500/40 animate-pulse"
                : "text-slate-400 bg-slate-900 border-slate-800"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{dueDateLabel}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-cyan-500/10 flex items-center justify-between">
        {STATUS_PREV[quest.status] ? (
          <button
            onClick={() => {
              playUIMenuSFX();
              updateQuestStatus(quest.id, STATUS_PREV[quest.status]!);
            }}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{STATUS_PREV[quest.status]}</span>
          </button>
        ) : (
          <div />
        )}

        {STATUS_NEXT[quest.status] ? (
          <button
            onClick={() => {
              playUIMenuSFX();
              updateQuestStatus(quest.id, STATUS_NEXT[quest.status]!);
            }}
            className={`text-[11px] font-mono font-extrabold flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95 ${
              STATUS_NEXT[quest.status] === "Completed"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            }`}
          >
            <span>{STATUS_NEXT[quest.status]}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CLEARED</span>
          </div>
        )}
      </div>

      {isEditOpen && <EditQuestModal quest={quest} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />}
    </div>
  );
};
