import React, { useState } from "react";
import { Dumbbell, Plus, Check, Clock, FileText, Trash2, Award } from "lucide-react";
import { Exercise, ExerciseLog } from "../types";
import { useFitnessStore } from "../store/useFitnessStore";

interface ExerciseLoggerProps {
  exercise: Exercise;
}

export const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({ exercise }) => {
  const { sessionLogs, logSet, removeExerciseFromWorkout } = useFitnessStore();

  // Filter logs for this specific exercise in current session
  const exerciseLogs = sessionLogs.filter((log) => log.exerciseId === exercise.id);

  // Auto increment set number
  const nextSetNumber = exerciseLogs.length + 1;

  // Default values based on previous set logged or defaults
  const lastLog = exerciseLogs[exerciseLogs.length - 1];
  const [weight, setWeight] = useState<number>(lastLog ? lastLog.weight : 60);
  const [reps, setReps] = useState<number>(lastLog ? lastLog.reps : 10);
  const [rpe, setRpe] = useState<number | "">(lastLog && lastLog.rpe ? lastLog.rpe : 8);
  const [restTime, setRestTime] = useState<number>(lastLog && lastLog.restTime ? lastLog.restTime : 60);
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justLogged, setJustLogged] = useState<boolean>(false);

  const handleLogSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weight < 0 || reps <= 0) return;

    setIsSubmitting(true);
    const result = await logSet({
      exerciseId: exercise.id,
      set: nextSetNumber,
      weight: Number(weight),
      reps: Number(reps),
      rpe: rpe !== "" ? Number(rpe) : null,
      restTime: Number(restTime),
      notes: notes.trim() || null,
    });
    setIsSubmitting(false);

    if (result) {
      setNotes("");
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all">
      {/* Exercise Card Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              {exercise.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                {exercise.category}
              </span>
              <span className="text-xs text-slate-400">• {exercise.muscleGroup}</span>
              <span className="text-xs text-slate-400">• {exercise.equipment}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => removeExerciseFromWorkout(exercise.id)}
          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Remove from session"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Logged Sets Table */}
      {exerciseLogs.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-2">
                <th className="py-2 px-2">SET</th>
                <th className="py-2 px-2">WEIGHT</th>
                <th className="py-2 px-2">REPS</th>
                <th className="py-2 px-2">RPE</th>
                <th className="py-2 px-2">REST</th>
                <th className="py-2 px-2">NOTES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {exerciseLogs.map((log) => (
                <tr key={log.id} className="text-slate-200 hover:bg-slate-850/50">
                  <td className="py-2 px-2 font-bold text-cyan-400">#{log.set}</td>
                  <td className="py-2 px-2 text-white font-semibold">{log.weight} kg</td>
                  <td className="py-2 px-2 font-semibold">{log.reps} reps</td>
                  <td className="py-2 px-2 text-slate-400">{log.rpe ?? "-"}</td>
                  <td className="py-2 px-2 text-slate-400">{log.restTime ? `${log.restTime}s` : "-"}</td>
                  <td className="py-2 px-2 text-slate-400 italic max-w-xs truncate">
                    {log.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Set Form */}
      <form onSubmit={handleLogSet} className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/60">
        <div className="text-xs font-mono font-bold text-slate-400 mb-3 flex items-center justify-between">
          <span>LOG SET #{nextSetNumber}</span>
          {justLogged && (
            <span className="text-emerald-400 flex items-center gap-1 font-sans">
              <Check className="w-3.5 h-3.5" /> Logged!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {/* Weight */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              WEIGHT (KG)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              required
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Reps */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              REPS
            </label>
            <input
              type="number"
              min="1"
              required
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* RPE */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              RPE (1-10)
            </label>
            <select
              value={rpe}
              onChange={(e) => setRpe(e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">None</option>
              <option value="6">6 - Very Easy</option>
              <option value="7">7 - Easy</option>
              <option value="8">8 - Moderate</option>
              <option value="9">9 - Hard</option>
              <option value="10">10 - Max Effort</option>
            </select>
          </div>

          {/* Rest Time */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">
              REST TIMER
            </label>
            <select
              value={restTime}
              onChange={(e) => setRestTime(parseInt(e.target.value, 10))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="30">30 sec</option>
              <option value="60">60 sec</option>
              <option value="90">90 sec</option>
              <option value="120">120 sec</option>
              <option value="180">3 min</option>
            </select>
          </div>
        </div>

        {/* Optional Notes */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Optional set notes (e.g. clean form, felt light)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-900/30"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? "Logging Set..." : `Log Set #${nextSetNumber}`}
        </button>
      </form>
    </div>
  );
};
