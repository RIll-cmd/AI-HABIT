"use client";

import React from "react";
import {
  CheckCircle2,
  Check,
  Clock,
  Award,
  Zap,
  Coins,
  Star,
  Tag,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { KanbanQuest, QuestRank } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { toast } from "sonner";

export interface DashboardQuestCardProps {
  quest: KanbanQuest;
}

const RANK_ACCENTS: Record<QuestRank, { border: string; text: string; bg: string; gradient: string }> = {
  S: {
    border: "border-amber-500/40",
    text: "text-amber-400",
    bg: "bg-amber-950/40",
    gradient: "from-amber-500 via-yellow-400 to-amber-500",
  },
  A: {
    border: "border-purple-500/40",
    text: "text-purple-300",
    bg: "bg-purple-950/40",
    gradient: "from-purple-500 via-pink-400 to-purple-500",
  },
  B: {
    border: "border-blue-500/40",
    text: "text-blue-300",
    bg: "bg-blue-950/40",
    gradient: "from-blue-500 via-indigo-400 to-blue-500",
  },
  C: {
    border: "border-cyan-500/40",
    text: "text-cyan-300",
    bg: "bg-cyan-950/40",
    gradient: "from-cyan-500 via-teal-400 to-cyan-500",
  },
  D: {
    border: "border-emerald-500/40",
    text: "text-emerald-300",
    bg: "bg-emerald-950/40",
    gradient: "from-emerald-500 via-green-400 to-emerald-500",
  },
  F: {
    border: "border-slate-700",
    text: "text-slate-400",
    bg: "bg-slate-900/60",
    gradient: "from-slate-600 via-slate-500 to-slate-600",
  },
};

export const DashboardQuestCard: React.FC<DashboardQuestCardProps> = ({ quest }) => {
  const { updateQuestStatus } = useKanbanMissionStore();
  const isCompleted = quest.status === "Completed";
  const rankStyle = RANK_ACCENTS[quest.rank] || RANK_ACCENTS.C;

  // Subtask progress
  const totalSubtasks = quest.subtasks?.length || 0;
  const completedSubtasks = quest.subtasks?.filter((st) => st.isCompleted).length || 0;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuestStatus(quest.id, "Completed");
    toast.success(`Mission Cleared: ${quest.title}! +${quest.expReward} EXP, +${quest.goldReward}g`);
  };

  return (
    <Card
      className={`bg-[#0a1024]/90 border-cyan-500/10 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] relative overflow-hidden rounded-2xl sweep-light ${
        isCompleted
          ? "border-emerald-500/30 bg-emerald-950/15 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : ""
      }`}
    >
      {/* Top Animated Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${
            isCompleted ? "from-emerald-500 via-emerald-400 to-emerald-500" : rankStyle.gradient
          } animate-gradient-shift`}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      <CardContent className="p-4 pt-5 space-y-3 relative z-10">
        {/* Header Badges & Title */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={`text-[10px] font-mono font-bold ${rankStyle.bg} ${rankStyle.border} ${rankStyle.text}`}
              >
                {quest.rank}-RANK
              </Badge>
              <Badge
                variant="outline"
                className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 text-[10px]"
              >
                {quest.category || "Mission"}
              </Badge>
              {quest.tags &&
                quest.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-cyan-500/20 text-cyan-300 bg-cyan-950/30 text-[9.5px] font-mono px-1.5 py-0"
                  >
                    #{tag}
                  </Badge>
                ))}
            </div>

            <h3
              className={`font-semibold text-sm tracking-tight leading-snug break-words transition-colors ${
                isCompleted ? "text-slate-400 line-through" : "text-white"
              }`}
            >
              {quest.title}
            </h3>

            {quest.description && (
              <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                {quest.description}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div>
            {isCompleted ? (
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CLEARED</span>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
                {quest.status}
              </span>
            )}
          </div>
        </div>

        {/* Subtask checklist progress bar if subtasks exist */}
        {totalSubtasks > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <ListTodo className="w-3 h-3 text-cyan-400" />
                Checklist ({completedSubtasks}/{totalSubtasks})
              </span>
              <span>{subtaskPercent}%</span>
            </div>
            <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${subtaskPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Rewards & Quick Action Bar */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-white/5">
          {/* Rewards */}
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
            <span className="text-cyan-300 flex items-center gap-1 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
              <CurrencyIcon type="EXP" size="xs" /> +{quest.expReward} EXP
            </span>
            <span className="text-amber-300 flex items-center gap-1 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
              <CurrencyIcon type="GOLD" size="xs" /> +{quest.goldReward}g
            </span>
            {quest.statReward && (
              <span className="text-cyan-300 flex items-center gap-0.5 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/20">
                <Star className="w-3 h-3 text-cyan-400" /> +{quest.statReward.amount}{" "}
                {quest.statReward.stat.slice(0, 3).toUpperCase()}
              </span>
            )}
          </div>

          {/* Action Button */}
          {!isCompleted && (
            <Button
              size="sm"
              onClick={handleComplete}
              className="h-7 text-[11px] font-mono font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg px-3 shadow-md shadow-indigo-950/40"
            >
              <Check className="w-3 h-3 mr-1" /> Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
