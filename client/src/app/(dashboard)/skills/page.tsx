'use client';

import React, { useEffect, useState } from 'react';
import { useSkillStore } from '@/features/skills/store/useSkillStore';
import { useCharacterStore } from '@/store/useCharacterStore';
import { SkillNode } from '@/features/skills/components/SkillNode';
import { SkillDetailModal } from '@/features/skills/components/SkillDetailModal';
import { SkillDefinition, PlayerSkill } from '@/features/skills/types';
import { playAIRASound } from '@/utils/audio';

export default function SkillsPage() {
  const { definitions, playerSkills, fetchSkills, unlockSkill, loading: skillsLoading } = useSkillStore();
  const { character, loadCharacter } = useCharacterStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillDefinition | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);

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
      // Wait to close to show the updated button state? Or just close it?
      // Leaving it open lets the user see it's unlocked and they can close it.
    }
  };

  if (skillsLoading && definitions.length === 0) {
    return <div className="p-8 text-center text-slate-400">Loading Skill Tree...</div>;
  }

  const elements = ['Flame', 'Tempest', 'Earth', 'Tide', 'Ascension'];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Skill Tree</h1>
          <p className="text-sm text-slate-400 mt-1">Unlock abilities using Skill Points earned from combat and leveling.</p>
        </div>
        <div className="bg-[#151C33] border border-slate-700 px-6 py-3 rounded-lg text-center shadow-inner">
          <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Available SP</span>
          <span className="text-3xl font-black text-emerald-400">{character?.availableSP || 0}</span>
        </div>
      </div>

      {/* Trees */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {elements.map((elem) => {
          const pathSkills = definitions.filter(d => d.elementPath === elem).sort((a, b) => a.tier - b.tier);
          
          if (pathSkills.length === 0) return null;

          return (
            <div key={elem} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
              <h2 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-widest">{elem}</h2>
              
              <div className="space-y-6 flex flex-col items-center relative">
                {/* Visual connectors could be drawn here, but we'll keep it simple linear/grid for now */}
                
                {pathSkills.map((skill) => {
                  const pSkill = playerSkills.find(ps => ps.skillDefinitionId === skill.id);
                  const { available } = checkAvailability(skill);
                  let status: 'locked' | 'available' | 'unlocked' = 'locked';
                  
                  if (pSkill) status = 'unlocked';
                  else if (available) status = 'available';

                  return (
                    <SkillNode
                      key={skill.id}
                      skill={skill}
                      playerSkill={pSkill}
                      status={status}
                      onClick={() => setSelectedSkill(skill)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
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
