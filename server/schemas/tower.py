from pydantic import BaseModel, Field


class CombatResultSchema(BaseModel):
    isVictory: bool = Field(..., description="Whether the character won the combat encounter")
    totalTurns: int = Field(..., description="Total turns elapsed during combat simulation")
