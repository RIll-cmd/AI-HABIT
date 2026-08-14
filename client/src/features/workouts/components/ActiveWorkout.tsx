"use client";

import { useState, useEffect } from "react";
import { useWorkoutStore, ExerciseDefinition } from "../store/useWorkoutStore";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RestTimer } from "./RestTimer";
import { VoiceLogger } from "./VoiceLogger";
import {
  Plus,
  Timer,
  Check,
  Loader2,
  Dumbbell,
  Sparkles,
  Target,
  Zap,
  Swords,
  Flame,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { calculateE1RM, evaluateRank } from "../utils/rankEngine";
import confetti from "canvas-confetti";
import { API_BASE_URL } from "@/constants";
import { playAIRASound, playBattleSFX, playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";

export function ActiveWorkout() {
  const {
    isWorkoutActive,
    sessionId,
    startTime,
    endWorkout,
    exercises,
    addExercise,
    sets,
    logSet,
    startRestTimer,
  } = useWorkoutStore();
  const { user, refetch } = useUser();
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [activeBoss, setActiveBoss] = useState<any>(null);

  // Local state for the current inputs of each exercise
  const [inputs, setInputs] = useState<Record<string, { weight: string; reps: string; rpe: string }>>({});
  const [overloads, setOverloads] = useState<Record<string, any>>({});
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);

  // Fetch cataloged exercises from backend
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/workouts/exercises`);
        if (res.ok) {
          const data = await res.json();
          setAvailableExercises(data);
        } else {
          setAvailableExercises(FALLBACK_EXERCISES);
        }
      } catch (e) {
        setAvailableExercises(FALLBACK_EXERCISES);
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchCatalog();
  }, []);

  // Fetch active boss data
  useEffect(() => {
    if (!user?.id || !isWorkoutActive) return;
    const fetchBoss = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/fitness/boss/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.isDefeated) {
            setActiveBoss(data);
          }
        }
      } catch (e) {}
    };
    fetchBoss();
  }, [user?.id, isWorkoutActive]);

  // Fetch Overload Data when exercises change
  useEffect(() => {
    if (!isWorkoutActive || exercises.length === 0 || !user?.id) return;

    const fetchOverloads = async () => {
      try {
        const exIds = exercises.map((e) => e.id);
        const res = await fetch(`${API_BASE_URL}/api/fitness/overload-batch/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseIds: exIds }),
        });
        if (res.ok) {
          const data = await res.json();
          setOverloads(data);
        }
      } catch (e) {
        console.error("Failed to load overload recommendations", e);
      }
    };

    fetchOverloads();
  }, [exercises, isWorkoutActive, user?.id]);

  // Timer interval
  useEffect(() => {
    if (!isWorkoutActive) return;
    const start = startTime || Date.now();
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkoutActive, startTime]);

  const handleLogSet = (exercise: ExerciseDefinition) => {
    const input = inputs[exercise.id] || { weight: "", reps: "", rpe: "" };
    const w = parseFloat(input.weight);
    const r = parseInt(input.reps, 10);
    const rpe = input.rpe ? parseFloat(input.rpe) : undefined;

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
      toast.error("Please enter valid weight and reps.");
      return;
    }

    playBattleSFX("impact");

    logSet({
      exerciseId: exercise.id,
      weight: w,
      reps: r,
      rpe,
    });

    const e1rm = calculateE1RM(w, r);
    const rankInfo = evaluateRank(e1rm, exercise.name);

    toast.success(
      <div className="flex items-center gap-2 font-mono">
        <span>
          Set logged: {w}kg × {r} ({e1rm}kg e1RM)
        </span>
        <Badge className={`${rankInfo.badgeBg} ${rankInfo.badgeBorder} border font-bold text-xs uppercase px-2`}>
          {rankInfo.rank} RANK
        </Badge>
      </div>
    );

    // Clear inputs for this exercise (keep weight for convenience)
    setInputs((prev) => ({
      ...prev,
      [exercise.id]: { ...prev[exercise.id], reps: "" },
    }));

    // Trigger rest timer
    startRestTimer(90);
  };

  const handleVoiceParse = async (text: string) => {
    if (!sessionId) return;
    setIsVoiceProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${sessionId}/log-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const data = await res.json();

        // Ensure exercise is in active session
        if (!exercises.find((e) => e.id === data.exerciseId)) {
          addExercise(data.exercise);
        }

        // Add to local state
        logSet({
          exerciseId: data.exerciseId,
          weight: data.weight,
          reps: data.reps,
          rpe: data.rpe,
        });

        // Auto-fill the input fields for next set
        setInputs((prev) => ({
          ...prev,
          [data.exerciseId]: {
            weight: data.weight.toString(),
            reps: "",
            rpe: data.rpe ? data.rpe.toString() : "",
          },
        }));

        playBattleSFX("impact");
        toast.success(`Voice Logged: ${data.exercise.name} - ${data.weight}kg × ${data.reps}`);
      } else {
        const err = await res.json();
        toast.error(`Voice error: ${err.detail}`);
      }
    } catch (e) {
      toast.error("Failed to process voice log.");
    } finally {
      setIsVoiceProcessing(false);
    }
  };

  const handleFinishWorkout = async () => {
    if (sets.length === 0) {
      toast.error("Log at least one set before finishing.");
      return;
    }

    setIsSubmitting(true);
    playBuffSFX("levelup");
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${sessionId}/finish`, {
        method: "POST",
      });

      if (res.ok) {
        const result = await res.json();

        if (result.newPRs && result.newPRs.length > 0) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          playAIRASound("SUCCESSFUL");
          toast.success(`New PRs Achieved! ${result.newPRs.length} PRs broken!`);
        }
        if (result.bossDefeated) {
          confetti({
            particleCount: 150,
            spread: 100,
            colors: ["#fbbf24", "#f59e0b", "#b45309"],
            origin: { y: 0.5 },
          });
          playAIRASound("ABILITIES_IMPROVED");
          toast.success("WEEKLY BOSS DEFEATED! Massive rewards earned!");
        } else {
          toast.success("Workout session complete! Rewards applied.");
        }

        await refetch();
        endWorkout();
      } else {
        toast.error("Failed to log workout to server.");
      }
    } catch (e) {
      toast.error("Network error while logging workout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!isWorkoutActive) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#040714]/95 backdrop-blur-2xl overflow-y-auto pb-28 font-sans">
      {/* Background Floating Runes */}
      <FloatingRuneField density="medium" className="opacity-40" />

      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 pt-6 animate-in fade-in duration-300 relative z-10">
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between sticky top-0 bg-[#070D1E]/90 py-3 px-4 rounded-2xl z-20 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Dumbbell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white font-heading">
                Active Kinetic Session
              </h2>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          </div>

          <Button
            disabled={isSubmitting}
            onClick={handleFinishWorkout}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Check className="w-4 h-4 mr-1.5 stroke-[3]" />}
            Finish Workout
          </Button>
        </div>

        {/* Active Boss PR Objective Banner */}
        {activeBoss && (
          <div className="bg-gradient-to-r from-red-950/80 via-[#120716]/90 to-amber-950/80 border-2 border-red-500/50 rounded-[22px] p-5 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-xl">
            <FloatingRuneField density="low" className="opacity-20" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-300 border border-red-500/60 font-black font-mono text-[10.5px] uppercase px-2.5 py-0.5 tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.4)] flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span>WEEKLY BOSS PR ACTIVE</span>
                </Badge>
                <span className="text-xs font-mono text-amber-300 font-bold">{activeBoss.name}</span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-200">
                HP:{" "}
                <span className="text-red-400">
                  {Math.max(0, 100 - (activeBoss.currentDamage || 0) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <p className="text-xs font-sans text-slate-300 leading-relaxed relative z-10">
              Target: <strong className="text-white font-mono">{activeBoss.targetExercise}</strong> (
              {activeBoss.targetWeight} KG × {activeBoss.targetReps} Reps). Every completed set near or above this target
              deals direct HP damage to <strong className="text-red-400">{activeBoss.name}</strong>!
            </p>

            {/* Live Boss HP Bar */}
            <div className="w-full bg-[#050208] h-3 rounded-full overflow-hidden border border-red-500/40 p-[1px] relative z-10">
              <div
                className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                style={{
                  width: `${Math.max(0, Math.min(100, 100 - (activeBoss.currentDamage || 0) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Voice Logger Integration */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0C1226]/90 via-[#080E20]/90 to-[#050914]/95 border border-cyan-500/30 backdrop-blur-xl">
          <VoiceLogger onParsedResult={handleVoiceParse} isProcessing={isVoiceProcessing} />
        </div>

        {/* Exercises Deck */}
        <div className="space-y-4">
          {exercises.map((ex) => {
            const exSets = sets.filter((s) => s.exerciseId === ex.id);
            const highestWeight = exSets.reduce((max, s) => Math.max(max, s.weight), 0);
            const highestReps = exSets.find((s) => s.weight === highestWeight)?.reps || 0;
            const activeE1RM = calculateE1RM(highestWeight, highestReps);

            return (
              <div
                key={ex.id}
                className="rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-indigo-500/30 overflow-hidden shadow-xl backdrop-blur-xl"
              >
                {/* Exercise Header */}
                <div className="p-4 bg-indigo-950/30 border-b border-indigo-500/20 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-sans">{ex.name}</h3>
                      <Badge className="bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-[9px] font-mono uppercase px-1.5 py-0.2">
                        {ex.primaryMuscle}
                      </Badge>
                    </div>

                    {overloads[ex.id] && (
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-cyan-300">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>
                          Target: {overloads[ex.id].recommendedWeight}kg × {overloads[ex.id].suggestedReps}
                        </span>
                        <button
                          className="p-1 hover:bg-cyan-950 text-cyan-400 rounded-lg transition-colors cursor-pointer ml-1"
                          onClick={() => {
                            playUIMenuSFX();
                            setInputs((prev) => ({
                              ...prev,
                              [ex.id]: {
                                weight: overloads[ex.id].recommendedWeight.toString(),
                                reps: overloads[ex.id].suggestedReps.split("-")[0] || "8",
                                rpe: "8",
                              },
                            }));
                            toast.success("Target loaded into inputs");
                          }}
                          title="Auto-fill recommended target"
                        >
                          <Zap className="w-3 h-3 text-cyan-300" />
                        </button>
                      </div>
                    )}
                  </div>

                  {activeE1RM > 0 && (
                    <div className="text-right font-mono">
                      <span className="block text-[9.5px] text-slate-400 uppercase tracking-widest">Est. 1RM</span>
                      <span className="text-sm font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                        {activeE1RM} kg
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-4 font-mono">
                  {/* Logged Sets List */}
                  {exSets.map((s, idx) => {
                    const setE1RM = calculateE1RM(s.weight, s.reps);
                    const setRank = evaluateRank(setE1RM, ex.name);

                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between bg-[#050914]/90 p-3 rounded-xl border border-slate-800 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-bold w-4">#{idx + 1}</span>
                          <span className="font-bold text-slate-100">
                            {s.weight} kg × {s.reps} reps
                          </span>
                          {s.rpe && <span className="text-xs text-slate-400">@ RPE {s.rpe}</span>}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-cyan-400 font-semibold">{setE1RM}kg e1RM</span>
                          <Badge className={`${setRank.badgeBg} ${setRank.badgeBorder} border text-[10px] px-1.5 py-0.5`}>
                            {setRank.rank}
                          </Badge>
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Input Row */}
                  <div className="grid grid-cols-12 gap-2 items-center pt-2">
                    <div className="col-span-4">
                      <span className="block text-[10px] text-slate-400 font-mono mb-1">WEIGHT (KG)</span>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-11 bg-[#050914] border-slate-800 focus:border-cyan-400 text-center font-mono text-base text-white rounded-xl"
                        value={inputs[ex.id]?.weight || ""}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            [ex.id]: { ...prev[ex.id], weight: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <span className="block text-[10px] text-slate-400 font-mono mb-1">REPS</span>
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-11 bg-[#050914] border-slate-800 focus:border-cyan-400 text-center font-mono text-base text-white rounded-xl"
                        value={inputs[ex.id]?.reps || ""}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            [ex.id]: { ...prev[ex.id], reps: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <span className="block text-[10px] text-slate-400 font-mono mb-1">RPE</span>
                      <Input
                        type="number"
                        placeholder="8"
                        className="h-11 bg-[#050914] border-slate-800 focus:border-cyan-400 text-center font-mono text-base text-white rounded-xl"
                        value={inputs[ex.id]?.rpe || ""}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            [ex.id]: { ...prev[ex.id], rpe: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="col-span-2 pt-5">
                      <button
                        onClick={() => handleLogSet(ex)}
                        className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer active:scale-95 transition-all"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Exercise Menu */}
        <div className="pt-4 space-y-3 pb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Add Exercise to Active Session
          </h3>
          {isLoadingCatalog ? (
            <div className="flex items-center justify-center p-6 text-slate-400 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Loading Exercise Catalog...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableExercises
                .filter((mex) => !exercises.find((e) => e.id === mex.id))
                .map((mex) => (
                  <button
                    key={mex.id}
                    onClick={() => {
                      playUIMenuSFX();
                      addExercise(mex);
                    }}
                    className="p-3 rounded-xl bg-[#080E20]/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0C142A] text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-sm group"
                  >
                    <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white font-sans">
                        {mex.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">
                        {mex.primaryMuscle} • {mex.equipment}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <RestTimer />
    </div>
  );
}

const FALLBACK_EXERCISES: ExerciseDefinition[] = [
  { id: "ex1", name: "Barbell Bench Press", primaryMuscle: "Chest", equipment: "Barbell" },
  { id: "ex2", name: "Barbell Back Squat", primaryMuscle: "Legs", equipment: "Barbell" },
  { id: "ex3", name: "Barbell Deadlift", primaryMuscle: "Back", equipment: "Barbell" },
  { id: "ex4", name: "Overhead Barbell Press", primaryMuscle: "Shoulders", equipment: "Barbell" },
  { id: "ex5", name: "Dumbbell Bicep Curl", primaryMuscle: "Arms", equipment: "Dumbbell" },
  { id: "ex6", name: "Barbell Row", primaryMuscle: "Back", equipment: "Barbell" },
];
