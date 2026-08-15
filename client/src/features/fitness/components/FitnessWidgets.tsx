import React, { useEffect } from "react";
import { Dumbbell, Award, Flame, Play, ArrowRight, Clock, Trophy, TrendingUp } from "lucide-react";
import { useFitnessStore } from "../store/useFitnessStore";

/**
 * Today's Workout Dashboard Widget
 */
export const TodayWorkoutWidget: React.FC = () => {
  const { activeSession, startWorkout, recoverActiveSession } = useFitnessStore();

  useEffect(() => {
    recoverActiveSession();
  }, [recoverActiveSession]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              TODAY'S WORKOUT
            </h3>
            <p className="text-[11px] text-slate-400">Fitness Module Engine</p>
          </div>
        </div>

        {activeSession && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold animate-pulse">
            IN PROGRESS
          </span>
        )}
      </div>

      <div className="my-4">
        {activeSession ? (
          <div>
            <div className="text-lg font-extrabold text-white">Active Session Running</div>
            <p className="text-xs text-slate-400 mt-1">
              Started at {new Date(activeSession.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
            </p>
          </div>
        ) : (
          <div>
            <div className="text-base font-bold text-slate-200">No Workout Started</div>
            <p className="text-xs text-slate-400 mt-1">
              Ready to hit the gym? Launch a free session to start tracking your sets.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (!activeSession) {
            startWorkout();
          }
        }}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Play className="w-4 h-4 fill-current" />
        {activeSession ? "Continue Session" : "Start Free Session"}
      </button>
    </div>
  );
};

/**
 * Recent PRs Dashboard Widget
 */
export const RecentPRsWidget: React.FC = () => {
  const { personalRecords, loadPersonalRecords } = useFitnessStore();

  useEffect(() => {
    loadPersonalRecords();
  }, [loadPersonalRecords]);

  const recentPR = personalRecords.length > 0 ? personalRecords[0] : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              RECENT PR
            </h3>
            <p className="text-[11px] text-slate-400">Personal Best Tracker</p>
          </div>
        </div>
      </div>

      {recentPR ? (
        <div className="my-3 bg-slate-950/60 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              {recentPR.exercise?.name || "Exercise"}
            </div>
            <div suppressHydrationWarning className="text-[11px] text-slate-400 mt-0.5">
              {new Date(recentPR.date).toLocaleDateString()}
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-base font-black text-amber-400">
              {recentPR.weight} kg × {recentPR.reps}
            </div>
            <div className="text-[10px] text-cyan-300">
              1RM: {recentPR.estimated1RM} kg
            </div>
          </div>
        </div>
      ) : (
        <div className="my-4 text-center text-slate-500 text-xs py-2">
          No personal records logged yet. Complete a workout to record PRs!
        </div>
      )}
    </div>
  );
};

/**
 * Weekly Volume Dashboard Widget
 */
export const WeeklyVolumeWidget: React.FC = () => {
  const { workoutHistory, loadWorkoutHistory } = useFitnessStore();

  useEffect(() => {
    loadWorkoutHistory();
  }, [loadWorkoutHistory]);

  // Calculate volume for last 7 days
  const now = new Date().getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const weeklySessions = workoutHistory.filter((s) => {
    const time = new Date(s.startedAt).getTime();
    return now - time <= sevenDaysMs;
  });

  const totalWeeklyVolume = weeklySessions.reduce((sum, session) => {
    const logs = session.exerciseLogs || [];
    const sessionVolume = logs.reduce((logSum, l) => logSum + l.weight * l.reps, 0);
    return sum + sessionVolume;
  }, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              WEEKLY VOLUME
            </h3>
            <p className="text-[11px] text-slate-400">Last 7 Days Progress</p>
          </div>
        </div>
      </div>

      <div className="my-3 flex items-baseline justify-between">
        <div className="text-2xl font-black font-mono text-emerald-400">
          {Math.round(totalWeeklyVolume * 10) / 10} <span className="text-sm text-slate-400">kg</span>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {weeklySessions.length} Workout{weeklySessions.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (totalWeeklyVolume / 10000) * 100)}%` }}
        />
      </div>
    </div>
  );
};
