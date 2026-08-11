"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Swords, Crown, Play, Trophy, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { useWorkoutStore } from "@/features/workouts/store/useWorkoutStore";

import { API_BASE_URL } from "@/constants";
import { getEnemySpriteUrl } from "@/utils/spriteUtils";
import { CurrencyIcon } from "@/components/CurrencyDisplay";

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
    try {
      const res = await fetch(`${API_BASE_URL}/api/fitness/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: user.id })
      });
      if (res.ok) {
        const session = await res.json();
        startWorkout(session.id);
        router.push("/workouts"); // Redirect to workouts page where active workout modal shows
      } else {
        toast.error("Failed to start boss challenge.");
      }
    } catch (e) {
      toast.error("Network error starting challenge.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="max-w-md w-full border-dashed border-2 bg-slate-950/50">
          <CardContent className="pt-6 text-center space-y-4">
            <Crown className="w-12 h-12 mx-auto text-slate-700" />
            <h3 className="text-xl font-bold">No Boss Available</h3>
            <p className="text-muted-foreground">The Weekly Boss PR system is currently unavailable or resting.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hpPercent = boss.isDefeated ? 0 : Math.max(0, 100 - (boss.currentDamage * 100));
  const rewards = JSON.parse(boss.rewards);
  const damageLogs = boss.damageLogs ? JSON.parse(boss.damageLogs) : [];

  return (
    <div className="flex flex-col h-full gap-6 p-6 max-w-4xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Swords className="w-8 h-8 text-red-500" />
            Weekly Boss PR
          </h1>
          <p className="text-muted-foreground mt-1">Break your limits to defeat the Weekly Boss.</p>
        </div>
        
        {boss.isDefeated && (
          <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/50 text-sm px-4 py-1.5 uppercase font-black tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Defeated
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Boss Display */}
        <Card className={`relative overflow-hidden border-2 ${boss.isDefeated ? 'border-amber-500/30 bg-amber-950/10' : 'border-red-900/50 bg-red-950/10'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          
          <CardHeader className="text-center relative z-10">
            <Badge variant="outline" className="mx-auto mb-2 text-xs border-red-500/50 text-red-400">
              {boss.name}
            </Badge>
            <div className="h-48 flex items-center justify-center my-4">
               {boss.name || boss.bossSprite ? (
                 <img 
                   src={getEnemySpriteUrl(boss.name || boss.bossSprite || "Gym Behemoth", { isBoss: true, preferAnimated: true })} 
                   alt={boss.name || "Weekly Boss"}
                   onError={(e) => { e.currentTarget.src = "/bosses/gollux.gif"; }}
                   className={`h-full object-contain ${boss.isDefeated ? 'grayscale opacity-50' : 'drop-shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-105 transition-transform'}`}
                 />
               ) : (
                 <Crown className="w-32 h-32 text-red-950" />
               )}
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-red-400">BOSS HP</span>
                <span className="text-slate-300">{hpPercent.toFixed(1)}%</span>
              </div>
              <Progress value={hpPercent} className={`h-3 ${boss.isDefeated ? '[&>div]:bg-slate-700' : '[&>div]:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
            </div>
            
            <div className="bg-background/80 p-4 rounded-xl border border-red-900/30">
              <h4 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" /> WIN CONDITION
              </h4>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-xl font-black text-white">{boss.targetExercise}</div>
                <div className="text-red-400 font-mono font-bold mt-1 text-lg">
                  {boss.targetWeight}KG × {boss.targetReps} Reps
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  *Proportional damage is dealt even if you don't fully meet the target.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action & Info */}
        <div className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> 
                Bounty Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 text-sm font-bold">
                  +{rewards.exp} EXP
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 text-sm font-bold flex items-center gap-1.5">
                  <CurrencyIcon type="GOLD" size="xs" />
                  <span>+{rewards.gold} Gold</span>
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 text-sm font-bold uppercase">
                  +1 {rewards.stat}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400 space-y-3">
              <p>1. Start a workout session and log sets for <strong className="text-white">{boss.targetExercise}</strong>.</p>
              <p>2. The closer your set is to the target weight and reps, the more damage you deal to the boss.</p>
              <p>3. Damage accumulates over the week. You have until <strong className="text-white">{new Date(boss.expiresAt).toLocaleDateString()}</strong> to defeat it.</p>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full h-14 bg-red-600 hover:bg-red-500 text-white font-black text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
            disabled={boss.isDefeated || isWorkoutActive}
            onClick={handleStartChallenge}
          >
            {boss.isDefeated ? "Boss Defeated" : isWorkoutActive ? "Session Active" : (
              <><Play className="w-6 h-6 mr-2 fill-white" /> Challenge Boss</>
            )}
          </Button>
        </div>
      </div>

      {/* Combat Damage Log Feed */}
      <Card className="bg-card/50 border border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-lg flex items-center gap-2 font-mono uppercase tracking-wider text-red-400">
            <Swords className="w-5 h-5 text-red-500" />
            Combat Damage Log Feed
          </CardTitle>
          <CardDescription className="text-xs font-mono text-slate-400">
            Real-time record of all successful strikes dealt to {boss.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {damageLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
              No strike telemetry recorded yet. Log sets of {boss.targetExercise} to deal direct HP damage.
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {damageLogs.map((log: any, idx: number) => (
                <div key={log.id || idx} className="p-3 bg-slate-950/60 border border-red-950/40 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-red-950/80 border border-red-500/30 text-red-400 font-bold rounded text-[10px] uppercase">
                      ⚔️ STRIKE
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">
                        Dealt <span className="text-red-400">{(log.damageDealt || 2000).toLocaleString()} DMG</span> with {log.exerciseName} ({log.weight} KG × {log.reps} Reps)
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Remaining Boss HP: <span className="text-amber-400 font-bold">{log.hpPercentAfter}%</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
