from typing import Optional, Literal
from pydantic import BaseModel, Field


class HabitCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: str = Field("General", max_length=50)
    difficulty: str = Field("Easy", max_length=20)  # 'Easy', 'Medium', 'Hard'
    primaryStat: str = Field("discipline", max_length=50)  # 'strength', 'knowledge', etc.
    scheduleType: str = Field("Daily", max_length=50)  # 'Daily', 'Weekly', 'Monthly', 'Specific_Days', 'Custom'
    scheduleDays: Optional[str] = None  # JSON array string for specific days
    icon: Optional[str] = None
    color: Optional[str] = None


class MissionCompleteSchema(BaseModel):
    completionType: Literal["MINI", "NORMAL", "ELITE"]
    expEarned: Optional[int] = None
    statsEarned: Optional[int] = None
