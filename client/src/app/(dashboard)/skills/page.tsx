'use client';

import React, { useEffect, useState } from 'react';
import { useSkillStore } from '@/features/skills/store/useSkillStore';
import { useCharacterStore } from '@/store/useCharacterStore';
import { SkillNode } from '@/features/skills/components/SkillNode';
import { SkillDetailModal } from '@/features/skills/components/SkillDetailModal';
import { SkillDefinition } from '@/features/skills/types';
import { playAIRASound, playUIMenuSFX } from '@/utils/audio';
import { PixelBadge } from '@/components/ui/pixel/PixelBadge';
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
  rune: string;
  icon: any;
  accentColor: string;
  textColor: string;
  borderColor: string;
  scalingStats: string;
  tagline: string;
}

const ELEMENT_META: Record<string, ElementMeta> = {
  Flame: {
    id: 'Flame',
    name: 'Flame',
    rune: 'ᚠ',
    icon: Flame,
    accentColor: 'from-amber-600 via-orange-600 to-red-700',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-800',
    scalingStats: 'STR & FOC',
    tagline: 'Thermal Burst & Power',
  },
  Tempest: {
    id: 'Tempest',
    name: 'Tempest',
    rune: 'ᛏ',
    icon: Zap,
    accentColor: 'from-cyan-600 via-sky-600 to-blue-700',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-800',
    scalingStats: 'FOC & DIS',
    tagline: 'Velocity & Air Shear',
  },
  Earth: {
    id: 'Earth',
    name: 'Earth',
    rune: 'ᛖ',
    icon: Shield,
    accentColor: 'from-amber-700 via-yellow-700 to-stone-800',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-800',
    scalingStats: 'END & DIS',
    tagline: 'Ironclad Fortitude',
  },
  Tide: {
    id: 'Tide',
    name: 'Tide',
    rune: 'ᛗ',
    icon: Waves,
    accentColor: 'from-blue-600 via-indigo-600 to-cyan-700',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-800',
    scalingStats: 'KNW & REC',
    tagline: 'Arcane Fluidity & Recovery',
  },
  Ascension: {
    id: 'Ascension',
    name: 'Ascension',
    rune: 'ᛟ',
    icon: Crown,
    accentColor: 'from-purple-600 via-fuchsia-600 to-amber-600',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-800',
    scalingStats: 'UNIVERSAL',
    tagline: 'Monarch Passives & Will',
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
      <div className="p-12 text-center text-[#d4a373] font-pixel flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-4" />
        <span className="text-xs tracking-wider uppercase text-[#fef08a]">Synchronizing Guild Spell Matrix...</span>
      </div>
    );
  }

  const elements = ['Flame', 'Tempest', 'Earth', 'Tide', 'Ascension'];
  const displayedElements = activeFilter === 'ALL' ? elements : [activeFilter];

  const totalMastered = playerSkills.length;
  const totalDefinitions = definitions.length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* ========================================================= */}
      {/* 1. GUILD ELEMENTAL SKILL MATRIX HERO HEADER               */}
      {/* ========================================================= */}
      <div className="konosuba-adventurer-card p-5 sm:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.85)] border-4 border-[#381e10] relative overflow-hidden">
        
        {/* Top Runic Engraved Border Pattern Ribbon */}
        <div className="w-full bg-[#381e10] text-[#eedcb8] text-[9px] sm:text-[10px] font-mono tracking-[0.25em] py-1 px-3 flex items-center justify-center text-center overflow-hidden whitespace-nowrap mb-4 select-none border-2 border-[#1a0c05]">
          <span className="truncate">ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ ᛫ ᛭ ᛫ ELEMENTAL SKILL MATRIX ᛫ ᛭ ᛫ ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-pixel font-bold uppercase tracking-wider px-2 py-0.5 bg-[#381e10] border border-[#1a0c05] text-[#fef08a] flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-400" /> ASCENDANT GUILD MATRIX
              </span>
              <span className="text-[10px] font-pixel text-[#8c5225] font-bold">
                RANK {character?.rank || 'F'} • LEVEL {character?.level || 1}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#241208] font-pixel tracking-wide flex items-center gap-2">
              <span>Elemental Skill Matrix</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#633a20] max-w-xl font-pixel leading-relaxed">
              Channel elemental resonant affinities to unlock active combat maneuvers, stances, and universal monarch passives.
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs font-pixel text-[#522e18]">
              <span className="flex items-center gap-1.5 text-[#381e10]">
                <TrendingUp className="w-3.5 h-3.5 text-amber-800" />
                <span>Mastery: <strong className="text-amber-900">{totalMastered}</strong> / {totalDefinitions} Abilities</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#381e10]">
                <Sword className="w-3.5 h-3.5 text-amber-800" />
                <span>Combat Power: <strong className="text-amber-900">{character?.power || 50}</strong></span>
              </span>
            </div>
          </div>

          {/* SP Vault Display (KonoSuba SP / AP Plaque Look) */}
          <div className="bg-[#381e10] border-2 border-[#1a0c05] p-4 sm:px-6 sm:py-4 flex items-center gap-4 shadow-[inset_1px_1px_0_0_#633a20,0_4px_10px_rgba(0,0,0,0.5)]">
            <div className="w-12 h-12 bg-[#24130b] border border-[#522e18] flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-6 h-6 text-[#fef08a]" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-pixel font-bold text-[#e2b17a] tracking-wider">Available Skill Points</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-[#fef08a] font-pixel tracking-tight">{character?.availableSP || 0}</span>
                <span className="text-xs font-pixel font-bold text-amber-300">SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs (Engraved Wooden/Parchment Stamped Buttons) */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t-2 border-[#522e18]/40 overflow-x-auto pb-1 font-pixel text-xs custom-scrollbar">
          <button
            onClick={() => {
              setActiveFilter('ALL');
              playUIMenuSFX('confirm');
            }}
            className={`px-3.5 py-1.5 font-bold uppercase transition-none flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-2 active:translate-y-0.5 ${
              activeFilter === 'ALL'
                ? 'bg-[#381e10] text-[#fef08a] border-[#1a0c05] shadow-[inset_1px_1px_0_0_#633a20]'
                : 'bg-[#ebd9b5] text-[#381e10] border-[#522e18] hover:bg-[#dfba7c]'
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
                onClick={() => {
                  setActiveFilter(elem);
                  playUIMenuSFX('confirm');
                }}
                className={`px-3.5 py-1.5 font-bold uppercase transition-none flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-2 active:translate-y-0.5 ${
                  isSelected
                    ? 'bg-[#381e10] text-[#fef08a] border-[#1a0c05] shadow-[inset_1px_1px_0_0_#633a20]'
                    : 'bg-[#ebd9b5] text-[#381e10] border-[#522e18] hover:bg-[#dfba7c]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-800" />
                <span>{meta.rune} {elem} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ELEMENTAL TREE COLUMNS                                 */}
      {/* ========================================================= */}
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
              className="pixel-guild-panel p-4 flex flex-col items-center relative shadow-[0_6px_14px_rgba(0,0,0,0.6)] border-2 border-[#4a2813]"
            >
              {/* Element Header Banner */}
              <div className="w-full text-center pb-3 border-b-2 border-[#542d17] mb-5 relative font-pixel">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon className={`w-4 h-4 ${meta.textColor}`} />
                  <h2 className="text-sm font-bold text-[#fef08a] uppercase tracking-wider">{elem}</h2>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#d4a373] px-1">
                  <span>{meta.scalingStats}</span>
                  <span className="text-[#fef08a] font-bold">{elemMastered}/{pathSkills.length} Unlocked</span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full h-1.5 bg-[#140a05] border border-[#542d17] mt-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${meta.accentColor} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              
              {/* Nodes Vertical Pathway */}
              <div className="flex flex-col items-center w-full relative space-y-4 font-pixel">
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

                      {/* Connection Line */}
                      {!isLast && (
                        <div className="h-4 flex items-center justify-center my-0.5">
                          <div
                            className={`w-1 h-full transition-all duration-500 ${
                              isNodeUnlocked
                                ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                                : 'bg-[#3b1d0e]'
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
