import React, { useState, useEffect } from "react";
import { X, Save, Target, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { KanbanQuest, QuestRank, QuestStatus, QuestSubtask } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";

export interface EditQuestModalProps {
  quest: KanbanQuest;
  isOpen: boolean;
  onClose: () => void;
}

export const EditQuestModal: React.FC<EditQuestModalProps> = ({ quest, isOpen, onClose }) => {
  const { updateQuest } = useKanbanMissionStore();

  const [title, setTitle] = useState(quest.title);
  const [description, setDescription] = useState(quest.description || "");
  const [rank, setRank] = useState<QuestRank>(quest.rank);
  const [category, setCategory] = useState(quest.category || "General");
  const [tagsInput, setTagsInput] = useState((quest.tags || []).join(", "));
  const [status, setStatus] = useState<QuestStatus>(quest.status);
  const [dueDate, setDueDate] = useState(
    quest.dueDate ? new Date(quest.dueDate).toISOString().substring(0, 10) : ""
  );

  const [subtasks, setSubtasks] = useState<QuestSubtask[]>(quest.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState("");

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.description || "");
      setRank(quest.rank);
      setCategory(quest.category || "General");
      setTagsInput((quest.tags || []).join(", "));
      setStatus(quest.status);
      setDueDate(quest.dueDate ? new Date(quest.dueDate).toISOString().substring(0, 10) : "");
      setSubtasks(quest.subtasks || []);
    }
  }, [quest]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    playUIMenuSFX();
    const newSt: QuestSubtask = {
      id: `st-${Date.now()}-${subtasks.length}`,
      title: subtaskInput.trim(),
      isCompleted: false,
    };
    setSubtasks([...subtasks, newSt]);
    setSubtaskInput("");
  };

  const handleRemoveSubtask = (id: string) => {
    playUIMenuSFX();
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    playUIMenuSFX();
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, isCompleted: !st.isCompleted } : st))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    const expMap: Record<QuestRank, number> = {
      S: 500,
      A: 350,
      B: 250,
      C: 150,
      D: 100,
      F: 50,
    };
    const goldMap: Record<QuestRank, number> = {
      S: 150,
      A: 90,
      B: 65,
      C: 40,
      D: 25,
      F: 15,
    };

    updateQuest(quest.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      rank,
      category: category.trim() || "General",
      tags: parsedTags,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      subtasks,
      expReward: expMap[rank] || quest.expReward || 150,
      goldReward: goldMap[rank] || quest.goldReward || 40,
    });

    playBuffSFX();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-[#0C1226]/98 via-[#080E20]/98 to-[#050914]/98 border border-cyan-500/30 rounded-[28px] p-6 sm:p-7 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-slate-100 space-y-5 animate-in zoom-in-95 duration-200 backdrop-blur-2xl overflow-hidden">
        {/* Top Glow Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-heading text-white tracking-tight">
                Edit Directive
              </h3>
              <p className="text-[10.5px] font-mono text-slate-400">System Kanban Mission Engine</p>
            </div>
          </div>

          <button
            onClick={() => {
              playUIMenuSFX();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Title Input */}
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
              DIRECTIVE TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Daily High-Volume Compound Lifts — Bench 80kg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all font-sans text-xs"
            />
          </div>

          {/* Status & Rank Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                SWIMLANE STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuestStatus)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-white focus:outline-none cursor-pointer transition-all"
              >
                <option value="To Do">To Do (Pending)</option>
                <option value="In Progress">In Progress (Active)</option>
                <option value="Review">Review (Verification)</option>
                <option value="Completed">Completed (Cleared)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                THREAT RANK *
              </label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as QuestRank)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-white focus:outline-none cursor-pointer transition-all"
              >
                <option value="F">F-Rank (+50 EXP, +15g)</option>
                <option value="D">D-Rank (+100 EXP, +25g)</option>
                <option value="C">C-Rank (+150 EXP, +40g)</option>
                <option value="B">B-Rank (+250 EXP, +65g)</option>
                <option value="A">A-Rank (+350 EXP, +90g)</option>
                <option value="S">S-Rank (+500 EXP, +150g)</option>
              </select>
            </div>
          </div>

          {/* Category & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                CATEGORY
              </label>
              <input
                type="text"
                placeholder="e.g., Fitness, Code, Main Quest"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
                DUE DATE
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-white focus:outline-none cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
              HASHTAGS
            </label>
            <input
              type="text"
              placeholder="#workout, #daily"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
              DESCRIPTION / DIRECTIVE LOG
            </label>
            <textarea
              rows={2}
              placeholder="Directive objectives, target metrics, or operational protocol..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none transition-all font-sans text-xs"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold uppercase text-[10px] tracking-wider">
              SUBTASK CHECKLIST
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 bg-[#060B18] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 px-4 py-2 rounded-xl font-bold cursor-pointer transition-all active:scale-95"
              >
                + Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 bg-[#060B18] p-3 rounded-xl border border-cyan-500/15 max-h-32 overflow-y-auto custom-scrollbar">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between text-[11px] text-slate-300 px-2 py-1 rounded-lg bg-slate-900/60"
                  >
                    <span
                      onClick={() => handleToggleSubtask(st.id)}
                      className={`cursor-pointer font-sans select-none flex items-center gap-1.5 ${
                        st.isCompleted ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      <span className={st.isCompleted ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        {st.isCompleted ? "✓" : "○"}
                      </span>
                      <span>{st.title}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3.5 border-t border-cyan-500/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                playUIMenuSFX();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Directive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

