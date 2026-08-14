"use client";

import { useEffect } from "react";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useTowerStore } from "@/features/tower/store/useTowerStore";
import { 
  Lock, 
  Swords, 
  CheckCircle2, 
  Crown,
  ChevronRight,
  ShieldAlert,
  Activity,
  Target,
  Zap,
  Heart,
  Shield,
  Wind,
  Dumbbell,
  BookOpen,
  Flame,
  Snowflake,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BattleModal } from "@/features/tower/components/BattleModal";
import { FloorBattleBanner } from "@/features/tower/components/FloorBattleBanner";
import { getEnemySpriteUrl } from "@/utils/spriteUtils";
import { playBattleSFX, playUIMenuSFX, playAIRASound } from "@/utils/audio";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { SystemTooltip } from "@/components/ui/SystemTooltip";
import { ENEMY_LORE, CURRENCY_LORE, getEnemyLore } from "@/features/lore/loreData";
import { getAttributeWeaknessConfig, getElementalVulnerabilityConfig } from "@/utils/combatIcons";

export default function TowerPage() {
  const { character } = useCharacterStore();
  const { 
    floors, 
    selectedFloor, 
    fetchFloors, 
    selectFloor, 
    challengeFloor, 
    isSimulating
  } = useTowerStore();

  useEffect(() => {
    if (character?.id) {
      fetchFloors(character.id);
    }
  }, [character?.id, fetchFloors]);

  // Sort floors descending so Floor 20 is at the top
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Tower Map */}
      <div className="w-1/2 flex flex-col h-full min-h-0">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Swords className="w-6 h-6 text-primary" />
          Ascend Tower Map
        </h2>
        <p className="text-muted-foreground mb-6">Climb the tower to test your character's ultimate potential.</p>
        
        <div className="flex-1 pr-4 overflow-y-auto">
          <div className="flex flex-col gap-4 relative pb-10">
            {/* The line connecting floors */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-border/50 rounded-full" />
            
            {sortedFloors.map((floor) => {
              const isSelected = selectedFloor?.id === floor.id;
              
              let statusColor = "bg-muted text-muted-foreground border-border";
              let StatusIcon = Lock;
              let statusGlow = "";
              
              if (floor.status === "CLEARED") {
                statusColor = "bg-green-500/10 text-green-500 border-green-500/50";
                StatusIcon = CheckCircle2;
              } else if (floor.status === "AVAILABLE" || floor.status === "ATTEMPTED") {
                statusColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500";
                statusGlow = "shadow-[0_0_15px_rgba(99,102,241,0.5)]";
                StatusIcon = Swords;
              } else if (floor.isBoss) {
                statusColor = "bg-red-500/5 text-red-500/40 border-red-500/20";
                StatusIcon = Crown;
              }

              const enemyLore = getEnemyLore(floor.enemy.name, floor.floorNumber, floor.isBoss);

              return (
                <SystemTooltip
                  key={floor.id}
                  title={`${enemyLore.name} (Lv. ${floor.enemy.level})`}
                  subtitle={`Floor ${floor.floorNumber} Guardian • Power Req: ${floor.requiredPower?.toLocaleString() || "Standard"}`}
                  category={enemyLore.category}
                  rarity={enemyLore.rarity}
                  description={enemyLore.description}
                  lore={enemyLore.lore}
                  mechanics={`⚡ Weakness & Tactics: ${enemyLore.weakness} • ${enemyLore.behavior}`}
                  stats={[
                    { label: "Floor Level", value: `Floor ${floor.floorNumber}` },
                    { label: "Enemy HP", value: floor.enemy.hp?.toLocaleString() || "1,000", color: "text-red-400" },
                    { label: "Attack Power", value: floor.enemy.attack?.toLocaleString() || "120", color: "text-amber-400" },
                    { label: "Floor Bounty", value: `${floor.goldReward}g / ${floor.expReward} EXP`, color: "text-cyan-400" }
                  ]}
                  tags={["Tower", floor.isBoss ? "Boss" : "Enemy", `Floor${floor.floorNumber}`]}
                  className="w-full"
                >
                  <div 
                    onClick={() => selectFloor(floor)}
                    className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/50 z-10 w-full text-left
                      ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-accent' : 'border-transparent bg-card/80 backdrop-blur-sm'}
                    `}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${statusColor} ${statusGlow} transition-all overflow-hidden p-1.5 shrink-0 bg-slate-950/80`}>
                      <img
                        src={getEnemySpriteUrl(floor.enemy.name, { floorOrLevel: floor.floorNumber, isBoss: floor.isBoss })}
                        alt={floor.enemy.name}
                        onError={(e) => { e.currentTarget.src = "/sprites/static/slime.png"; }}
                        className={`w-full h-full object-contain ${floor.status === "LOCKED" ? "opacity-40 grayscale" : "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"}`}
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg ${floor.status === "LOCKED" ? "text-muted-foreground" : ""}`}>
                          Floor {floor.floorNumber}
                        </h3>
                        {floor.isBoss && <Badge variant="destructive" className="ml-auto">BOSS</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {floor.enemy.name} • Lv {floor.enemy.level}
                      </p>
                    </div>
                    
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isSelected ? 'translate-x-1 text-primary' : ''}`} />
                  </div>
                </SystemTooltip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-1/2 flex flex-col gap-6 h-full min-h-0">
        {selectedFloor ? (
          <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between h-full min-h-0 space-y-4">
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Floor {selectedFloor.floorNumber}
                    {selectedFloor.status === "CLEARED" && <Badge className="bg-green-500 ml-2">CLEARED</Badge>}
                  </h2>
                  <p className="text-muted-foreground">Enemy: {selectedFloor.enemy.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-bold font-mono tracking-wider">{selectedFloor.status}</p>
                </div>
              </div>

              {/* Tower Battle View (Player Left vs Enemy Right Face-Off Banner) */}
              <FloorBattleBanner
                playerName={character?.name || "Player"}
                playerPower={character?.power || 0}
                enemyName={selectedFloor.enemy.name}
                enemyLevel={selectedFloor.enemy.level}
                floorNumber={selectedFloor.floorNumber}
                isBoss={selectedFloor.isBoss}
              />

              {/* Enemy Weaknesses & Telemetry */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Enemy Tactical Vulnerabilities
                </h3>

                {(() => {
                  const attrConfig = getAttributeWeaknessConfig(selectedFloor.enemy.weaknessStat || "Knowledge");
                  const elemConfig = getElementalVulnerabilityConfig(selectedFloor.enemy.resistanceStat || "Flame");
                  const AttrIcon = attrConfig.icon;
                  const ElemIcon = elemConfig.icon;

                  return (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Attribute Weakness */}
                        <SystemTooltip
                          title={`Attribute Weakness: ${attrConfig.label}`}
                          category="Tactical Weakness"
                          rarity="RARE"
                          description={attrConfig.description}
                          lore="Exploiting this attribute with matched skills or equipment yields massive damage multipliers."
                          mechanics="Deals +25% Bonus Damage when attacking with skills or weapons aligned with this stat."
                          stats={[
                            { label: "Vulnerable Stat", value: attrConfig.label, color: attrConfig.color },
                            { label: "Exploit Bonus", value: "+25% DMG", color: "text-emerald-400" }
                          ]}
                          tags={["Weakness", "Combat", attrConfig.label]}
                          className="w-full"
                        >
                          <div className={`bg-[#0B1020] border ${attrConfig.border} rounded-xl p-3 flex flex-col gap-1 w-full text-left cursor-help hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all`}>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Attribute Weakness</span>
                            <div className="flex items-center gap-2">
                              <Badge className={`${attrConfig.bg} ${attrConfig.color} border ${attrConfig.border} font-mono font-bold text-xs uppercase px-2.5 py-1 flex items-center gap-1.5 shadow-sm`}>
                                <AttrIcon className={`w-3.5 h-3.5 ${attrConfig.color} ${attrConfig.glow}`} />
                                <span>{attrConfig.label}</span>
                              </Badge>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono mt-1">+25% damage bonus when stat matches</span>
                          </div>
                        </SystemTooltip>

                        {/* Elemental Weakness */}
                        <SystemTooltip
                          title={`Elemental Vulnerability: ${elemConfig.label}`}
                          category="Elemental Affinity"
                          rarity="RARE"
                          description={elemConfig.description}
                          lore="Elemental resonance shatters the target's natural kinetic barrier."
                          mechanics="Deals +25% Bonus Damage when casting spells or using elemental weapon infusions of this type."
                          stats={[
                            { label: "Vulnerable Element", value: elemConfig.label, color: elemConfig.color },
                            { label: "Exploit Bonus", value: "+25% DMG", color: "text-emerald-400" }
                          ]}
                          tags={["Element", "Combat", elemConfig.label]}
                          className="w-full"
                        >
                          <div className={`bg-[#0B1020] border ${elemConfig.border} rounded-xl p-3 flex flex-col gap-1 w-full text-left cursor-help hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all`}>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Elemental Vulnerability</span>
                            <div className="flex items-center gap-2">
                              <Badge className={`${elemConfig.bg} ${elemConfig.color} border ${elemConfig.border} font-mono font-bold text-xs uppercase px-2.5 py-1 flex items-center gap-1.5 shadow-sm`}>
                                <ElemIcon className={`w-3.5 h-3.5 ${elemConfig.color} ${elemConfig.glow}`} />
                                <span>{elemConfig.label}</span>
                              </Badge>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono mt-1">+25% damage bonus on element exploit</span>
                          </div>
                        </SystemTooltip>
                      </div>

                      {/* Scaled Enemy Combat Telemetry */}
                      <div className="bg-[#0B1020]/90 rounded-xl p-3 border border-slate-800/80 grid grid-cols-4 gap-2 text-center shadow-inner">
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-950/20 border border-red-500/20 hover:border-red-500/40 transition-colors">
                          <div className="flex items-center gap-1 mb-1">
                            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/30 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                            <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider">HP</span>
                          </div>
                          <span className="text-sm font-extrabold text-red-400 font-mono tracking-tight">{selectedFloor.enemy.hp.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                          <div className="flex items-center gap-1 mb-1">
                            <Swords className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                            <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider">ATK</span>
                          </div>
                          <span className="text-sm font-extrabold text-amber-400 font-mono tracking-tight">{selectedFloor.enemy.attack.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-950/20 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                          <div className="flex items-center gap-1 mb-1">
                            <Shield className="w-3.5 h-3.5 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                            <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider">DEF</span>
                          </div>
                          <span className="text-sm font-extrabold text-blue-400 font-mono tracking-tight">{selectedFloor.enemy.defense.toLocaleString()}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                          <div className="flex items-center gap-1 mb-1">
                            <Wind className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                            <span className="text-[9px] text-slate-400 font-mono uppercase font-bold tracking-wider">SPD</span>
                          </div>
                          <span className="text-sm font-extrabold text-emerald-400 font-mono tracking-tight">{selectedFloor.enemy.speed.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Floor Rewards & Stats */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3 text-slate-300 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-amber-500" />
                  Floor Rewards & Progress
                </h3>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Attempts</span>
                    <span className="font-bold text-slate-200">{selectedFloor.attempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Best Clear Time</span>
                    <span className="font-bold text-slate-200">
                      {selectedFloor.bestClearTimeSeconds ? `${selectedFloor.bestClearTimeSeconds}s` : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-800 pt-2 mt-2">
                    <span className="text-slate-400">Floor Completion Bounty</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <SystemTooltip
                        title={CURRENCY_LORE.gold.name}
                        category={CURRENCY_LORE.gold.category}
                        rarity={CURRENCY_LORE.gold.rarity}
                        description={CURRENCY_LORE.gold.description}
                        lore={CURRENCY_LORE.gold.lore}
                        mechanics={CURRENCY_LORE.gold.mechanics}
                        tags={CURRENCY_LORE.gold.tags}
                      >
                        <span className="inline-flex items-center gap-1 font-bold text-yellow-400 cursor-help bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-500/30">
                          <CurrencyIcon type="GOLD" size="xs" />
                          <span>+{selectedFloor.goldReward} Gold</span>
                        </span>
                      </SystemTooltip>

                      <SystemTooltip
                        title={CURRENCY_LORE.exp.name}
                        category={CURRENCY_LORE.exp.category}
                        rarity={CURRENCY_LORE.exp.rarity}
                        description={CURRENCY_LORE.exp.description}
                        lore={CURRENCY_LORE.exp.lore}
                        mechanics={CURRENCY_LORE.exp.mechanics}
                        tags={CURRENCY_LORE.exp.tags}
                      >
                        <span className="inline-flex items-center gap-1 font-bold text-cyan-400 cursor-help bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                          <CurrencyIcon type="EXP" size="xs" />
                          <span>+{selectedFloor.expReward} EXP</span>
                        </span>
                      </SystemTooltip>

                      <SystemTooltip
                        title={CURRENCY_LORE.gems.name}
                        category={CURRENCY_LORE.gems.category}
                        rarity={CURRENCY_LORE.gems.rarity}
                        description={CURRENCY_LORE.gems.description}
                        lore={CURRENCY_LORE.gems.lore}
                        mechanics={CURRENCY_LORE.gems.mechanics}
                        tags={CURRENCY_LORE.gems.tags}
                      >
                        <span className="inline-flex items-center gap-1 font-bold text-purple-400 cursor-help bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
                          <CurrencyIcon type="GEMS" size="xs" />
                          <span>+{(selectedFloor.gemReward ?? (selectedFloor.isBoss ? Math.max(25, Math.floor(selectedFloor.floorNumber / 5) * 25) : (selectedFloor.floorNumber % 2 === 0 ? 5 : 2)))} Gems</span>
                        </span>
                      </SystemTooltip>

                      <SystemTooltip
                        title={CURRENCY_LORE.towerTokens.name}
                        category={CURRENCY_LORE.towerTokens.category}
                        rarity={CURRENCY_LORE.towerTokens.rarity}
                        description={CURRENCY_LORE.towerTokens.description}
                        lore={CURRENCY_LORE.towerTokens.lore}
                        mechanics={CURRENCY_LORE.towerTokens.mechanics}
                        tags={CURRENCY_LORE.towerTokens.tags}
                      >
                        <span className="inline-flex items-center gap-1 font-bold text-amber-300 cursor-help bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                          <CurrencyIcon type="TOWER_TOKENS" size="xs" />
                          <span>+{(selectedFloor.towerTokensReward ?? (10 * selectedFloor.floorNumber * (selectedFloor.isBoss ? 3 : 1)))} Tokens</span>
                        </span>
                      </SystemTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold shrink-0 mt-2" 
              size="lg"
              disabled={selectedFloor.status === "LOCKED" || isSimulating || !character}
              onClick={() => {
                if (character) {
                  playBattleSFX("encounter");
                  if (selectedFloor.status === "CLEARED") {
                    playAIRASound("REPEATING");
                  }
                  challengeFloor(character.id, selectedFloor.floorNumber);
                }
              }}
            >
              {isSimulating ? (
                <span className="flex items-center gap-2 animate-pulse">
                  <Swords className="w-5 h-5 animate-spin" /> Simulating Battle...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Swords className="w-5 h-5" /> ENTER FLOOR
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border flex items-center justify-center h-full text-muted-foreground">
            Select a floor to view details.
          </div>
        )}
      </div>

      {/* Combat Result Modal */}
      <BattleModal />
    </div>
  );
}

function RequirementRow({ label, required, current }: { label: string, required: number, current: number }) {
  const isMet = current >= required;
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm ${isMet ? 'text-primary' : 'text-destructive'}`}>
          {current}
        </span>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="font-mono text-sm text-muted-foreground">{required}</span>
        {isMet ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 ml-1" />
        ) : (
          <div className="w-4 h-4 text-red-500 ml-1 font-bold flex items-center justify-center text-xs">✕</div>
        )}
      </div>
    </div>
  );
}
