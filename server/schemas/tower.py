from pydantic import BaseModel, Field
from typing import List, Optional

class ChallengeRequest(BaseModel):
    floorNumber: int

class CombatEvent(BaseModel):
    turn: int
    actor: str
    action: str
    damage: int = 0
    message: str

class CombatLog(BaseModel):
    isVictory: bool
    turnsElapsed: int
    playerHpRemaining: int
    enemyHpRemaining: int
    totalDamageDealt: int
    events: List[CombatEvent]
    rewards: Optional[dict] = None
