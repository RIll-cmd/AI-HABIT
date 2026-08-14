import React from "react";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepSchedule } from "./StepSchedule";
import { StepDifficulty } from "./StepDifficulty";
import { StepTiers } from "./StepTiers";
import { StepReview } from "./StepReview";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { useHabitStore } from "../../store/useHabitStore";
import { useRouter } from "next/navigation";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { Target, Sparkles, ChevronRight, ArrowLeft } from "lucide-react";
import { playBuffSFX, playUIMenuSFX } from "@/utils/audio";
import { toast } from "sonner";

const STEP_LABELS = [
  "Identity",
  "Schedule",
  "Difficulty",
  "Tiers",
  "Review",
];

export const CreateHabitWizard: React.FC = () => {
  const { step, nextStep, prevStep, getPayload, reset } = useCreateHabitStore();
  const { createNewHabit, isLoading } = useHabitStore();
  const router = useRouter();

  const handleNext = () => {
    playUIMenuSFX();
    nextStep();
  };

  const handleBack = () => {
    playUIMenuSFX();
    if (step === 1) {
      reset();
      router.push("/habits");
    } else {
      prevStep();
    }
  };

  const handleSubmit = async () => {
    const payload = getPayload();
    const newHabit = await createNewHabit("char-id-123", payload);
    if (newHabit) {
      playBuffSFX();
      toast.success(`Protocol constructed: ${newHabit.name}!`);
      reset();
      router.push("/habits");
    } else {
      toast.error("Failed to construct habit protocol.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepBasicInfo />;
      case 2:
        return <StepSchedule />;
      case 3:
        return <StepDifficulty />;
      case 4:
        return <StepTiers />;
      case 5:
        return <StepReview />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 sm:p-6 relative font-sans">
      {/* Background Floating Runes */}
      <FloatingRuneField density="low" className="opacity-40" />

      <div className="w-full max-w-2xl bg-gradient-to-br from-[#0C1226]/98 via-[#080E20]/98 to-[#050914]/98 backdrop-blur-2xl rounded-[28px] shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-cyan-500/30 p-6 sm:p-10 relative overflow-hidden text-slate-100">
        {/* Floating Runes inside wizard */}
        <FloatingRuneField density="low" />

        {/* Top Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent pointer-events-none" />

        {/* Wizard Header */}
        <div className="flex items-center justify-between pb-6 border-b border-cyan-500/15 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-heading text-white tracking-tight">
                Construct Ascension Protocol
              </h2>
              <p className="text-[10.5px] font-mono text-slate-400">
                Step {step} of 5 • {STEP_LABELS[step - 1]} Configuration
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
            PHASE {step}/5
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 relative z-10 px-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-mono font-black transition-all ${
                  step === s
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-300 scale-110"
                    : step > s
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "bg-[#060B18] text-slate-500 border border-slate-800"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <span className={`text-[9.5px] font-mono uppercase mt-1.5 hidden sm:block font-bold ${
                step === s ? "text-cyan-300" : step > s ? "text-emerald-400" : "text-slate-600"
              }`}>
                {STEP_LABELS[s - 1]}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[360px] relative z-10">
          {renderStep()}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-between items-center border-t border-cyan-500/15 pt-6 relative z-10">
          <button
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-7 py-2.5 rounded-xl font-extrabold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl font-extrabold font-mono text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isLoading ? "Constructing..." : "Activate Protocol"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

