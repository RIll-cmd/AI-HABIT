"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { ActiveWorkout } from "@/features/workouts/components/ActiveWorkout";
import { ExerciseRankCard } from "@/features/workouts/components/ExerciseRankCard";
import { CreateCustomWorkoutModal } from "@/features/workouts/components/CreateCustomWorkoutModal";
import {
  BodyHeatmap,
  MuscleRecoveryHUD,
  WorkoutLoggerModal,
} from "@/components/workout";
import { MuscleGroupKey } from "@/features/workouts/types/muscleRecovery";
import { useUser } from "@/context/UserContext";
import { AiraAvatar } from "@/components/ui/AiraAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Activity,
  Trophy,
  Flame,
  Play,
  Bot,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  Swords,
  Zap,
  Target,
  Layers,
  ChevronRight,
  Shield,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "@/constants";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { WORKOUT_LORE } from "@/features/lore/loreData";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import {
  playUIMenuSFX,
  playBattleSFX,
  playBuffSFX,
  playAIRASound,
} from "@/utils/audio";
import Link from "next/link";

const PREDEFINED_SPLITS = [
  {
    name: "Push Split",
    target: "Chest • Shoulders • Triceps",
    statGain: "+Strength & Endurance",
    accentColor: "from-amber-500/20 via-orange-600/10 to-transparent",
    borderColor: "border-amber-500/30 hover:border-amber-400/60",
    glowColor: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-500/40",
    exercises: [
      { id: "ex1", name: "Barbell Bench Press", primaryMuscle: "Chest", equipment: "Barbell" },
      { id: "ex7", name: "Incline Dumbbell Press", primaryMuscle: "Chest", equipment: "Dumbbell" },
      { id: "ex4", name: "Overhead Barbell Press", primaryMuscle: "Shoulders", equipment: "Barbell" },
      { id: "ex11", name: "Dips", primaryMuscle: "Chest", equipment: "Bodyweight" },
      { id: "ex9", name: "Tricep Rope Pushdown", primaryMuscle: "Arms", equipment: "Cable" },
    ],
  },
  {
    name: "Pull Split",
    target: "Back • Biceps • Rear Delts",
    statGain: "+Strength & Endurance",
    accentColor: "from-indigo-500/20 via-blue-600/10 to-transparent",
    borderColor: "border-indigo-500/30 hover:border-indigo-400/60",
    glowColor: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    exercises: [
      { id: "ex3", name: "Barbell Deadlift", primaryMuscle: "Back", equipment: "Barbell" },
      { id: "ex12", name: "Lat Pulldown", primaryMuscle: "Back", equipment: "Cable" },
      { id: "ex6", name: "Barbell Row", primaryMuscle: "Back", equipment: "Barbell" },
      { id: "ex8", name: "Pull Up", primaryMuscle: "Back", equipment: "Bodyweight" },
      { id: "ex5", name: "Dumbbell Bicep Curl", primaryMuscle: "Arms", equipment: "Dumbbell" },
    ],
  },
  {
    name: "Legs Split",
    target: "Quads • Hamstrings • Calves",
    statGain: "+Strength & Endurance",
    accentColor: "from-emerald-500/20 via-teal-600/10 to-transparent",
    borderColor: "border-emerald-500/30 hover:border-emerald-400/60",
    glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    exercises: [
      { id: "ex2", name: "Barbell Back Squat", primaryMuscle: "Legs", equipment: "Barbell" },
      { id: "ex13", name: "Romanian Deadlift", primaryMuscle: "Legs", equipment: "Barbell" },
      { id: "ex14", name: "Leg Press", primaryMuscle: "Legs", equipment: "Machine" },
      { id: "ex15", name: "Lying Leg Curl", primaryMuscle: "Legs", equipment: "Machine" },
      { id: "ex16", name: "Calf Raises", primaryMuscle: "Legs", equipment: "Machine" },
    ],
  },
  {
    name: "Core & Cardio",
    target: "Abs • Obliques • Stability",
    statGain: "+Endurance & Consistency",
    accentColor: "from-cyan-500/20 via-sky-600/10 to-transparent",
    borderColor: "border-cyan-500/30 hover:border-cyan-400/60",
    glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    exercises: [
      { id: "ex17", name: "Cable Woodchoppers", primaryMuscle: "Core", equipment: "Cable" },
      { id: "ex18", name: "Hanging Leg Raises", primaryMuscle: "Core", equipment: "Bodyweight" },
      { id: "ex19", name: "Planks", primaryMuscle: "Core", equipment: "Bodyweight" },
      { id: "ex20", name: "Push-ups", primaryMuscle: "Chest", equipment: "Bodyweight" },
    ],
  },
];

export default function WorkoutsPage() {
  const {
    isWorkoutActive,
    startWorkout,
    startWorkoutWithTemplate,
    customTemplates,
    deleteCustomTemplate,
    muscleRecovery,
    fetchMuscleRecoveryStatus,
    resetMuscleRecovery,
    isLoadingRecovery,
  } = useWorkoutStore();
  const { user } = useUser();

  const [ranks, setRanks] = useState<any[]>([]);
  const [isLoadingRanks, setIsLoadingRanks] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoggerModalOpen, setIsLoggerModalOpen] = useState(false);
  const [selectedMuscleKey, setSelectedMuscleKey] = useState<MuscleGroupKey | null>(null);
  const [activeBoss, setActiveBoss] = useState<any>(null);

  useEffect(() => {
    useWorkoutStore.getState().hydrateTemplates();
  }, []);

  // Fetch Muscle Recovery Telemetry
  useEffect(() => {
    const charId = user?.id;
    if (charId) {
      fetchMuscleRecoveryStatus(charId);
    }
  }, [user?.id, isWorkoutActive, fetchMuscleRecoveryStatus]);

  // Fetch PR Ranks
  useEffect(() => {
    const fetchRanks = async () => {
      const charId = user?.id;
      if (!charId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/workouts/ranks/${charId}`);
        if (res.ok) {
          const data = await res.json();
          setRanks(data.ranks || []);
        }
      } catch (e) {
        console.error("Failed to fetch ranks", e);
      } finally {
        setIsLoadingRanks(false);
      }
    };
    fetchRanks();
  }, [user?.id, isWorkoutActive]);

  // Fetch Weekly Boss
  useEffect(() => {
    const fetchBoss = async () => {
      const charId = user?.id;
      if (!charId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/fitness/boss/${charId}`);
        if (res.ok) {
          const data = await res.json();
          setActiveBoss(data);
        }
      } catch (e) {}
    };
    fetchBoss();
  }, [user?.id]);

  const handleQuickWorkout = async () => {
    const charId = user?.id;
    if (!charId) return;
    playBattleSFX("encounter");
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: charId }),
      });
      if (res.ok) {
        const session = await res.json();
        startWorkout(session.id);
        playBuffSFX("speed");
      } else {
        toast.error("Failed to start workout session.");
      }
    } catch (e) {
      toast.error("Network error starting session.");
    }
  };

  const handleStartTemplate = async (name: string, exercises: any[]) => {
    const charId = user?.id;
    if (!charId) return;
    playBattleSFX("encounter");
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: charId }),
      });
      if (res.ok) {
        const session = await res.json();
        startWorkoutWithTemplate(name, exercises, session.id);
        playBuffSFX("buff");
      } else {
        toast.error("Failed to start templated session.");
      }
    } catch (e) {
      toast.error("Network error starting templated session.");
    }
  };

  const handleCielAnalysis = async () => {
    const charId = user?.id;
    if (!charId) return;
    setIsAnalyzing(true);
    playAIRASound("NOTICE");
    try {
      const res = await fetch(`${API_BASE_URL}/api/aira/analyze-workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Analyze my recent workout ranks and muscle recovery telemetry.",
          characterId: charId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        playAIRASound("CONFIRMED");
        toast.info(
          <div className="flex flex-col gap-2">
            <div className="font-bold flex items-center gap-2 text-cyan-400">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" /> AIRA Analysis Telemetry
            </div>
            <div className="text-xs text-slate-200">
              <ReactMarkdown>{data.analysis}</ReactMarkdown>
            </div>
          </div>,
          { duration: 15000 }
        );
      } else {
        toast.error("Analysis failed.");
      }
    } catch (e) {
      toast.error("Network error during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetRecoverySimulation = async () => {
    const charId = user?.id;
    if (!charId) return;
    playUIMenuSFX("confirm");
    await resetMuscleRecovery(charId);
    toast.success("Simulation Reset: All muscle groups refreshed to 100%!");
  };

  return (
    <div className="space-y-8 pb-16 font-sans animate-in fade-in duration-300 relative text-slate-100 max-w-6xl mx-auto p-4 md:p-6">
      {/* Background Floating Runes */}
      <FloatingRuneField density="low" className="opacity-60" />

      {/* ========================================================= */}
      {/* 1. HERO & TOP TELEMETRY COMMAND BAR */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1126]/95 via-[#070D1E]/95 to-[#040814]/98 border border-indigo-500/25 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        <FloatingRuneField density="high" />

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Holographic Dumbbell Pedestal */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#12193b] to-[#070c20] border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)] shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
              <Dumbbell className="w-8 h-8 drop-shadow-[0_0_12px_rgba(99,102,241,0.7)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  KINETIC ASCENSION HUB
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(99,102,241,0.25)] flex items-center gap-1">
                  RECOVERY & HEATMAP ENGINE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Workout Command & Muscle Heatmap
              </h1>
              <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                Track real-time anatomical muscle fatigue, time-decay recovery, progressive overload e1RM power ranks, and boss damage.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto justify-end">
            <Button
              onClick={() => {
                playUIMenuSFX("click");
                setIsLoggerModalOpen(true);
              }}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Log Targeted Workout</span>
            </Button>

            <Link href="/workouts/boss-pr">
              <button
                onClick={() => playBattleSFX("encounter")}
                className="px-4 py-2.5 rounded-xl border border-red-500/50 bg-gradient-to-r from-red-950/80 via-[#18080f] to-red-950/60 hover:from-red-900/90 hover:to-red-950 text-red-200 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 group"
              >
                <Swords className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                <span>Weekly Boss PR</span>
              </button>
            </Link>

            <button
              onClick={handleCielAnalysis}
              disabled={isAnalyzing}
              className="px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 active:scale-95"
            >
              {isAnalyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <AiraAvatar mood="ANALYZING" className="w-4 h-4 border-none shadow-none rounded-full" />
              )}
              <span>AIRA Intel</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RECOVERY ENGINE HUD & ANATOMICAL BODY HEATMAP */}
      {/* ========================================================= */}
      <div className="space-y-6">
        {/* Top Recovery Telemetry HUD */}
        <MuscleRecoveryHUD
          recoveryStatus={muscleRecovery}
          onOpenLogger={() => {
            playUIMenuSFX("click");
            setIsLoggerModalOpen(true);
          }}
          onResetRecovery={handleResetRecoverySimulation}
          isLoading={isLoadingRecovery}
        />

        {/* Interactive Dual-View Anatomical Heatmap */}
        <BodyHeatmap
          recoveryStatus={muscleRecovery}
          selectedMuscleKey={selectedMuscleKey}
          onSelectMuscle={(mKey) => {
            setSelectedMuscleKey(mKey);
            playUIMenuSFX("click");
          }}
          variant="full"
          defaultView="dual"
        />
      </div>

      {/* ========================================================= */}
      {/* 3. ACTIVE LIVE WORKOUT SESSION (IF ACTIVE) */}
      {/* ========================================================= */}
      {isWorkoutActive && (
        <div className="relative z-20">
          <ActiveWorkout />
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. FITNESS STATS & PR RANK MATRIX */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fitness Power Card */}
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-emerald-500/25 shadow-xl relative overflow-hidden backdrop-blur-2xl flex flex-col justify-between group hover:border-emerald-400/50 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-28 h-28 text-emerald-400" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10.5px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Fitness Power
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 fill-emerald-400/30 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <div className="text-4xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {user?.power || 0}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-emerald-400" /> Level {user?.level || 1} Character
              </span>
            </div>
          </div>

          {/* Quick Boss PR Status Banner */}
          {activeBoss && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 relative z-10">
              <Link href="/workouts/boss-pr">
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 hover:border-red-400/60 transition-all flex items-center justify-between group/boss cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Swords className="w-4 h-4 text-red-400 group-hover/boss:rotate-12 transition-transform" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {activeBoss.name || "Weekly Boss"}
                      </div>
                      <div className="text-[10px] font-mono text-red-400 font-bold">
                        {activeBoss.isDefeated ? "DEFEATED" : `Target: ${activeBoss.targetExercise}`}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover/boss:text-white group-hover/boss:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Personal Records Card */}
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-amber-500/25 shadow-xl relative overflow-hidden backdrop-blur-2xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
                  Personal Record RPG Ranks
                </h3>
                <p className="text-[10.5px] font-mono text-slate-400">
                  Estimated 1-Rep Max benchmarks & Tier Thresholds
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {isLoadingRanks ? (
              <div className="flex items-center justify-center py-10 text-slate-400 font-mono text-xs gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                <span>Syncing Exercise Ranks...</span>
              </div>
            ) : ranks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ranks.map((r, i) => (
                  <ExerciseRankCard
                    key={i}
                    exerciseName={r.exerciseName}
                    e1rm={r.e1rm}
                    currentRank={r.currentRank}
                    nextRank={r.nextRank}
                    nextThreshold={r.nextThreshold}
                    progress={r.progress}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 font-mono text-xs border border-dashed border-slate-800 rounded-2xl p-4 bg-[#050914]/50">
                No exercise sets logged yet. Log a workout above to establish your e1RM ranks!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. USER CUSTOM WORKOUT PLANS */}
      {/* ========================================================= */}
      {customTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Custom Workout Protocols ({customTemplates.length})
            </h3>
            <button
              onClick={() => {
                playUIMenuSFX();
                setIsCreateModalOpen(true);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + New Custom Routine
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-[22px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-cyan-500/30 hover:border-cyan-400/60 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all overflow-hidden flex flex-col justify-between group relative backdrop-blur-xl"
              >
                <div className="flex items-start justify-between pb-3 border-b border-cyan-500/20">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-sans">
                      {plan.name}
                    </h4>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{plan.target}</p>
                  </div>
                  <button
                    onClick={() => {
                      playUIMenuSFX("decline");
                      deleteCustomTemplate(plan.id);
                      toast.info(`Deleted custom plan "${plan.name}"`);
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-950/40 cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-3 font-mono flex-1 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-wider">
                      {plan.exercises.length} Movements Included:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1.5">
                      {plan.exercises.slice(0, 3).map((ex, idx) => (
                        <li key={idx} className="truncate flex items-center gap-1.5 text-slate-300">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span>{ex.name}</span>
                        </li>
                      ))}
                      {plan.exercises.length > 3 && (
                        <li className="text-[10px] text-cyan-400/90 font-mono italic">
                          + {plan.exercises.length - 3} more movements
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    disabled={isWorkoutActive}
                    onClick={() => handleStartTemplate(plan.name, plan.exercises)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-500 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Launch {plan.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. PREDEFINED SPLIT ROUTINES MATRIX */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Standard Split Routines
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Choose a tactical routine to target primary muscle groups and build progressive power.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREDEFINED_SPLITS.map((split, i) => (
            <div
              key={i}
              className={`p-5 rounded-[22px] bg-gradient-to-br ${split.accentColor} bg-[#080D1E]/90 border ${split.borderColor} ${split.glowColor} transition-all duration-300 flex flex-col justify-between group relative overflow-hidden backdrop-blur-xl`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-black uppercase ${split.badgeColor}`}
                  >
                    {split.statGain}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {split.exercises.length} Exercises
                  </span>
                </div>

                <h4 className="text-base font-extrabold font-heading text-white group-hover:text-cyan-300 transition-colors">
                  {split.name}
                </h4>
                <p className="text-xs text-slate-300 font-sans mt-0.5">{split.target}</p>

                <ul className="mt-4 space-y-1.5 text-xs text-slate-300 font-sans">
                  {split.exercises.map((ex, idx) => (
                    <li key={idx} className="truncate flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400/80" />
                      <span>{ex.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={isWorkoutActive}
                onClick={() => handleStartTemplate(split.name, split.exercises)}
                className="w-full mt-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/40 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-40 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Routine</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. MODALS */}
      {/* ========================================================= */}
      <CreateCustomWorkoutModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <WorkoutLoggerModal
        isOpen={isLoggerModalOpen}
        onClose={() => setIsLoggerModalOpen(false)}
        initialExerciseId={selectedMuscleKey ? undefined : undefined}
      />
    </div>
  );
}
