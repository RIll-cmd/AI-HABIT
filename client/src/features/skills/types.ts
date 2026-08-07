export interface SkillDefinition {
  id: string;
  name: string;
  description: string | null;
  elementPath: string | null;
  tier: number;
  maxLevel: number;
  skillType: string;
  baseCostSP: number;
  statRequirements: string; // JSON string
  icon: string | null;
}

export interface PlayerSkill {
  id: string;
  characterId: string;
  skillDefinitionId: string;
  currentLevel: number;
  skillDefinition?: SkillDefinition;
}

export interface SkillUnlockResponse {
  status: string;
  message: string;
  playerSkill: PlayerSkill;
  availableSP: number;
}
