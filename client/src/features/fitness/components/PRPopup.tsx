import React, { useEffect } from "react";
import { Award, Trophy, Sparkles, X, ChevronRight, Zap } from "lucide-react";
import { useFitnessStore } from "../store/useFitnessStore";
import { playSuccessfulSound } from "@/features/audio/useSystemAudio";

export const PRPopup: React.FC = () => {
  const { newPRsPopupList, dismissPRPopup } = useFitnessStore();

  useEffect(() => {
    if (newPRsPopupList.length > 0) {
      playSuccessfulSound();
    }
  }, [newPRsPopupList]);

  if (newPRsPopupList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl w-full max-w-lg p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden text-center text-slate-100">
        {/* Background Radial Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissPRPopup}
          className="absolute top-4 right-4 text-amber-300/70 hover:text-white p-1.5 rounded-lg hover:bg-amber-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Trophy Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse">
          <Trophy className="w-10 h-10 text-slate-950 drop-shadow-md" />
        </div>

        {/* Banner Headers */}
        <div className="text-xs font-mono font-black tracking-widest text-amber-400 uppercase mb-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
          SYSTEM ACHIEVEMENT UNLOCKED
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
          NEW PERSONAL RECORD!
        </h2>
        <p className="text-xs text-amber-200/80 mb-6 max-w-xs mx-auto">
          Your strength stat has ascended to new heights. You set a new personal record during this workout session!
        </p>

        {/* PR List Cards */}
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto no-scrollbar">
          {newPRsPopupList.map((pr) => (
            <div
              key={pr.id}
              className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-left shadow-lg"
            >
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  {pr.exercise?.name || "Exercise"}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  Category: <span className="text-amber-300 font-semibold">{pr.exercise?.category || "General"}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-mono font-black text-amber-400">
                  {pr.weight} kg × {pr.reps}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  EST. 1RM: <span className="text-cyan-300 font-bold">{pr.estimated1RM} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Claim Button */}
        <button
          onClick={dismissPRPopup}
          className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider py-3.5 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          Claim Record & Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
