"use client";

import { useEffect, useState } from "react";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { ActiveWorkout } from "@/features/workouts/components/ActiveWorkout";
import { ExerciseRankCard } from "@/features/workouts/components/ExerciseRankCard";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dumbbell, Activity, Trophy, Flame, Play, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function WorkoutsPage() {
  const { isWorkoutActive, startWorkout } = useWorkoutStore();
  const { user } = useUser();
  const [ranks, setRanks] = useState<any[]>([]);
  const [isLoadingRanks, setIsLoadingRanks] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchRanks = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/workouts/ranks/${user.id}`);
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
  }, [user, isWorkoutActive]); // refetch when workout finishes

  const handleCielAnalysis = async () => {
    if (!user) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/aira/analyze-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Analyze my recent workout ranks.",
          characterId: user.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        toast.info(
          <div className="flex flex-col gap-2">
            <div className="font-bold flex items-center gap-2"><Bot className="w-4 h-4 text-sky-400" /> Ciel (AIRA)</div>
            <div className="text-sm"><ReactMarkdown>{data.analysis}</ReactMarkdown></div>
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-indigo-500" />
            Workout Command
          </h1>
          <p className="text-muted-foreground mt-1">Track your sets, destroy your PRs, damage Bosses.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <Button 
            variant="outline"
            className="w-full sm:w-auto border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 shadow-lg shadow-sky-900/10"
            onClick={handleCielAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
            Ciel Analysis
          </Button>
          {!isWorkoutActive && (
            <Button 
              size="default" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/20"
              onClick={startWorkout}
            >
              <Play className="w-5 h-5 mr-2 fill-white" /> Start Workout
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="w-24 h-24" /></div>
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
              <div className="flex items-center justify-center p-6 text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin" /></div>
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Recent Workouts</h3>
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-200">Push Day</div>
              <div className="text-sm text-muted-foreground mt-0.5">Today • 5 Exercises • 58m</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-emerald-400">+420 EXP</div>
              <div className="text-xs text-muted-foreground mt-0.5">1 Boss Damaged</div>
            </div>
          </div>
        </Card>
      </div>
      
      {isWorkoutActive && <ActiveWorkout />}
    </div>
  );
}
