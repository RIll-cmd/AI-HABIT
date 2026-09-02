"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { HabitDifficulty, PrimaryStat, ScheduleType } from "../types";
import { getBaseReward } from "../utils";
import { useHabitStore } from "../store";
import { PixelBadge } from "@/components/ui/pixel/PixelBadge";
import { PixelButton } from "@/components/ui/pixel/PixelButton";
import { PixelProgress } from "@/components/ui/pixel/PixelProgress";
import {
  PixelSparklesIcon,
  PixelDumbbellIcon,
  PixelHeartIcon,
  PixelBookIcon,
  PixelTargetIcon,
  PixelLightningIcon,
  PixelShieldIcon,
  PixelActivityIcon,
  PixelCheckIcon,
  PixelArrowRightIcon,
  PixelArrowLeftIcon,
  PixelFlameIcon,
  PixelCoinsIcon,
  PixelStarIcon,
  PixelLayersIcon,
  PixelCalendarIcon,
  PixelHistoryIcon,
} from "@/components/ui/pixel/PixelIcons";

const CATEGORIES = [
  { id: "Health", label: "Health", icon: PixelHeartIcon, color: "text-emerald-400" },
  { id: "Fitness", label: "Fitness", icon: PixelDumbbellIcon, color: "text-red-400" },
  { id: "Productivity", label: "Productivity", icon: PixelTargetIcon, color: "text-purple-400" },
  { id: "Mindfulness", label: "Mindfulness", icon: PixelSparklesIcon, color: "text-pink-400" },
  { id: "Learning", label: "Learning", icon: PixelBookIcon, color: "text-amber-400" },
  { id: "Finance", label: "Finance", icon: PixelCoinsIcon, color: "text-yellow-400" },
];

const PRIMARY_STATS: { id: PrimaryStat; label: string; icon: any; desc: string }[] = [
  { id: "strength", label: "Strength", icon: PixelDumbbellIcon, desc: "Physical power & fitness" },
  { id: "knowledge", label: "Knowledge", icon: PixelBookIcon, desc: "Learning & mental sharpness" },
  { id: "discipline", label: "Discipline", icon: PixelShieldIcon, desc: "Willpower & task execution" },
  { id: "focus", label: "Focus", icon: PixelTargetIcon, desc: "Concentration & deep work" },
  { id: "endurance", label: "Endurance", icon: PixelLightningIcon, desc: "Stamina & persistence" },
  { id: "recovery", label: "Recovery", icon: PixelHeartIcon, desc: "Rest, health & vitality" },
  { id: "consistency", label: "Consistency", icon: PixelActivityIcon, desc: "Streak stability & habit strength" },
];

const DIFFICULTIES: { id: HabitDifficulty; label: string; desc: string }[] = [
  { id: "EASY", label: "Easy", desc: "Quick daily routines (+15 EXP, +5 Gold, +2 Stat)" },
  { id: "MEDIUM", label: "Medium", desc: "Standard focused effort (+35 EXP, +12 Gold, +5 Stat)" },
  { id: "HARD", label: "Hard", desc: "Challenging growth missions (+75 EXP, +25 Gold, +10 Stat)" },
];

const SCHEDULE_TYPES: { id: ScheduleType; label: string; desc: string; icon: any }[] = [
  { id: "DAILY", label: "Daily", desc: "Repeats every single day", icon: PixelCalendarIcon },
  { id: "X_TIMES_WEEK", label: "Weekly", desc: "Repeats once per week", icon: PixelHistoryIcon },
  { id: "MONTHLY", label: "Monthly", desc: "Repeats once per month", icon: PixelLayersIcon },
  { id: "CUSTOM", label: "Custom (RRule)", desc: "Advanced flexible scheduling", icon: PixelActivityIcon },
];

export interface MissionWizardProps {
  onClose?: () => void;
}

export function MissionWizard({ onClose }: MissionWizardProps) {
  const router = useRouter();
  const { createNewHabit } = useHabitStore();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Health");
  const [primaryStat, setPrimaryStat] = useState<PrimaryStat>("discipline");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("MEDIUM");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("DAILY");
  const [rruleString, setRruleString] = useState<string>("FREQ=WEEKLY;BYDAY=MO,WE,FR");

  const totalSteps = 6;

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const base = getBaseReward(difficulty);
      const result = await createNewHabit("char-id-123", {
        name: name.trim(),
        description: description.trim() || null,
        category,
        difficulty,
        primaryStat,
        scheduleType,
        rrule: scheduleType === "CUSTOM" ? rruleString : null,
        tiers: [
          { tier: "MINI", targetValue: 1, targetUnit: "Rep", baseExp: Math.round(base.exp * 0.4), baseGold: Math.round(base.gold * 0.4), statReward: Math.round(base.stat * 0.4) },
          { tier: "NORMAL", targetValue: 2, targetUnit: "Reps", baseExp: base.exp, baseGold: base.gold, statReward: base.stat },
          { tier: "ELITE", targetValue: 3, targetUnit: "Reps", baseExp: Math.round(base.exp * 1.7), baseGold: Math.round(base.gold * 1.7), statReward: Math.round(base.stat * 1.7) },
        ],
      });

      if (result) {
        toast.success(`Mission "${name}" forged successfully!`, {
          description: "Today's daily quest board has been updated.",
        });
        if (onClose) {
          onClose();
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error("Failed to forge habit mission. Please try again.");
      }
    } catch (error) {
      console.error("[MissionWizard] Creation error:", error);
      toast.error("An unexpected error occurred while creating habit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const baseReward = getBaseReward(difficulty);

  const slideVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <div className="w-full max-w-2xl bg-[#1A102F] border-4 border-[#3b1861] shadow-[0_-4px_0_0_#000,0_4px_0_0_#000,-4px_0_0_0_#000,4px_0_0_0_#000] text-white font-pixel select-none space-y-4 p-5 sm:p-6 relative">
      {/* Wizard Header */}
      <div className="border-b-2 border-black/40 pb-3.5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#120824] border border-[#3b1861] flex items-center justify-center text-cyan-400">
              <PixelSparklesIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold pixel-text-outlined uppercase tracking-wider text-white">
                Forge Habit Template
              </h2>
              <p className="text-[9px] text-white/60 uppercase">
                Step {step} of {totalSteps}: Permanent Habit Routine
              </p>
            </div>
          </div>
          <PixelBadge variant="purple" size="sm">
            Phase 3 Engine
          </PixelBadge>
        </div>

        {/* Step Progress Bar */}
        <PixelProgress value={step} max={totalSteps} variant="primary" height="sm" />
      </div>

      <div>
        <AnimatePresence mode="wait">
          {/* STEP 1: NAME & DESCRIPTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="text-white/80 block mb-1 font-bold uppercase text-[10px] tracking-wider">
                  Habit Name <span className="text-rose-400">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning Hydration, 30-Min Cardio, Deep Reading"
                  className="w-full bg-[#120824] border-2 border-[#3b1861] focus:border-cyan-400 p-2.5 text-white placeholder-white/30 focus:outline-none text-xs"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-white/80 block mb-1 font-bold uppercase text-[10px] tracking-wider">
                  Description <span className="text-white/40 text-[9px]">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of your daily execution target..."
                  rows={3}
                  className="w-full bg-[#120824] border-2 border-[#3b1861] focus:border-cyan-400 p-2.5 text-white placeholder-white/30 focus:outline-none text-xs resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: CATEGORY */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="space-y-3 text-xs"
            >
              <p className="text-white/80 font-bold uppercase text-[10px] tracking-wider">
                Select Domain Category:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 border-2 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer active:translate-y-0.5 ${
                        isSelected
                          ? "border-cyan-400 bg-[#25123D] text-cyan-300 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.2)]"
                          : "border-[#3b1861] bg-[#120824] text-white/70 hover:border-white/40"
                      }`}
                    >
                      <div className="w-8 h-8 bg-[#1A102F] border border-[#3b1861] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: PRIMARY STAT */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="space-y-3 text-xs"
            >
              <p className="text-white/80 font-bold uppercase text-[10px] tracking-wider">
                Select Primary Attribute Stat to Train:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {PRIMARY_STATS.map((st) => {
                  const Icon = st.icon;
                  const isSelected = primaryStat === st.id;
                  return (
                    <button
                      type="button"
                      key={st.id}
                      onClick={() => setPrimaryStat(st.id)}
                      className={`p-2.5 border-2 flex items-center gap-2.5 text-left cursor-pointer active:translate-y-0.5 ${
                        isSelected
                          ? "border-purple-400 bg-[#25123D] text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.2)]"
                          : "border-[#3b1861] bg-[#120824] text-white/70 hover:border-white/40"
                      }`}
                    >
                      <div className="w-7 h-7 bg-[#1A102F] border border-[#3b1861] flex items-center justify-center text-purple-400 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold uppercase text-white">
                          {st.label}
                        </div>
                        <div className="text-[10px] text-white/50 truncate">
                          {st.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <PixelCheckIcon className="w-4 h-4 text-purple-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: DIFFICULTY */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="space-y-3 text-xs"
            >
              <p className="text-white/80 font-bold uppercase text-[10px] tracking-wider">
                Select Difficulty Tier:
              </p>
              <div className="space-y-2.5">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <button
                      type="button"
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`w-full p-3 border-2 flex items-center justify-between text-left cursor-pointer active:translate-y-0.5 ${
                        isSelected
                          ? "border-cyan-400 bg-[#25123D] text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.2)]"
                          : "border-[#3b1861] bg-[#120824] text-white/70 hover:border-white/40"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase text-white">
                            {diff.label}
                          </span>
                          <PixelBadge variant={diff.id === "HARD" ? "danger" : diff.id === "MEDIUM" ? "cyan" : "success"} size="sm">
                            {diff.id}
                          </PixelBadge>
                        </div>
                        <p className="text-[10px] text-white/60">{diff.desc}</p>
                      </div>
                      {isSelected && (
                        <PixelCheckIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 5: SCHEDULE TYPE */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="space-y-3 text-xs"
            >
              <p className="text-white/80 font-bold uppercase text-[10px] tracking-wider">
                Select Repetition Cadence:
              </p>
              <div className="space-y-2.5">
                {SCHEDULE_TYPES.map((sch) => {
                  const Icon = sch.icon;
                  const isSelected = scheduleType === sch.id;
                  return (
                    <button
                      type="button"
                      key={sch.id}
                      onClick={() => setScheduleType(sch.id)}
                      className={`w-full p-3 border-2 flex items-center gap-3 text-left cursor-pointer active:translate-y-0.5 ${
                        isSelected
                          ? "border-emerald-400 bg-[#25123D] text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.2)]"
                          : "border-[#3b1861] bg-[#120824] text-white/70 hover:border-white/40"
                      }`}
                    >
                      <div className="w-8 h-8 bg-[#1A102F] border border-[#3b1861] flex items-center justify-center text-emerald-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold uppercase text-white">
                          {sch.label}
                        </div>
                        <div className="text-[10px] text-white/60">{sch.desc}</div>
                      </div>
                      {isSelected && (
                        <PixelCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {scheduleType === "CUSTOM" && (
                <div className="mt-3 p-3 bg-[#120824] border-2 border-[#3b1861] space-y-1.5">
                  <label className="text-[10px] font-bold text-cyan-300 uppercase block">
                    Custom Recurrence Rule (RFC 5545)
                  </label>
                  <input
                    value={rruleString}
                    onChange={(e) => setRruleString(e.target.value)}
                    placeholder="e.g. FREQ=WEEKLY;BYDAY=MO,WE,FR"
                    className="w-full bg-[#1A102F] border border-[#3b1861] p-2 text-white text-xs"
                  />
                  <p className="text-[9px] text-white/50">
                    Example: FREQ=WEEKLY;INTERVAL=2 (Every 2 weeks)
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 6: CONFIRMATION SUMMARY */}
          {step === 6 && (
            <motion.div
              key="step6"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="space-y-3 text-xs"
            >
              <div className="border-2 border-[#3b1861] bg-[#120824] p-3.5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <PixelBadge variant="cyan" size="sm" className="mb-1">
                      {category} • {scheduleType}
                    </PixelBadge>
                    <h4 className="text-xs sm:text-sm font-bold uppercase text-white">
                      {name}
                    </h4>
                    {description && (
                      <p className="text-[10px] text-white/60 mt-1">{description}</p>
                    )}
                  </div>
                  <PixelBadge variant="purple" size="sm">
                    {primaryStat}
                  </PixelBadge>
                </div>

                <div className="grid grid-cols-3 gap-2.5 border-t border-[#3b1861] pt-3">
                  <div className="bg-[#1A0D2E] p-2 text-center border border-[#3b1861]">
                    <div className="text-[9px] text-white/50 mb-0.5">Base EXP</div>
                    <div className="text-xs font-bold text-cyan-300 flex items-center justify-center gap-1">
                      <PixelFlameIcon className="w-3 h-3 text-cyan-300" />
                      <span>+{baseReward.exp}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A0D2E] p-2 text-center border border-[#3b1861]">
                    <div className="text-[9px] text-white/50 mb-0.5">Base Gold</div>
                    <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
                      <PixelCoinsIcon className="w-3 h-3 text-amber-300" />
                      <span>+{baseReward.gold}</span>
                    </div>
                  </div>

                  <div className="bg-[#1A0D2E] p-2 text-center border border-[#3b1861]">
                    <div className="text-[9px] text-white/50 mb-0.5">Base Stat</div>
                    <div className="text-xs font-bold text-purple-300 flex items-center justify-center gap-1">
                      <PixelStarIcon className="w-3 h-3 text-purple-300" />
                      <span>+{baseReward.stat}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1A0D2E] p-2.5 border border-[#3b1861] flex items-center justify-between text-[10px] text-white/70">
                  <span>Difficulty: <strong className="text-white">{difficulty}</strong></span>
                  <span>Schedule: <strong className="text-white">{scheduleType}</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between mt-4 border-t-2 border-black/40 pt-3">
          <PixelButton
            type="button"
            variant="dark"
            size="sm"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="text-xs"
          >
            <PixelArrowLeftIcon className="w-3 h-3 mr-1" /> Back
          </PixelButton>

          {step < totalSteps ? (
            <PixelButton
              type="button"
              variant="cyan"
              size="sm"
              onClick={handleNext}
              className="text-xs"
            >
              Next <PixelArrowRightIcon className="w-3 h-3 ml-1" />
            </PixelButton>
          ) : (
            <PixelButton
              type="button"
              variant="gold"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-xs"
            >
              {isSubmitting ? (
                <span>Forging Habit...</span>
              ) : (
                <span className="flex items-center">
                  Forge Habit Mission <PixelSparklesIcon className="w-3 h-3 ml-1" />
                </span>
              )}
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}

