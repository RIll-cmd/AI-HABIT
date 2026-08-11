"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { ActiveWorkout } from "@/features/workouts/components/ActiveWorkout";
import { ExerciseRankCard } from "@/features/workouts/components/ExerciseRankCard";
import { CreateCustomWorkoutModal } from "@/features/workouts/components/CreateCustomWorkoutModal";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dumbbell, Activity, Trophy, Flame, Play, Bot, Loader2, Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from "@/constants";

const PREDEFINED_SPLITS = [
  {
    name: "Push Split",
    target: "Chest • Shoulders • Triceps",
    statGain: "+Strength & Endurance",
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
  } = useWorkoutStore();
  const { user } = useUser();

  const [ranks, setRanks] = useState<any[]>([]);
  const [isLoadingRanks, setIsLoadingRanks] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchRanks = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/workouts/ranks/${user.id}`);
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

  const handleQuickWorkout = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.id })
      });
      if (res.ok) {
        const session = await res.json();
        startWorkout(session.id);
      } else {
        toast.error("Failed to start workout session.");
      }
    } catch (e) {
      toast.error("Network error starting session.");
    }
  };

  const handleStartTemplate = async (name: string, exercises: any[]) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.id })
      });
      if (res.ok) {
        const session = await res.json();
        startWorkoutWithTemplate(name, exercises, session.id);
      } else {
        toast.error("Failed to start templated session.");
      }
    } catch (e) {
      toast.error("Network error starting templated session.");
    }
  };

  const handleCielAnalysis = async () => {
    if (!user) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/aira/analyze-workout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Analyze my recent workout ranks.",
          characterId: user.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.info(
          <div className="flex flex-col gap-2">
            <div className="font-bold flex items-center gap-2">
              <Bot className="w-4 h-4 text-sky-400" /> Ciel (AIRA)
            </div>
            <div className="text-sm">
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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-indigo-500" />
            Workout Command
          </h1>
          <p className="text-muted-foreground mt-1">Track sets, earn e1RM RPG ranks, and build custom workout plans.</p>
        </div>

        <div className="flex flex-wrap items-center w-full md:w-auto gap-2">
          <Button
            variant="outline"
            className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 shadow-lg shadow-sky-900/10"
            onClick={handleCielAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
            Ciel Analysis
          </Button>

          <Button
            variant="outline"
            className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300 font-mono text-xs uppercase"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1 text-cyan-400" /> Create Custom Plan
          </Button>

          {!isWorkoutActive && (
            <Button
              size="default"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/20"
              onClick={handleQuickWorkout}
            >
              <Play className="w-5 h-5 mr-2 fill-white" /> Quick Workout
            </Button>
          )}
        </div>
      </div>

      {/* Fitness Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-24 h-24" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Fitness Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-white">{user?.power || 0}</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <Flame className="w-3 h-3" /> Lv. {user?.level || 1}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Recent Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingRanks ? (
              <div className="flex items-center justify-center p-6 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : ranks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
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
              <div className="text-center p-6 text-muted-foreground text-sm border border-dashed border-slate-800 rounded-lg">
                No sets logged yet. Start a workout to establish your ranks.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Custom Workout Plans (if created) */}
      {customTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-cyan-400">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Your Custom Workout Plans ({customTemplates.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates.map((plan) => (
              <Card
                key={plan.id}
                className="bg-[#0D1322] border border-cyan-500/40 hover:border-cyan-400 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
              >
                <CardHeader className="pb-2 bg-cyan-950/30 border-b border-slate-800/80 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {plan.name}
                    </CardTitle>
                    <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{plan.target}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteCustomTemplate(plan.id);
                      toast.info(`Deleted custom plan "${plan.name}"`);
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </CardHeader>

                <CardContent className="p-4 space-y-3 font-mono flex-1 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold mb-2">
                      {plan.exercises.length} Exercises Included:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {plan.exercises.slice(0, 3).map((ex, idx) => (
                        <li key={idx} className="truncate">
                          • {ex.name}
                        </li>
                      ))}
                      {plan.exercises.length > 3 && (
                        <li className="text-[10px] text-slate-500 italic">+ {plan.exercises.length - 3} more</li>
                      )}
                    </ul>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
                    disabled={isWorkoutActive}
                    onClick={() => handleStartTemplate(plan.name, plan.exercises)}
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-slate-950" /> Launch {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Predefined Workout Splits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-indigo-400" />
            Predefined Split Routines
          </h3>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Custom Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREDEFINED_SPLITS.map((split, i) => (
            <Card
              key={i}
              className="bg-[#0B1020]/90 border border-slate-800 hover:border-indigo-500/50 transition-all overflow-hidden flex flex-col justify-between group shadow-md"
            >
              <CardHeader className="pb-2 bg-slate-900/50 border-b border-slate-800/60">
                <CardTitle className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {split.name}
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{split.target}</p>
              </CardHeader>
              <CardContent className="p-4 space-y-3 font-mono flex-1 flex flex-col justify-between">
                <div>
                  <span className="block text-[10px] text-emerald-400 font-bold mb-2">{split.statGain}</span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {split.exercises.slice(0, 3).map((ex, idx) => (
                      <li key={idx} className="truncate">
                        • {ex.name}
                      </li>
                    ))}
                    {split.exercises.length > 3 && (
                      <li className="text-[10px] text-slate-500 italic">+ {split.exercises.length - 3} more</li>
                    )}
                  </ul>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-900/20"
                  disabled={isWorkoutActive}
                  onClick={() => handleStartTemplate(split.name, split.exercises)}
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-white" /> Launch Routine
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals & Active Workout Overlay */}
      <CreateCustomWorkoutModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      {isWorkoutActive && <ActiveWorkout />}
    </div>
  );
}
