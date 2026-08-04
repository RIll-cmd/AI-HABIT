"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  Brain,
  Zap,
  Target,
  Clock,
  Shield,
  BookOpen,
  Calendar,
  Flame,
  Star,
  Activity,
  Layers,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HabitDifficulty, PrimaryStat, ScheduleType } from "../types";
import { getBaseReward } from "../utils";
import { useHabitStore } from "../store";

const CATEGORIES = [
  { id: "Health", label: "Health", icon: HeartPulse, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { id: "Fitness", label: "Fitness", icon: Dumbbell, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { id: "Productivity", label: "Productivity", icon: Target, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  { id: "Mindfulness", label: "Mindfulness", icon: Brain, color: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
  { id: "Learning", label: "Learning", icon: BookOpen, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "Finance", label: "Finance", icon: Coins, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
];

const PRIMARY_STATS: { id: PrimaryStat; label: string; icon: any; color: string; desc: string }[] = [
  { id: "strength", label: "Strength", icon: Dumbbell, color: "text-red-400 border-red-500/30 bg-red-500/10", desc: "Physical power & fitness" },
  { id: "knowledge", label: "Knowledge", icon: BookOpen, color: "text-blue-400 border-blue-500/30 bg-blue-500/10", desc: "Learning & mental sharpness" },
  { id: "discipline", label: "Discipline", icon: Shield, color: "text-purple-400 border-purple-500/30 bg-purple-500/10", desc: "Willpower & task execution" },
  { id: "focus", label: "Focus", icon: Target, color: "text-amber-400 border-amber-500/30 bg-amber-500/10", desc: "Concentration & deep work" },
  { id: "endurance", label: "Endurance", icon: Zap, color: "text-orange-400 border-orange-500/30 bg-orange-500/10", desc: "Stamina & persistence" },
  { id: "recovery", label: "Recovery", icon: HeartPulse, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", desc: "Rest, health & vitality" },
  { id: "consistency", label: "Consistency", icon: Activity, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", desc: "Streak stability & habit strength" },
];

const DIFFICULTIES: { id: HabitDifficulty; label: string; desc: string; color: string }[] = [
  { id: "Easy", label: "Easy", desc: "Quick daily routines (15 EXP, 5 Gold, +2 Stat)", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:border-emerald-400" },
  { id: "Medium", label: "Medium", desc: "Standard focused effort (35 EXP, 12 Gold, +5 Stat)", color: "border-blue-500/40 text-blue-400 bg-blue-500/10 hover:border-blue-400" },
  { id: "Hard", label: "Hard", desc: "Challenging growth missions (75 EXP, 25 Gold, +10 Stat)", color: "border-amber-500/40 text-amber-400 bg-amber-500/10 hover:border-amber-400" },
];

const SCHEDULE_TYPES: { id: ScheduleType; label: string; desc: string; icon: any }[] = [
  { id: "Daily", label: "Daily", desc: "Repeats every single day", icon: Calendar },
  { id: "Weekly", label: "Weekly", desc: "Repeats once per week", icon: Clock },
  { id: "Monthly", label: "Monthly", desc: "Repeats once per month", icon: Layers },
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
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("Medium");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("Daily");

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
      const result = await createNewHabit("char-id-123", {
        name: name.trim(),
        description: description.trim() || null,
        category,
        difficulty,
        primaryStat,
        scheduleType,
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
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Card className="w-full max-w-2xl border-white/10 bg-[#151C33] shadow-2xl text-slate-100 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-3xl pointer-events-none rounded-full" />

      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-heading text-white">
                Forge Habit Template
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Step {step} of {totalSteps}: Create a permanent habit routine
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
            Phase 3 Engine
          </Badge>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-800/60 h-1.5 rounded-full mt-4 overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: NAME & DESCRIPTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-slate-200 block mb-1">
                  Habit Name <span className="text-red-400">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning Hydration, 30-Min Cardio, Deep Reading"
                  className="bg-[#0B1020] border-white/10 text-white focus:border-blue-500 h-12"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200 block mb-1">
                  Description <span className="text-xs text-slate-400">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of your daily execution target..."
                  rows={3}
                  className="w-full rounded-xl bg-[#0B1020] border border-white/10 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
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
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-300 font-medium mb-2">
                Select Domain Category:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col items-center justify-center text-center space-y-2 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/10 scale-[1.02]"
                          : "border-white/10 bg-[#0B1020] text-slate-300 hover:border-white/20 hover:bg-[#111827]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold">{cat.label}</span>
                    </div>
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
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-300 font-medium mb-2">
                Select Primary Attribute Stat to Train:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                {PRIMARY_STATS.map((st) => {
                  const Icon = st.icon;
                  const isSelected = primaryStat === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => setPrimaryStat(st.id)}
                      className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 flex items-center space-x-3 ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/20 text-white shadow-md shadow-purple-500/10"
                          : "border-white/10 bg-[#0B1020] text-slate-300 hover:border-white/20 hover:bg-[#111827]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg border ${st.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold capitalize text-white">
                          {st.label}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {st.desc}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      )}
                    </div>
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
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-300 font-medium mb-2">
                Select Difficulty Tier:
              </p>
              <div className="space-y-3">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = difficulty === diff.id;
                  return (
                    <div
                      key={diff.id}
                      onClick={() => setDifficulty(diff.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/10"
                          : "border-white/10 bg-[#0B1020] text-slate-300 hover:border-white/20 hover:bg-[#111827]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-bold text-white">
                            {diff.label}
                          </span>
                          <Badge variant="outline" className={diff.color}>
                            {diff.id}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{diff.desc}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0" />
                      )}
                    </div>
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
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-300 font-medium mb-2">
                Select Repetition Cadence:
              </p>
              <div className="space-y-3">
                {SCHEDULE_TYPES.map((sch) => {
                  const Icon = sch.icon;
                  const isSelected = scheduleType === sch.id;
                  return (
                    <div
                      key={sch.id}
                      onClick={() => setScheduleType(sch.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center space-x-4 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/10"
                          : "border-white/10 bg-[#0B1020] text-slate-300 hover:border-white/20 hover:bg-[#111827]"
                      }`}
                    >
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 text-emerald-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold text-white">
                          {sch.label}
                        </div>
                        <div className="text-xs text-slate-400">{sch.desc}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
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
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-white/15 bg-[#0B1020] p-5 space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 mb-1">
                      {category} • {scheduleType}
                    </Badge>
                    <h4 className="text-xl font-bold text-white font-heading">
                      {name}
                    </h4>
                    {description && (
                      <p className="text-xs text-slate-400 mt-1">{description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 capitalize">
                    {primaryStat}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                  <div className="bg-[#151C33] rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-slate-400 mb-0.5">Base EXP</div>
                    <div className="text-lg font-extrabold text-blue-400 flex items-center justify-center space-x-1">
                      <Flame className="w-4 h-4 text-blue-400" />
                      <span>+{baseReward.exp}</span>
                    </div>
                  </div>

                  <div className="bg-[#151C33] rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-slate-400 mb-0.5">Base Gold</div>
                    <div className="text-lg font-extrabold text-amber-400 flex items-center justify-center space-x-1">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>+{baseReward.gold}</span>
                    </div>
                  </div>

                  <div className="bg-[#151C33] rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-slate-400 mb-0.5">Base Stat</div>
                    <div className="text-lg font-extrabold text-purple-400 flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-purple-400" />
                      <span>+{baseReward.stat}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs text-slate-300">
                  <span>Difficulty Tier: <strong className="text-white">{difficulty}</strong></span>
                  <span>Schedule: <strong className="text-white">{scheduleType}</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between mt-6 border-t border-white/10 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? (
                <span>Forging Habit...</span>
              ) : (
                <span className="flex items-center">
                  Forge Habit Mission <Sparkles className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
