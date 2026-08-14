from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from db import db
from db_utils import ensure_character_exists
from datetime import datetime

router = APIRouter(prefix="/api/crafting", tags=["crafting"])

class IngredientRequirement(BaseModel):
    name: str
    quantity: int
    icon: str
    ownedQuantity: int = 0
    isSatisfied: bool = False

class RecipeOutput(BaseModel):
    name: str
    type: str
    rarity: str
    icon: str
    description: str
    attack: int = 0
    defense: int = 0
    strength: int = 0
    knowledge: int = 0
    endurance: int = 0
    recovery: int = 0
    focus: int = 0
    discipline: int = 0
    sellValue: int = 0

class CraftingRecipe(BaseModel):
    id: str
    title: str
    category: str # WEAPONS, ARMOR, ACCESSORIES, ALCHEMY
    description: str
    requiredLevel: int
    goldCost: int
    ingredients: List[IngredientRequirement]
    output: RecipeOutput
    canCraft: bool = False
    missingRequirements: List[str] = []

class CraftRequest(BaseModel):
    character_id: str
    recipe_id: str

class CraftResponse(BaseModel):
    status: str
    message: str
    craftedItem: Dict[str, Any]
    newGold: int
    consumedIngredients: List[Dict[str, Any]]


# Master Recipe Registry with Rich Solo-Leveling / Ascend Lore and Stats
CRAFTING_RECIPES: List[Dict[str, Any]] = [
    # --- WEAPONS ---
    {
        "id": "recipe_shadow_dagger",
        "title": "Shadow Monarch's Dagger",
        "category": "WEAPONS",
        "description": "Forged by compressing shadow steel with high-density mana. Strikes inflict rapid critical lacerations.",
        "requiredLevel": 5,
        "goldCost": 300,
        "ingredients": [
            {"name": "Shadow Steel Ingot", "quantity": 2, "icon": "/icons/Icon390.png"},
            {"name": "Large Silver Gem", "quantity": 2, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Shadow Monarch's Dagger",
            "type": "WEAPON",
            "rarity": "RARE",
            "icon": "/icons/Icon7.png",
            "description": "A razor-sharp obsidian dagger that vibrates with dark mana. Swiftly shreds enemy defense in close-quarters combat.",
            "attack": 65,
            "defense": 0,
            "strength": 20,
            "knowledge": 0,
            "endurance": 0,
            "recovery": 0,
            "focus": 15,
            "discipline": 10,
            "sellValue": 450
        }
    },
    {
        "id": "recipe_dragon_greatsword",
        "title": "Dragon-Bone Greatsword",
        "category": "WEAPONS",
        "description": "A devastating heavy greatsword forged from the calcified rib cage and scales of an ancient Drake.",
        "requiredLevel": 12,
        "goldCost": 600,
        "ingredients": [
            {"name": "Dragon Drake Scale", "quantity": 3, "icon": "/icons/Icon380.png"},
            {"name": "Obsidian Core Crystal", "quantity": 2, "icon": "/icons/Icon392.png"},
            {"name": "Large Silver Gem", "quantity": 3, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Dragon-Bone Greatsword",
            "type": "WEAPON",
            "rarity": "EPIC",
            "icon": "/icons/Icon19.png",
            "description": "A gargantuan blade echoing with draconic fury. Unleashes overwhelming kinetic shockwaves on every swing.",
            "attack": 110,
            "defense": 15,
            "strength": 35,
            "knowledge": 0,
            "endurance": 15,
            "recovery": 0,
            "focus": 10,
            "discipline": 20,
            "sellValue": 900
        }
    },
    {
        "id": "recipe_tempest_bow",
        "title": "Tempest Phantom Bow",
        "category": "WEAPONS",
        "description": "Spun with ethereal wind-strung filaments that compress atmospheric lightning into armor-piercing arrows.",
        "requiredLevel": 8,
        "goldCost": 450,
        "ingredients": [
            {"name": "Ocean Sapphire Shard", "quantity": 2, "icon": "/icons/Icon338.png"},
            {"name": "Shadow Steel Ingot", "quantity": 2, "icon": "/icons/Icon390.png"},
            {"name": "Large Silver Gem", "quantity": 2, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Tempest Phantom Bow",
            "type": "WEAPON",
            "rarity": "RARE",
            "icon": "/icons/Icon110.png",
            "description": "An aerodynamic composite recurve bow that shoots concentrated azure plasma arrows without consuming physical ammunition.",
            "attack": 75,
            "defense": 0,
            "strength": 10,
            "knowledge": 15,
            "endurance": 0,
            "recovery": 0,
            "focus": 30,
            "discipline": 20,
            "sellValue": 600
        }
    },
    {
        "id": "recipe_void_staff",
        "title": "Void Singularity Staff",
        "category": "WEAPONS",
        "description": "An ominous ceremonial staff crowned with a floating cosmic void crystal that bends dimensional gravity.",
        "requiredLevel": 20,
        "goldCost": 850,
        "ingredients": [
            {"name": "Monarch Soul Fragment", "quantity": 1, "icon": "/icons/Icon268.png"},
            {"name": "Obsidian Core Crystal", "quantity": 3, "icon": "/icons/Icon392.png"},
            {"name": "Large Silver Gem", "quantity": 4, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Void Singularity Staff",
            "type": "WEAPON",
            "rarity": "LEGENDARY",
            "icon": "/icons/Icon80.png",
            "description": "Channels raw cosmic rift energy to disintegrate enemy defenses and multiply neural knowledge scaling.",
            "attack": 135,
            "defense": 20,
            "strength": 15,
            "knowledge": 50,
            "endurance": 20,
            "recovery": 30,
            "focus": 40,
            "discipline": 25,
            "sellValue": 1500
        }
    },

    # --- ARMOR & DEFENSE ---
    {
        "id": "recipe_titan_cuirass",
        "title": "Titan Alloy Cuirass",
        "category": "ARMOR",
        "description": "Heavy chest plate forged from high-tensile titan alloys to insulate against high-tier boss strikes.",
        "requiredLevel": 6,
        "goldCost": 350,
        "ingredients": [
            {"name": "Shadow Steel Ingot", "quantity": 3, "icon": "/icons/Icon390.png"},
            {"name": "Solar Titan Quartz", "quantity": 2, "icon": "/icons/Icon331.png"},
            {"name": "Large Silver Gem", "quantity": 2, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Titan Alloy Cuirass",
            "type": "ARMOR",
            "rarity": "RARE",
            "icon": "/icons/Icon185.png",
            "description": "A reinforced breastplate capable of dispersing direct kinetic shockwaves across its interlocking plates.",
            "attack": 0,
            "defense": 65,
            "strength": 15,
            "knowledge": 0,
            "endurance": 30,
            "recovery": 10,
            "focus": 0,
            "discipline": 15,
            "sellValue": 550
        }
    },
    {
        "id": "recipe_abyssal_crown",
        "title": "Abyssal Guardian Crown",
        "category": "ARMOR",
        "description": "Forged from ocean sapphire shards to fortify the wearer's mental focus and tactical recovery in combat.",
        "requiredLevel": 10,
        "goldCost": 400,
        "ingredients": [
            {"name": "Ocean Sapphire Shard", "quantity": 3, "icon": "/icons/Icon338.png"},
            {"name": "Large Silver Gem", "quantity": 3, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Abyssal Guardian Crown",
            "type": "HELMET",
            "rarity": "EPIC",
            "icon": "/icons/Icon171.png",
            "description": "An ornate circlet resonating with deep tidal currents. Protects against cognitive fatigue and enhances recovery.",
            "attack": 0,
            "defense": 50,
            "strength": 0,
            "knowledge": 25,
            "endurance": 15,
            "recovery": 30,
            "focus": 20,
            "discipline": 15,
            "sellValue": 650
        }
    },
    {
        "id": "recipe_shadowstrider_boots",
        "title": "Shadowstrider Greaves",
        "category": "ARMOR",
        "description": "Lightweight alloy boots designed to minimize ground friction and amplify evasive velocity.",
        "requiredLevel": 5,
        "goldCost": 250,
        "ingredients": [
            {"name": "Shadow Steel Ingot", "quantity": 2, "icon": "/icons/Icon390.png"},
            {"name": "Large Silver Gem", "quantity": 1, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Shadowstrider Greaves",
            "type": "BOOTS",
            "rarity": "RARE",
            "icon": "/icons/Icon230.png",
            "description": "Silent boots that wrap the wearer's feet in kinetic dispersion fields for swift movement.",
            "attack": 0,
            "defense": 40,
            "strength": 10,
            "knowledge": 0,
            "endurance": 20,
            "recovery": 10,
            "focus": 25,
            "discipline": 20,
            "sellValue": 400
        }
    },

    # --- RELICS & ACCESSORIES ---
    {
        "id": "recipe_ring_dominion",
        "title": "Ring of Absolute Dominion",
        "category": "ACCESSORIES",
        "description": "An ancient monarch ring bound with void soul fragments. Amplifies all core physical and neural stats simultaneously.",
        "requiredLevel": 15,
        "goldCost": 800,
        "ingredients": [
            {"name": "Monarch Soul Fragment", "quantity": 2, "icon": "/icons/Icon268.png"},
            {"name": "Obsidian Core Crystal", "quantity": 2, "icon": "/icons/Icon392.png"},
            {"name": "Large Silver Gem", "quantity": 4, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Ring of Absolute Dominion",
            "type": "RING",
            "rarity": "LEGENDARY",
            "icon": "/icons/Icon249.png",
            "description": "An all-powerful monarch relic that pulses in sync with the wearer's heart. Grants immense attribute boosts.",
            "attack": 25,
            "defense": 25,
            "strength": 30,
            "knowledge": 30,
            "endurance": 30,
            "recovery": 30,
            "focus": 30,
            "discipline": 30,
            "sellValue": 1800
        }
    },
    {
        "id": "recipe_amulet_vitality",
        "title": "Amulet of Eternal Vitality",
        "category": "ACCESSORIES",
        "description": "A glowing pendant distilled from concentrated crimson life herbs and purified ocean sapphires.",
        "requiredLevel": 8,
        "goldCost": 500,
        "ingredients": [
            {"name": "Crimson Life Herb", "quantity": 4, "icon": "/icons/Icon279.png"},
            {"name": "Ocean Sapphire Shard", "quantity": 2, "icon": "/icons/Icon338.png"},
            {"name": "Large Silver Gem", "quantity": 2, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Amulet of Eternal Vitality",
            "type": "NECKLACE",
            "rarity": "EPIC",
            "icon": "/icons/Icon257.png",
            "description": "Surrounds the wearer in an aura of constant regeneration, accelerating cellular recovery and stamina replenishment.",
            "attack": 0,
            "defense": 20,
            "strength": 0,
            "knowledge": 15,
            "endurance": 35,
            "recovery": 50,
            "focus": 15,
            "discipline": 15,
            "sellValue": 750
        }
    },

    # --- ALCHEMY & CONSUMABLES ---
    {
        "id": "recipe_grand_exp_elixir",
        "title": "Grand Elixir of Ascension",
        "category": "ALCHEMY",
        "description": "A luminous distilled concoction that accelerates neural pathways and grants +300 EXP instantly.",
        "requiredLevel": 1,
        "goldCost": 150,
        "ingredients": [
            {"name": "Mana Root Essence", "quantity": 2, "icon": "/icons/Icon276.png"},
            {"name": "Large Silver Gem", "quantity": 1, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Grand Elixir of Ascension",
            "type": "CONSUMABLE",
            "rarity": "RARE",
            "icon": "/icons/Icon309.png",
            "description": "Synthesized from distilled mana roots. Stimulates the Ascendant's nervous system, immediately granting +300 EXP.",
            "attack": 0,
            "defense": 0,
            "strength": 0,
            "knowledge": 0,
            "endurance": 0,
            "recovery": 0,
            "focus": 0,
            "discipline": 0,
            "sellValue": 200
        }
    },
    {
        "id": "recipe_divine_hp_potion",
        "title": "Divine Full Recovery Potion",
        "category": "ALCHEMY",
        "description": "A super-concentrated restorative solution that instantly heals and seals wounds, restoring +300 HP.",
        "requiredLevel": 1,
        "goldCost": 120,
        "ingredients": [
            {"name": "Crimson Life Herb", "quantity": 3, "icon": "/icons/Icon279.png"},
            {"name": "Large Silver Gem", "quantity": 1, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Divine Full Recovery Potion",
            "type": "CONSUMABLE",
            "rarity": "RARE",
            "icon": "/icons/Icon304.png",
            "description": "Distilled from concentrated crimson herbs. Immediately restores 300 HP and optimizes physical stamina flow.",
            "attack": 0,
            "defense": 0,
            "strength": 0,
            "knowledge": 0,
            "endurance": 0,
            "recovery": 0,
            "focus": 0,
            "discipline": 0,
            "sellValue": 160
        }
    },
    {
        "id": "recipe_double_exp_chip",
        "title": "Double-EXP Hyper Matrix Token",
        "category": "ALCHEMY",
        "description": "An advanced system chip encoded with neural double experience algorithms for 1 hour.",
        "requiredLevel": 10,
        "goldCost": 350,
        "ingredients": [
            {"name": "System Processor Chip", "quantity": 2, "icon": "/icons/Icon261.png"},
            {"name": "Monarch Soul Fragment", "quantity": 1, "icon": "/icons/Icon268.png"},
            {"name": "Large Silver Gem", "quantity": 2, "icon": "/icons/Icon341.png"}
        ],
        "output": {
            "name": "Double-EXP Hyper Matrix Token",
            "type": "CONSUMABLE",
            "rarity": "EPIC",
            "icon": "/icons/Icon267.png",
            "description": "Activates a 1-Hour Double EXP multiplier across all workout sessions, tower battles, and daily habit missions.",
            "attack": 0,
            "defense": 0,
            "strength": 0,
            "knowledge": 0,
            "endurance": 0,
            "recovery": 0,
            "focus": 0,
            "discipline": 0,
            "sellValue": 500
        }
    }
]


@router.get("/recipes/{character_id}", response_model=List[CraftingRecipe])
async def get_crafting_recipes(character_id: str):
    """
    Returns all crafting recipes with dynamic live inventory ingredient tracking for the character.
    """
    char = await ensure_character_exists(character_id)
    
    # Fetch player's current items
    player_items = await db.playeritem.find_many(
        where={"characterId": character_id},
        include={"itemDefinition": True}
    )

    # Build inventory counts map: lower name -> total quantity
    inv_map: Dict[str, int] = {}
    for p_item in player_items:
        if p_item.itemDefinition:
            name_key = p_item.itemDefinition.name.lower().strip()
            inv_map[name_key] = inv_map.get(name_key, 0) + p_item.quantity

    recipes_result = []
    for r in CRAFTING_RECIPES:
        can_craft = True
        missing_reqs = []

        # Check level
        if char.level < r["requiredLevel"]:
            can_craft = False
            missing_reqs.append(f"Requires Level {r['requiredLevel']} (Current: Lv.{char.level})")

        # Check gold
        if char.gold < r["goldCost"]:
            can_craft = False
            missing_reqs.append(f"Need {r['goldCost']} Gold (Have {char.gold})")

        # Check ingredients
        ingredients_status = []
        for ing in r["ingredients"]:
            ing_name_key = ing["name"].lower().strip()
            owned = inv_map.get(ing_name_key, 0)
            is_satisfied = owned >= ing["quantity"]
            if not is_satisfied:
                can_craft = False
                missing_reqs.append(f"Missing {ing['quantity'] - owned}x {ing['name']}")
            
            ingredients_status.append(IngredientRequirement(
                name=ing["name"],
                quantity=ing["quantity"],
                icon=ing["icon"],
                ownedQuantity=owned,
                isSatisfied=is_satisfied
            ))

        recipes_result.append(CraftingRecipe(
            id=r["id"],
            title=r["title"],
            category=r["category"],
            description=r["description"],
            requiredLevel=r["requiredLevel"],
            goldCost=r["goldCost"],
            ingredients=ingredients_status,
            output=RecipeOutput(**r["output"]),
            canCraft=can_craft,
            missingRequirements=missing_reqs
        ))

    return recipes_result


@router.post("/craft", response_model=CraftResponse)
async def craft_item(payload: CraftRequest):
    """
    Validates materials, deducts gold & ingredients, creates ItemDefinition if needed,
    and grants the crafted item to the character's inventory!
    """
    char = await ensure_character_exists(payload.character_id)

    # Find the recipe
    recipe = next((r for r in CRAFTING_RECIPES if r["id"] == payload.recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="Crafting recipe not found.")

    # Check level
    if char.level < recipe["requiredLevel"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Character level {char.level} is below required level {recipe['requiredLevel']}."
        )

    # Check Gold
    if char.gold < recipe["goldCost"]:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient Gold. Needed {recipe['goldCost']}, but you have {char.gold}."
        )

    # Fetch player items
    player_items = await db.playeritem.find_many(
        where={"characterId": payload.character_id},
        include={"itemDefinition": True}
    )

    # Verify all ingredients
    consumed_records = []
    for ing in recipe["ingredients"]:
        ing_name_key = ing["name"].lower().strip()
        matching_items = [
            pi for pi in player_items 
            if pi.itemDefinition and pi.itemDefinition.name.lower().strip() == ing_name_key
        ]
        total_owned = sum(pi.quantity for pi in matching_items)
        if total_owned < ing["quantity"]:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient ingredient: '{ing['name']}'. Required {ing['quantity']}, owned {total_owned}."
            )
        consumed_records.append({"items": matching_items, "needed": ing["quantity"], "name": ing["name"]})

    # Deduct Ingredients from inventory
    for c in consumed_records:
        needed = c["needed"]
        for p_item in c["items"]:
            if needed <= 0:
                break
            if p_item.quantity <= needed:
                needed -= p_item.quantity
                await db.playeritem.delete(where={"id": p_item.id})
            else:
                await db.playeritem.update(
                    where={"id": p_item.id},
                    data={"quantity": p_item.quantity - needed}
                )
                needed = 0

    # Deduct Gold
    new_gold = char.gold - recipe["goldCost"]
    await db.character.update(
        where={"id": char.id},
        data={"gold": new_gold}
    )

    # Find or Create Target ItemDefinition
    out = recipe["output"]
    item_def = await db.itemdefinition.find_first(where={"name": out["name"]})
    if not item_def:
        item_def = await db.itemdefinition.create(
            data={
                "name": out["name"],
                "description": out["description"],
                "type": out["type"],
                "rarity": out["rarity"],
                "icon": out["icon"],
                "sellValue": out["sellValue"],
                "attack": out["attack"],
                "defense": out["defense"],
                "strength": out["strength"],
                "knowledge": out["knowledge"],
                "endurance": out["endurance"],
                "recovery": out["recovery"],
                "focus": out["focus"],
                "discipline": out["discipline"]
            }
        )

    # Grant Crafted Item to Character
    if out["type"] == "CONSUMABLE":
        existing_stack = await db.playeritem.find_first(
            where={"characterId": char.id, "itemDefinitionId": item_def.id}
        )
        if existing_stack:
            crafted_item = await db.playeritem.update(
                where={"id": existing_stack.id},
                data={"quantity": existing_stack.quantity + 1},
                include={"itemDefinition": True}
            )
        else:
            crafted_item = await db.playeritem.create(
                data={
                    "characterId": char.id,
                    "itemDefinitionId": item_def.id,
                    "quantity": 1,
                    "acquiredFrom": "FORGE_CRAFTING"
                },
                include={"itemDefinition": True}
            )
    else:
        crafted_item = await db.playeritem.create(
            data={
                "characterId": char.id,
                "itemDefinitionId": item_def.id,
                "quantity": 1,
                "acquiredFrom": "FORGE_CRAFTING"
            },
            include={"itemDefinition": True}
        )

    # Log Progress & Inventory Transaction
    await db.inventorytransaction.create(
        data={
            "characterId": char.id,
            "playerItemId": crafted_item.id,
            "type": "CRAFT",
            "quantity": 1,
            "source": f"FORGE_{recipe['id'].upper()}"
        }
    )

    await db.progresshistory.create(
        data={
            "characterId": char.id,
            "type": "CRAFT_ITEM",
            "amount": recipe["goldCost"],
            "description": f"🔨 Successfully forged {out['name']} in the Cyber Forge!"
        }
    )

    return CraftResponse(
        status="success",
        message=f"Successfully forged {out['name']}!",
        craftedItem={
            "id": crafted_item.id,
            "name": item_def.name,
            "type": item_def.type,
            "rarity": item_def.rarity,
            "icon": item_def.icon,
            "attack": item_def.attack,
            "defense": item_def.defense,
            "strength": item_def.strength,
            "knowledge": item_def.knowledge,
            "endurance": item_def.endurance,
            "recovery": item_def.recovery,
            "focus": item_def.focus,
            "discipline": item_def.discipline,
            "description": item_def.description
        },
        newGold=new_gold,
        consumedIngredients=recipe["ingredients"]
    )
