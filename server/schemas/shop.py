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
    
    # Computed fields for the character
    canAfford: bool
    meetsRequirements: bool
    inStock: bool
