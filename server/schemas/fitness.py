from typing import Optional
from pydantic import BaseModel, Field


class WorkoutSessionStartSchema(BaseModel):
    characterId: str = Field(..., min_length=1)
    planId: Optional[str] = None


class ExerciseLogCreateSchema(BaseModel):
    exerciseId: str = Field(..., min_length=1)
    set: int = Field(..., ge=1)
    weight: float = Field(..., ge=0.0)
    reps: int = Field(..., ge=0)
    rpe: Optional[float] = Field(None, ge=1.0, le=10.0)
    restTime: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=500)


class TextLogSchema(BaseModel):
    text: str = Field(..., min_length=1, max_length=300)
