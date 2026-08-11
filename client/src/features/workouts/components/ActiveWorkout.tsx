"use client";

import { useState, useEffect } from "react";
import { useWorkoutStore, ExerciseDefinition } from "../store/useWorkoutStore";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RestTimer } from "./RestTimer";
import { VoiceLogger } from "./VoiceLogger";
import { Plus, Timer, Check, Loader2, Dumbbell, Sparkles, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import { calculateE1RM, evaluateRank } from "../utils/rankEngine";
import confetti from "canvas-confetti";

import { API_BASE_URL } from "@/constants";
import { playAIRASound } from "@/utils/audio";

export function ActiveWorkout() {
  const { isWorkoutActive, sessionId, startTime, endWorkout, exercises, addExercise, sets, logSet, startRestTimer } = useWorkoutStore();
  const { user, refetch } = useUser();
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [activeBoss, setActiveBoss] = useState<any>(null);
  
  // Local state for the current inputs of each exercise
  const [inputs, setInputs] = useState<Record<string, { weight: string, reps: string, rpe: string }>>({});
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
        const exIds = exercises.map(e => e.id);
        const res = await fetch(`${API_BASE_URL}/api/fitness/overload-batch/${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exIds)
        });
        if (res.ok) {
          const data = await res.json();
          setOverloads(data);
        }
      } catch (e) {}
    };
    fetchOverloads();
  }, [exercises, user?.id, isWorkoutActive]);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleLogSet = async (exercise: ExerciseDefinition) => {
    const input = inputs[exercise.id] || { weight: "", reps: "", rpe: "" };
    const w = parseFloat(input.weight);
    const r = parseInt(input.reps);
    const rpe = input.rpe ? parseFloat(input.rpe) : undefined;

    if (isNaN(w) || isNaN(r) || r <= 0) {
      toast.error("Please enter valid weight and reps");
      return;
    }
    
    // Ensure active session on backend
    let currentSessionId = sessionId;
    if (!currentSessionId && user?.id) {
      try {
        const startRes = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ characterId: user.id })
        });
        if (startRes.ok) {
          const sess = await startRes.json();
          currentSessionId = sess.id;
        }
      } catch (e) {}
    }
    
    // Log immediately to backend for Boss HP calculations and voice memory
    if (currentSessionId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${currentSessionId}/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exerciseId: exercise.id,
            set: sets.filter(s => s.exerciseId === exercise.id).length + 1,
            weight: w,
            reps: r,
            rpe: rpe
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.bossDamage?.matched) {
            if (activeBoss) {
              const newDamageRatio = Math.min(1, (100 - data.bossDamage.hpPercent) / 100);
              setActiveBoss({
                ...activeBoss,
                currentDamage: newDamageRatio,
                isDefeated: data.bossDamage.isDefeated
              });
            }

            if (data.bossDamage.isDefeated) {
              toast.success(`🏆 WEEKLY BOSS DEFEATED! ${data.bossDamage.bossName} slain! Rewards: +500 EXP, +100 Gold, +1 STR`);
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } else {
              toast.info(`💥 BOSS STRUCK! Dealt -${data.bossDamage.damageDealt}% damage to ${data.bossDamage.bossName}! (Boss HP: ${data.bossDamage.hpPercent}%)`);
            }
          }
        }
      } catch (e) {
        toast.error("Warning: Failed to sync set to server.");
      }
    }

    logSet({
      exerciseId: exercise.id,
      weight: w,
      reps: r,
      rpe: rpe
    });

    playAIRASound("CONFIRMED");

    const e1rm = calculateE1RM(w, r);
    const rankInfo = evaluateRank(e1rm, exercise.name);

    toast.success(
      <div className="flex items-center gap-2 font-mono">
        <span>Set logged: {w}kg × {r} ({e1rm}kg e1RM)</span>
        <Badge className={`${rankInfo.badgeBg} ${rankInfo.badgeBorder} border font-bold text-xs uppercase px-2`}>
          {rankInfo.rank} RANK
        </Badge>
      </div>
    );
    
    // Clear inputs for this exercise (keep weight for convenience)
    setInputs(prev => ({
      ...prev,
      [exercise.id]: { ...prev[exercise.id], reps: "" }
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
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Ensure exercise is in active session
        if (!exercises.find(e => e.id === data.exerciseId)) {
          addExercise(data.exercise);
        }

        // Add to local state
        logSet({
          exerciseId: data.exerciseId,
          weight: data.weight,
          reps: data.reps,
          rpe: data.rpe
        });

        // Auto-fill the input fields for next set
        setInputs(prev => ({
          ...prev,
          [data.exerciseId]: {
            weight: data.weight.toString(),
            reps: "",
            rpe: data.rpe ? data.rpe.toString() : ""
          }
        }));

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
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/${sessionId}/finish`, {
        method: "POST"
      });
      
      if (res.ok) {
        const result = await res.json();
        
        if (result.newPRs && result.newPRs.length > 0) {
           confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
           toast.success(`New PRs Achieved! ${result.newPRs.length} PRs broken!`);
        }
        if (result.bossDefeated) {
           confetti({ particleCount: 150, spread: 100, colors: ['#fbbf24', '#f59e0b', '#b45309'], origin: { y: 0.5 } });
           toast.success("🔥 WEEKLY BOSS DEFEATED! Massive rewards earned! 🔥");
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
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm overflow-y-auto pb-24 font-sans">
      <div className="max-w-xl mx-auto p-4 space-y-6 pt-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background/95 pb-4 z-10 border-b border-border/50 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-indigo-400" />
              Active Workout
            </h2>
            <div className="flex items-center gap-1.5 text-emerald-400 mt-1">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-bold text-sm">{formatDuration(duration)}</span>
            </div>
          </div>
          <Button disabled={isSubmitting} variant="default" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 shadow-lg shadow-emerald-900/30" onClick={handleFinishWorkout}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Finish Workout
          </Button>
        </div>

        {/* Active Boss PR Objective Banner */}
        {activeBoss && (
          <div className="bg-gradient-to-r from-red-950/80 via-[#121829] to-amber-950/80 border-2 border-red-500/40 rounded-2xl p-4 shadow-xl space-y-2.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-400 border border-red-500/50 font-black font-mono text-[11px] uppercase px-2.5 py-0.5 tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  ⚔️ WEEKLY BOSS PR OBJECTIVE ACTIVE
                </Badge>
                <span className="text-xs font-mono text-amber-400 font-bold">{activeBoss.name}</span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-300">
                HP: <span className="text-red-400">{(Math.max(0, 100 - (activeBoss.currentDamage || 0) * 100)).toFixed(1)}%</span>
              </div>
            </div>
            
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              Target: <strong className="text-white font-mono">{activeBoss.targetExercise}</strong> ({activeBoss.targetWeight} KG × {activeBoss.targetReps} Reps). Every completed set near or above this target deals direct HP damage to <strong className="text-red-400">{activeBoss.name}</strong>!
            </p>

            {/* Live Boss HP Bar */}
            <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden border border-red-500/30">
              <div 
                className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.max(0, Math.min(100, 100 - (activeBoss.currentDamage || 0) * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Voice Logger Integration */}
        <div className="mb-6">
          <VoiceLogger onParsedResult={handleVoiceParse} isProcessing={isVoiceProcessing} />
        </div>

        {/* Exercises */}
        {exercises.map((ex) => {
          const exSets = sets.filter(s => s.exerciseId === ex.id);
          const maxE1rm = exSets.reduce((max, s) => Math.max(max, calculateE1RM(s.weight, s.reps)), 0);
          
          // Live preview rank for current inputs
          const currentWeight = parseFloat(inputs[ex.id]?.weight || "0");
          const currentReps = parseInt(inputs[ex.id]?.reps || "0");
          const liveE1RM = calculateE1RM(currentWeight, currentReps);
          const activeE1RM = Math.max(maxE1rm, liveE1RM);
          const activeRank = evaluateRank(activeE1RM, ex.name);

          return (
            <Card key={ex.id} className="border-slate-800 bg-[#0B1020]/90 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-white">{ex.name}</CardTitle>
                    <Badge className={`${activeRank.badgeBg} ${activeRank.badgeBorder} border font-mono font-extrabold text-xs uppercase px-2 py-0.5 shadow-sm`}>
                      [{activeRank.rank} RANK]
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">{ex.primaryMuscle} • {ex.equipment}</p>
                  
                  {overloads[ex.id] && (
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className={`font-mono text-[10px] ${overloads[ex.id].shouldIncrease ? 'border-amber-500/50 text-amber-400 bg-amber-950/20' : 'border-blue-500/50 text-blue-400 bg-blue-950/20'} px-2 py-1 flex items-center gap-1.5`}>
                        <Target className="w-3 h-3" />
                        TARGET: {overloads[ex.id].recommendedWeight}KG × {overloads[ex.id].suggestedReps}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                        onClick={() => {
                          setInputs(prev => ({
                            ...prev,
                            [ex.id]: {
                              weight: overloads[ex.id].recommendedWeight.toString(),
                              reps: overloads[ex.id].suggestedReps.split('-')[0] || "8",
                              rpe: "8"
                            }
                          }));
                          toast.success("Target loaded into inputs");
                        }}
                        title="Auto-fill recommended target"
                      >
                        <Zap className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {activeE1RM > 0 && (
                  <div className="text-right font-mono">
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Est. 1RM</span>
                    <span className="text-sm font-bold text-cyan-400">{activeE1RM} kg</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                
                {/* Logged Sets List */}
                {exSets.map((s, idx) => {
                  const setE1RM = calculateE1RM(s.weight, s.reps);
                  const setRank = evaluateRank(setE1RM, ex.name);

                  return (
                    <div key={s.id} className="flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-bold w-4">#{idx + 1}</span>
                        <span className="font-bold text-slate-100">{s.weight} kg × {s.reps} reps</span>
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
                      className="h-11 bg-slate-950 border-slate-800 text-center font-mono text-base text-white"
                      value={inputs[ex.id]?.weight || ""}
                      onChange={(e) => setInputs(prev => ({ ...prev, [ex.id]: { ...prev[ex.id], weight: e.target.value } }))}
                    />
                  </div>
                  <div className="col-span-3">
                    <span className="block text-[10px] text-slate-400 font-mono mb-1">REPS</span>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="h-11 bg-slate-950 border-slate-800 text-center font-mono text-base text-white"
                      value={inputs[ex.id]?.reps || ""}
                      onChange={(e) => setInputs(prev => ({ ...prev, [ex.id]: { ...prev[ex.id], reps: e.target.value } }))}
                    />
                  </div>
                  <div className="col-span-3">
                    <span className="block text-[10px] text-slate-400 font-mono mb-1">RPE</span>
                    <Input 
                      type="number" 
                      placeholder="8" 
                      className="h-11 bg-slate-950 border-slate-800 text-center font-mono text-base text-white"
                      value={inputs[ex.id]?.rpe || ""}
                      onChange={(e) => setInputs(prev => ({ ...prev, [ex.id]: { ...prev[ex.id], rpe: e.target.value } }))}
                    />
                  </div>
                  <div className="col-span-2 pt-5">
                    <Button 
                      size="icon" 
                      className="h-11 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-900/30"
                      onClick={() => handleLogSet(ex)}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          );
        })}

        {/* Add Exercise Menu */}
        <div className="pt-4 space-y-3 pb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" /> Add Exercise to Session
          </h3>
          {isLoadingCatalog ? (
            <div className="flex items-center justify-center p-6 text-slate-400 font-mono text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Loading Exercise Catalog...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableExercises
                .filter(mex => !exercises.find(e => e.id === mex.id))
                .map(mex => (
                  <Button 
                    key={mex.id} 
                    variant="outline" 
                    className="justify-start h-auto py-3 bg-slate-900/70 border-slate-800 hover:bg-slate-800/80 text-left font-sans"
                    onClick={() => addExercise(mex)}
                  >
                    <Plus className="w-4 h-4 mr-2.5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-200">{mex.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">{mex.primaryMuscle} • {mex.equipment}</div>
                    </div>
                  </Button>
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
