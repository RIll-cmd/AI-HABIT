import React from 'react';
import { SkillDefinition, PlayerSkill } from '../types';
import { SkillIcon } from './SkillIcon';
import { getSkillLore } from '../data/skillLore';
import { playUISound } from '@/utils/audio';
import { Sparkles, BookOpen, CheckCircle2, Lock, Flame, Zap, Shield, Waves, Crown, Swords } from 'lucide-react';

interface SkillNodeProps {
  skill: SkillDefinition;
  playerSkill?: PlayerSkill;
  status: 'locked' | 'available' | 'unlocked';
  onClick: () => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, playerSkill, status, onClick }) => {
  const loreData = getSkillLore(skill.id, skill.name);
  const elementKey = (skill.elementPath || 'universal').toLowerCase();
  const tier = Math.min(5, Math.max(1, skill.tier || 1));

  // Determine element specific visuals and icons
  let ElementIcon = Sparkles;
  let elementGlowBg = 'from-slate-900 to-slate-950';
  let elementBadgeColor = 'text-slate-400 bg-slate-800 border-slate-700';
  let tierBadgeColor = 'text-slate-400 bg-slate-900/90 border-slate-700';

  switch (skill.elementPath) {
    case 'Flame':
      ElementIcon = Flame;
      elementGlowBg = 'from-red-950/80 via-slate-900 to-black';
      elementBadgeColor = 'text-red-400 bg-red-950/60 border-red-500/40';
      tierBadgeColor = 'text-red-300 bg-red-950/90 border-red-500/50';
      break;
    case 'Tempest':
      ElementIcon = Zap;
      elementGlowBg = 'from-cyan-950/80 via-slate-900 to-black';
      elementBadgeColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      tierBadgeColor = 'text-cyan-300 bg-cyan-950/90 border-cyan-500/50';
      break;
    case 'Earth':
      ElementIcon = Shield;
      elementGlowBg = 'from-amber-950/80 via-slate-900 to-black';
      elementBadgeColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      tierBadgeColor = 'text-amber-300 bg-amber-950/90 border-amber-500/50';
      break;
    case 'Tide':
      ElementIcon = Waves;
      elementGlowBg = 'from-blue-950/80 via-slate-900 to-black';
      elementBadgeColor = 'text-blue-400 bg-blue-950/60 border-blue-500/40';
      tierBadgeColor = 'text-blue-300 bg-blue-950/90 border-blue-500/50';
      break;
    case 'Ascension':
      ElementIcon = Crown;
      elementGlowBg = 'from-purple-950/80 via-slate-900 to-black';
      elementBadgeColor = 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      tierBadgeColor = 'text-purple-300 bg-purple-950/90 border-purple-500/50';
      break;
  }

  // Dynamic CSS classes based on activation status, element, and tier
  let activeEffectClass = '';
  let containerBg = 'bg-[#0B1020]/95';

  if (status === 'unlocked') {
    activeEffectClass = `skill-tier-${elementKey}-${tier}`;
    containerBg = `bg-gradient-to-b ${elementGlowBg}`;
  } else if (status === 'available') {
    activeEffectClass = 'skill-ready-indicator';
    containerBg = 'bg-[#0E1B2E]';
  } else {
    activeEffectClass = 'border-2 border-slate-800/80 hover:border-slate-600/80 shadow-md';
  }

  let reqs: Record<string, any> = {};
  try {
    reqs = JSON.parse(skill.statRequirements);
  } catch (e) {}

  return (
    <div className="relative group/node flex flex-col items-center">
      <button
        onClick={() => {
          playUISound("/sounds/General/10_UI_Menu_SFX/001_Hover_01.wav");
          onClick();
        }}
        className={`
          relative transition-all duration-300 
          w-[72px] h-[72px] rounded-2xl p-1.5 flex flex-col items-center justify-center
          hover:scale-110 active:scale-95 z-10 cursor-pointer
          ${containerBg} ${activeEffectClass}
          ${status === 'locked' ? 'opacity-70 hover:opacity-100 hover:border-slate-500' : ''}
        `}
      >
        {/* Tier Indicator Pill (Top Left) */}
        <div className={`absolute -top-2 -left-2 text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full border shadow-md z-20 ${tierBadgeColor}`}>
          {tier === 5 ? 'ULT' : `T${tier}`}
        </div>

        {/* Status Lock / Element Aura Indicator (Top Right) */}
        {status === 'locked' ? (
          <div className="absolute -top-2 -right-2 bg-slate-900/90 text-slate-400 border border-slate-700 p-1 rounded-full shadow-md z-20">
            <Lock className="w-2.5 h-2.5" />
          </div>
        ) : status === 'available' ? (
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-300 shadow-md z-20 animate-bounce">
            UP
          </div>
        ) : (
          <div className={`absolute -top-2 -right-2 text-white p-1 rounded-full shadow-md z-20 ${elementBadgeColor}`}>
            <ElementIcon className="w-2.5 h-2.5" />
          </div>
        )}

        {/* Skill Sprite Icon */}
        <div className="flex items-center justify-center w-full h-full drop-shadow-lg">
          <SkillIcon iconId={skill.icon} size={48} />
        </div>
        
        {/* Level Indicator (Bottom Right for Unlocked) */}
        {status === 'unlocked' && playerSkill && (
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-slate-900 shadow-lg z-20">
            Lv.{playerSkill.currentLevel}
          </div>
        )}
      </button>

      {/* Node Skill Name Label Underneath */}
      <span className="mt-1.5 text-[11px] font-semibold text-slate-300 text-center max-w-[84px] truncate tracking-tight font-sans transition-colors group-hover/node:text-white">
        {skill.name}
      </span>

      {/* Rich Interactive Hover Popover Tooltip with Lore */}
      <div className="hidden group-hover/node:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 sm:w-84 bg-[#0B1020]/98 border border-cyan-500/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Holographic Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {skill.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${elementBadgeColor}`}>
                {skill.elementPath || "Universal"}
              </span>
              <span className="text-[9px] font-mono text-slate-300 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded">
                Tier {skill.tier}
              </span>
              <span className="text-[9px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded">
                {skill.skillType}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {status === 'unlocked' ? (
            <span className="text-[9px] font-mono font-bold uppercase text-yellow-300 bg-yellow-950/70 border border-yellow-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-2.5 h-2.5 text-yellow-400" /> Lv.{playerSkill?.currentLevel || 1}/{skill.maxLevel}
            </span>
          ) : status === 'available' ? (
            <span className="text-[9px] font-mono font-bold uppercase text-emerald-300 bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              READY ({skill.baseCostSP} SP)
            </span>
          ) : (
            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> LOCKED
            </span>
          )}
        </div>

        {/* Combat Description */}
        <div className="my-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 tracking-wider mb-0.5 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMBAT EFFECT:</span>
          </span>
          <p className="text-[11.5px] text-slate-100 leading-snug font-sans">
            {loreData.combatEffect || skill.description}
          </p>
        </div>

        {/* Story Lore Chronicle */}
        <div className="my-2.5 p-3 rounded-xl bg-gradient-to-br from-[#131A32] to-[#0A0E1A] border border-purple-500/40 relative overflow-hidden shadow-md">
          <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold text-purple-300 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>ANCIENT CHRONICLE LORE</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic">
            &ldquo;{loreData.lore}&rdquo;
          </p>
        </div>

        {/* Prerequisites Footer */}
        {Object.keys(reqs).length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[9.5px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">REQ:</span>
            <span>
              {Object.entries(reqs)
                .map(([k, v]) => (k === 'skills' ? `Skill ${(v as string[]).join(', ')}` : `${v} ${k}`))
                .join(' • ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
