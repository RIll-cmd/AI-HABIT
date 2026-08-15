"use client";

import React, { useState, useEffect } from "react";
import {
  EnrichedExercise,
  LoggedSetInput,
  LogWorkoutPayload,
} from "@/features/workouts/types/muscleRecovery";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { useUser } from "@/context/UserContext";
import {
  Dumbbell,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Activity,
  Flame,
  Zap,
  Search,
  Trophy,
  Sparkles,
  Layers,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { playBattleSFX, playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { MuscleIndicatorBadge } from "./MuscleIndicatorBadge";

interface WorkoutLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialExerciseId?: string;
}

interface SetEntry {
  id: string;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

export const WorkoutLoggerModal: React.FC<WorkoutLoggerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialExerciseId,
}) => {
  const { user } = useUser();
  const characterId = user?.id || "guest-character";
  const {
    availableExercises,
    fetchAvailableExercises,
    logCompletedWorkout,
  } = useWorkoutStore();

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [weightUnit, setWeightUnit] = useState<"KG" | "LBS">("KG");
  const [sets, setSets] = useState<SetEntry[]>([
    { id: "set-1", weight: 60, reps: 10, rpe: 8.0, completed: true },
    { id: "set-2", weight: 65, reps: 8, rpe: 8.5, completed: true },
    { id: "set-3", weight: 70, reps: 6, rpe: 9.0, completed: true },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableExercises();
    }
  }, [isOpen, fetchAvailableExercises]);

  useEffect(() => {
    if (availableExercises.length > 0 && !selectedExerciseId) {
      if (initialExerciseId) {
        setSelectedExerciseId(initialExerciseId);
      } else {
        setSelectedExerciseId(availableExercises[0].id);
      }
    }
  }, [availableExercises, initialExerciseId, selectedExerciseId]);

  if (!isOpen) return null;

  const filteredExercises = availableExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedExercise =
    availableExercises.find((e) => e.id === selectedExerciseId) ||
    availableExercises[0];

  const handleAddSet = () => {
    playUIMenuSFX("click");
    const lastSet = sets[sets.length - 1];
    setSets((prev) => [
      ...prev,
      {
        id: `set-${Date.now()}`,
        weight: lastSet ? lastSet.weight : 50,
        reps: lastSet ? lastSet.reps : 10,
        rpe: lastSet ? lastSet.rpe : 8.0,
        completed: true,
      },
    ]);
  };

  const handleRemoveSet = (index: number) => {
    playUIMenuSFX("click");
    if (sets.length <= 1) return;
    setSets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSet = (
    index: number,
    field: keyof SetEntry,
    value: number | boolean
  ) => {
    setSets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedExercise) {
      toast.error("Please select an exercise");
      return;
    }

    const validSets = sets.filter((s) => s.completed && s.reps > 0);
    if (validSets.length === 0) {
      toast.error("Please log at least one completed set");
      return;
    }

    setIsSubmitting(true);
    playBattleSFX("crit");

    try {
      const payload: LogWorkoutPayload = {
        characterId,
        durationSeconds: durationMinutes * 60,
        sets: validSets.map((s) => ({
          exerciseId: selectedExercise.id,
          weight: weightUnit === "LBS" ? Math.round(s.weight * 0.453592) : s.weight,
          reps: s.reps,
          rpe: s.rpe,
        })),
        bodyweight: 75.0,
      };

      const result = await logCompletedWorkout(payload);
      playBuffSFX("buff");

      toast.success("Workout Telemetry Logged!", {
        description: `+${result.rewards?.exp ?? 150} EXP, +${
          result.rewards?.gold ?? 50
        } Gold, and muscle fatigue applied to ${selectedExercise.primaryMuscle}!`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to log workout session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-[#0E152E] via-[#091024] to-[#040815] border-2 border-cyan-500/40 p-6 sm:p-7 shadow-2xl overflow-hidden text-slate-100 space-y-6 max-h-[90vh] flex flex-col">
        {/* Background Atmosphere */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                TARGETED TRAINING DISPATCH
              </span>
              <h3 className="text-xl font-black font-heading text-white tracking-tight">
                Log Workout & Apply Fatigue
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Exercise Search & Selection Bar */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>SELECT TARGET EXERCISE</span>
              <span className="text-[10px] text-cyan-400 font-normal">
                {availableExercises.length} Exercises Loaded
              </span>
            </label>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, muscle (e.g. Chest, Quads, Back)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick Exercise Carousel/Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {filteredExercises.slice(0, 9).map((ex) => {
                const isSel = ex.id === selectedExerciseId;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      playUIMenuSFX("click");
                      setSelectedExerciseId(ex.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? "bg-cyan-950/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold font-sans text-white truncate">
                      {ex.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[9px] font-mono text-cyan-300 font-bold px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30">
                        {ex.primaryMuscle}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {ex.equipment}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Exercise Target Telemetry Preview */}
          {selectedExercise && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  ACTIVE TARGET MUSCLE
                </span>
                <span className="text-sm font-black font-heading text-white">
                  {selectedExercise.name}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  <MuscleIndicatorBadge
                    muscleKey={selectedExercise.primaryMuscle}
                    name={`Primary: ${selectedExercise.primaryMuscle}`}
                    size="sm"
                    status="FATIGUED"
                  />
                  {selectedExercise.secondaryMuscles?.map((sec) => (
                    <MuscleIndicatorBadge
                      key={sec}
                      muscleKey={sec}
                      name={`Assisting: ${sec}`}
                      size="sm"
                      status="RECOVERING"
                    />
                  ))}
                </div>
              </div>

              {/* Weight Unit & Duration Setting */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 p-0.5">
                  <button
                    onClick={() => setWeightUnit("KG")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      weightUnit === "KG"
                        ? "bg-cyan-500 text-slate-950"
                        : "text-slate-400"
                    }`}
                  >
                    KG
                  </button>
                  <button
                    onClick={() => setWeightUnit("LBS")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      weightUnit === "LBS"
                        ? "bg-cyan-500 text-slate-950"
                        : "text-slate-400"
                    }`}
                  >
                    LBS
                  </button>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-xl text-xs font-mono">
                  <span className="text-slate-400">Duration:</span>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) =>
                      setDurationMinutes(Math.max(5, parseInt(e.target.value) || 30))
                    }
                    className="w-10 bg-transparent text-cyan-300 font-bold text-center focus:outline-none"
                  />
                  <span className="text-slate-400">min</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Sets Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
              <span>SETS LOGGED</span>
              <span>{sets.length} Sets Total</span>
            </div>

            <div className="space-y-2">
              {sets.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10"
                >
                  <span className="w-6 text-center text-xs font-mono text-cyan-400 font-bold">
                    #{idx + 1}
                  </span>

                  {/* Weight Input */}
                  <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1">
                    <span className="text-[10px] font-mono text-slate-400">WT:</span>
                    <input
                      type="number"
                      value={s.weight}
                      onChange={(e) =>
                        handleUpdateSet(
                          idx,
                          "weight",
                          Math.max(0, parseFloat(e.target.value) || 0)
                        )
                      }
                      className="w-full bg-transparent font-mono text-sm font-bold text-white focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-slate-400">
                      {weightUnit}
                    </span>
                  </div>

                  {/* Reps Input */}
                  <div className="flex-1 flex items-center gap-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1">
                    <span className="text-[10px] font-mono text-slate-400">REPS:</span>
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) =>
                        handleUpdateSet(
                          idx,
                          "reps",
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-full bg-transparent font-mono text-sm font-bold text-white focus:outline-none"
                    />
                  </div>

                  {/* RPE Selector */}
                  <div className="w-20 flex items-center gap-1 bg-slate-950/80 border border-slate-700 rounded-xl px-2 py-1">
                    <span className="text-[10px] font-mono text-slate-400">RPE:</span>
                    <input
                      type="number"
                      step="0.5"
                      min="6.0"
                      max="10.0"
                      value={s.rpe}
                      onChange={(e) =>
                        handleUpdateSet(
                          idx,
                          "rpe",
                          parseFloat(e.target.value) || 8.0
                        )
                      }
                      className="w-full bg-transparent font-mono text-xs font-bold text-amber-300 focus:outline-none"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveSet(idx)}
                    disabled={sets.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSet}
              className="w-full h-9 rounded-xl border-dashed border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-950/30 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD ANOTHER SET
            </Button>
          </div>
        </div>

        {/* Footer / Submit Bar */}
        <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            Estimated XP:{" "}
            <span className="text-emerald-400 font-bold">
              +{sets.length * 50} EXP
            </span>{" "}
            • Boss Damage:{" "}
            <span className="text-cyan-300 font-bold">Applied</span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-11 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              "PROCESSING..."
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                COMPLETE & APPLY FATIGUE
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
