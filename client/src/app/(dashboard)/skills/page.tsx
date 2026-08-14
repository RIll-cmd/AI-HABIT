'use client';

import React, { useEffect, useState } from 'react';
import { useSkillStore } from '@/features/skills/store/useSkillStore';
import { useCharacterStore } from '@/store/useCharacterStore';
import { SkillNode } from '@/features/skills/components/SkillNode';
import { SkillDetailModal } from '@/features/skills/components/SkillDetailModal';
import { SkillDefinition } from '@/features/skills/types';
import { playAIRASound } from '@/utils/audio';
import {
  Flame,
  Zap,
  Shield,
  Waves,
  Crown,
  Sparkles,
  Layers,
  Sword,
  TrendingUp,
} from 'lucide-react';

interface ElementMeta {
  id: string;
  name: string;
  icon: any;
  accentColor: string;
  textColor: string;
  borderColor: string;
  headerGlow: string;
  cardGlow: string;
  scalingStats: string;
  tagline: string;
  lineColor: string;
}

const ELEMENT_META: Record<string, ElementMeta> = {
  Flame: {
    id: 'Flame',
    name: 'Flame',
    icon: Flame,
    accentColor: 'from-red-600 via-orange-600 to-amber-600',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30 hover:border-red-500/60',
    headerGlow: 'bg-red-500/10 text-red-400 border-red-500/30',
    cardGlow: 'shadow-[0_0_25px_rgba(239,68,68,0.12)]',
    scalingStats: 'STR & FOC',
    tagline: 'Thermal Burst & Power',
    lineColor: 'bg-gradient-to-b from-red-500 to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  },
  Tempest: {
    id: 'Tempest',
    name: 'Tempest',
    icon: Zap,
    accentColor: 'from-cyan-500 via-sky-500 to-blue-600',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
    headerGlow: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    cardGlow: 'shadow-[0_0_25px_rgba(34,211,238,0.12)]',
    scalingStats: 'FOC & DIS',
    tagline: 'Velocity & Air Shear',
    lineColor: 'bg-gradient-to-b from-cyan-400 to-sky-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
  },
  Earth: {
    id: 'Earth',
    name: 'Earth',
    icon: Shield,
    accentColor: 'from-amber-600 via-yellow-600 to-amber-700',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
    headerGlow: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    cardGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.12)]',
    scalingStats: 'END & DIS',
    tagline: 'Ironclad Fortitude',
    lineColor: 'bg-gradient-to-b from-amber-500 to-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
  },
  Tide: {
    id: 'Tide',
    name: 'Tide',
    icon: Waves,
    accentColor: 'from-blue-600 via-indigo-600 to-cyan-600',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30 hover:border-blue-500/60',
    headerGlow: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    cardGlow: 'shadow-[0_0_25px_rgba(59,130,246,0.12)]',
    scalingStats: 'KNW & REC',
    tagline: 'Arcane Fluidity & Recovery',
    lineColor: 'bg-gradient-to-b from-blue-500 to-cyan-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]',
  },
  Ascension: {
    id: 'Ascension',
    name: 'Ascension',
    icon: Crown,
    accentColor: 'from-purple-600 via-fuchsia-600 to-indigo-700',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    headerGlow: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    cardGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.12)]',
    scalingStats: 'UNIVERSAL',
    tagline: 'Monarch Passives & Will',
    lineColor: 'bg-gradient-to-b from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
  },
};

export default function SkillsPage() {
  const { definitions, playerSkills, fetchSkills, unlockSkill, loading: skillsLoading } = useSkillStore();
  const { character, loadCharacter } = useCharacterStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  useEffect(() => {
    if (character?.id) {
      fetchSkills(character.id);
    }
  }, [character?.id, fetchSkills]);

  const checkAvailability = (skill: SkillDefinition) => {
    try {
      const reqs = JSON.parse(skill.statRequirements);
      
      if (reqs.skills) {
        for (const reqSkillId of reqs.skills) {
          if (!playerSkills.find(ps => ps.skillDefinitionId === reqSkillId)) {
            return { available: false, reason: `Missing prerequisite skill.` };
          }
        }
      }
      
      if (character && character.stats) {
        const statMap: Record<string, number> = {
          "Strength": character.stats.strength || 1,
          "Knowledge": character.stats.knowledge || 1,
          "Endurance": character.stats.endurance || 1,
          "Recovery": character.stats.recovery || 1,
          "Focus": character.stats.focus || 1,
          "Discipline": character.stats.discipline || 1,
          "Consistency": character.stats.consistency || 1,
        };
        
        for (const [key, val] of Object.entries(reqs)) {
          if (key !== 'skills' && statMap[key] < (val as number)) {
            return { available: false, reason: `Requires ${val} ${key}` };
          }
        }
      }

      if (character && character.availableSP < skill.baseCostSP) {
        return { available: false, reason: `Not enough SP.` };
      }

      return { available: true };
    } catch {
      return { available: true };
    }
  };

  const handleUnlock = async () => {
    if (!character || !selectedSkill) return;
    setUnlockLoading(true);
    try {
      await unlockSkill(character.id, selectedSkill.id);
      playAIRASound("NEW_SKILL");
    } catch (e) {
      // Error handled by store toast
    } finally {
      setUnlockLoading(false);
    }
  };

  if (skillsLoading && definitions.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <span className="font-mono text-sm tracking-wider uppercase text-cyan-300">Synchronizing Skill Matrix...</span>
      </div>
    );
  }

  const elements = ['Flame', 'Tempest', 'Earth', 'Tide', 'Ascension'];
  const displayedElements = activeFilter === 'ALL' ? elements : [activeFilter];

  const totalMastered = playerSkills.length;
  const totalDefinitions = definitions.length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 pb-16">
      {/* 1. HERO HEADER */}
      <div className="bg-[#151C33] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Holographic Ambient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-cyan-500 via-amber-500 via-blue-500 to-purple-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> ASCENDANT MATRIX
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Rank {character?.rank || 'F'} • Level {character?.level || 1}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight flex items-center gap-2">
              <span>Elemental Skill Matrix</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-sans leading-relaxed">
              Channel elemental resonant affinities to unlock active combat maneuvers, stances, and universal monarch passives.
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                <span>Mastery: <strong className="text-yellow-400">{totalMastered}</strong> / {totalDefinitions} Abilities</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sword className="w-3.5 h-3.5 text-cyan-400" />
                <span>Combat Power: <strong className="text-cyan-400">{character?.power || 50}</strong></span>
              </span>
            </div>
          </div>

          {/* SP Vault Display */}
          <div className="bg-[#0B1020] border border-emerald-500/40 rounded-2xl p-4 sm:px-6 sm:py-4 flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Available Skill Points</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{character?.availableSP || 0}</span>
                <span className="text-xs font-mono font-bold text-emerald-300">SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto pb-1 font-mono text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
              activeFilter === 'ALL'
                ? 'bg-white/10 border-white/30 text-white shadow-md'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> All Paths ({totalDefinitions})
          </button>

          {elements.map((elem) => {
            const meta = ELEMENT_META[elem];
            const Icon = meta.icon;
            const count = definitions.filter(d => d.elementPath === elem).length;
            const isSelected = activeFilter === elem;

            return (
              <button
                key={elem}
                onClick={() => setActiveFilter(elem)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? `${meta.headerGlow} shadow-md`
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${meta.textColor}`} /> {elem} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ELEMENTAL TREE COLUMNS */}
      <div className={`grid grid-cols-1 ${displayedElements.length === 1 ? 'max-w-md mx-auto' : 'sm:grid-cols-2 lg:grid-cols-5'} gap-6`}>
        {displayedElements.map((elem) => {
          const meta = ELEMENT_META[elem] || ELEMENT_META.Ascension;
          const Icon = meta.icon;
          const pathSkills = definitions.filter(d => d.elementPath === elem).sort((a, b) => a.tier - b.tier);
          
          if (pathSkills.length === 0) return null;

          const elemMastered = pathSkills.filter(s => playerSkills.some(ps => ps.skillDefinitionId === s.id)).length;
          const progressPercent = Math.round((elemMastered / pathSkills.length) * 100);

          return (
            <div
              key={elem}
              className={`bg-[#151C33] border rounded-2xl p-4 flex flex-col items-center relative transition-all duration-300 ${meta.borderColor} ${meta.cardGlow}`}
            >
              {/* Element Header Banner */}
              <div className="w-full text-center pb-3 border-b border-white/10 mb-5 relative">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon className={`w-4 h-4 ${meta.textColor}`} />
                  <h2 className="text-base font-bold text-white uppercase tracking-widest font-heading">{elem}</h2>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span>{meta.scalingStats}</span>
                  <span className={meta.textColor}>{elemMastered}/{pathSkills.length} Unlocked</span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full h-1 bg-slate-900 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${meta.accentColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              
              {/* Nodes Vertical Pathway with Glowing Connectors */}
              <div className="flex flex-col items-center w-full relative space-y-4">
                {pathSkills.map((skill, index) => {
                  const pSkill = playerSkills.find(ps => ps.skillDefinitionId === skill.id);
                  const { available } = checkAvailability(skill);
                  let status: 'locked' | 'available' | 'unlocked' = 'locked';
                  
                  if (pSkill) status = 'unlocked';
                  else if (available) status = 'available';

                  const isLast = index === pathSkills.length - 1;
                  const isNodeUnlocked = status === 'unlocked';

                  return (
                    <React.Fragment key={skill.id}>
                      <SkillNode
                        skill={skill}
                        playerSkill={pSkill}
                        status={status}
                        onClick={() => setSelectedSkill(skill)}
                      />

                      {/* Energetic Connection Line to Next Tier */}
                      {!isLast && (
                        <div className="h-4 flex items-center justify-center my-0.5">
                          <div
                            className={`w-0.5 h-full rounded-full transition-all duration-500 ${
                              isNodeUnlocked
                                ? meta.lineColor
                                : 'bg-slate-800'
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. SKILL DETAIL MODAL */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          playerSkill={playerSkills.find(ps => ps.skillDefinitionId === selectedSkill.id)}
          available={checkAvailability(selectedSkill).available}
          unmetReason={checkAvailability(selectedSkill).reason}
          onClose={() => setSelectedSkill(null)}
          onUnlock={handleUnlock}
          loading={unlockLoading}
        />
      )}
    </div>
  );
}
