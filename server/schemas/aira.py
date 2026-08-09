from typing import Optional, List
from pydantic import BaseModel, Field


class AIRAChatSchema(BaseModel):
    prompt: str = Field(..., description="User prompt or query for AIRA")
    characterId: Optional[str] = Field("char-id-123", description="Character ID for context injection")


class AIRACombatAnalysisSchema(BaseModel):
    battleLogs: List[str] = Field(default_factory=list, description="Array of turn battle logs from the tower run")
    characterId: Optional[str] = Field("char-id-123", description="Character ID for context injection")
    floorNumber: Optional[int] = Field(1, description="Floor number")
    isVictory: bool = Field(False, description="Did the player win?")
    turnsElapsed: int = Field(0, description="Number of turns the combat took")
    playerHpRemaining: int = Field(0, description="Player remaining HP")
