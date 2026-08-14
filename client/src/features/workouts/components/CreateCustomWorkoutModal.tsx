"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWorkoutStore, ExerciseDefinition } from "../store/useWorkoutStore";
import { Dumbbell, Plus, Check, Trash2, Sparkles, X, Activity, Layers } from "lucide-react";
import { toast } from "sonner";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { playUIMenuSFX, playBuffSFX } from "@/utils/audio";
import { API_BASE_URL } from "@/constants";

interface CreateCustomWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCustomWorkoutModal({ isOpen, onClose }: CreateCustomWorkoutModalProps) {
  const { addCustomTemplate } = useWorkoutStore();
  const [planName, setPlanName] = useState("");
  const [targetFocus, setTargetFocus] = useState("");
  const [availableCatalog, setAvailableCatalog] = useState<ExerciseDefinition[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/workouts/exercises`);
        if (res.ok) {
          const data = await res.json();
          setAvailableCatalog(data);
        } else {
          setAvailableCatalog(DEFAULT_CATALOG);
        }
      } catch (e) {
        setAvailableCatalog(DEFAULT_CATALOG);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, [isOpen]);

  const toggleSelectExercise = (exercise: ExerciseDefinition) => {
    playUIMenuSFX("hover");
    if (selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises((prev) => prev.filter((e) => e.id !== exercise.id));
    } else {
      setSelectedExercises((prev) => [...prev, exercise]);
    }
  };

  const handleSavePlan = () => {
    if (!planName.trim()) {
      toast.error("Please enter a routine name for your custom plan.");
      return;
    }
    if (selectedExercises.length === 0) {
      toast.error("Select at least 1 exercise for your custom plan.");
      return;
    }

    const defaultTarget = selectedExercises
      .map((e) => e.primaryMuscle)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(" • ");

    addCustomTemplate(planName, targetFocus.trim() || defaultTarget, selectedExercises);
    playBuffSFX("buff");
    toast.success(`Custom plan "${planName}" created successfully!`);

    // Reset and close
    setPlanName("");
    setTargetFocus("");
    setSelectedExercises([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-gradient-to-br from-[#0C1226]/98 via-[#080E20]/98 to-[#050914]/98 border border-cyan-500/40 text-slate-100 font-sans shadow-2xl overflow-hidden p-6 backdrop-blur-2xl rounded-[24px]">
        {/* Floating Runes */}
        <FloatingRuneField density="low" className="opacity-40" />

        <DialogHeader className="border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight text-white flex items-center gap-2 font-heading">
                Create Custom Workout Plan
              </DialogTitle>
              <p className="text-xs text-slate-400 font-mono">
                Assemble custom exercise protocols and target muscle chains
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 max-h-[60vh] overflow-y-auto pr-1 relative z-10 custom-scrollbar">
          {/* Plan Name & Target Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Routine Name
              </label>
              <Input
                placeholder="e.g. Upper Body Hypertrophy"
                className="bg-[#050914] border-slate-800 focus:border-cyan-500/60 font-sans text-sm text-white rounded-xl placeholder:text-slate-600"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" />
                Target Muscle Focus (Optional)
              </label>
              <Input
                placeholder="e.g. Chest • Shoulders • Arms"
                className="bg-[#050914] border-slate-800 focus:border-cyan-500/60 font-sans text-sm text-white rounded-xl placeholder:text-slate-600"
                value={targetFocus}
                onChange={(e) => setTargetFocus(e.target.value)}
              />
            </div>
          </div>

          {/* Selected Exercises Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <Layers className="w-3.5 h-3.5" />
                Selected Exercises ({selectedExercises.length})
              </span>
              {selectedExercises.length > 0 && (
                <button
                  onClick={() => {
                    playUIMenuSFX("decline");
                    setSelectedExercises([]);
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedExercises.length === 0 ? (
              <div className="p-4 bg-[#050914]/80 border border-dashed border-slate-800/80 rounded-xl text-center text-xs text-slate-500 font-mono">
                Click exercises below in the library to assemble your routine.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 bg-[#050914]/80 border border-cyan-500/20 rounded-xl">
                {selectedExercises.map((ex) => (
                  <Badge
                    key={ex.id}
                    className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5 px-3 py-1 text-xs shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  >
                    <span>{ex.name}</span>
                    <button
                      onClick={() => toggleSelectExercise(ex)}
                      className="hover:text-red-400 text-slate-400 ml-1 cursor-pointer transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Catalog Selection List */}
          <div>
            <span className="block text-[10.5px] font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
              Exercise Library Catalog
            </span>

            {isLoading ? (
              <div className="text-center p-6 text-slate-500 text-xs font-mono">Loading Catalog...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {availableCatalog.map((ex) => {
                  const isSelected = !!selectedExercises.find((e) => e.id === ex.id);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => toggleSelectExercise(ex)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-[#050914]/90 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold font-sans">{ex.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {ex.primaryMuscle} • {ex.equipment}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_8px_#06b6d4]"
                            : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-cyan-500/20 pt-4 flex justify-end gap-2 relative z-10">
          <Button
            variant="ghost"
            onClick={() => {
              playUIMenuSFX("decline");
              onClose();
            }}
            className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePlan}
            className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold px-6 uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer rounded-xl"
          >
            Save Custom Routine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const DEFAULT_CATALOG: ExerciseDefinition[] = [
  { id: "ex1", name: "Barbell Bench Press", primaryMuscle: "Chest", equipment: "Barbell" },
  { id: "ex2", name: "Barbell Back Squat", primaryMuscle: "Legs", equipment: "Barbell" },
  { id: "ex3", name: "Barbell Deadlift", primaryMuscle: "Back", equipment: "Barbell" },
  { id: "ex4", name: "Overhead Barbell Press", primaryMuscle: "Shoulders", equipment: "Barbell" },
  { id: "ex5", name: "Dumbbell Bicep Curl", primaryMuscle: "Arms", equipment: "Dumbbell" },
  { id: "ex6", name: "Lat Pulldown", primaryMuscle: "Back", equipment: "Cable" },
];

