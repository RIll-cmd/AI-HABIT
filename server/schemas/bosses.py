from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class BossPhaseSchema(BaseModel):
    id: str
    bossId: str
    name: str
    maxHp: int
    orderIndex: int

class BossActivityCreate(BaseModel):
    activityType: str = Field(..., description="'HABIT', 'MISSION', 'WORKOUT'")
    referenceId: Optional[str] = None
    damageValue: int = Field(..., description="Damage this activity deals")

class BossActivitySchema(BossActivityCreate):
    id: str
    bossId: str

class BossDamageLogSchema(BaseModel):
    id: str
    bossId: str
    activityId: Optional[str]
    damage: int
    createdAt: datetime

class BossCreate(BaseModel):
    name: str = Field(..., description="Name of the boss/goal")
    description: Optional[str] = None
    category: str = Field(..., description="'ACADEMIC', 'PROJECT', 'FITNESS', 'CAREER', etc.")
    difficulty: str = Field(..., description="'EASY', 'NORMAL', 'HARD', 'ELITE', 'LEGENDARY'")
    deadline: Optional[datetime] = None
    activities: List[BossActivityCreate] = Field(default_factory=list, description="Activities linked to this boss")

class BossSchema(BaseModel):
    id: str
    characterId: str
    name: str
    description: Optional[str]
    category: str
    difficulty: str
    maxHp: int
    currentHp: int
    deadline: Optional[datetime]
    status: str
    createdAt: datetime
    
    phases: List[BossPhaseSchema] = []
    activities: List[BossActivitySchema] = []
    damageLogs: List[BossDamageLogSchema] = []
