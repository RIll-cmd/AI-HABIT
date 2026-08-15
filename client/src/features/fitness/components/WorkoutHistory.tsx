import React, { useEffect } from "react";
import { History, Calendar, Clock, Flame, Dumbbell, Award, ChevronRight } from "lucide-react";
import { useFitnessStore } from "../store/useFitnessStore";

export const WorkoutHistory: React.FC = () => {
  const { workoutHistory, isLoadingHistory, loadWorkoutHistory } = useFitnessStore();

  useEffect(() => {
    loadWorkoutHistory();
  }, [loadWorkoutHistory]);

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (secs?: number | null) => {
    if (!secs) return "< 1m";
    const mins = Math.floor(secs / 60);
    return `${mins} min`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-100 space-y-6">
      {/* Header Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Workout History</h2>
            <p className="text-xs text-slate-400">
              Timeline of your completed gym sessions and logged progressive overload.
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs text-slate-400">COMPLETED WORKOUTS</div>
          <div className="text-xl font-black text-cyan-400">{workoutHistory.length}</div>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingHistory ? (
        <div className="text-center py-12 text-slate-500 text-sm font-mono">
          Loading workout history timeline...
        </div>
      ) : workoutHistory.length === 0 ? (
        /* Empty State */
        <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Dumbbell className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-slate-300">No workout history recorded yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            Complete your first workout session to start building your training timeline.
          </p>
        </div>
      ) : (
        /* Timeline Items */
        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
          {workoutHistory.map((session) => {
            const logs = session.exerciseLogs || [];
            
            // Calculate total volume for session
            const totalVolume = logs.reduce(
              (acc, log) => acc + log.weight * log.reps,
              0
            );

            // Group logs by exercise name
            const exerciseMap: Record<string, { count: number; maxWeight: number }> = {};
            logs.forEach((log) => {
              const name = log.exercise?.name || "Exercise";
              if (!exerciseMap[name]) {
                exerciseMap[name] = { count: 0, maxWeight: log.weight };
              }
              exerciseMap[name].count += 1;
              exerciseMap[name].maxWeight = Math.max(
                exerciseMap[name].maxWeight,
                log.weight
              );
            });

            return (
              <div key={session.id} className="relative">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

                <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all space-y-4">
                  {/* Session Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span suppressHydrationWarning className="text-sm font-bold text-slate-200">
                        {formatDate(session.startedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {formatDuration(session.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        {roundVal(totalVolume)} kg
                      </span>
                    </div>
                  </div>

                  {/* Logged Exercises Summary */}
                  <div>
                    <div className="text-xs font-mono text-slate-400 mb-2">
                      EXERCISES LOGGED ({Object.keys(exerciseMap).length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(exerciseMap).map(([name, data]) => (
                        <div
                          key={name}
                          className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-200 truncate">{name}</span>
                          <span className="font-mono text-cyan-300 font-bold ml-2">
                            {data.count} sets • max {data.maxWeight}kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function roundVal(val: number): number {
  return Math.round(val * 10) / 10;
}
