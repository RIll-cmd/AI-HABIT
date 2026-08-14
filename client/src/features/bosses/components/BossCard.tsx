import { useState } from "react";
import { Boss, useBossStore } from "../store/useBossStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { formatDistanceToNow, isPast } from "date-fns";
import { CalendarClock, ShieldAlert, CheckCircle2, TrendingUp, Sparkles, Loader2, ChevronDown, ChevronUp, Heart, Skull } from "lucide-react";
import { getEnemySpriteUrl } from "@/utils/spriteUtils";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { getEnemyLore } from "@/features/lore/loreData";

interface BossCardProps {
  boss: Boss;
}

export function BossCard({ boss }: BossCardProps) {
  const hpPercent = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));
  const isDefeated = boss.status === "DEFEATED";
  const { fetchBossTrajectory } = useBossStore();
  const { character } = useCharacterStore();
  const bossLore = getEnemyLore(boss.name, 1, true);
  
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

  const rarityTier = boss.difficulty === "EXTREME" || boss.difficulty === "HARD" ? "LEGENDARY" : "EPIC";

  return (
    <div className={`relative rounded-xl border p-6 shadow-sm transition-all duration-300 hover:z-30 ${isDefeated ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border/50 hover:border-red-500/30'}`}>
      {/* Background HP indicator for active bosses with overflow masking */}
      {!isDefeated && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 left-0 h-1 bg-red-500 transition-all duration-1000"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      )}
      
      <SystemTooltip
        title={boss.name}
        subtitle={`${boss.category} • ${boss.difficulty} Tier Titan`}
        category="Real-Life Dungeon Boss"
        rarity={rarityTier}
        description={boss.description || "A colossal real-world challenge transformed into a towering dungeon boss. Defeating it permanently elevates your life momentum."}
        lore={bossLore.lore || "A manifestation of your greatest ambitions. Born from the crucible of self-mastery, this titan yields immense power upon defeat."}
        mechanics="⚡ Combat Tactics: Deal damage to this boss by completing linked daily habits, high-yield missions, and intense workout sessions."
        stats={[
          { label: "Total HP", value: `${boss.maxHp.toLocaleString()} HP`, color: "text-red-400" },
          { label: "Remaining HP", value: `${boss.currentHp.toLocaleString()} HP (${hpPercent.toFixed(1)}%)`, color: isDefeated ? "text-emerald-400" : "text-amber-400" },
          { label: "Active Phase", value: currentPhaseName, color: "text-cyan-400" },
          { label: "Difficulty Tier", value: boss.difficulty, color: "text-purple-400" }
        ]}
        tags={["Boss", boss.category, boss.difficulty]}
        className="w-full"
      >
        <div className="flex justify-between items-start mb-4 gap-4 w-full cursor-help group/boss text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {boss.category} • {boss.difficulty}
              </span>
              {isDefeated ? (
                <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DEFEATED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                  <ShieldAlert className="w-3.5 h-3.5" /> ACTIVE
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black tracking-tight group-hover/boss:text-red-400 transition-colors truncate">{boss.name}</h3>
            {boss.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{boss.description}</p>
            )}
          </div>

          {/* Boss Sprite Artwork */}
          <div className="w-20 h-20 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover/boss:scale-105 group-hover/boss:border-red-400 transition-all">
            <img
              src={getEnemySpriteUrl(boss.name, { isBoss: true, preferAnimated: true })}
              alt={boss.name}
              onError={(e) => { e.currentTarget.src = "/bosses/gollux.gif"; }}
              className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>
      </SystemTooltip>

      {!isDefeated ? (
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-1">
            <span className="font-mono font-bold text-red-400 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500 fill-red-500/30 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP
            </span>
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
              {showAnalysis ? "Hide AIRA Trajectory Analysis" : "Request AIRA Trajectory Analysis"}
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
