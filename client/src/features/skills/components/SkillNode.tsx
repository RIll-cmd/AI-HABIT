import React from 'react';
import { SkillDefinition, PlayerSkill } from '../types';
import { SkillIcon } from './SkillIcon';
import { playUISound } from '@/utils/audio';

interface SkillNodeProps {
  skill: SkillDefinition;
  playerSkill?: PlayerSkill;
  status: 'locked' | 'available' | 'unlocked';
  onClick: () => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, playerSkill, status, onClick }) => {
  // Determine border color based on element
  let borderColor = 'border-slate-700';
  let glowColor = '';
  
  if (status !== 'locked') {
    switch(skill.elementPath) {
      case 'Flame': borderColor = 'border-red-500'; glowColor = 'shadow-[0_0_15px_rgba(239,68,68,0.5)]'; break;
      case 'Tempest': borderColor = 'border-cyan-400'; glowColor = 'shadow-[0_0_15px_rgba(34,211,238,0.5)]'; break;
      case 'Earth': borderColor = 'border-amber-600'; glowColor = 'shadow-[0_0_15px_rgba(217,119,6,0.5)]'; break;
      case 'Tide': borderColor = 'border-blue-500'; glowColor = 'shadow-[0_0_15px_rgba(59,130,246,0.5)]'; break;
      case 'Ascension': borderColor = 'border-purple-500'; glowColor = 'shadow-[0_0_15px_rgba(168,85,247,0.5)]'; break;
    }
  }

  if (status === 'unlocked') {
    borderColor = 'border-yellow-400';
    glowColor = 'shadow-[0_0_20px_rgba(250,204,21,0.6)]';
  }

  return (
    <button
      onClick={() => {
        playUISound("/sounds/General/10_UI_Menu_SFX/001_Hover_01.wav");
        onClick();
      }}
      className={`
        relative group transition-all duration-200 
        rounded-lg border-2 bg-slate-900 p-1 flex flex-col items-center justify-center
        hover:scale-105 active:scale-95
        ${borderColor} ${glowColor}
        ${status === 'locked' ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-white'}
      `}
      title={skill.name}
    >
      <SkillIcon iconId={skill.icon} size={48} />
      
      {/* Level Indicator (if unlocked) */}
      {status === 'unlocked' && playerSkill && (
        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full border border-slate-900 shadow-md">
          Lv.{playerSkill.currentLevel}
        </div>
      )}
    </button>
  );
};
