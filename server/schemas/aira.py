from typing import Optional, List
from pydantic import BaseModel, Field


class AIRAChatSchema(BaseModel):
    prompt: str = Field(..., description="User prompt or query for AIRA")
    characterId: Optional[str] = Field("char-id-123", description="Character ID for context injection")


class AIRADefeatSchema(BaseModel):
    battleLogs: List[str] = Field(default_factory=list, description="Array of turn battle logs from the defeated tower run")
    characterId: Optional[str] = Field("char-id-123", description="Character ID for context injection")
    floorNumber: Optional[int] = Field(1, description="Floor number where defeat occurred")
