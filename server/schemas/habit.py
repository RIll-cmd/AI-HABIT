from enum import Enum
from typing import Optional, Literal, List
from pydantic import BaseModel, Field

class HabitStatus(str, Enum):
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    ARCHIVED = "ARCHIVED"
    DELETED = "DELETED"

class Difficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class ScheduleType(str, Enum):
    DAILY = "DAILY"
    SPECIFIC_DAYS = "SPECIFIC_DAYS"
    X_TIMES_WEEK = "X_TIMES_WEEK"
    MONTHLY = "MONTHLY"
    CUSTOM = "CUSTOM"

class Tier(str, Enum):
    MINI = "MINI"
    NORMAL = "NORMAL"
    ELITE = "ELITE"

class HabitScheduleCreateSchema(BaseModel):
    daysOfWeek: Optional[str] = None
    timesPerWeek: Optional[int] = None
    timesPerMonth: Optional[int] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    timezone: Optional[str] = None

class HabitTierCreateSchema(BaseModel):
    tier: Tier
    targetType: Optional[str] = None
    targetValue: Optional[float] = None
    targetUnit: Optional[str] = None
    baseExp: int = 0
    baseGold: int = 0
    statReward: int = 0

class HabitCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = None
    color: Optional[str] = None
    category: str = Field("General", max_length=50)
    difficulty: Difficulty = Field(Difficulty.EASY)
    primaryStat: str = Field("discipline", max_length=50)
    scheduleType: ScheduleType = Field(ScheduleType.DAILY)
    preferredTime: Optional[str] = None
    
    schedule: Optional[HabitScheduleCreateSchema] = None
    tiers: List[HabitTierCreateSchema] = Field(default_factory=list)

class MissionCompleteSchema(BaseModel):
    completionType: Tier
    expEarned: Optional[int] = None
    statsEarned: Optional[int] = None

class HabitStatusUpdateSchema(BaseModel):
    status: HabitStatus
