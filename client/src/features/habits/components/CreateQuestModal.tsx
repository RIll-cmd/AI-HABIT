import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { QuestRank } from "../types/kanban";
import { useKanbanMissionStore } from "../store/useKanbanMissionStore";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import {
  PixelXIcon,
  PixelPlusIcon,
  PixelTrashIcon,
  PixelPushpinIcon,
  PixelSwordIcon,
} from "@/components/ui/pixel/PixelIcons";

export interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDueDate?: string;
}

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({
  isOpen,
  onClose,
  initialDueDate,
}) => {
  const { addQuest } = useKanbanMissionStore();

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rank, setRank] = useState<QuestRank>("C");
  const [category, setCategory] = useState("Main Quest");
  const [tagsInput, setTagsInput] = useState("#daily");
  const [dueDate, setDueDate] = useState(initialDueDate || "");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && initialDueDate) {
      setDueDate(initialDueDate);
    }
  }, [isOpen, initialDueDate]);

  if (!isOpen || !mounted) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    playUIMenuSFX();
    setSubtasks([...subtasks, subtaskInput.trim()]);
    setSubtaskInput("");
  };

  const handleRemoveSubtask = (index: number) => {
    playUIMenuSFX();
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
      expReward: expMap[rank] || 150,
      goldReward: goldMap[rank] || 40,
      statReward: { stat: "discipline", amount: 1 },
    });

    playBuffSFX();

    // Reset and close
    setTitle("");
    setDescription("");
    setRank("C");
    setSubtasks([]);
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
              <PixelSwordIcon className="w-4 h-4 text-[#542d17]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#261408]">
                Create New Mission
              </h3>
              <p className="text-[10px] text-[#7a4820] uppercase font-bold">Quest Board Directive</p>
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
              placeholder="e.g., Deep Focus Sprint (2-Hour Coding Session)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
            />
          </div>

          {/* Rank & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                MISSION RANK *
              </label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value as QuestRank)}
                className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] focus:outline-none cursor-pointer text-xs font-bold shadow-[inset_1px_1px_0_0_#d4a373]"
              >
                <option value="F">F-Rank (+50 EXP, +15g)</option>
                <option value="D">D-Rank (+100 EXP, +25g)</option>
                <option value="C">C-Rank (+150 EXP, +40g)</option>
                <option value="B">B-Rank (+250 EXP, +65g)</option>
                <option value="A">A-Rank (+350 EXP, +90g)</option>
                <option value="S">S-Rank (+500 EXP, +150g)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                CATEGORY
              </label>
              <input
                type="text"
                placeholder="Deep Work, Fitness, Learning"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#fcedc7] border-2 border-[#542d17] focus:border-amber-700 p-2 text-[#261408] placeholder-[#8a572c]/60 focus:outline-none text-xs shadow-[inset_1px_1px_0_0_#d4a373]"
              />
            </div>
          </div>

          {/* Hashtags & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
                HASHTAGS
              </label>
              <input
                type="text"
                placeholder="#daily, #focus"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
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

          {/* Subtask Checklist Section */}
          <div>
            <label className="block text-[#4a2e1b] mb-1 font-bold uppercase text-[10px] tracking-wider">
              SUBTASK CHECKLIST
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add checklist step..."
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
                {subtasks.map((st, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-[#261408] gap-2">
                    <span className="truncate">▪ {st}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(i)}
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
              size="sm"
              onClick={() => {
                playUIMenuSFX();
                onClose();
              }}
              className="text-xs"
            >
              Cancel
            </PixelButton>

            <PixelButton type="submit" variant="gold" size="sm" className="text-xs">
              Pin Mission to Board
            </PixelButton>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
