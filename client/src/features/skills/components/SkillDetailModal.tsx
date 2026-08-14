import React from 'react';
import { SkillDefinition, PlayerSkill } from '../types';
import { SkillIcon } from './SkillIcon';
import { getSkillLore } from '../data/skillLore';
import { playUISound, playBuffSFX } from '@/utils/audio';
import { BookOpen, Sparkles, Swords } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#151C33] border border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-slate-700 bg-slate-800/50">
          <SkillIcon iconId={skill.icon} size={64} className="rounded-lg shadow-md border border-slate-600 bg-slate-900" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white tracking-wide">{skill.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              <span className="text-blue-400">{skill.skillType}</span>
              <span>•</span>
              <span className="text-purple-400">Tier {skill.tier}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Combat Effect */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider mb-1 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
              <span>COMBAT MASTERY EFFECT:</span>
            </span>
            <p className="text-xs text-slate-100 font-sans leading-relaxed">
              {loreData.combatEffect || skill.description}
            </p>
          </div>

          {/* Ancient Lore Chronicle */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#121A30] to-[#0A0E1A] border border-purple-500/40 relative overflow-hidden shadow-md">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>ANCIENT CHRONICLE LORE</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
              &ldquo;{loreData.lore}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-900/50 rounded-lg p-3 border border-slate-800">
            <div>
              <span className="block text-slate-500 mb-0.5 text-xs uppercase">Element</span>
              <span className="font-semibold text-slate-200">{skill.elementPath || 'Universal'}</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-0.5 text-xs uppercase">Max Level</span>
              <span className="font-semibold text-slate-200">{skill.maxLevel}</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-0.5 text-xs uppercase">Current Level</span>
              <span className="font-semibold text-yellow-400">{playerSkill ? playerSkill.currentLevel : 0}</span>
            </div>
            <div>
              <span className="block text-slate-500 mb-0.5 text-xs uppercase">SP Cost</span>
              <span className="font-semibold text-emerald-400">{skill.baseCostSP} SP</span>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Requirements</h3>
            <ul className="space-y-1 text-sm">
              {Object.entries(reqs).length === 0 && (
                <li className="text-slate-500 italic">None</li>
              )}
              {Object.entries(reqs).map(([key, val]) => {
                if (key === 'skills') {
                  const prereqs = val as string[];
                  return (
                    <li key={key} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      Requires skill(s): <span className="font-medium text-slate-200">{prereqs.join(', ')}</span>
                    </li>
                  );
                }
                return (
                  <li key={key} className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Requires {key}: <span className="font-medium text-slate-200">{val}</span>
                  </li>
                );
              })}
            </ul>
            {!available && !playerSkill && (
              <p className="mt-2 text-xs text-red-400 font-medium">
                {unmetReason || 'Requirements not met'}
              </p>
            )}
            {isMaxLevel && (
              <p className="mt-2 text-xs text-yellow-500 font-medium">
                Maximum level reached.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-end">
          <button
            onClick={() => {
              playBuffSFX("levelup");
              onUnlock();
            }}
            disabled={(!available && !playerSkill) || isMaxLevel || loading}
            className={`
              px-6 py-2 rounded-md font-bold tracking-widest text-sm uppercase transition-all
              ${((!available && !playerSkill) || isMaxLevel)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 active:scale-95'
              }
            `}
          >
            {loading ? 'Processing...' : (playerSkill ? 'Upgrade' : 'Unlock')}
          </button>
        </div>
      </div>
    </div>
  );
};
