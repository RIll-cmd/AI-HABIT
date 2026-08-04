from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.inventory import ItemGrantSchema

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.get("/{character_id}")
async def get_inventory(character_id: str):
    """
    Fetch all Inventory records for a character including nested Item,
    Equipment, and Consumable details.
    """
    await ensure_character_exists(character_id)

    inventory_items = await db.inventory.find_many(
        where={"characterId": character_id},
        include={
            "item": {
                "include": {
                    "equipment": True,
                    "consumable": True,
                }
            }
        },
        order={"obtainedAt": "desc"},
    )
    return inventory_items


@router.post("/{character_id}/grant")
async def grant_item(character_id: str, payload: ItemGrantSchema):
    """
    Creates an Item template record (with Equipment stats if provided)
    and grants an Inventory instance to the specified character.
    """
    await ensure_character_exists(character_id)

    # 1. Create base Item
    item = await db.item.create(
        data={
            "name": payload.name,
            "description": payload.description,
            "category": payload.category,
            "rarity": payload.rarity,
            "sellPrice": payload.sellPrice,
            "buyPrice": payload.buyPrice,
            "lore": payload.lore,
            "icon": payload.icon,
        }
    )

    # 2. Create Equipment details if category is Equipment
    if payload.equipment and payload.category == "Equipment":
        eq = payload.equipment
        await db.equipment.create(
            data={
                "itemId": item.id,
                "slot": eq.slot,
                "strength": eq.strength,
                "knowledge": eq.knowledge,
                "recovery": eq.recovery,
                "focus": eq.focus,
                "discipline": eq.discipline,
                "endurance": eq.endurance,
                "attack": eq.attack,
                "defense": eq.defense,
                "hp": eq.hp,
                "setName": eq.setName,
            }
        )

    # 3. Create Inventory record instance
    inventory_record = await db.inventory.create(
        data={
            "characterId": character_id,
            "itemId": item.id,
            "quantity": 1,
            "isEquipped": False,
        },
        include={
            "item": {
                "include": {
                    "equipment": True,
                    "consumable": True,
                }
            }
        },
    )

    return inventory_record


@router.post("/{character_id}/equip/{inventory_id}")
async def equip_item(character_id: str, inventory_id: str):
    """
    Equips an inventory item for a character. Unequips any existing item in the same slot.
    """
    await ensure_character_exists(character_id)

    target_record = await db.inventory.find_first(
        where={"id": inventory_id, "characterId": character_id},
        include={
            "item": {
                "include": {
                    "equipment": True,
                }
            }
        },
    )

    if not target_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item with ID '{inventory_id}' not found.",
        )

    # If item is Equipment, auto-unequip any currently equipped item sharing the same slot
    target_equipment = target_record.item.equipment if target_record.item else None
    if target_equipment:
        currently_equipped = await db.inventory.find_many(
            where={"characterId": character_id, "isEquipped": True},
            include={
                "item": {
                    "include": {
                        "equipment": True,
                    }
                }
            },
        )

        for equipped in currently_equipped:
            eq_details = equipped.item.equipment if equipped.item else None
            if eq_details and eq_details.slot == target_equipment.slot:
                await db.inventory.update(
                    where={"id": equipped.id},
                    data={"isEquipped": False},
                )

    # Set target inventory item to equipped
    updated_record = await db.inventory.update(
        where={"id": inventory_id},
        data={"isEquipped": True},
        include={
            "item": {
                "include": {
                    "equipment": True,
                }
            }
        },
    )

    return {
        "status": "success",
        "message": f"Successfully equipped '{target_record.item.name}'",
        "inventory": updated_record,
    }


@router.post("/{character_id}/unequip/{inventory_id}")
async def unequip_item(character_id: str, inventory_id: str):
    """
    Unequips an inventory item for a character.
    """
    await ensure_character_exists(character_id)

    target_record = await db.inventory.find_first(
        where={"id": inventory_id, "characterId": character_id},
        include={"item": True},
    )

    if not target_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item with ID '{inventory_id}' not found.",
        )

    updated_record = await db.inventory.update(
        where={"id": inventory_id},
        data={"isEquipped": False},
        include={
            "item": {
                "include": {
                    "equipment": True,
                }
            }
        },
    )

    return {
        "status": "success",
        "message": f"Successfully unequipped '{target_record.item.name}'",
        "inventory": updated_record,
    }
