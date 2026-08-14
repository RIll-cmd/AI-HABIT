from pydantic import BaseModel
from typing import Optional, List, Any

class ShopItemBuyRequest(BaseModel):
    shop_item_id: str

class ShopItemDetailSchema(BaseModel):
    id: str
    itemId: str
    currencyType: str
    price: int
    stock: Optional[int]
    requiredLevel: Optional[int]
    requiredPower: Optional[int]
    
    # Joined Item fields
    name: str
    description: Optional[str]
    type: str
    rarity: str
    icon: str
    sellValue: Optional[int] = 0
    
    # Combat & Primary Stats
    attack: Optional[int] = 0
    defense: Optional[int] = 0
    strength: Optional[int] = 0
    knowledge: Optional[int] = 0
    endurance: Optional[int] = 0
    recovery: Optional[int] = 0
    focus: Optional[int] = 0
    discipline: Optional[int] = 0
    consistency: Optional[int] = 0
    
    # Computed fields for the character
    canAfford: bool
    meetsRequirements: bool
    inStock: bool
