import React from 'react';
import { SkillDefinition, PlayerSkill } from '../types';
import { SkillIcon } from './SkillIcon';
import { getSkillLore } from '../data/skillLore';
import { playUISound, playBuffSFX } from '@/utils/audio';
import { BookOpen, Sparkles, Swords, X } from 'lucide-react';
import { PixelButton } from '@/components/ui/pixel/PixelButton';

interface SkillDetailModalProps {
  skill: SkillDefinition;
  playerSkill?: PlayerSkill;
  available: boolean;
  unmetReason?: string;
  onClose: () => void;
  onUnlock: () => void;
  loading: boolean;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ 
  skill, 
  playerSkill, 
  available, 
  unmetReason, 
  onClose, 
  onUnlock, 
  loading 
}) => {
  const loreData = getSkillLore(skill.id, skill.name);
  let reqs: Record<string, any> = {};
  try {
    reqs = JSON.parse(skill.statRequirements);
  } catch (e) {}

  const isMaxLevel = playerSkill && playerSkill.currentLevel >= skill.maxLevel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 font-pixel select-none">
      <div className="konosuba-adventurer-card border-4 border-[#381e10] shadow-[0_16px_36px_rgba(0,0,0,0.9)] max-w-md w-full overflow-hidden text-[#241208]">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 p-4 border-b-2 border-[#522e18] bg-[#ebd9b5]">
          <SkillIcon iconId={skill.icon} size={56} className="border-2 border-[#522e18] bg-[#381e10] p-1" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#241208] tracking-wide truncate">{skill.name}</h2>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8c5225]">
              <span className="text-amber-900">{skill.skillType}</span>
              <span>•</span>
              <span>Tier {skill.tier}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#522e18] hover:text-[#241208] cursor-pointer p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          {/* Combat Effect */}
          <div className="p-2.5 bg-[#ebd9b5] border border-[#522e18] shadow-[inset_1px_1px_0_0_#ffffff]">
            <span className="text-[10px] font-bold uppercase text-amber-900 tracking-wider mb-1 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-amber-800" />
              <span>COMBAT MASTERY EFFECT:</span>
            </span>
            <p className="text-xs text-[#241208] leading-relaxed">
              {loreData.combatEffect || skill.description}
            </p>
          </div>

          {/* Ancient Lore Chronicle */}
          <div className="p-2.5 bg-[#ecd9b5]/50 border border-[#522e18]/40">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-900 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-800" />
              <span>ANCIENT CODEX LORE</span>
            </div>
            <p className="text-[11px] text-[#633a20] leading-relaxed italic">
              &ldquo;{loreData.lore}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-[#ebd9b5] p-2.5 border border-[#522e18]">
            <div>
              <span className="block text-[#633a20] text-[9px] uppercase">Element</span>
              <span className="font-bold text-[#241208]">{skill.elementPath || 'Universal'}</span>
            </div>
            <div>
              <span className="block text-[#633a20] text-[9px] uppercase">Max Level</span>
              <span className="font-bold text-[#241208]">{skill.maxLevel}</span>
            </div>
            <div>
              <span className="block text-[#633a20] text-[9px] uppercase">Current Level</span>
              <span className="font-bold text-amber-800">{playerSkill ? playerSkill.currentLevel : 0}</span>
            </div>
            <div>
              <span className="block text-[#633a20] text-[9px] uppercase">SP Cost</span>
              <span className="font-bold text-emerald-800">{skill.baseCostSP} SP</span>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-1">
            <h3 className="text-[10px] uppercase font-bold text-[#633a20] tracking-wider">Requirements</h3>
            <ul className="space-y-1 text-xs">
              {Object.entries(reqs).length === 0 && (
                <li className="text-[#8c5225] italic">None</li>
              )}
              {Object.entries(reqs).map(([key, val]) => {
                if (key === 'skills') {
                  const prereqs = val as string[];
                  return (
                    <li key={key} className="flex items-center gap-1.5 text-[#381e10]">
                      <span className="w-1.5 h-1.5 bg-amber-800"></span>
                      Requires skill(s): <span className="font-bold">{prereqs.join(', ')}</span>
                    </li>
                  );
                }
                return (
                  <li key={key} className="flex items-center gap-1.5 text-[#381e10]">
                    <span className="w-1.5 h-1.5 bg-amber-800"></span>
                    Requires {key}: <span className="font-bold">{val}</span>
                  </li>
                );
              })}
            </ul>
            {!available && !playerSkill && (
              <p className="text-xs text-rose-800 font-bold">
                {unmetReason || 'Requirements not met'}
              </p>
            )}
            {isMaxLevel && (
              <p className="text-xs text-amber-800 font-bold">
                Maximum mastery reached.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#ebd9b5] border-t-2 border-[#522e18] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-[#f5ecda] border-2 border-[#522e18] text-[#381e10] hover:bg-[#dfba7c] text-xs cursor-pointer"
          >
            Close
          </button>

          <PixelButton
            onClick={() => {
              playBuffSFX("levelup");
              onUnlock();
            }}
            disabled={(!available && !playerSkill) || isMaxLevel || loading}
            variant={(!available && !playerSkill) || isMaxLevel ? 'dark' : 'gold'}
            size="sm"
            className="text-xs"
          >
            {loading ? 'Learning...' : (playerSkill ? 'Upgrade' : 'Learn Skill')}
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;
