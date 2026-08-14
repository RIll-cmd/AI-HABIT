from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
import random
from datetime import datetime
from db import db
from db_utils import ensure_character_exists
from schemas.beasts import (
    EggResponse,
    BeastResponse,
    BestiarySpeciesSummary,
    BeastCollectionResponse,
    IncubateEggRequest,
    FeedEnergyRequest,
    StepSyncRequest,
    StepSyncResponse,
    HatchEggRequest,
    EquipBeastRequest,
    BuyEggRequest
)

router = APIRouter(prefix="/api/beasts", tags=["beasts"])

# =======================================================================
# 🐉 20-SPECIES CANONICAL BESTIARY CATALOG
# =======================================================================
BESTIARY_CATALOG: List[Dict[str, Any]] = [
    {
        "speciesId": 1,
        "name": "Vesperis",
        "species": "Void Drake",
        "element": "VOID",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_1.png",
        "statBonusType": "AGI_BOOST",
        "statBonusValue": 6.0,
        "description": "A celestial dragon infused with pure dark energy that quickens movement and footwork.",
        "lore": "Hatched from subterranean rift fissures near F-Rank spatial gates."
    },
    {
        "speciesId": 2,
        "name": "Morvath",
        "species": "Amethyst Wyrm",
        "element": "VOID",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_2.png",
        "statBonusType": "INT_BOOST",
        "statBonusValue": 10.0,
        "description": "Revered in ancient ruins for radiating resonant psychic waves.",
        "lore": "Channels high-frequency astral frequencies into the hunter's consciousness."
    },
    {
        "speciesId": 3,
        "name": "Florian",
        "species": "Verdant Sylva Wyrm",
        "element": "NATURE",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_3.png",
        "statBonusType": "EXP_BOOST",
        "statBonusValue": 5.0,
        "description": "A gentle juvenile woodland drake that accelerates stamina and journey mastery.",
        "lore": "Gathers morning dew and floral mana to soothe tired muscles during long walks."
    },
    {
        "speciesId": 4,
        "name": "Ymir",
        "species": "Glacial Frost Dragon",
        "element": "FROST",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_4.png",
        "statBonusType": "FOCUS",
        "statBonusValue": 7.0,
        "description": "Its cryogenic scales maintain chilling mental clarity during heavy daily steps.",
        "lore": "Found nestled in the highest peaks of permafrost dungeons."
    },
    {
        "speciesId": 5,
        "name": "Nyx",
        "species": "Obsidian Shadow Drake",
        "element": "VOID",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_5.png",
        "statBonusType": "STR_BOOST",
        "statBonusValue": 4.0,
        "description": "Born from cooling subterranean magma; moves silently in the hunter's shadow.",
        "lore": "Feeds on fatigue and replaces it with quiet stoic determination."
    },
    {
        "speciesId": 6,
        "name": "Ignis",
        "species": "Solar Flame Dragon",
        "element": "FIRE",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_6.png",
        "statBonusType": "STR_BOOST",
        "statBonusValue": 12.0,
        "description": "Radiates relentless thermic energy that surges neuromuscular power.",
        "lore": "Its heart beats with the nuclear fusion of an adolescent miniature star."
    },
    {
        "speciesId": 7,
        "name": "Aurelius",
        "species": "Golden Celestial Wyrm",
        "element": "HOLY",
        "rarity": "LEGENDARY",
        "spritePath": "/beasts/beast_7.png",
        "statBonusType": "GOLD_BOOST",
        "statBonusValue": 25.0,
        "description": "An exalted sun dragon covered in pure auric plating that magnetizes treasure.",
        "lore": "Guardians of the highest spires of the Celestial Tower."
    },
    {
        "speciesId": 8,
        "name": "Thalassa",
        "species": "Abyssal Tide Dragon",
        "element": "FROST",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_8.png",
        "statBonusType": "ENDURANCE",
        "statBonusValue": 8.0,
        "description": "Glides through oceanic air currents, granting deep rhythmic cardiovascular rhythm.",
        "lore": "Awakened when hunters conquer deep oceanic distance trials."
    },
    {
        "speciesId": 9,
        "name": "Zephyrus",
        "species": "Tempest Storm Drake",
        "element": "STORM",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_9.png",
        "statBonusType": "AGI_BOOST",
        "statBonusValue": 5.0,
        "description": "Crackle of kinetic lightning surrounds its nimble wings with every stride.",
        "lore": "Dances in summer thunderstorm downdrafts."
    },
    {
        "speciesId": 10,
        "name": "Volcanus",
        "species": "Magma Core Wyrm",
        "element": "FIRE",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_10.png",
        "statBonusType": "STR_BOOST",
        "statBonusValue": 8.0,
        "description": "Armored in volcanic obsidian basalt with glowing molten lava veins.",
        "lore": "Forged in the deepest geothermal vents beneath the World Engine."
    },
    {
        "speciesId": 11,
        "name": "Bramble",
        "species": "Thornwood Dragon",
        "element": "NATURE",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_11.png",
        "statBonusType": "RECOVERY",
        "statBonusValue": 4.0,
        "description": "Camouflaged among thorny briars; grants natural biological resilience.",
        "lore": "Protects ancient grove seed sanctuaries from corruption."
    },
    {
        "speciesId": 12,
        "name": "Borealis",
        "species": "Aurora Frost Wyrm",
        "element": "FROST",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_12.png",
        "statBonusType": "EXP_BOOST",
        "statBonusValue": 15.0,
        "description": "Shimmers with iridescent emerald and violet auroral light ribbons.",
        "lore": "Manifests only when the polar magnetic fields align with the hunter's streak."
    },
    {
        "speciesId": 13,
        "name": "Erebos",
        "species": "Void Star Dragon",
        "element": "VOID",
        "rarity": "HOLOGRAPHIC",
        "spritePath": "/beasts/beast_13.png",
        "statBonusType": "EXP_BOOST",
        "statBonusValue": 35.0,
        "description": "A mythic holographic entity woven from the dark matter of an event horizon.",
        "lore": "The rarest of all familiars. Glitches reality with rainbow prismatic chromatic aberration."
    },
    {
        "speciesId": 14,
        "name": "Solarius",
        "species": "Dawn Light Drake",
        "element": "HOLY",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_14.png",
        "statBonusType": "DISCIPLINE",
        "statBonusValue": 5.0,
        "description": "Greets the morning horizon with a bright chime, reinforcing dawn walking habits.",
        "lore": "Known by nomadic hunters as the Beacon of First Light."
    },
    {
        "speciesId": 15,
        "name": "Cyberion",
        "species": "Synthetic Neon Wyrm",
        "element": "CYBER",
        "rarity": "LEGENDARY",
        "spritePath": "/beasts/beast_15.png",
        "statBonusType": "AGI_BOOST",
        "statBonusValue": 20.0,
        "description": "An overclocked cybernetic biomechanical familiar laced with fiber-optic veins.",
        "lore": "Synthesized in high-tech neo-laboratories to sync bio-kinetic telemetry."
    },
    {
        "speciesId": 16,
        "name": "Gladius",
        "species": "Iron Scale Dragon",
        "element": "FIRE",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_16.png",
        "statBonusType": "STR_BOOST",
        "statBonusValue": 5.0,
        "description": "Hardened metallic scales provide impenetrable armor and kinetic feedback.",
        "lore": "Frequents old battlegrounds to absorb fallen warriors' fighting spirits."
    },
    {
        "speciesId": 17,
        "name": "Terra",
        "species": "Ancient Mountain Drake",
        "element": "NATURE",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_17.png",
        "statBonusType": "ENDURANCE",
        "statBonusValue": 9.0,
        "description": "Its slow, steady breath echoes the timeless tectonic shifts of the earth.",
        "lore": "Rests undisturbed for centuries beneath granite peaks."
    },
    {
        "speciesId": 18,
        "name": "Aether",
        "species": "Prismatic Astral Wyrm",
        "element": "VOID",
        "rarity": "LEGENDARY",
        "spritePath": "/beasts/beast_18.png",
        "statBonusType": "INT_BOOST",
        "statBonusValue": 22.0,
        "description": "Reflects pure starlight and bends gravitational fields around the hunter.",
        "lore": "Born in the interdimensional nexus where time and space converge."
    },
    {
        "speciesId": 19,
        "name": "Crimson",
        "species": "Blood Wyrm",
        "element": "FIRE",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_19.png",
        "statBonusType": "STR_BOOST",
        "statBonusValue": 14.0,
        "description": "Pulses with fiery crimson adrenaline whenever the hunter pushes to exhaustion.",
        "lore": "Ignites in flames during high-intensity intervals and boss encounters."
    },
    {
        "speciesId": 20,
        "name": "Chrono",
        "species": "Temporal Spark Drake",
        "element": "CYBER",
        "rarity": "HOLOGRAPHIC",
        "spritePath": "/beasts/beast_20.png",
        "statBonusType": "GOLD_BOOST",
        "statBonusValue": 40.0,
        "description": "Manipulates the flow of time and luck, granting staggering economic windfalls.",
        "lore": "Appears only to hunters who walk consistent steps across unrelenting daily streaks."
    }
]

# Map Species ID to Catalog Item
SPECIES_BY_ID = {item["speciesId"]: item for item in BESTIARY_CATALOG}

# Mystery Egg Shop Catalog
EGG_SHOP_CATALOG = {
    "WOODLAND": {
        "name": "Woodland Earth Egg",
        "eggType": "NATURE",
        "sprite": "/eggs/egg_1.png",
        "rarity": "COMMON",
        "targetSteps": 3000,
        "targetEnergy": 3000,
        "goldPrice": 250,
        "gemPrice": 0,
        "pool": [3, 11, 14, 17]
    },
    "FROST": {
        "name": "Glacial Cryo Egg",
        "eggType": "FROST",
        "sprite": "/eggs/egg_4.png",
        "rarity": "RARE",
        "targetSteps": 5000,
        "targetEnergy": 5000,
        "goldPrice": 650,
        "gemPrice": 10,
        "pool": [4, 8, 12, 1]
    },
    "SOLAR": {
        "name": "Solar Flare Egg",
        "eggType": "FIRE",
        "sprite": "/eggs/egg_6.png",
        "rarity": "EPIC",
        "targetSteps": 8000,
        "targetEnergy": 8000,
        "goldPrice": 1600,
        "gemPrice": 25,
        "pool": [6, 10, 16, 19]
    },
    "CYBER": {
        "name": "Neon Cyber Egg",
        "eggType": "CYBER",
        "sprite": "/eggs/egg_15.png",
        "rarity": "LEGENDARY",
        "targetSteps": 12000,
        "targetEnergy": 12000,
        "goldPrice": 3800,
        "gemPrice": 60,
        "pool": [15, 7, 2, 9]
    },
    "COSMIC": {
        "name": "Cosmic Void Egg",
        "eggType": "VOID",
        "sprite": "/eggs/egg_13.png",
        "rarity": "HOLOGRAPHIC",
        "targetSteps": 20000,
        "targetEnergy": 20000,
        "goldPrice": 8500,
        "gemPrice": 150,
        "pool": [13, 18, 20, 2, 7]
    }
}

# =======================================================================
# 🎲 WEIGHTED DROP & HATCHING LOGIC
# =======================================================================
def roll_hatch_beast(egg_type: str, egg_rarity: str) -> Dict[str, Any]:
    """
    Selects a beast based on egg type and rarity weightings.
    """
    matching_candidates = []
    for beast in BESTIARY_CATALOG:
        if egg_type == "ELEMENTAL" or beast["element"] == egg_type:
            matching_candidates.append(beast)

    if not matching_candidates:
        matching_candidates = BESTIARY_CATALOG

    weights = []
    for b in matching_candidates:
        r = b["rarity"]
        if egg_rarity == "HOLOGRAPHIC":
            w = 50 if r == "HOLOGRAPHIC" else (30 if r == "LEGENDARY" else (15 if r == "EPIC" else 5))
        elif egg_rarity == "LEGENDARY":
            w = 5 if r == "HOLOGRAPHIC" else (45 if r == "LEGENDARY" else (35 if r == "EPIC" else 15))
        elif egg_rarity == "EPIC":
            w = 2 if r == "HOLOGRAPHIC" else (15 if r == "LEGENDARY" else (50 if r == "EPIC" else 33))
        elif egg_rarity == "RARE":
            w = 1 if r == "HOLOGRAPHIC" else (5 if r == "LEGENDARY" else (30 if r == "EPIC" else (45 if r == "RARE" else 19)))
        else: # COMMON
            w = 1 if r == "HOLOGRAPHIC" else (3 if r == "LEGENDARY" else (10 if r == "EPIC" else (30 if r == "RARE" else 56)))
        weights.append(w)

    chosen = random.choices(matching_candidates, weights=weights, k=1)[0]
    return chosen

async def calculate_passive_buffs(character_id: str) -> Dict[str, float]:
    """
    Calculates total passive bonuses from equipped and unlocked beasts.
    """
    equipped_beast = await db.beast.find_first(
        where={"characterId": character_id, "isEquipped": True}
    )
    buffs: Dict[str, float] = {
        "EXP_BOOST": 0.0,
        "GOLD_BOOST": 0.0,
        "STR_BOOST": 0.0,
        "AGI_BOOST": 0.0,
        "INT_BOOST": 0.0,
        "STRENGTH": 0.0,
        "KNOWLEDGE": 0.0,
        "DISCIPLINE": 0.0,
        "RECOVERY": 0.0,
        "FOCUS": 0.0,
        "ENDURANCE": 0.0
    }

    if equipped_beast:
        b_type = getattr(equipped_beast, "passiveBuffType", None) or getattr(equipped_beast, "statBonusType", "EXP_BOOST")
        b_val = getattr(equipped_beast, "passiveBuffValue", None) or getattr(equipped_beast, "statBonusValue", 5.0)
        buffs[b_type] = buffs.get(b_type, 0.0) + float(b_val)

    # Add small collection mastery synergy (+1% EXP & Gold per 2 unique unlocked species)
    unlocked_species = await db.beast.find_many(where={"characterId": character_id})
    unique_count = len(set(b.species for b in unlocked_species))
    collection_bonus = float(unique_count // 2)
    buffs["EXP_BOOST"] += collection_bonus
    buffs["GOLD_BOOST"] += collection_bonus

    return buffs

# =======================================================================
# 🌐 API ROUTE HANDLERS
# =======================================================================

@router.get("/collection")
@router.get("/collection/{character_id}", response_model=BeastCollectionResponse)
async def get_beast_collection(
    character_id: Optional[str] = None,
    characterId: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None)
):
    """
    Retrieves player's active egg, owned eggs, unlocked beasts, bestiary discovery matrix, and passive bonuses.
    Auto-initializes a starter egg if the user has zero beasts and zero eggs.
    """
    target_id = character_id or characterId or user_id
    if not target_id:
        raise HTTPException(status_code=400, detail="character_id or user_id required")

    character = await ensure_character_exists(target_id)
    char_id = character.id

    # 1. Fetch owned eggs
    owned_eggs = await db.egg.find_many(
        where={"characterId": char_id},
        order={"createdAt": "desc"}
    )

    # 2. Fetch unlocked beasts
    unlocked_beasts = await db.beast.find_many(
        where={"characterId": char_id},
        order={"unlockedAt": "desc"}
    )

    # 3. If zero eggs & zero beasts, seed a Free Starter Egg
    if len(owned_eggs) == 0 and len(unlocked_beasts) == 0:
        starter_egg = await db.egg.create(
            data={
                "name": "Verdant Core Egg",
                "eggType": "NATURE",
                "sprite": "/eggs/egg_1.png",
                "rarity": "COMMON",
                "targetSteps": 3000,
                "currentSteps": 0,
                "targetEnergy": 3000,
                "currentEnergy": 0,
                "status": "INCUBATING",
                "characterId": char_id
            }
        )
        owned_eggs = [starter_egg]

    # Find currently active incubator egg
    active_egg = next((e for e in owned_eggs if e.status in ["INCUBATING", "READY_TO_HATCH"]), None)
    equipped_beast = next((b for b in unlocked_beasts if b.isEquipped), None)

    # Build 20-species Bestiary discovery summaries
    unlocked_map = {}
    for b in unlocked_beasts:
        if b.species not in unlocked_map:
            unlocked_map[b.species] = []
        unlocked_map[b.species].append(b)

    bestiary_summary: List[BestiarySpeciesSummary] = []
    for spec in BESTIARY_CATALOG:
        instances = unlocked_map.get(spec["species"], [])
        is_unlocked = len(instances) > 0
        active_inst = instances[0] if is_unlocked else None
        is_eq = any(inst.isEquipped for inst in instances) if is_unlocked else False

        bestiary_summary.append(
            BestiarySpeciesSummary(
                speciesId=spec["speciesId"],
                name=spec["name"],
                species=spec["species"],
                element=spec["element"],
                rarity=spec["rarity"],
                spritePath=spec["spritePath"],
                statBonusType=spec["statBonusType"],
                statBonusValue=spec["statBonusValue"],
                description=spec["description"],
                lore=spec["lore"],
                isUnlocked=is_unlocked,
                unlockedCount=len(instances),
                beastInstanceId=active_inst.id if active_inst else None,
                isEquipped=is_eq
            )
        )

    discovered_count = len(set(b.species for b in unlocked_beasts))
    passive_buffs = await calculate_passive_buffs(char_id)

    def to_egg_resp(e) -> EggResponse:
        t_steps = getattr(e, "targetSteps", None) or getattr(e, "targetEnergy", 5000) or 5000
        c_steps = getattr(e, "currentSteps", None) or getattr(e, "currentEnergy", 0) or 0
        d = e.dict()
        d["targetSteps"] = t_steps
        d["currentSteps"] = c_steps
        d["target_steps"] = t_steps
        d["current_steps"] = c_steps
        d["targetEnergy"] = t_steps
        d["currentEnergy"] = c_steps
        d["user_id"] = e.characterId
        return EggResponse(**d)

    def to_beast_resp(b) -> BeastResponse:
        d = b.dict()
        b_type = getattr(b, "passiveBuffType", None) or getattr(b, "statBonusType", "EXP_BOOST")
        b_val = getattr(b, "passiveBuffValue", None) or getattr(b, "statBonusValue", 5.0)
        d["passiveBuffType"] = b_type
        d["passiveBuffValue"] = b_val
        d["passive_buff_type"] = b_type
        d["passive_buff_value"] = b_val
        d["statBonusType"] = b_type
        d["statBonusValue"] = b_val
        d["sprite_path"] = b.spritePath
        d["is_equipped"] = b.isEquipped
        d["user_id"] = b.characterId
        return BeastResponse(**d)

    return BeastCollectionResponse(
        characterId=char_id,
        user_id=char_id,
        activeEgg=to_egg_resp(active_egg) if active_egg else None,
        ownedEggs=[to_egg_resp(e) for e in owned_eggs],
        unlockedBeasts=[to_beast_resp(b) for b in unlocked_beasts],
        equippedBeast=to_beast_resp(equipped_beast) if equipped_beast else None,
        totalDiscovered=discovered_count,
        totalSpecies=len(BESTIARY_CATALOG),
        bestiary=bestiary_summary,
        passiveBuffs=passive_buffs
    )

# =======================================================================
# 🚶 PEDOMETER STEP SYNC ENDPOINT
# =======================================================================
@router.post("/steps/sync", response_model=StepSyncResponse)
async def sync_steps(req: StepSyncRequest):
    """
    Pure walking/pedometer step sync.
    Increments active Egg.currentSteps, logs to DailyStepLog, and transitions status to READY_TO_HATCH.
    """
    char_id = req.characterId or req.user_id
    if not char_id:
        raise HTTPException(status_code=400, detail="characterId or user_id required")

    steps = req.stepCount if req.stepCount is not None else (req.step_count or 0)
    if steps <= 0:
        raise HTTPException(status_code=400, detail="stepCount must be greater than 0")

    character = await ensure_character_exists(char_id)

    # 1. Record in DailyStepLog
    try:
        await db.dailysteplog.create(
            data={
                "characterId": character.id,
                "stepCount": steps,
                "date": datetime.utcnow()
            }
        )
    except Exception as e:
        print("DailyStepLog logging error:", e)

    # 2. Find active incubating egg
    active_egg = await db.egg.find_first(
        where={
            "characterId": character.id,
            "status": "INCUBATING"
        }
    )

    if not active_egg:
        # Check if already ready to hatch
        ready_egg = await db.egg.find_first(
            where={"characterId": character.id, "status": "READY_TO_HATCH"}
        )
        if ready_egg:
            t_steps = getattr(ready_egg, "targetSteps", 5000) or getattr(ready_egg, "targetEnergy", 5000) or 5000
            c_steps = getattr(ready_egg, "currentSteps", 0) or getattr(ready_egg, "currentEnergy", 0) or 0
            d = ready_egg.dict()
            d["targetSteps"] = t_steps
            d["currentSteps"] = c_steps
            d["target_steps"] = t_steps
            d["current_steps"] = c_steps
            d["targetEnergy"] = t_steps
            d["currentEnergy"] = c_steps
            d["user_id"] = ready_egg.characterId
            return StepSyncResponse(
                characterId=character.id,
                stepsAdded=steps,
                currentSteps=c_steps,
                targetSteps=t_steps,
                isReadyToHatch=True,
                status="READY_TO_HATCH",
                progressPercent=100,
                egg=EggResponse(**d),
                message="Your active egg is already fully incubated and ready to hatch!"
            )
        # Auto-create starter egg if user has none
        active_egg = await db.egg.create(
            data={
                "name": "Verdant Core Egg",
                "eggType": "NATURE",
                "sprite": "/eggs/egg_1.png",
                "rarity": "COMMON",
                "targetSteps": 3000,
                "currentSteps": 0,
                "targetEnergy": 3000,
                "currentEnergy": 0,
                "status": "INCUBATING",
                "characterId": character.id
            }
        )

    t_steps = getattr(active_egg, "targetSteps", 5000) or getattr(active_egg, "targetEnergy", 5000) or 5000
    old_steps = getattr(active_egg, "currentSteps", 0) or getattr(active_egg, "currentEnergy", 0) or 0
    new_steps = old_steps + steps
    new_status = "READY_TO_HATCH" if new_steps >= t_steps else "INCUBATING"

    updated = await db.egg.update(
        where={"id": active_egg.id},
        data={
            "currentSteps": new_steps,
            "currentEnergy": new_steps,
            "status": new_status
        }
    )

    progress_pct = min(100, int((new_steps / t_steps) * 100))

    d = updated.dict()
    d["targetSteps"] = t_steps
    d["currentSteps"] = new_steps
    d["target_steps"] = t_steps
    d["current_steps"] = new_steps
    d["targetEnergy"] = t_steps
    d["currentEnergy"] = new_steps
    d["user_id"] = updated.characterId

    return StepSyncResponse(
        characterId=character.id,
        stepsAdded=steps,
        currentSteps=new_steps,
        targetSteps=t_steps,
        isReadyToHatch=new_status == "READY_TO_HATCH",
        status=new_status,
        progressPercent=progress_pct,
        egg=EggResponse(**d),
        message=f"Synced +{steps:,} steps! Progress: {progress_pct}%" if new_status == "INCUBATING" else "⚡ EGG READY TO HATCH! The shell is bursting with light!"
    )

@router.post("/eggs/feed-energy")
async def feed_energy(req: FeedEnergyRequest):
    """
    Alias / compatibility endpoint for step sync.
    """
    char_id = req.characterId or req.user_id
    steps = req.energyAmount or req.stepCount or req.step_count or 1000
    return await sync_steps(StepSyncRequest(characterId=char_id, stepCount=steps, source=req.source))

# =======================================================================
# 🐣 HATCH EGG ENDPOINT
# =======================================================================
@router.post("/eggs/hatch")
async def hatch_egg(req: HatchEggRequest):
    """
    Cracks open a ready egg, rolls weighted drop table, mints collectible Beast, and links to character.
    """
    char_id = req.characterId or req.user_id
    egg_id = req.eggId or req.egg_id
    if not char_id or not egg_id:
        raise HTTPException(status_code=400, detail="characterId and eggId required")

    egg = await db.egg.find_unique(where={"id": egg_id})
    if not egg or egg.characterId != char_id:
        raise HTTPException(status_code=404, detail="Egg not found")
    if egg.status == "HATCHED":
        raise HTTPException(status_code=400, detail="Egg has already hatched")

    t_steps = getattr(egg, "targetSteps", 5000) or getattr(egg, "targetEnergy", 5000) or 5000
    c_steps = getattr(egg, "currentSteps", 0) or getattr(egg, "currentEnergy", 0) or 0

    if c_steps < t_steps and egg.status != "READY_TO_HATCH":
        raise HTTPException(status_code=400, detail=f"Egg requires {t_steps - c_steps:,} more steps to hatch")

    # Roll drop table
    beast_spec = roll_hatch_beast(egg.eggType, egg.rarity)

    # Check if character already has an equipped beast
    current_equipped = await db.beast.find_first(
        where={"characterId": char_id, "isEquipped": True}
    )
    should_auto_equip = current_equipped is None

    # Create new Beast instance in DB
    new_beast = await db.beast.create(
        data={
            "name": beast_spec["name"],
            "species": beast_spec["species"],
            "element": beast_spec["element"],
            "rarity": beast_spec["rarity"],
            "spritePath": beast_spec["spritePath"],
            "passiveBuffType": beast_spec["statBonusType"],
            "passiveBuffValue": float(beast_spec["statBonusValue"]),
            "statBonusType": beast_spec["statBonusType"],
            "statBonusValue": float(beast_spec["statBonusValue"]),
            "description": beast_spec["description"],
            "lore": beast_spec["lore"],
            "isEquipped": should_auto_equip,
            "characterId": char_id
        }
    )

    # Update egg state
    updated_egg = await db.egg.update(
        where={"id": egg.id},
        data={
            "status": "HATCHED",
            "hatchedBeastId": new_beast.id,
            "hatchedAt": datetime.utcnow()
        }
    )

    if should_auto_equip:
        await db.character.update(
            where={"id": char_id},
            data={"equippedBeastId": new_beast.id}
        )

    b_dict = new_beast.dict()
    b_dict["passive_buff_type"] = new_beast.passiveBuffType
    b_dict["passive_buff_value"] = new_beast.passiveBuffValue
    b_dict["sprite_path"] = new_beast.spritePath
    b_dict["is_equipped"] = new_beast.isEquipped
    b_dict["user_id"] = char_id

    e_dict = updated_egg.dict()
    e_dict["target_steps"] = t_steps
    e_dict["current_steps"] = c_steps
    e_dict["user_id"] = char_id

    return {
        "success": True,
        "message": f"Congratulations! Your {egg.name} hatched into {new_beast.name} the {new_beast.species}!",
        "beast": BeastResponse(**b_dict),
        "egg": EggResponse(**e_dict),
        "isFirstBeast": should_auto_equip
    }

# =======================================================================
# ⚔️ EQUIP COMPANION ENDPOINT
# =======================================================================
@router.post("/equip")
async def equip_beast(req: EquipBeastRequest):
    """
    Equips or unequips a companion beast.
    """
    char_id = req.characterId or req.user_id
    beast_id = req.beastId or req.beast_id
    if not char_id:
        raise HTTPException(status_code=400, detail="characterId required")

    character = await db.character.find_unique(where={"id": char_id})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    if beast_id:
        beast = await db.beast.find_unique(where={"id": beast_id})
        if not beast or beast.characterId != char_id:
            raise HTTPException(status_code=404, detail="Beast not found in user collection")

        # Unequip all others
        await db.beast.update_many(
            where={"characterId": char_id},
            data={"isEquipped": False}
        )

        # Equip selected
        updated_beast = await db.beast.update(
            where={"id": beast_id},
            data={"isEquipped": True}
        )

        await db.character.update(
            where={"id": char_id},
            data={"equippedBeastId": beast_id}
        )

        b_dict = updated_beast.dict()
        b_dict["passive_buff_type"] = updated_beast.passiveBuffType
        b_dict["passive_buff_value"] = updated_beast.passiveBuffValue
        b_dict["sprite_path"] = updated_beast.spritePath
        b_dict["is_equipped"] = True
        b_dict["user_id"] = char_id

        return {
            "success": True,
            "message": f"{updated_beast.name} is now your active companion!",
            "equippedBeast": BeastResponse(**b_dict)
        }
    else:
        # Unequip
        await db.beast.update_many(
            where={"characterId": char_id},
            data={"isEquipped": False}
        )
        await db.character.update(
            where={"id": char_id},
            data={"equippedBeastId": None}
        )
        return {"success": True, "message": "Companion unequipped", "equippedBeast": None}

# =======================================================================
# 🏪 EGG MARKET & STORAGE ENDPOINTS
# =======================================================================
@router.post("/eggs/buy")
async def buy_egg(req: BuyEggRequest):
    """
    Purchases a mystery egg with Gold or Gems.
    """
    char_id = req.characterId or req.user_id
    egg_type = (req.eggType or req.egg_type or "").upper()
    if not char_id or not egg_type:
        raise HTTPException(status_code=400, detail="characterId and eggType required")

    if egg_type not in EGG_SHOP_CATALOG:
        raise HTTPException(status_code=400, detail=f"Invalid egg type. Valid types: {list(EGG_SHOP_CATALOG.keys())}")

    egg_config = EGG_SHOP_CATALOG[egg_type]
    character = await db.character.find_unique(where={"id": char_id})
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    currency = req.currencyType.upper()
    if currency == "GEMS":
        cost = egg_config["gemPrice"]
        if cost <= 0 or character.gems < cost:
            raise HTTPException(status_code=400, detail=f"Insufficient Gems (Requires {cost} Gems)")
        await db.character.update(
            where={"id": char_id},
            data={"gems": character.gems - cost}
        )
    else:
        cost = egg_config["goldPrice"]
        if character.gold < cost:
            raise HTTPException(status_code=400, detail=f"Insufficient Gold (Requires {cost} Gold)")
        await db.character.update(
            where={"id": char_id},
            data={"gold": character.gold - cost}
        )

    # Check if there is already an incubating egg
    existing_incubating = await db.egg.find_first(
        where={"characterId": char_id, "status": "INCUBATING"}
    )
    status = "INCUBATING" if not existing_incubating else "INCUBATING"

    new_egg = await db.egg.create(
        data={
            "name": egg_config["name"],
            "eggType": egg_config["eggType"],
            "sprite": egg_config["sprite"],
            "rarity": egg_config["rarity"],
            "targetSteps": egg_config["targetSteps"],
            "currentSteps": 0,
            "targetEnergy": egg_config["targetSteps"],
            "currentEnergy": 0,
            "status": status,
            "characterId": char_id
        }
    )

    # Record Economy Log
    try:
        await db.economylog.create(
            data={
                "characterId": char_id,
                "currency": currency,
                "amount": -cost,
                "reason": f"Purchased {egg_config['name']}",
                "source": "SHOP"
            }
        )
    except Exception as e:
        print("EconomyLog error:", e)

    return {
        "success": True,
        "message": f"Purchased {egg_config['name']}!",
        "egg": new_egg
    }

@router.post("/eggs/incubate")
async def incubate_egg(req: IncubateEggRequest):
    """
    Select an owned egg to place into the incubator.
    """
    char_id = req.characterId or req.user_id
    egg_id = req.eggId or req.egg_id
    if not char_id or not egg_id:
        raise HTTPException(status_code=400, detail="characterId and eggId required")

    egg = await db.egg.find_unique(where={"id": egg_id})
    if not egg or egg.characterId != char_id:
        raise HTTPException(status_code=404, detail="Egg not found")
    if egg.status == "HATCHED":
        raise HTTPException(status_code=400, detail="Egg has already hatched")

    t_steps = getattr(egg, "targetSteps", 5000) or getattr(egg, "targetEnergy", 5000) or 5000
    c_steps = getattr(egg, "currentSteps", 0) or getattr(egg, "currentEnergy", 0) or 0

    updated_egg = await db.egg.update(
        where={"id": egg_id},
        data={"status": "READY_TO_HATCH" if c_steps >= t_steps else "INCUBATING"}
    )
    return {"message": "Egg placed in active incubator", "egg": updated_egg}
