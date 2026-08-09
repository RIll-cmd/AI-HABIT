import { useState } from "react";
import { Boss, useBossStore } from "../store/useBossStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { formatDistanceToNow, isPast } from "date-fns";
import { CalendarClock, ShieldAlert, CheckCircle2, TrendingUp, Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface BossCardProps {
  boss: Boss;
}

export function BossCard({ boss }: BossCardProps) {
  const hpPercent = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));
  const isDefeated = boss.status === "DEFEATED";
  const { fetchBossTrajectory } = useBossStore();
  const { character } = useCharacterStore();
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleFetchAnalysis = async () => {
    if (!character || analysis) {
      setShowAnalysis(!showAnalysis);
      return;
    }
    
    setShowAnalysis(true);
    setIsAnalyzing(true);
    const result = await fetchBossTrajectory(character.id, boss.id);
    if (result) {
      setAnalysis(result);
    } else {
      setAnalysis("<< Error. >> Failed to connect to analysis matrix.");
    }
    setIsAnalyzing(false);
  };
  
  // Calculate current phase
  // Phases are ordered ascending 1, 2, 3, 4. 
  // We determine which phase we are in by checking accumulated HP.
  let currentPhaseName = boss.phases[0]?.name || "Phase 1";
  if (!isDefeated) {
    const damageDealt = boss.maxHp - boss.currentHp;
    let damageThreshold = 0;
    
    for (const phase of boss.phases) {
      damageThreshold += phase.maxHp;
      if (damageDealt < damageThreshold) {
        currentPhaseName = phase.name;
        break;
      }
    }
  } else {
    currentPhaseName = "Defeated";
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 ${isDefeated ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border/50 hover:border-red-500/30'}`}>
      {/* Background HP indicator for active bosses */}
      {!isDefeated && (
        <div 
          className="absolute top-0 left-0 h-1 bg-red-500 transition-all duration-1000"
          style={{ width: `${hpPercent}%` }}
        />
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {boss.category} • {boss.difficulty}
            </span>
            {isDefeated ? (
              <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> DEFEATED
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                <ShieldAlert className="w-3 h-3" /> ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black tracking-tight">{boss.name}</h3>
          {boss.description && (
            <p className="text-sm text-muted-foreground mt-1">{boss.description}</p>
          )}
        </div>
      </div>

      {!isDefeated ? (
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-1">
            <span className="font-mono font-bold text-red-400">{boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP</span>
            <span className="font-mono text-sm text-muted-foreground">{hpPercent.toFixed(1)}% Remaining</span>
          </div>
          
          <div className="h-4 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm pt-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs bg-cyan-950/30 px-3 py-1 rounded-md border border-cyan-900/50">
              <TrendingUp className="w-4 h-4" />
              {currentPhaseName}
            </div>
            
            {boss.deadline && (
              <div className={`flex items-center gap-1.5 font-mono ${isPast(new Date(boss.deadline)) ? 'text-red-500' : 'text-orange-400'}`}>
                <CalendarClock className="w-4 h-4" />
                {isPast(new Date(boss.deadline)) 
                  ? "Deadline passed" 
                  : formatDistanceToNow(new Date(boss.deadline), { addSuffix: true })}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border/30">
            <button 
              onClick={handleFetchAnalysis}
              className="flex items-center gap-2 text-sm font-bold text-cyan-500 hover:text-cyan-400 transition-colors w-full"
            >
              <Sparkles className="w-4 h-4" />
              {showAnalysis ? "Hide Ciel Trajectory Analysis" : "Request Ciel Trajectory Analysis"}
              {showAnalysis ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
            </button>
            
            {showAnalysis && (
              <div className="mt-3 p-4 rounded-lg bg-cyan-950/20 border border-cyan-900/30">
                {isAnalyzing ? (
                  <div className="flex items-center gap-3 text-cyan-400 text-sm font-mono">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating trajectory matrix...
                  </div>
                ) : (
                  <p className="text-sm font-mono text-cyan-100 whitespace-pre-wrap leading-relaxed">
                    {analysis}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-green-400">Goal Accomplished</p>
              <p className="text-sm text-green-500/70">You dealt {boss.maxHp.toLocaleString()} total damage.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
