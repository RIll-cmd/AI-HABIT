import React, { useState } from "react";
import { X, Plus, Sparkles, Target, Award, Calendar, Tag } from "lucide-react";
import { QuestRank, QuestStatus } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";

export interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ isOpen, onClose }) => {
  const { addQuest } = useKanbanMissionStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rank, setRank] = useState<QuestRank>("C");
  const [category, setCategory] = useState("Main Quest");
  const [tagsInput, setTagsInput] = useState("#daily");
  const [dueDate, setDueDate] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, subtaskInput.trim()]);
    setSubtaskInput("");
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    addQuest({
      characterId: "char-id-123",
      title: title.trim(),
      description: description.trim() || undefined,
      status: "To Do",
      rank,
      category: category.trim() || "General",
      tags: parsedTags,
      subtasks: subtasks.map((st, i) => ({ id: `st-${Date.now()}-${i}`, title: st, isCompleted: false })),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      expReward: 0,
      goldReward: 0,
      statReward: { stat: "discipline", amount: 1 },
    });

    // Reset and close
    setTitle("");
    setDescription("");
    setRank("C");
    setSubtasks([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#151C33] border border-blue-500/30 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Construct Custom Quest</h3>
              <p className="text-[11px] font-mono text-slate-400">System Kanban Mission Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Title Input */}
          <div>
            <label className="block text-slate-300 mb-1 font-bold">QUEST TITLE *</label>
            <input
              type="text"
              required
              placeholder="e.g., Daily Gym Overload — Bench 80kg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Rank & Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">QUEST RANK *</label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as QuestRank)}
                className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="F">F-Rank (50 EXP, 15g)</option>
                <option value="D">D-Rank (100 EXP, 25g)</option>
                <option value="C">C-Rank (150 EXP, 40g)</option>
                <option value="B">B-Rank (250 EXP, 65g)</option>
                <option value="A">A-Rank (350 EXP, 90g)</option>
                <option value="S">S-Rank (500 EXP, 150g)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">CATEGORY</label>
              <input
                type="text"
                placeholder="e.g., Fitness, Code, Main Quest"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Hashtags & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">HASHTAGS</label>
              <input
                type="text"
                placeholder="#workout, #daily"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">DUE DATE</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 mb-1 font-bold">DESCRIPTION</label>
            <textarea
              rows={2}
              placeholder="Quest objectives, target metrics, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0B1020] border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Subtasks Builder */}
          <div>
            <label className="block text-slate-300 mb-1 font-bold">SUBTASK CHECKLIST</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subtask item..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 bg-[#0B1020] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-3 py-1.5 rounded-xl font-bold border border-blue-500/40"
              >
                Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1 bg-[#0B1020] p-2 rounded-xl border border-slate-800">
                {subtasks.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300 px-2 py-0.5">
                    <span>• {st}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/30"
            >
              Construct Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
