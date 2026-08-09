from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AIRAChatSchema(BaseModel):
    prompt: str = Field(..., description="User prompt or query for AIRA")
    characterId: Optional[str] = Field("char-id-123", description="Character ID for context injection")


class AIRAPendingAction(BaseModel):
    action_type: str = Field(..., description="The name of the mutative tool (e.g., log_completed_workout)")
    action_args: Dict[str, Any] = Field(..., description="The arguments for the action")
    summary: str = Field(..., description="A short summary of the detected action for the user to confirm")

class AIRAChatResponseSchema(BaseModel):
    response: str
    pending_action: Optional[AIRAPendingAction] = None

class AIRAExecuteActionSchema(BaseModel):
    action_type: str
    action_args: Dict[str, Any]
    characterId: Optional[str] = "char-id-123"

class AIRACombatAnalysisSchema(BaseModel):
    battleLogs: List[str] = Field(default_factory=list, description="Array of turn battle logs from the tower run")
    characterId: Optional[str] = Field("char-id-123", description="Character ID for context injection")
    floorNumber: Optional[int] = Field(1, description="Floor number")
    isVictory: bool = Field(False, description="Did the player win?")
    turnsElapsed: int = Field(0, description="Number of turns the combat took")
    playerHpRemaining: int = Field(0, description="Player remaining HP")
