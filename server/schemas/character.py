from typing import Optional
from pydantic import BaseModel, Field


class CharacterUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    title: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, max_length=50)
    avatar: Optional[str] = Field(None, max_length=255)


class HistoryEntrySchema(BaseModel):
    amount: int
    type: str
    description: str


class ProgressionSyncSchema(BaseModel):
    total_exp: int
    level: int
    power: int
    rank: str
    history_entry: Optional[HistoryEntrySchema] = None
