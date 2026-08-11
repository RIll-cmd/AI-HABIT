from fastapi import APIRouter, HTTPException
from prisma.models import ShopItem, Character, EconomyLog
from db import db
from schemas.shop import ShopItemBuyRequest, ShopItemDetailSchema
from routers.inventory import grant_item
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

async def seed_shop_items_auto():
    defs = await db.itemdefinition.find_many()
    if not defs:
        default_items = [
            {"name": "Shadow Blade", "type": "WEAPON", "rarity": "COMMON", "icon": "/icons/Icon20.png", "sellValue": 100, "attack": 15},
            {"name": "Dragon Slayer", "type": "WEAPON", "rarity": "EPIC", "icon": "/icons/Icon5.png", "sellValue": 1000, "attack": 50},
            {"name": "Health Potion", "type": "CONSUMABLE", "rarity": "COMMON", "icon": "/icons/Icon304.png", "sellValue": 50},
            {"name": "EXP Elixir", "type": "CONSUMABLE", "rarity": "RARE", "icon": "/icons/Icon309.png", "sellValue": 250},
            {"name": "Guardian Cuirass", "type": "ARMOR", "rarity": "RARE", "icon": "/icons/Icon185.png", "sellValue": 400, "defense": 25},
            {"name": "Ring of Dominion", "type": "RING", "rarity": "EPIC", "icon": "/icons/Icon244.png", "sellValue": 1200, "strength": 10, "knowledge": 10},
        ]
        for item in default_items:
            await db.itemdefinition.create(
                data={
                    "name": item["name"],
                    "description": f"A standard {item['rarity'].lower()} {item['name']}.",
                    "type": item["type"],
                    "rarity": item["rarity"],
                    "icon": item.get("icon", "/icons/default.png"),
                    "sellValue": item.get("sellValue", 50),
                    "attack": item.get("attack", 0),
                    "defense": item.get("defense", 0),
                    "strength": item.get("strength", 0),
                    "knowledge": item.get("knowledge", 0),
                }
            )
        defs = await db.itemdefinition.find_many()

    prices = [250, 4500, 500, 1200, 800, 3000]
    currencies = ["GOLD", "GOLD", "GOLD", "GEMS", "TOWER_TOKENS", "GOLD"]

    for idx, d in enumerate(defs[:6]):
        await db.shopitem.create(
            data={
                "itemId": d.id,
                "currencyType": currencies[idx % len(currencies)],
                "price": prices[idx % len(prices)],
                "stock": 10,
                "requiredLevel": 1
            }
        )

@router.get("/{character_id}", response_model=List[ShopItemDetailSchema])
async def get_shop_items(character_id: str):
    character = await db.character.find_unique(where={"id": character_id})
    if not character:
        from db_utils import ensure_character_exists
        character = await ensure_character_exists(character_id)
        
    shop_items = await db.shopitem.find_many(include={"item": True})
    if not shop_items:
        await seed_shop_items_auto()
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
    
    # Auto-activate specific Shop Consumables / Cosmetics
    if shop_item.item:
        if shop_item.item.type == "CONSUMABLE":
            if "Double-EXP" in shop_item.item.name:
                await db.activebuff.create(data={
                    "characterId": character_id,
                    "buffType": "DOUBLE_EXP",
                    "multiplier": 2.0,
                    "expiresAt": datetime.now() + timedelta(hours=1),
                    "chargesRemaining": 10
                })
            elif "Double-Gold" in shop_item.item.name:
                await db.activebuff.create(data={
                    "characterId": character_id,
                    "buffType": "DOUBLE_GOLD",
                    "multiplier": 2.0,
                    "expiresAt": datetime.now() + timedelta(hours=1),
                    "chargesRemaining": 10
                })
        elif shop_item.item.type == "COSMETIC":
            if "Title Scroll" in shop_item.item.name:
                title_name = shop_item.item.name.replace("Title Scroll: ", "")
                title = await db.title.find_first(where={"name": title_name})
                if not title:
                    title = await db.title.create(data={"name": title_name, "category": "Special"})
                existing_title = await db.charactertitle.find_first(where={"characterId": character_id, "titleId": title.id})
                if not existing_title:
                    await db.charactertitle.create(data={"characterId": character_id, "titleId": title.id})

    # Decrement stock
    if shop_item.stock is not None and shop_item.stock > 0:
        await db.shopitem.update(
            where={"id": shop_item.id},
            data={"stock": {"decrement": 1}}
        )
        
    return {"message": "Purchase successful", "item": granted}

import random

@router.post("/{character_id}/refresh", response_model=List[ShopItemDetailSchema])
async def refresh_shop_items(character_id: str):
    character = await db.character.find_unique(where={"id": character_id})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    all_item_defs = await db.itemdefinition.find_many()
    if not all_item_defs:
        raise HTTPException(status_code=404, detail="No Item Definitions available in database")

    # Pick up to 8 random items from ItemDefinition
    sample_size = min(8, len(all_item_defs))
    selected_defs = random.sample(all_item_defs, sample_size)

    # Delete existing shop items
    await db.shopitem.delete_many()

    # Create new rotated shop items
    for item_def in selected_defs:
        rarity = (item_def.rarity or "COMMON").upper()
        
        if rarity == "COMMON":
            currency_type = "GOLD"
            price = random.randint(150, 350)
            stock = 10
            req_level = 1
        elif rarity == "RARE":
            currency_type = random.choice(["GOLD", "TOWER_TOKENS"])
            price = random.randint(500, 1200) if currency_type == "GOLD" else random.randint(50, 150)
            stock = 3
            req_level = random.randint(3, 8)
        elif rarity == "EPIC":
            currency_type = random.choice(["GOLD", "GEMS"])
            price = random.randint(2500, 5000) if currency_type == "GOLD" else random.randint(100, 300)
            stock = 1
            req_level = random.randint(10, 20)
        else: # LEGENDARY / MYTHIC
            currency_type = random.choice(["GOLD", "GEMS"])
            price = random.randint(8000, 15000) if currency_type == "GOLD" else random.randint(500, 1000)
            stock = 1
            req_level = random.randint(15, 30)

        await db.shopitem.create(
            data={
                "itemId": item_def.id,
                "currencyType": currency_type,
                "price": price,
                "stock": stock,
                "requiredLevel": req_level
            }
        )

    # Return refreshed items list
    return await get_shop_items(character_id)

