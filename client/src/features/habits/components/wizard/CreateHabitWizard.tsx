import React from "react";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepSchedule } from "./StepSchedule";
import { StepDifficulty } from "./StepDifficulty";
import { StepTiers } from "./StepTiers";
import { StepReview } from "./StepReview";
import { useCreateHabitStore } from "../../store/useCreateHabitStore";
import { useHabitStore } from "../../store/useHabitStore";
import { useRouter } from "next/navigation";

export const CreateHabitWizard: React.FC = () => {
  const { step, nextStep, prevStep, getPayload, reset } = useCreateHabitStore();
  const { createNewHabit, isLoading } = useHabitStore();
  const router = useRouter();

  const handleNext = () => {
    nextStep();
  };

  const handleBack = () => {
    if (step === 1) {
      reset();
      router.push("/habits");
    } else {
      prevStep();
    }
  };

  const handleSubmit = async () => {
    const payload = getPayload();
    // Use the mock character id as in useHabitStore or pass if available
    const newHabit = await createNewHabit("char-id-123", payload);
    if (newHabit) {
      reset();
      router.push("/habits");
    } else {
      alert("Failed to create habit. Please check console.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <StepBasicInfo />;
      case 2: return <StepSchedule />;
      case 3: return <StepDifficulty />;
      case 4: return <StepTiers />;
      case 5: return <StepReview />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#151C33]/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-10 relative overflow-hidden">
        {/* Neon accent line at top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s 
                    ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]" 
                    : step > s 
                      ? "bg-slate-600 text-slate-300" 
                      : "bg-[#0D1117] text-slate-500 border border-slate-700"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s !== 5 && (
                <div 
                  className={`hidden sm:block h-1 w-full -mx-4 mt-4 absolute z-[-1] transition-all ${
                    step > s ? "bg-slate-600" : "bg-slate-800"
                  }`} 
                  style={{ top: '1.25rem', left: `calc(${s * 20}% - 10%)`, width: '20%' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex justify-between border-t border-slate-700/50 pt-6">
          <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-8 py-2 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-2 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Habit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
