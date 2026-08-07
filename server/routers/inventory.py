from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists
from schemas.inventory import PlayerItemSchema, EquipmentActionResponse, ToggleActionResponse
from typing import List

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


@router.get("/{character_id}", response_model=List[PlayerItemSchema])
async def get_inventory(character_id: str):
    """
    Fetch all PlayerItem records for a character including nested ItemDefinition details.
    """
    await ensure_character_exists(character_id)

    inventory_items = await db.playeritem.find_many(
        where={"characterId": character_id},
        include={"itemDefinition": True},
        order={"acquiredAt": "desc"},
    )
    return inventory_items


async def grant_item(character_id: str, item_definition_id: str, quantity: int = 1, source: str = "LOOT"):
    """
    Helper function to grant an item to a character.
    Creates a transaction log.
    """
    await ensure_character_exists(character_id)

    item_def = await db.itemdefinition.find_unique(where={"id": item_definition_id})
    if not item_def:
        raise HTTPException(status_code=404, detail="Item Definition not found.")

    # Check if item stacks (for this prototype, let's just create a new PlayerItem or increment quantity)
    # Materials and consumables stack. Equipment generally does not.
    if item_def.type in ["MATERIAL", "CONSUMABLE"]:
        existing = await db.playeritem.find_first(
            where={
                "characterId": character_id,
                "itemDefinitionId": item_definition_id
            }
        )
        if existing:
            player_item = await db.playeritem.update(
                where={"id": existing.id},
                data={"quantity": existing.quantity + quantity},
                include={"itemDefinition": True}
            )
        else:
            player_item = await db.playeritem.create(
                data={
                    "characterId": character_id,
                    "itemDefinitionId": item_definition_id,
                    "quantity": quantity,
                    "acquiredFrom": source
                },
                include={"itemDefinition": True}
            )
    else:
        # Create separate instances for equipment
        player_item = await db.playeritem.create(
            data={
                "characterId": character_id,
                "itemDefinitionId": item_definition_id,
                "quantity": 1,
                "acquiredFrom": source
            },
            include={"itemDefinition": True}
        )
    
    # Create Transaction
    await db.inventorytransaction.create(
        data={
            "characterId": character_id,
            "playerItemId": player_item.id,
            "type": source,
            "quantity": quantity,
            "source": source
        }
    )
    
    return player_item


@router.patch("/{player_item_id}/equip", response_model=EquipmentActionResponse)
async def equip_item(player_item_id: str):
    """
    Toggles the isEquipped boolean. Auto-unequips existing items in the same slot.
    """
    target_record = await db.playeritem.find_unique(
        where={"id": player_item_id},
        include={"itemDefinition": True},
    )

    if not target_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PlayerItem with ID '{player_item_id}' not found.",
        )

    character_id = target_record.characterId
    item_def = target_record.itemDefinition
    
    # If the item is already equipped, just unequip it
    if target_record.isEquipped:
        updated_record = await db.playeritem.update(
            where={"id": player_item_id},
            data={"isEquipped": False},
            include={"itemDefinition": True},
        )
        return EquipmentActionResponse(
            status="success",
            message=f"Unequipped '{item_def.name}'",
            playerItem=updated_record
        )

    # Equipment slots logic
    equipment_slots = ["WEAPON", "HELMET", "ARMOR", "GLOVES", "BOOTS", "RING", "NECKLACE", "ARTIFACT", "RELIC"]
    if item_def.type in equipment_slots:
        # Find all equipped items of the same type and unequip them
        currently_equipped = await db.playeritem.find_many(
            where={
                "characterId": character_id,
                "isEquipped": True,
                "itemDefinition": {
                    "is": {
                        "type": item_def.type
                    }
                }
            },
            include={"itemDefinition": True}
        )

        for equipped in currently_equipped:
            if equipped.id != target_record.id:
                await db.playeritem.update(
                    where={"id": equipped.id},
                    data={"isEquipped": False},
                )

    # Equip the target item
    updated_record = await db.playeritem.update(
        where={"id": player_item_id},
        data={"isEquipped": True},
        include={"itemDefinition": True},
    )

    return EquipmentActionResponse(
        status="success",
        message=f"Equipped '{item_def.name}'",
        playerItem=updated_record
    )


@router.patch("/{player_item_id}/toggle-lock", response_model=ToggleActionResponse)
async def toggle_lock(player_item_id: str):
    """
    Toggles isLocked.
    """
    target_record = await db.playeritem.find_unique(where={"id": player_item_id})

    if not target_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PlayerItem with ID '{player_item_id}' not found.",
        )

    updated_record = await db.playeritem.update(
        where={"id": player_item_id},
        data={"isLocked": not target_record.isLocked},
        include={"itemDefinition": True},
    )

    return ToggleActionResponse(
        status="success",
        message=f"Lock status toggled to {updated_record.isLocked}",
        playerItem=updated_record
    )


@router.patch("/{player_item_id}/toggle-favorite", response_model=ToggleActionResponse)
async def toggle_favorite(player_item_id: str):
    """
    Toggles isFavorite.
    """
    target_record = await db.playeritem.find_unique(where={"id": player_item_id})

    if not target_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PlayerItem with ID '{player_item_id}' not found.",
        )

    updated_record = await db.playeritem.update(
        where={"id": player_item_id},
        data={"isFavorite": not target_record.isFavorite},
        include={"itemDefinition": True},
    )

    return ToggleActionResponse(
        status="success",
        message=f"Favorite status toggled to {updated_record.isFavorite}",
        playerItem=updated_record
    )
