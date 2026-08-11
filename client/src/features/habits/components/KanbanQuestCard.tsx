import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Coins,
  ChevronRight,
  ChevronLeft,
  ListTodo,
  CheckSquare,
  Square,
  History,
  Trash2,
  Tag,
  AlertCircle,
  Flame,
  Pencil,
} from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { KanbanQuest, QuestRank, QuestStatus } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { EditQuestModal } from "./EditQuestModal";

export interface KanbanQuestCardProps {
  quest: KanbanQuest;
}

const RANK_CONFIG: Record<QuestRank, { badgeBg: string; textColor: string; borderColor: string; label: string }> = {
  S: { badgeBg: "bg-amber-950/80", textColor: "text-amber-400", borderColor: "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]", label: "S-RANK" },
  A: { badgeBg: "bg-purple-950/80", textColor: "text-purple-300", borderColor: "border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.35)]", label: "A-RANK" },
  B: { badgeBg: "bg-blue-950/80", textColor: "text-blue-300", borderColor: "border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.35)]", label: "B-RANK" },
  C: { badgeBg: "bg-cyan-950/80", textColor: "text-cyan-300", borderColor: "border-cyan-500/60", label: "C-RANK" },
  D: { badgeBg: "bg-emerald-950/80", textColor: "text-emerald-300", borderColor: "border-emerald-500/60", label: "D-RANK" },
  F: { badgeBg: "bg-slate-900", textColor: "text-slate-400", borderColor: "border-slate-700", label: "F-RANK" },
};

const STATUS_NEXT: Record<QuestStatus, QuestStatus | null> = {
  "To Do": "In Progress",
  "In Progress": "Review",
  "Review": "Completed",
  "Completed": null,
};

const STATUS_PREV: Record<QuestStatus, QuestStatus | null> = {
  "To Do": null,
  "In Progress": "To Do",
  "Review": "In Progress",
  "Completed": "Review",
};

export const KanbanQuestCard: React.FC<KanbanQuestCardProps> = ({ quest }) => {
  const { updateQuestStatus, toggleSubtask, deleteQuest } = useKanbanMissionStore();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const rankStyle = RANK_CONFIG[quest.rank] || RANK_CONFIG.C;

  // Calculate subtask completion percentage
  const totalSubtasks = quest.subtasks.length;
  const completedSubtasks = quest.subtasks.filter((st) => st.isCompleted).length;
  const autoProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const progressPercent = quest.progressOverride !== undefined ? quest.progressOverride : (quest.status === "Completed" ? 100 : autoProgress);

  // Due date countdown indicator
  let dueDateLabel: string | null = null;
  let isOverdue = false;
  if (quest.dueDate) {
    const dueTime = new Date(quest.dueDate).getTime();
    const diffHours = Math.round((dueTime - Date.now()) / (1000 * 60 * 60));
    if (diffHours < 0) {
      dueDateLabel = `OVERDUE (${Math.abs(diffHours)}h ago)`;
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
      className={`bg-[#151C33] border rounded-2xl p-4 shadow-xl transition-all relative overflow-hidden group ${
        isCompleted
          ? "border-emerald-500/30 bg-emerald-950/10"
          : "border-white/10 hover:border-blue-500/40"
      }`}
    >
      {/* Top Rank Accent Border */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isCompleted ? "bg-emerald-500" : quest.rank === "S" ? "bg-amber-400" : quest.rank === "A" ? "bg-purple-500" : "bg-blue-500"
        }`}
      />

      {/* Header Badges & Title */}
      <div className="flex items-start justify-between gap-2 mb-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] font-bold ${rankStyle.badgeBg} ${rankStyle.textColor} ${rankStyle.borderColor}`}
          >
            {rankStyle.label}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[10px]">
            {quest.category}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditOpen(true)}
            title="Edit Quest / Task"
            className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => deleteQuest(quest.id)}
            title="Delete Quest"
            className="text-slate-600 hover:text-rose-400 transition-colors p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-bold text-white font-heading leading-snug mb-1">
        {quest.title}
      </h4>

      {quest.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {quest.description}
        </p>
      )}

      {/* Hashtag List */}
      {quest.tags && quest.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {quest.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar & Subtask Checklist Toggle */}
      <div className="my-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ListTodo className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Checklist ({completedSubtasks}/{totalSubtasks})
            </span>
          </button>
          <span className="text-blue-300 font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full transition-all duration-300 ${
              isCompleted
                ? "bg-emerald-500"
                : progressPercent >= 100
                ? "bg-emerald-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Expandable Subtasks Checklist */}
      {showSubtasks && totalSubtasks > 0 && (
        <div className="my-2 p-2.5 rounded-xl bg-[#0B1020] border border-white/10 space-y-1.5">
          {quest.subtasks.map((st) => (
            <div
              key={st.id}
              onClick={() => toggleSubtask(quest.id, st.id)}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
            >
              {st.isCompleted ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className={st.isCompleted ? "line-through text-slate-500" : ""}>
                {st.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Due Date & Rewards Footer */}
      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold flex items-center gap-0.5">
            <Zap className="w-3 h-3 fill-current" /> +{quest.expReward} EXP
          </span>
          {quest.goldReward > 0 && (
            <div suppressHydrationWarning className="flex items-center gap-1 text-xs text-amber-400 font-mono font-bold bg-amber-950/20 border border-amber-500/20 px-2 py-0.5 rounded-lg">
              <CurrencyIcon type="GOLD" size="xs" />
              <span>+{quest.goldReward}g</span>
            </div>
          )}
        </div>

        {dueDateLabel && (
          <div
            className={`flex items-center gap-1 font-bold ${
              isOverdue ? "text-rose-400 animate-pulse" : "text-slate-400"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{dueDateLabel}</span>
          </div>
        )}
      </div>

      {/* Status Transition Controls */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
        {STATUS_PREV[quest.status] ? (
          <button
            onClick={() => updateQuestStatus(quest.id, STATUS_PREV[quest.status]!)}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            {STATUS_PREV[quest.status]}
          </button>
        ) : (
          <div />
        )}

        {STATUS_NEXT[quest.status] ? (
          <button
            onClick={() => updateQuestStatus(quest.id, STATUS_NEXT[quest.status]!)}
            className={`text-[11px] font-mono font-bold flex items-center gap-1 px-3 py-1 rounded-lg transition-all shadow-md ${
              STATUS_NEXT[quest.status] === "Completed"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/30"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
            }`}
          >
            <span>
              {STATUS_NEXT[quest.status] === "Completed" ? "Slay / Clear" : STATUS_NEXT[quest.status]}
            </span>
            <ChevronRight className="w-3 h-3" />
          </button>
        ) : (
          <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED
          </span>
        )}
      </div>

      {/* Edit Quest Modal */}
      <EditQuestModal
        quest={quest}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
};
