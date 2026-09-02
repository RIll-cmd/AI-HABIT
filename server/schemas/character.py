from typing import Optional
from pydantic import BaseModel, Field


class CharacterUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    title: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, max_length=50)
    avatar: Optional[str] = Field(None, max_length=255)


class HistoryEntrySchema(BaseModel):
    amount: int = Field(..., ge=0, le=10_000_000)
    type: str = Field(..., max_length=50)
    description: str = Field(..., max_length=255)


class ProgressionSyncSchema(BaseModel):
    total_exp: int = Field(..., ge=0, le=100_000_000)
    level: int = Field(..., ge=1, le=1000)
    power: int = Field(..., ge=0, le=100_000_000)
    rank: str = Field(..., min_length=1, max_length=10)
    history_entry: Optional[HistoryEntrySchema] = None

