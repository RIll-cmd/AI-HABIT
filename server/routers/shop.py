from fastapi import APIRouter, HTTPException
from prisma.models import ShopItem, Character, EconomyLog
from db import db
from schemas.shop import ShopItemBuyRequest, ShopItemDetailSchema
from routers.inventory import grant_item
from typing import List

router = APIRouter(prefix="/api/shop", tags=["Shop"])

@router.get("/{character_id}", response_model=List[ShopItemDetailSchema])
async def get_shop_items(character_id: str):
    character = await db.character.find_unique(where={"id": character_id})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
        
    shop_items = await db.shopitem.find_many(include={"item": True})
    
    result = []
    for si in shop_items:
        # Check stock
        in_stock = True
        if si.stock is not None and si.stock <= 0:
            in_stock = False
            
        # Check requirements
        meets_reqs = True
        if si.requiredLevel is not None and character.level < si.requiredLevel:
            meets_reqs = False
        if si.requiredPower is not None and character.power < si.requiredPower:
            meets_reqs = False
            
        # Check currency
        can_afford = False
        if si.currencyType == "GOLD":
            can_afford = character.gold >= si.price
        elif si.currencyType == "GEMS":
            can_afford = character.gems >= si.price
        elif si.currencyType == "TOWER_TOKENS":
            can_afford = character.towerTokens >= si.price
            
        item_def = si.item
        
        result.append(ShopItemDetailSchema(
            id=si.id,
            itemId=si.itemId,
            currencyType=si.currencyType,
            price=si.price,
            stock=si.stock,
            requiredLevel=si.requiredLevel,
            requiredPower=si.requiredPower,
            name=item_def.name if item_def else "Unknown",
            description=item_def.description if item_def else None,
            type=item_def.type if item_def else "UNKNOWN",
            rarity=item_def.rarity if item_def else "COMMON",
            icon=item_def.icon if item_def else "",
            canAfford=can_afford,
            meetsRequirements=meets_reqs,
            inStock=in_stock
        ))
        
    return result

@router.post("/{character_id}/buy")
async def buy_item(character_id: str, request: ShopItemBuyRequest):
    character = await db.character.find_unique(where={"id": character_id})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
        
    shop_item = await db.shopitem.find_unique(
        where={"id": request.shop_item_id},
        include={"item": True}
    )
    
    if not shop_item:
        raise HTTPException(status_code=404, detail="Shop item not found")
        
    # Check stock
    if shop_item.stock is not None and shop_item.stock <= 0:
        raise HTTPException(status_code=400, detail="Item is out of stock")
        
    # Check requirements
    if shop_item.requiredLevel is not None and character.level < shop_item.requiredLevel:
        raise HTTPException(status_code=400, detail="Level requirement not met")
    if shop_item.requiredPower is not None and character.power < shop_item.requiredPower:
        raise HTTPException(status_code=400, detail="Power requirement not met")
        
    # Check currency
    if shop_item.currencyType == "GOLD" and character.gold < shop_item.price:
        raise HTTPException(status_code=400, detail="Insufficient Gold")
    elif shop_item.currencyType == "GEMS" and character.gems < shop_item.price:
        raise HTTPException(status_code=400, detail="Insufficient Gems")
    elif shop_item.currencyType == "TOWER_TOKENS" and character.towerTokens < shop_item.price:
        raise HTTPException(status_code=400, detail="Insufficient Tower Tokens")
        
    # Transaction: Deduct currency
    update_data = {}
    if shop_item.currencyType == "GOLD":
        update_data = {"gold": {"decrement": shop_item.price}}
    elif shop_item.currencyType == "GEMS":
        update_data = {"gems": {"decrement": shop_item.price}}
    elif shop_item.currencyType == "TOWER_TOKENS":
        update_data = {"towerTokens": {"decrement": shop_item.price}}
        
    await db.character.update(
        where={"id": character_id},
        data=update_data
    )
    
    # Log EconomyLog
    await db.economylog.create(
        data={
            "characterId": character_id,
            "currency": shop_item.currencyType,
            "amount": -shop_item.price,
            "reason": f"Purchased {shop_item.item.name if shop_item.item else 'Item'}",
            "source": "SHOP_PURCHASE"
        }
    )
    
    # Deliver item
    granted = await grant_item(character_id, shop_item.itemId, quantity=1, source="SHOP_PURCHASE")
    
    # Decrement stock
    if shop_item.stock is not None:
        await db.shopitem.update(
            where={"id": shop_item.id},
            data={"stock": {"decrement": 1}}
        )
        
    return {"message": "Purchase successful", "item": granted}
