"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Swords,
  Crown,
  Play,
  Trophy,
  Crosshair,
  Sparkles,
  Flame,
  Shield,
  Zap,
  Target,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";
import { API_BASE_URL } from "@/constants";
import { getEnemySpriteUrl } from "@/utils/spriteUtils";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { FloatingRuneField } from "@/components/shared/FloatingRuneField";
import { playBattleSFX, playUIMenuSFX, playBuffSFX } from "@/utils/audio";
import Link from "next/link";

export default function BossPRPage() {
  const { user } = useUser();
  const router = useRouter();
  const { startWorkout, isWorkoutActive } = useWorkoutStore();
  const [boss, setBoss] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBoss = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/fitness/boss/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBoss(data);
        }
      } catch (e) {
        toast.error("Failed to load Weekly Boss");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoss();
  }, [user?.id]);

  const handleStartChallenge = async () => {
    if (!user?.id) return;
    playBattleSFX("encounter");
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.id }),
      });
      if (res.ok) {
        const session = await res.json();
        startWorkout(session.id);
        playBuffSFX("speed");
        router.push("/workouts");
      } else {
        toast.error("Failed to start boss challenge.");
      }
    } catch (e) {
      toast.error("Network error starting challenge.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center font-mono text-sm text-red-400 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span>Initializing Boss PR Containment Arena...</span>
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="flex h-[70vh] items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-[26px] bg-gradient-to-br from-[#120a16] to-[#08050e] border border-red-500/20 text-center space-y-4 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <FloatingRuneField density="low" className="opacity-30" />
          <Crown className="w-16 h-16 mx-auto text-red-500/40 animate-pulse" />
          <h3 className="text-xl font-black text-white font-heading">No Active Weekly Boss</h3>
          <p className="text-xs text-slate-400 font-mono">
            The Weekly Boss PR system is currently calibrating the next titan. Check back shortly.
          </p>
          <Link href="/workouts">
            <button className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono font-bold hover:bg-slate-800 transition-all cursor-pointer mt-2">
              ← Return to Workout Command
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const hpPercent = boss.isDefeated ? 0 : Math.max(0, 100 - boss.currentDamage * 100);
  const rewards = typeof boss.rewards === "string" ? JSON.parse(boss.rewards) : boss.rewards || {};
  const damageLogs = boss.damageLogs ? (typeof boss.damageLogs === "string" ? JSON.parse(boss.damageLogs) : boss.damageLogs) : [];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 font-sans relative text-slate-100 pb-16 animate-in fade-in duration-300">
      {/* Background Floating Runes & Moving Particles */}
      <FloatingRuneField density="low" className="opacity-60" />

      {/* ========================================================= */}
      {/* TOP ARENA HEADER */}
      {/* ========================================================= */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#1c0b1a]/95 via-[#120716]/95 to-[#08030d]/98 border border-red-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden backdrop-blur-2xl shrink-0">
        {/* Floating Runes */}
        <FloatingRuneField density="high" />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />

        {/* Cyber Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Link href="/workouts">
              <button
                onClick={() => playUIMenuSFX()}
                className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-300 hover:text-white hover:bg-red-900/60 transition-all cursor-pointer shrink-0 shadow-lg group"
                title="Back to Workouts"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </Link>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" />
                  WEEKLY RAID TRIAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/50 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)] flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-red-400 animate-pulse" />
                  TITAN ENCOUNTER
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                Weekly Boss PR Arena
              </h1>
              <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                Break personal record thresholds to deal proportional kinetic strikes against {boss.name}.
              </p>
            </div>
          </div>

          {boss.isDefeated ? (
            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/60 text-xs px-4 py-2 uppercase font-black font-mono tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              TITAN DEFEATED
            </Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-300 border border-red-500/60 text-xs px-4 py-2 uppercase font-black font-mono tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-1.5 animate-pulse">
              <Crosshair className="w-4 h-4 text-red-400" />
              ACTIVE TARGET
            </Badge>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOSS DISPLAY & ACTION GRID */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Boss Stage Podium Card */}
        <div
          className={`relative rounded-[28px] overflow-hidden border-2 p-6 md:p-8 backdrop-blur-2xl flex flex-col justify-between shadow-2xl transition-all ${
            boss.isDefeated
              ? "border-amber-500/40 bg-gradient-to-br from-[#120e06]/95 via-[#0c0903]/95 to-[#050401]/98 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
              : "border-red-600/40 bg-gradient-to-br from-[#1c0814]/95 via-[#11050e]/95 to-[#080206]/98 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
          }`}
        >
          {/* Floating Runes */}
          <FloatingRuneField density="low" className="opacity-30" />

          {/* Boss Stage Header */}
          <div className="relative z-10 text-center space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-widest inline-block border ${
                boss.isDefeated
                  ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                  : "bg-red-950/80 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              }`}
            >
              {boss.name}
            </span>

            {/* Boss Sprite Avatar */}
            <div className="h-56 flex items-center justify-center my-4 relative">
              <div
                className={`absolute w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                  boss.isDefeated ? "bg-amber-500/10" : "bg-red-600/20 animate-pulse"
                }`}
              />
              {boss.name || boss.bossSprite ? (
                <img
                  src={getEnemySpriteUrl(boss.name || boss.bossSprite || "Gym Behemoth", {
                    isBoss: true,
                    preferAnimated: true,
                  })}
                  alt={boss.name || "Weekly Boss"}
                  onError={(e) => {
                    e.currentTarget.src = "/bosses/gollux.gif";
                  }}
                  className={`h-full object-contain relative z-10 ${
                    boss.isDefeated
                      ? "grayscale opacity-40"
                      : "drop-shadow-[0_0_35px_rgba(239,68,68,0.6)] hover:scale-110 transition-transform duration-300"
                  }`}
                />
              ) : (
                <Crown className="w-36 h-36 text-red-950 relative z-10" />
              )}
            </div>
          </div>

          {/* HP Bar & Win Condition Directive */}
          <div className="relative z-10 space-y-5">
            {/* HP Bar */}
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-xs font-black">
                <span className="text-red-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-red-400 animate-pulse" />
                  TITAN INTEGRITY
                </span>
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {hpPercent.toFixed(1)}% HP
                </span>
              </div>
              <div className="h-4 w-full bg-[#050208] rounded-full overflow-hidden border border-red-950 p-[1.5px] shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    boss.isDefeated
                      ? "bg-slate-800"
                      : "bg-gradient-to-r from-red-700 via-red-500 to-amber-400 shadow-[0_0_15px_#ef4444]"
                  }`}
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* Win Condition Directive Card */}
            <div className="p-4 rounded-2xl bg-[#08030d]/90 border border-red-500/30 text-center shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                <Crosshair className="w-3.5 h-3.5 text-red-400" />
                <span>OVERLOAD WIN CONDITION</span>
              </div>
              <div className="text-lg font-black text-white font-heading">{boss.targetExercise}</div>
              <div className="text-red-400 font-mono font-black text-xl tracking-tight mt-0.5 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {boss.targetWeight} KG × {boss.targetReps} Reps
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                *Proportional kinetic damage is dealt based on proximity to target overload parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Action & Info Deck */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Bounty Loot Rewards Deck */}
          <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <FloatingRuneField density="low" className="opacity-20" />

            <div className="flex items-center gap-2.5 pb-3 border-b border-amber-500/20 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-heading tracking-tight">
                  Bounty Loot Rewards
                </h3>
                <p className="text-[10.5px] font-mono text-slate-400">
                  Earned immediately upon full boss HP annihilation
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-4 relative z-10">
              <Badge className="bg-blue-950/80 text-blue-300 border border-blue-500/40 px-3.5 py-1.5 text-xs font-mono font-bold shadow-[0_0_10px_rgba(59,130,246,0.25)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>+{rewards.exp || 2500} EXP</span>
              </Badge>

              <Badge className="bg-amber-950/80 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 text-xs font-mono font-bold shadow-[0_0_10px_rgba(245,158,11,0.25)] flex items-center gap-1.5">
                <CurrencyIcon type="GOLD" size="xs" />
                <span>+{rewards.gold || 1000} Gold</span>
              </Badge>

              <Badge className="bg-purple-950/80 text-purple-300 border border-purple-500/40 px-3.5 py-1.5 text-xs font-mono font-bold shadow-[0_0_10px_rgba(168,85,247,0.25)] flex items-center gap-1.5">
                <CurrencyIcon type="GEMS" size="xs" />
                <span>+{rewards.gems || 50} Gems</span>
              </Badge>

              <Badge className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-3.5 py-1.5 text-xs font-mono font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)] flex items-center gap-1.5">
                <CurrencyIcon type="TOWER_TOKENS" size="xs" />
                <span>+{rewards.towerTokens || 100} Tokens</span>
              </Badge>

              <Badge className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-mono font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)] uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  +{rewards.statAmount || 2} {rewards.stat || "Strength"}
                </span>
              </Badge>
            </div>
          </div>

          {/* Tactical Directive Instructions */}
          <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-slate-800 shadow-xl relative overflow-hidden backdrop-blur-2xl space-y-3 font-mono text-xs text-slate-300">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Target className="w-3.5 h-3.5 text-red-400" />
              Combat Protocol Briefing
            </div>
            <p className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <span>
                Start a workout session and log sets for <strong className="text-white">{boss.targetExercise}</strong>.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <span>
                Damage is automatically calculated and dealt based on your heaviest completed sets and reps.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <span>
                Damage accumulates throughout the week until expiration on{" "}
                <strong suppressHydrationWarning className="text-amber-400">{new Date(boss.expiresAt).toLocaleDateString()}</strong>.
              </span>
            </p>
          </div>

          {/* Epic Challenge Boss Launch Button */}
          <button
            disabled={boss.isDefeated || isWorkoutActive}
            onClick={handleStartChallenge}
            className={`w-full py-4 rounded-[22px] font-black text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xl active:scale-95 ${
              boss.isDefeated
                ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed"
                : isWorkoutActive
                ? "bg-indigo-950 text-indigo-300 border border-indigo-500/50 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 via-orange-600 to-red-700 hover:from-red-500 hover:to-orange-500 text-white shadow-[0_0_35px_rgba(239,68,68,0.5)] border border-red-500/60"
            }`}
          >
            {boss.isDefeated ? (
              <>
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Titan Defeated This Week</span>
              </>
            ) : isWorkoutActive ? (
              <>
                <Shield className="w-5 h-5 text-indigo-400" />
                <span>Session Currently Active (Check HUD)</span>
              </>
            ) : (
              <>
                <Swords className="w-5 h-5 fill-white animate-bounce" />
                <span>Initiate Boss Raid Challenge</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COMBAT DAMAGE LOG FEED TERMINAL */}
      {/* ========================================================= */}
      <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#0C1226]/95 via-[#080E20]/95 to-[#050914]/98 border border-red-950/60 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <FloatingRuneField density="low" className="opacity-20" />

        <div className="flex items-center justify-between pb-4 border-b border-red-500/20 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-heading tracking-tight">
                Combat Strike Feed
              </h3>
              <p className="text-[10.5px] font-mono text-slate-400">
                Real-time telemetry of kinetic strikes dealt to {boss.name}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
            {damageLogs.length} Strikes Recorded
          </span>
        </div>

        <div className="pt-4 relative z-10">
          {damageLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl bg-[#050914]/60">
              No strike telemetry recorded yet this cycle. Log sets of {boss.targetExercise} to unleash direct damage.
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {damageLogs.map((log: any, idx: number) => (
                <div
                  key={log.id || idx}
                  className="p-3.5 bg-[#07030d]/80 border border-red-900/40 rounded-xl flex items-center justify-between shadow-sm hover:border-red-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-red-950/90 border border-red-500/40 text-red-300 font-black rounded-lg text-[10px] uppercase flex items-center gap-1 shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                      <Swords className="w-3 h-3 text-red-400" />
                      <span>STRIKE</span>
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">
                        Dealt <span className="text-red-400 font-black">{(log.damageDealt || 2000).toLocaleString()} DMG</span>{" "}
                        with {log.exerciseName} ({log.weight} KG × {log.reps} Reps)
                      </p>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">
                        Remaining Boss HP: <span className="text-amber-400 font-bold">{log.hpPercentAfter}%</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10.5px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

