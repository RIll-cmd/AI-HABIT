"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Flame,
  Dumbbell,
  Egg,
  Brain,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Activity,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type FeatureType = "habits" | "workouts" | "arsenal" | "aira" | null;

interface FeatureModalProps {
  feature: FeatureType;
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureModal({ feature, isOpen, onClose }: FeatureModalProps) {
  if (!feature) return null;

  const contentMap = {
    habits: {
      icon: Flame,
      color: "text-amber-400",
      badge: "NEURAL HABIT ENGINE",
      title: "Habit Adherence & Streak Multipliers",
      subtitle: "Multi-tiered habit schedules with streak freeze protection",
      description:
        "Ascend OS models daily routines with RPG stakes. Build unbreakable consistency through customizable daily, specific weekday, or weekly completion targets.",
      points: [
        {
          title: "Bronze, Silver, Gold Thresholds",
          desc: "Partial completion yields proportional XP and stat gains (no all-or-nothing failure).",
        },
        {
          title: "Streak Freeze Shields",
          desc: "Protect hard-earned consistency chains during illness or high-stress days.",
        },
        {
          title: "Calendar Heatmap & Telemetry",
          desc: "Visualize habit adherence patterns across 365-day chronological clusters.",
        },
      ],
      ctaText: "Configure Habit Deck",
    },
    workouts: {
      icon: Dumbbell,
      color: "text-cyan-400",
      badge: "KINETIC WORKOUT TERMINAL",
      title: "16-Muscle Anatomical Recovery",
      subtitle: "Set-by-set logging with physiological 48-72h freshness tracking",
      description:
        "Log weight, reps, and RPE with automated 1RM calculations. Exertion directly translates into Gate Boss raid damage and physical stat improvements.",
      points: [
        {
          title: "16 Anatomical Muscle Recovery Groups",
          desc: "Real-time fatigue tracking across chest, deltoids, quads, hamstrings, and CNS.",
        },
        {
          title: "Gate Boss Exertion Scaling",
          desc: "Workout volume deals direct elemental damage to active dungeon calamity bosses.",
        },
        {
          title: "PR & 1RM Telemetry",
          desc: "Track progressive overload and automated strength tier standards.",
        },
      ],
      ctaText: "Launch Workout Terminal",
    },
    arsenal: {
      icon: Egg,
      color: "text-purple-400",
      badge: "BESTIARY & RPG ARSENAL",
      title: "Companion Hatching & Equipment",
      subtitle: "Pedometer stride energy sync and socketable stat multipliers",
      description:
        "Turn real-world walking strides into incubation energy for 20 companion species. Equip armory gear with IRL attribute multipliers (STR, END, DIS, KNO, REC, FOC, CNS).",
      points: [
        {
          title: "20-Species Mythic Bestiary",
          desc: "Incubate Void Drakes, Astral Serpents, and Elemental Goliaths via step milestones.",
        },
        {
          title: "Tri-Currency In-Game Economy",
          desc: "Earn Gold, Gems, and Tower Tokens through daily consistency and boss raids.",
        },
        {
          title: "PaperDoll Equipment Sockets",
          desc: "Socket weapons, armor, and scrolls that amplify EXP and attribute gains.",
        },
      ],
      ctaText: "Explore Bestiary & Shop",
    },
    aira: {
      icon: Brain,
      color: "text-cyan-400",
      badge: "NEURAL LINK AI COMPANION",
      title: "AIRA Autonomous System Administrator",
      subtitle: "Strategic intelligence briefing your habits, recovery, and boss raids",
      description:
        "AIRA is an autonomous neural companion with real-time access to your habit database, workout volume, and sleep debt curves.",
      points: [
        {
          title: "Daily Tactical Briefing",
          desc: "Receive customized morning briefings prioritizing your most impactful daily quests.",
        },
        {
          title: "Sleep Debt & Somatic Synthesis",
          desc: "Synthesizes circadian rhythms with gym intensity to recommend optimal rest windows.",
        },
        {
          title: "High-Agency Motivation",
          desc: "Authoritative, sharp, and encouraging AI voice inspired by Solo Leveling.",
        },
      ],
      ctaText: "Initiate Neural Link",
    },
  };

  const data = contentMap[feature];
  const Icon = data.icon;

  const handleCtaClick = () => {
    onClose();
    const el = document.getElementById("auth-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-zinc-950/95 border border-zinc-800 text-zinc-100 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Icon className={`w-4 h-4 ${data.color}`} />
            </div>
            <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {data.badge}
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans mt-1">
            {data.title}
          </DialogTitle>

          <DialogDescription className="text-xs text-zinc-400 leading-relaxed font-normal">
            {data.description}
          </DialogDescription>
        </DialogHeader>

        {/* Feature Breakdown Points */}
        <div className="flex flex-col gap-3 py-3 border-y border-zinc-850">
          {data.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-zinc-200">{pt.title}</span>
                <span className="text-[11px] text-zinc-400 leading-relaxed">{pt.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Action CTA */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer font-medium py-2 px-3 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            Dismiss (✕)
          </button>

          <Button
            type="button"
            onClick={handleCtaClick}
            className="min-h-[44px] px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-xs shadow-md shadow-cyan-950/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {data.ctaText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
