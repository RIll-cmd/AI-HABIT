"use client";

import { useState, useEffect } from "react";
import { useWorkoutStore, ExerciseDefinition } from "../store/useWorkoutStore";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RestTimer } from "./RestTimer";
import { Plus, Timer, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ActiveWorkout() {
  const { isWorkoutActive, startTime, endWorkout, exercises, addExercise, sets, logSet, startRestTimer } = useWorkoutStore();
  const { user, refetch } = useUser();
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state for the current inputs of each exercise
  const [inputs, setInputs] = useState<Record<string, { weight: string, reps: string, rpe: string }>>({});
  
  // Fake exercises list for UI until we hook up API
  const mockAvailableExercises: ExerciseDefinition[] = [
    { id: "ex1", name: "Barbell Bench Press", primaryMuscle: "Chest", equipment: "Barbell" },
    { id: "ex2", name: "Squat", primaryMuscle: "Legs", equipment: "Barbell" },
    { id: "ex3", name: "Deadlift", primaryMuscle: "Back", equipment: "Barbell" },
    { id: "ex4", name: "Dumbbell Curl", primaryMuscle: "Biceps", equipment: "Dumbbell" }
  ];

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleLogSet = (exerciseId: string) => {
    const input = inputs[exerciseId] || { weight: "", reps: "", rpe: "" };
    const w = parseFloat(input.weight);
    const r = parseInt(input.reps);
    if (isNaN(w) || isNaN(r) || r <= 0) {
      toast.error("Please enter valid weight and reps");
      return;
    }
    
    logSet({
      exerciseId,
      weight: w,
      reps: r,
      rpe: input.rpe ? parseFloat(input.rpe) : undefined
    });
    
    // Clear inputs for this exercise
    setInputs(prev => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], reps: "" } // keep weight, clear reps
    }));

    // Trigger rest timer
    startRestTimer(90); // default 90s rest
  };

  const handleFinishWorkout = async () => {
    if (sets.length === 0) {
      toast.error("Log at least one set before finishing.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/workouts/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: user?.id || "Shadow Monarch",
          durationSeconds: duration,
          sets: sets.map(s => ({
            exerciseId: s.exerciseId,
            weight: s.weight,
            reps: s.reps,
            rpe: s.rpe
          }))
        })
      });
      
      if (res.ok) {
        toast.success("Workout logged successfully! Stats & EXP updated.");
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
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm overflow-y-auto pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6 pt-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background/95 pb-4 z-10 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Workout</h2>
            <div className="flex items-center gap-1.5 text-emerald-500 mt-1">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-medium">{formatDuration(duration)}</span>
            </div>
          </div>
          <Button disabled={isSubmitting} variant="default" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold" onClick={handleFinishWorkout}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Finish
          </Button>
        </div>

        {/* Exercises */}
        {exercises.map((ex) => (
          <Card key={ex.id} className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{ex.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{ex.primaryMuscle} • {ex.equipment}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Logged Sets */}
              {sets.filter(s => s.exerciseId === ex.id).map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between bg-slate-800/50 p-2 px-3 rounded-lg text-sm border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono w-4">{idx + 1}</span>
                    <span className="font-medium text-slate-200">{s.weight} kg × {s.reps}</span>
                    {s.rpe && <span className="text-xs text-muted-foreground">@ RPE {s.rpe}</span>}
                  </div>
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
              ))}

              {/* Input Row */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Input 
                    type="number" 
                    placeholder="kg" 
                    className="h-11 bg-slate-950 border-slate-800 text-center text-base"
                    value={inputs[ex.id]?.weight || ""}
                    onChange={(e) => setInputs(prev => ({ ...prev, [ex.id]: { ...prev[ex.id], weight: e.target.value } }))}
                  />
                </div>
                <div className="col-span-3">
                  <Input 
                    type="number" 
                    placeholder="reps" 
                    className="h-11 bg-slate-950 border-slate-800 text-center text-base"
                    value={inputs[ex.id]?.reps || ""}
                    onChange={(e) => setInputs(prev => ({ ...prev, [ex.id]: { ...prev[ex.id], reps: e.target.value } }))}
                  />
                </div>
                <div className="col-span-3">
                  <Input 
                    type="number" 
                    placeholder="rpe" 
                    className="h-11 bg-slate-950 border-slate-800 text-center text-base"
                    value={inputs[ex.id]?.rpe || ""}
                    onChange={(e) => setInputs(prev => ({ ...prev, [ex.id]: { ...prev[ex.id], rpe: e.target.value } }))}
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    size="icon" 
                    className="h-11 w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                    onClick={() => handleLogSet(ex.id)}
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

        {/* Add Exercise Menu */}
        <div className="pt-4 space-y-3 pb-8">
          <h3 className="text-sm font-medium text-muted-foreground">Add Exercise</h3>
          <div className="grid grid-cols-1 gap-2">
            {mockAvailableExercises.filter(mex => !exercises.find(e => e.id === mex.id)).map(mex => (
              <Button key={mex.id} variant="outline" className="justify-start h-auto py-3 bg-slate-900 border-slate-800 hover:bg-slate-800" onClick={() => addExercise(mex)}>
                <Plus className="w-4 h-4 mr-3 text-emerald-500" />
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-200">{mex.name}</div>
                  <div className="text-xs text-muted-foreground">{mex.primaryMuscle}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

      </div>
      
      <RestTimer />
    </div>
  );
}
