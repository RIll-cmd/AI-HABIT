from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SkillDefinitionSchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    elementPath: Optional[str] = None
    tier: int
    maxLevel: int
    skillType: str
    baseCostSP: int
    statRequirements: str
    icon: Optional[str] = None

    class Config:
        from_attributes = True

class PlayerSkillSchema(BaseModel):
    id: str
    characterId: str
    skillDefinitionId: str
    currentLevel: int

    skillDefinition: Optional[SkillDefinitionSchema] = None

    class Config:
        from_attributes = True

class SkillUnlockRequestSchema(BaseModel):
    skillDefinitionId: str

class SkillUnlockResponseSchema(BaseModel):
    status: str
    message: str
    playerSkill: PlayerSkillSchema
    availableSP: int
