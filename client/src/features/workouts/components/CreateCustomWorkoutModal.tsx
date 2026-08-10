"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWorkoutStore, ExerciseDefinition } from "../store/useWorkoutStore";
import { Dumbbell, Plus, Check, Trash2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

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
        const res = await fetch("http://127.0.0.1:8000/api/workouts/exercises");
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
    toast.success(`Custom plan "${planName}" created successfully!`);

    // Reset and close
    setPlanName("");
    setTargetFocus("");
    setSelectedExercises([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#0B1020] border border-cyan-500/40 text-slate-100 font-sans shadow-2xl overflow-hidden p-6">
        <DialogHeader className="border-b border-slate-800 pb-3">
          <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-cyan-400" />
            Create Custom Workout Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 max-h-[65vh] overflow-y-auto pr-1">
          {/* Plan Name & Target Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Routine Name
              </label>
              <Input
                placeholder="e.g. Upper Body Hypertrophy"
                className="bg-slate-950 border-slate-800 font-sans text-sm text-white"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Target Muscle Focus (Optional)
              </label>
              <Input
                placeholder="e.g. Chest • Shoulders • Arms"
                className="bg-slate-950 border-slate-800 font-sans text-sm text-white"
                value={targetFocus}
                onChange={(e) => setTargetFocus(e.target.value)}
              />
            </div>
          </div>

          {/* Selected Exercises Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Selected Exercises ({selectedExercises.length})
              </span>
              {selectedExercises.length > 0 && (
                <button
                  onClick={() => setSelectedExercises([])}
                  className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase"
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedExercises.length === 0 ? (
              <div className="p-3 bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500 font-mono">
                Click exercises below to add them to this routine plan.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                {selectedExercises.map((ex) => (
                  <Badge
                    key={ex.id}
                    className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5 px-2.5 py-1 text-xs"
                  >
                    <span>{ex.name}</span>
                    <button
                      onClick={() => toggleSelectExercise(ex)}
                      className="hover:text-red-400 text-slate-400 ml-1"
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
            <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Exercise Library Catalog
            </span>

            {isLoading ? (
              <div className="text-center p-6 text-slate-500 text-xs font-mono">Loading Catalog...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {availableCatalog.map((ex) => {
                  const isSelected = !!selectedExercises.find((e) => e.id === ex.id);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => toggleSelectExercise(ex)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-cyan-950/50 border-cyan-500/60 text-white shadow-md shadow-cyan-950/40"
                          : "bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{ex.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {ex.primaryMuscle} • {ex.equipment}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs font-bold ${
                          isSelected
                            ? "bg-cyan-500 text-slate-950 border-cyan-400"
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

        <DialogFooter className="border-t border-slate-800 pt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleSavePlan}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-6 uppercase tracking-wider text-xs shadow-lg shadow-cyan-900/30"
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
