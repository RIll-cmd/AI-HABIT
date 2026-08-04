from typing import Optional
from pydantic import BaseModel, Field


class EquipmentCreateSchema(BaseModel):
    slot: str = Field(..., description="Equipment slot: Weapon, Helmet, Armor, Gloves, Boots, Ring, Necklace, Artifact, Relic")
    strength: int = Field(0, description="Strength bonus")
    knowledge: int = Field(0, description="Knowledge bonus")
    recovery: int = Field(0, description="Recovery bonus")
    focus: int = Field(0, description="Focus bonus")
    discipline: int = Field(0, description="Discipline bonus")
    endurance: int = Field(0, description="Endurance bonus")
    attack: int = Field(0, description="Attack bonus")
    defense: int = Field(0, description="Defense bonus")
    hp: int = Field(0, description="HP bonus")
    setName: Optional[str] = Field(None, description="Set bonus name")


class ItemGrantSchema(BaseModel):
    name: str = Field(..., description="Item display name")
    description: str = Field(..., description="Item description")
    category: str = Field("Equipment", description="Item category: Equipment, Consumable, Material, Relic")
    rarity: str = Field("Common", description="Item rarity: Common, Uncommon, Rare, Epic, Legendary, Mythic, Ancient")
    sellPrice: int = Field(10, description="Gold earned when sold")
    buyPrice: int = Field(50, description="Gold required to buy")
    lore: Optional[str] = Field(None, description="Flavor lore description")
    icon: Optional[str] = Field(None, description="Icon asset path")
    equipment: Optional[EquipmentCreateSchema] = Field(None, description="Equipment stats details if category is Equipment")
