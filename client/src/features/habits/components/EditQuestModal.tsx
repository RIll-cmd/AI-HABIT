import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { KanbanQuest, QuestRank, QuestStatus, QuestSubtask } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import {
  PixelXIcon,
  PixelPlusIcon,
  PixelTrashIcon,
  PixelPushpinIcon,
  PixelPencilIcon,
} from "@/components/ui/pixel/PixelIcons";

export interface EditQuestModalProps {
  quest: KanbanQuest;
  isOpen: boolean;
  onClose: () => void;
}

export const EditQuestModal: React.FC<EditQuestModalProps> = ({
  quest,
  isOpen,
  onClose,
}) => {
  const { updateQuest } = useKanbanMissionStore();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState(quest.title);
  const [description, setDescription] = useState(quest.description || "");
  const [rank, setRank] = useState<QuestRank>(quest.rank);
  const [status, setStatus] = useState<QuestStatus>(quest.status);
  const [category, setCategory] = useState(quest.category || "General");
  const [tagsInput, setTagsInput] = useState(quest.tags ? quest.tags.join(", ") : "");
  const [dueDate, setDueDate] = useState(
    quest.dueDate ? new Date(quest.dueDate).toISOString().split("T")[0] : ""
  );
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<QuestSubtask[]>(quest.subtasks || []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitle(quest.title);
      setDescription(quest.description || "");
      setRank(quest.rank);
      setStatus(quest.status);
      setCategory(quest.category || "General");
      setTagsInput(quest.tags ? quest.tags.join(", ") : "");
      setDueDate(quest.dueDate ? new Date(quest.dueDate).toISOString().split("T")[0] : "");
      setSubtasks(quest.subtasks || []);
    }
  }, [isOpen, quest]);

  if (!isOpen || !mounted) return null;

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

  const handleToggleSubtask = (id: string) => {
    playUIMenuSFX();
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, isCompleted: !st.isCompleted } : st))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    playUIMenuSFX();
    setSubtasks(subtasks.filter((st) => st.id !== id));
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs font-pixel select-none">
      <div className="relative pixel-parchment-royal border-4 border-[#381e0f] shadow-[0_12px_28px_rgba(0,0,0,0.8)] p-5 sm:p-6 w-full max-w-lg text-[#261408] space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Top Pushpin */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <PixelPushpinIcon className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#8a572c]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#ebd099] border-2 border-[#542d17] flex items-center justify-center text-[#542d17]">
              <PixelPencilIcon className="w-4 h-4 text-[#542d17]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#261408]">
                Edit Mission Directive
              </h3>
              <p className="text-[10px] text-[#7a4820] uppercase font-bold">Mission Adjustment</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playUIMenuSFX();
              onClose();
            }}
            className="w-6 h-6 bg-[#ebd099] border border-[#542d17] hover:bg-[#dfba79] flex items-center justify-center text-[#542d17] cursor-pointer active:translate-y-0.5"
            title="Close"
          >
            <PixelXIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Title Input */}
          <div>
            <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
              MISSION TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
            />
          </div>

          {/* Status & Rank Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                MISSION STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuestStatus)}
                className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] focus:outline-none cursor-pointer text-xs font-bold shadow-[inset_1px_1px_0_0_#d4a373]"
              >
                <option value="To Do">Pending (To Do)</option>
                <option value="In Progress">Active (In Progress)</option>
                <option value="Review">Verification (Review)</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                MISSION RANK *
              </label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as QuestRank)}
                className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] focus:outline-none cursor-pointer text-xs font-bold shadow-[inset_1px_1px_0_0_#d4a373]"
              >
                <option value="F">F-Rank</option>
                <option value="D">D-Rank</option>
                <option value="C">C-Rank</option>
                <option value="B">B-Rank</option>
                <option value="A">A-Rank</option>
                <option value="S">S-Rank</option>
              </select>
            </div>
          </div>

          {/* Category & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                CATEGORY
              </label>
              <input
                type="text"
                placeholder="Fitness, Code, Main Quest"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
              />
            </div>

            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                DUE DATE
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] focus:outline-none cursor-pointer text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
              />
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
              HASHTAGS
            </label>
            <input
              type="text"
              placeholder="#workout, #daily"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
              MISSION DESCRIPTION / NOTES
            </label>
            <textarea
              rows={2}
              placeholder="Key objectives, success criteria, or action notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
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
                className="flex-1 bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
              />
              <PixelButton
                type="button"
                size="sm"
                variant="gold"
                onClick={handleAddSubtask}
                className="text-xs"
              >
                <PixelPlusIcon className="w-3 h-3 mr-1" />
                Add
              </PixelButton>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 bg-[#f4e0b2] p-2.5 border-2 border-[#542d17] max-h-32 overflow-y-auto">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between text-xs text-[#261408] px-2 py-1 bg-[#ebd099] border border-[#a8743e]"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(st.id)}
                      className={`text-left cursor-pointer flex items-center gap-1.5 flex-1 ${
                        st.isCompleted ? "line-through text-[#6e7d62]" : "text-[#261408]"
                      }`}
                    >
                      <span className="text-[10px]">{st.isCompleted ? "☑" : "☐"}</span>
                      <span className="truncate">{st.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-red-700 hover:text-red-900 cursor-pointer p-0.5"
                    >
                      <PixelTrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-[#8a572c]/40">
            <PixelButton
              type="button"
              variant="dark"
              size="md"
              onClick={() => {
                playUIMenuSFX();
                onClose();
              }}
              className="text-xs"
            >
              Cancel
            </PixelButton>

            <PixelButton type="submit" variant="gold" size="md" className="text-xs">
              Update Mission
            </PixelButton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
