from typing import Optional, List
from pydantic import BaseModel, Field

class ItemDefinitionSchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    type: str
    rarity: str
    icon: str
    sellValue: int
    attack: int
    defense: int
    strength: int
    knowledge: int
    discipline: int
    focus: int
    endurance: int
    recovery: int
    passive: Optional[str] = None

    class Config:
        from_attributes = True

class PlayerItemSchema(BaseModel):
    id: str
    characterId: str
    itemDefinitionId: str
    quantity: int
    isEquipped: bool
    isLocked: bool
    isFavorite: bool
    acquiredFrom: Optional[str] = None
    
    itemDefinition: Optional[ItemDefinitionSchema] = None

    class Config:
        from_attributes = True

class EquipmentActionResponse(BaseModel):
    status: str
    message: str
    playerItem: PlayerItemSchema

class ToggleActionResponse(BaseModel):
    status: str
    message: str
    playerItem: PlayerItemSchema

class ItemUseResponse(BaseModel):
    status: str
    message: str
    effectType: str
    effectValue: int
    consumedItemId: str
    remainingQuantity: int

