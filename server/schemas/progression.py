from pydantic import BaseModel, Field


class GoldLogSchema(BaseModel):
    amount: int = Field(..., description="Amount of gold gained or spent (can be negative)")
    reason: str = Field(..., description="Reason for the economy transaction")
    source: str = Field(..., description="Source of transaction: MISSION, ACHIEVEMENT, SHOP, TOWER, ADMIN")
