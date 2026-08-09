"use client";

import { useEffect, useState, useRef } from "react";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { CheckCircle2, ShieldAlert, Sparkles, BrainCircuit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function BattleModal() {
  const { combatLog, clearCombatLog, cielAnalysis, isAnalyzing } = useTowerStore();
  const { character } = useCharacterStore();
  
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!combatLog) {
      setDisplayedEvents([]);
      setIsAnimationComplete(false);
      return;
    }
    
    // Animate combat events appearing one by one
    let i = 0;
    const interval = setInterval(() => {
      if (i < combatLog.events.length) {
        setDisplayedEvents(prev => [...prev, combatLog.events[i]]);
        i++;
      } else {
        setIsAnimationComplete(true);
        clearInterval(interval);
      }
    }, 200); // 200ms per combat event for snappier animation
    
    return () => clearInterval(interval);
  }, [combatLog]);

  useEffect(() => {
    // Auto-scroll to bottom as new events appear
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedEvents]);

  return (
    <Dialog open={!!combatLog} onOpenChange={(open) => !open && clearCombatLog()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 font-bold tracking-tight">
            {combatLog?.isVictory ? (
              <span className="text-green-500 flex items-center gap-2"><CheckCircle2 className="w-7 h-7"/> TOWER CLEARED</span>
            ) : (
              <span className="text-red-500 flex items-center gap-2"><ShieldAlert className="w-7 h-7"/> ASCENSION FAILED</span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {combatLog && (
          <div className="space-y-6 mt-2 flex-1 overflow-hidden flex flex-col">
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl border border-border/50 shrink-0">
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Turns</p>
                <p className="text-2xl font-mono font-bold text-foreground">{combatLog.turnsElapsed}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Player HP</p>
                <p className={`text-2xl font-mono font-bold ${combatLog.playerHpRemaining > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {combatLog.playerHpRemaining}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Enemy HP</p>
                <p className={`text-2xl font-mono font-bold ${combatLog.enemyHpRemaining > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {combatLog.enemyHpRemaining}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Damage</p>
                <p className="text-2xl font-mono font-bold text-orange-400">{combatLog.totalDamageDealt}</p>
              </div>
            </div>
            
            {combatLog.rewards && combatLog.isVictory && isAnimationComplete && (
              <div className="border border-indigo-500/20 p-4 rounded-xl bg-indigo-500/5 shrink-0 animate-in fade-in zoom-in-95 duration-500 shadow-sm shadow-indigo-500/10">
                <h4 className="font-bold text-indigo-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4"/> Loot Drops
                </h4>
                <div className="flex flex-wrap gap-3">
                  {combatLog.rewards.gold > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-md">
                      <span className="text-yellow-500 font-bold">+{combatLog.rewards.gold} Gold</span>
                    </div>
                  )}
                  {combatLog.rewards.exp > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md">
                      <span className="text-blue-400 font-bold">+{combatLog.rewards.exp} EXP</span>
                    </div>
                  )}
                  {combatLog.rewards.items.map((item, i) => (
                    <div key={i} className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-md">
                      <span className="text-purple-400 font-bold">+{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 border rounded-xl overflow-hidden bg-card shadow-sm">
              <div className="bg-muted px-4 py-2 border-b">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Combat Log</h4>
              </div>
              <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-sm scroll-smooth">
                {displayedEvents.map((ev, idx) => {
                  const isPlayer = ev.actor === character?.name;
                  const isCrit = ev.message && ev.message.toLowerCase().includes("critical");
                  
                  return (
                    <div key={idx} className={`animate-in fade-in slide-in-from-left-2 duration-300 ${isCrit ? 'bg-yellow-500/10 p-2 rounded border border-yellow-500/20' : ''}`}>
                      <span className="text-muted-foreground/60 mr-2">[T{ev.turn}]</span>
                      <span className={`font-bold ${isPlayer ? 'text-blue-400' : 'text-red-400'}`}>
                        {ev.actor}
                      </span>
                      {" "} <span className="text-foreground/80">{ev.action}</span>, dealing <span className="text-orange-400 font-bold">{ev.damage}</span> damage.
                      {ev.message && <span className="ml-2 text-muted-foreground italic">({ev.message})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {isAnimationComplete && (
              <div className="mt-2 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-[#0c1a24] border border-cyan-900/50 p-5 rounded-xl relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <BrainCircuit className="w-5 h-5 text-cyan-400" />
                    <h4 className="font-bold text-cyan-400 uppercase tracking-widest text-xs">A.I.R.A Tactical Analysis</h4>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3 text-cyan-500/70 py-2">
                      <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                      <span className="animate-pulse font-mono text-sm tracking-wide">Processing battle telemetry...</span>
                    </div>
                  ) : (
                    <p className="text-sm font-mono text-cyan-100/90 whitespace-pre-wrap leading-relaxed">
                      {cielAnalysis || "<< Report. >> Error communicating with AIRA core."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
