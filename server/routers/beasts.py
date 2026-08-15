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
    SetDailyStepsRequest,
    ModifyStepGoalRequest,
    UpgradeBeastRequest,
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
        "spritePath": "/beasts/beast_1.gif",
        "statBonusType": "AGILITY_PERCENT",
        "statBonusValue": 8.0,
        "description": "Born in the abyssal silence between shattered dimensional rifts. Glides on weightless ethereal dark-matter wings.",
        "lore": "Synchronizes with the hunter's agile kinetic movements, converting brisk daily walking strides into a localized gravity reduction field."
    },
    {
        "speciesId": 2,
        "name": "Morvath",
        "species": "Amethyst Wyrm",
        "element": "VOID",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_2.gif",
        "statBonusType": "KNOWLEDGE_PERCENT",
        "statBonusValue": 12.0,
        "description": "Ancient psychic dragon carved from crystallized mana geocores. Scales vibrate at harmonic neural frequencies.",
        "lore": "Channels high-frequency astral frequencies into the hunter's prefrontal cortex, enhancing focus during study and deep reading blocks."
    },
    {
        "speciesId": 3,
        "name": "Florian",
        "species": "Verdant Sylva Wyrm",
        "element": "NATURE",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_3.gif",
        "statBonusType": "EXP_PERCENT",
        "statBonusValue": 6.0,
        "description": "A gentle woodland dragon that nests in the ancient canopies of the World Tree.",
        "lore": "Absorbs environmental solar energy and releases restorative phytocides, accelerating cellular EXP synthesis on morning strolls."
    },
    {
        "speciesId": 4,
        "name": "Ymir",
        "species": "Glacial Frost Dragon",
        "element": "FROST",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_4.gif",
        "statBonusType": "FOCUS_PERCENT",
        "statBonusValue": 10.0,
        "description": "Hatched in the eye of a perpetual sub-zero blizzard. Radiates a calm aura that freezes away distractions.",
        "lore": "Reduces neurological noise and thermal stress, lowering heart rate variability for laser-sharp focus and stoic discipline."
    },
    {
        "speciesId": 5,
        "name": "Nyx",
        "species": "Obsidian Shadow Drake",
        "element": "VOID",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_5.gif",
        "statBonusType": "STRENGTH_PERCENT",
        "statBonusValue": 5.0,
        "description": "Woven from cooling volcanic basalt and dungeon shadows; clings silently to the hunter's shoulder.",
        "lore": "Fortifies core muscular contraction and postural endurance by reinforcing kinetic feedback during heavy compound lifts."
    },
    {
        "speciesId": 6,
        "name": "Ignis",
        "species": "Solar Flame Dragon",
        "element": "FIRE",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_6.gif",
        "statBonusType": "STRENGTH_PERCENT",
        "statBonusValue": 15.0,
        "description": "Its draconic heart beats with the nuclear fury of an adolescent star, radiating thermic shockwaves.",
        "lore": "Ignites cellular ATP replenishment and neuromuscular power output, supercharging heavy barbell presses and explosive sprint sets."
    },
    {
        "speciesId": 7,
        "name": "Aurelius",
        "species": "Golden Celestial Wyrm",
        "element": "HOLY",
        "rarity": "LEGENDARY",
        "spritePath": "/beasts/beast_7.gif",
        "statBonusType": "GOLD_PERCENT",
        "statBonusValue": 30.0,
        "description": "An exalted dragon clad in impenetrable solar gold. The herald of sovereign prosperity.",
        "lore": "Radiates an auric magnetic resonance field that multiplies gold and relic bounty drops from all completed quests and tower monoliths."
    },
    {
        "speciesId": 8,
        "name": "Thalassa",
        "species": "Abyssal Tide Dragon",
        "element": "FROST",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_8.gif",
        "statBonusType": "ENDURANCE_PERCENT",
        "statBonusValue": 10.0,
        "description": "Glides through oceanic air currents, granting deep rhythmic cardiovascular rhythm.",
        "lore": "Enhances pulmonary efficiency and aerobic VO2 capacity, stabilizing breath rhythm during continuous distance walking and endurance training."
    },
    {
        "speciesId": 9,
        "name": "Zephyrus",
        "species": "Tempest Storm Drake",
        "element": "STORM",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_9.gif",
        "statBonusType": "AGILITY_PERCENT",
        "statBonusValue": 6.0,
        "description": "Sparks with azure static electricity as it darts across the sky in summer thunderstorm downdrafts.",
        "lore": "Infuses rapid motor neuron recruitment into leg muscles, turning regular daily steps into high-cadence kinetic progress."
    },
    {
        "speciesId": 10,
        "name": "Volcanus",
        "species": "Magma Core Wyrm",
        "element": "FIRE",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_10.gif",
        "statBonusType": "STRENGTH_PERCENT",
        "statBonusValue": 10.0,
        "description": "Armored in volcanic obsidian basalt with glowing molten lava veins from geothermal vents.",
        "lore": "Boosts heat-shock protein synthesis and blood flow, providing resilience and explosive power for heavy back and leg workouts."
    },
    {
        "speciesId": 11,
        "name": "Bramble",
        "species": "Thornwood Dragon",
        "element": "NATURE",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_11.gif",
        "statBonusType": "RECOVERY_PERCENT",
        "statBonusValue": 7.0,
        "description": "Entangled in evergreen vines and sharp ironthorn briars over ancient grove sanctuaries.",
        "lore": "Accelerates soft-tissue healing and reduces delayed onset muscle soreness (DOMS) after grueling physical training sessions."
    },
    {
        "speciesId": 12,
        "name": "Borealis",
        "species": "Aurora Frost Wyrm",
        "element": "FROST",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_12.gif",
        "statBonusType": "EXP_PERCENT",
        "statBonusValue": 18.0,
        "description": "Shimmers with iridescent emerald and violet auroral ribbons beneath polar midnight skies.",
        "lore": "Synthesizes magnetic auroral currents into the hunter's aura, substantially boosting experience yield across every habit logged."
    },
    {
        "speciesId": 13,
        "name": "Erebos",
        "species": "Void Star Dragon",
        "element": "VOID",
        "rarity": "HOLOGRAPHIC",
        "spritePath": "/beasts/beast_13.gif",
        "statBonusType": "EXP_PERCENT",
        "statBonusValue": 40.0,
        "description": "A mythic holographic entity woven from the singularity of a collapsed star; glitches reality with prismatic brilliance.",
        "lore": "Transmutes every micro-action of real-world discipline into massive astronomical EXP growth, elevating your ascension rate to sovereign heights."
    },
    {
        "speciesId": 14,
        "name": "Solarius",
        "species": "Dawn Light Drake",
        "element": "HOLY",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_14.gif",
        "statBonusType": "DISCIPLINE_PERCENT",
        "statBonusValue": 7.0,
        "description": "Greets the morning horizon with a bright chime, reinforcing dawn walking and morning routines.",
        "lore": "Reinforces circadian cortisol rhythm and willpower alignment, ensuring morning habits are completed with unwavering resolve."
    },
    {
        "speciesId": 15,
        "name": "Cyberion",
        "species": "Synthetic Neon Wyrm",
        "element": "CYBER",
        "rarity": "LEGENDARY",
        "spritePath": "/beasts/beast_15.gif",
        "statBonusType": "AGILITY_PERCENT",
        "statBonusValue": 25.0,
        "description": "An overclocked cybernetic biomechanical familiar laced with glowing fiber-optic telemetry conduits.",
        "lore": "Hooks directly into your biological telemetry, providing real-time biomechanical optimization for maximum speed and step cadence."
    },
    {
        "speciesId": 16,
        "name": "Gladius",
        "species": "Iron Scale Dragon",
        "element": "FIRE",
        "rarity": "COMMON",
        "spritePath": "/beasts/beast_16.gif",
        "statBonusType": "STRENGTH_PERCENT",
        "statBonusValue": 7.0,
        "description": "Hardened metallic scales provide impenetrable armor, absorbing the martial spirit of battlegrounds.",
        "lore": "Channels dense kinetic shock absorption, shielding the hunter's tendons during maximal effort lifts and intense PR attempts."
    },
    {
        "speciesId": 17,
        "name": "Terra",
        "species": "Ancient Mountain Drake",
        "element": "NATURE",
        "rarity": "RARE",
        "spritePath": "/beasts/beast_17.gif",
        "statBonusType": "ENDURANCE_PERCENT",
        "statBonusValue": 12.0,
        "description": "Carries a rocky tectonic carapace, moving with the unstoppable momentum of continental plates.",
        "lore": "Anchors cardiovascular stamina and mental grit, preventing fatigue from derailing multi-kilometer daily treks and long work sessions."
    },
    {
        "speciesId": 18,
        "name": "Aether",
        "species": "Prismatic Astral Wyrm",
        "element": "VOID",
        "rarity": "LEGENDARY",
        "spritePath": "/beasts/beast_18.gif",
        "statBonusType": "KNOWLEDGE_PERCENT",
        "statBonusValue": 28.0,
        "description": "Reflects pure starlight and floats through gravitational planes without friction.",
        "lore": "Expands neural processing bandwidth and abstract problem-solving capacity, amplifying Knowledge and analytical mastery."
    },
    {
        "speciesId": 19,
        "name": "Crimson",
        "species": "Blood Wyrm",
        "element": "FIRE",
        "rarity": "EPIC",
        "spritePath": "/beasts/beast_19.gif",
        "statBonusType": "STRENGTH_PERCENT",
        "statBonusValue": 18.0,
        "description": "Ignites in incandescent crimson fire whenever battle reaches its peak, feeding on adrenaline.",
        "lore": "Surges blood nitric oxide levels and muscular vasodilation, unlocking monstrous pumps and strength gains in the gym."
    },
    {
        "speciesId": 20,
        "name": "Chrono",
        "species": "Temporal Spark Drake",
        "element": "CYBER",
        "rarity": "HOLOGRAPHIC",
        "spritePath": "/beasts/beast_20.gif",
        "statBonusType": "GOLD_PERCENT",
        "statBonusValue": 50.0,
        "description": "A holographic dragon that flickers through timelines, seeing all past and future iterations.",
        "lore": "Bends the laws of probability and compound growth, delivering monumental economic bounties to hunters who maintain unbroken streaks."
    }
]

# Map Species ID to Catalog Item
SPECIES_BY_ID = {item["speciesId"]: item for item in BESTIARY_CATALOG}

# Mystery Egg Shop Catalog (Upgraded & Rebalanced Economy)
EGG_SHOP_CATALOG = {
    "WOODLAND": {
        "name": "Woodland Earth Egg",
        "eggType": "NATURE",
        "sprite": "/eggs/egg_1.png",
        "rarity": "COMMON",
        "targetSteps": 3000,
        "targetEnergy": 3000,
        "goldPrice": 1250,
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
        "goldPrice": 3500,
        "gemPrice": 35,
        "pool": [4, 8, 12, 1]
    },
    "SOLAR": {
        "name": "Solar Flare Egg",
        "eggType": "FIRE",
        "sprite": "/eggs/egg_6.png",
        "rarity": "EPIC",
        "targetSteps": 8000,
        "targetEnergy": 8000,
        "goldPrice": 8500,
        "gemPrice": 85,
        "pool": [6, 10, 16, 19]
    },
    "CYBER": {
        "name": "Neon Cyber Egg",
        "eggType": "CYBER",
        "sprite": "/eggs/egg_15.png",
        "rarity": "LEGENDARY",
        "targetSteps": 12000,
        "targetEnergy": 12000,
        "goldPrice": 22000,
        "gemPrice": 220,
        "pool": [15, 7, 2, 9]
    },
    "COSMIC": {
        "name": "Cosmic Void Egg",
        "eggType": "VOID",
        "sprite": "/eggs/egg_13.png",
        "rarity": "HOLOGRAPHIC",
        "targetSteps": 20000,
        "targetEnergy": 20000,
        "goldPrice": 50000,
        "gemPrice": 500,
        "pool": [13, 18, 20, 2, 7]
    }
}

# =======================================================================
# 🎲 WEIGHTED DROP & HATCHING LOGIC
# =======================================================================
def roll_hatch_beast(egg_type: str, egg_rarity: str) -> Dict[str, Any]:
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
    target_id = character_id or characterId or user_id
    if not target_id:
        raise HTTPException(status_code=400, detail="character_id or user_id required")

    character = await ensure_character_exists(target_id)
    char_id = character.id

    owned_eggs = await db.egg.find_many(
        where={"characterId": char_id},
        order={"createdAt": "desc"}
    )

    unlocked_beasts = await db.beast.find_many(
        where={"characterId": char_id},
        order={"unlockedAt": "desc"}
    )

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

    active_egg = next((e for e in owned_eggs if e.status in ["INCUBATING", "READY_TO_HATCH"]), None)
    equipped_beast = next((b for b in unlocked_beasts if b.isEquipped), None)

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

        b_level = getattr(active_inst, "level", 1) if active_inst else 1
        b_accum = getattr(active_inst, "accumulatedSteps", 0) if active_inst else 0
        b_step_req = getattr(active_inst, "stepUpgradeReq", 5000) if active_inst else 5000
        b_gold_req = getattr(active_inst, "goldUpgradeReq", 1000) if active_inst else 1000
        b_bonus_val = getattr(active_inst, "statBonusValue", spec["statBonusValue"]) if active_inst else spec["statBonusValue"]

        bestiary_summary.append(
            BestiarySpeciesSummary(
                speciesId=spec["speciesId"],
                name=spec["name"],
                species=spec["species"],
                element=spec["element"],
                rarity=spec["rarity"],
                spritePath=spec["spritePath"],
                statBonusType=spec["statBonusType"],
                statBonusValue=float(b_bonus_val),
                description=spec["description"],
                lore=spec["lore"],
                level=b_level,
                accumulatedSteps=b_accum,
                stepUpgradeReq=b_step_req,
                goldUpgradeReq=b_gold_req,
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
        d = e.dict() if hasattr(e, "dict") else dict(e)
        d["targetSteps"] = t_steps
        d["currentSteps"] = c_steps
        d["target_steps"] = t_steps
        d["current_steps"] = c_steps
        d["targetEnergy"] = t_steps
        d["currentEnergy"] = c_steps
        d["user_id"] = e.characterId
        return EggResponse(**d)

    def to_beast_resp(b) -> BeastResponse:
        d = b.dict() if hasattr(b, "dict") else dict(b)
        b_type = getattr(b, "passiveBuffType", None) or getattr(b, "statBonusType", "EXP_BOOST")
        b_val = getattr(b, "passiveBuffValue", None) or getattr(b, "statBonusValue", 5.0)
        d["passiveBuffType"] = b_type
        d["passiveBuffValue"] = b_val
        d["passive_buff_type"] = b_type
        d["passive_buff_value"] = b_val
        d["statBonusType"] = b_type
        d["statBonusValue"] = b_val
        d["sprite_path"] = getattr(b, "spritePath", "/beasts/beast_1.gif")
        d["is_equipped"] = getattr(b, "isEquipped", False)
        d["level"] = getattr(b, "level", 1) or 1
        d["accumulatedSteps"] = getattr(b, "accumulatedSteps", 0) or 0
        d["stepUpgradeReq"] = getattr(b, "stepUpgradeReq", 5000) or 5000
        d["goldUpgradeReq"] = getattr(b, "goldUpgradeReq", 1000) or 1000
        d["user_id"] = getattr(b, "characterId", char_id)
        return BeastResponse(**d)

    daily_steps = getattr(character, "dailySteps", 0) or 0
    daily_goal = getattr(character, "dailyStepGoal", 10000) or 10000

    return BeastCollectionResponse(
        characterId=char_id,
        user_id=char_id,
        dailySteps=daily_steps,
        dailyStepGoal=daily_goal,
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
# 🚶 PEDOMETER STEP SYNC & MODIFICATION ENDPOINTS
# =======================================================================
@router.post("/steps/sync", response_model=StepSyncResponse)
async def sync_steps(req: StepSyncRequest):
    char_id = req.characterId or req.user_id
    if not char_id:
        raise HTTPException(status_code=400, detail="characterId or user_id required")

    steps = req.stepCount if req.stepCount is not None else (req.step_count or 0)
    if steps <= 0:
        raise HTTPException(status_code=400, detail="stepCount must be greater than 0")

    character = await ensure_character_exists(char_id)

    # 1. Update character dailySteps
    cur_daily = getattr(character, "dailySteps", 0) or 0
    new_daily = cur_daily + steps
    await db.character.update(
        where={"id": character.id},
        data={"dailySteps": new_daily}
    )

    # 2. Record in DailyStepLog
    try:
        await db.dailysteplog.create(
            data={
                "characterId": character.id,
                "stepCount": steps,
                "date": datetime.utcnow()
            }
        )
    except Exception as e:
        print("DailyStepLog error:", e)

    # 3. Increment steps on equipped beast
    equipped_beast = await db.beast.find_first(
        where={"characterId": character.id, "isEquipped": True}
    )
    if equipped_beast:
        old_b_steps = getattr(equipped_beast, "accumulatedSteps", 0) or 0
        await db.beast.update(
            where={"id": equipped_beast.id},
            data={"accumulatedSteps": old_b_steps + steps}
        )

    # 4. Find active incubating egg
    active_egg = await db.egg.find_first(
        where={"characterId": character.id, "status": "INCUBATING"}
    )

    if not active_egg:
        ready_egg = await db.egg.find_first(
            where={"characterId": character.id, "status": "READY_TO_HATCH"}
        )
        t_steps = getattr(ready_egg, "targetSteps", 5000) if ready_egg else 5000
        c_steps = getattr(ready_egg, "currentSteps", 0) if ready_egg else 0
        return StepSyncResponse(
            characterId=character.id,
            stepsAdded=steps,
            currentSteps=c_steps,
            targetSteps=t_steps,
            dailySteps=new_daily,
            dailyStepGoal=getattr(character, "dailyStepGoal", 10000) or 10000,
            isReadyToHatch=ready_egg is not None,
            status="READY_TO_HATCH" if ready_egg else "IDLE",
            progressPercent=100 if ready_egg else 0,
            egg=None,
            message="Steps successfully synchronized to your neural core & companion!"
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

    d = updated.dict() if hasattr(updated, "dict") else dict(updated)
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
        dailySteps=new_daily,
        dailyStepGoal=getattr(character, "dailyStepGoal", 10000) or 10000,
        isReadyToHatch=new_status == "READY_TO_HATCH",
        status=new_status,
        progressPercent=progress_pct,
        egg=EggResponse(**d),
        message=f"Synced +{steps:,} steps! Progress: {progress_pct}%" if new_status == "INCUBATING" else "⚡ EGG READY TO HATCH! The shell is bursting with light!"
    )

@router.post("/steps/set-daily")
async def set_daily_steps(req: SetDailyStepsRequest):
    char_id = req.characterId or req.user_id
    if not char_id:
        raise HTTPException(status_code=400, detail="characterId required")

    character = await ensure_character_exists(char_id)
    steps_val = max(0, req.steps)
    goal_val = req.goal if (req.goal and req.goal > 0) else getattr(character, "dailyStepGoal", 10000) or 10000

    await db.character.update(
        where={"id": character.id},
        data={
            "dailySteps": steps_val,
            "dailyStepGoal": goal_val
        }
    )

    try:
        await db.dailysteplog.create(
            data={
                "characterId": character.id,
                "stepCount": steps_val,
                "date": datetime.utcnow()
            }
        )
    except Exception as e:
        print("DailyStepLog error:", e)

    return {
        "success": True,
        "dailySteps": steps_val,
        "dailyStepGoal": goal_val,
        "message": f"Daily step counter updated to {steps_val:,} steps (Goal: {goal_val:,})!"
    }

@router.post("/steps/goal")
async def modify_step_goal(req: ModifyStepGoalRequest):
    char_id = req.characterId or req.user_id
    if not char_id:
        raise HTTPException(status_code=400, detail="characterId required")

    character = await ensure_character_exists(char_id)
    goal = max(1000, req.goal)
    await db.character.update(
        where={"id": character.id},
        data={"dailyStepGoal": goal}
    )
    return {"success": True, "dailyStepGoal": goal, "message": f"Daily step target set to {goal:,} steps!"}

@router.post("/eggs/feed-energy")
async def feed_energy(req: FeedEnergyRequest):
    char_id = req.characterId or req.user_id
    steps = req.energyAmount or req.stepCount or req.step_count or 1000
    return await sync_steps(StepSyncRequest(characterId=char_id, stepCount=steps, source=req.source))

# =======================================================================
# 🐣 HATCH EGG ENDPOINT
# =======================================================================
@router.post("/eggs/hatch")
async def hatch_egg(req: HatchEggRequest):
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

    beast_spec = roll_hatch_beast(egg.eggType, egg.rarity)

    current_equipped = await db.beast.find_first(
        where={"characterId": char_id, "isEquipped": True}
    )
    should_auto_equip = current_equipped is None

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
            "level": 1,
            "accumulatedSteps": 0,
            "stepUpgradeReq": 5000,
            "goldUpgradeReq": 1000,
            "isEquipped": should_auto_equip,
            "characterId": char_id
        }
    )

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

    b_dict = new_beast.dict() if hasattr(new_beast, "dict") else dict(new_beast)
    b_dict["passive_buff_type"] = new_beast.passiveBuffType
    b_dict["passive_buff_value"] = new_beast.passiveBuffValue
    b_dict["sprite_path"] = new_beast.spritePath
    b_dict["is_equipped"] = new_beast.isEquipped
    b_dict["level"] = 1
    b_dict["accumulatedSteps"] = 0
    b_dict["stepUpgradeReq"] = 5000
    b_dict["goldUpgradeReq"] = 1000
    b_dict["user_id"] = char_id

    e_dict = updated_egg.dict() if hasattr(updated_egg, "dict") else dict(updated_egg)
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

        await db.beast.update_many(
            where={"characterId": char_id},
            data={"isEquipped": False}
        )

        updated_beast = await db.beast.update(
            where={"id": beast_id},
            data={"isEquipped": True}
        )

        await db.character.update(
            where={"id": char_id},
            data={"equippedBeastId": beast_id}
        )

        b_dict = updated_beast.dict() if hasattr(updated_beast, "dict") else dict(updated_beast)
        b_dict["passive_buff_type"] = updated_beast.passiveBuffType
        b_dict["passive_buff_value"] = updated_beast.passiveBuffValue
        b_dict["sprite_path"] = updated_beast.spritePath
        b_dict["is_equipped"] = True
        b_dict["level"] = getattr(updated_beast, "level", 1) or 1
        b_dict["accumulatedSteps"] = getattr(updated_beast, "accumulatedSteps", 0) or 0
        b_dict["stepUpgradeReq"] = getattr(updated_beast, "stepUpgradeReq", 5000) or 5000
        b_dict["goldUpgradeReq"] = getattr(updated_beast, "goldUpgradeReq", 1000) or 1000
        b_dict["user_id"] = char_id

        return {
            "success": True,
            "message": f"{updated_beast.name} is now your active companion!",
            "equippedBeast": BeastResponse(**b_dict)
        }
    else:
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
# ⚡ BEAST UPGRADE & ASCENSION ENDPOINT
# =======================================================================
@router.post("/upgrade")
async def upgrade_beast(req: UpgradeBeastRequest):
    char_id = req.characterId or req.user_id
    if not char_id or not req.beastId:
        raise HTTPException(status_code=400, detail="characterId and beastId required")

    character = await ensure_character_exists(char_id)
    beast = await db.beast.find_unique(where={"id": req.beastId})
    if not beast or beast.characterId != character.id:
        raise HTTPException(status_code=404, detail="Beast not found in your collection")

    cur_level = getattr(beast, "level", 1) or 1
    if cur_level >= 10:
        raise HTTPException(status_code=400, detail=f"{beast.name} has already reached maximum Ascension Level 10!")

    step_req = getattr(beast, "stepUpgradeReq", cur_level * 5000) or (cur_level * 5000)
    gold_req = getattr(beast, "goldUpgradeReq", cur_level * 1000) or (cur_level * 1000)
    accum_steps = getattr(beast, "accumulatedSteps", 0) or 0
    daily_steps = getattr(character, "dailySteps", 0) or 0

    effective_steps = max(accum_steps, daily_steps)
    if effective_steps < step_req:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient steps. Requires {step_req - effective_steps:,} more steps to level up ({step_req:,} required)."
        )

    if character.gold < gold_req:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient gold. Requires {gold_req - character.gold:,} more gold ({gold_req:,} Gold required)."
        )

    new_level = cur_level + 1
    old_bonus = getattr(beast, "statBonusValue", 5.0) or 5.0
    new_bonus = round(old_bonus * 1.2 + 2.0, 1)
    new_step_req = new_level * 5000
    new_gold_req = new_level * 1000
    new_accum_steps = max(0, accum_steps - step_req)

    await db.character.update(
        where={"id": character.id},
        data={"gold": character.gold - gold_req}
    )

    updated_beast = await db.beast.update(
        where={"id": beast.id},
        data={
            "level": new_level,
            "accumulatedSteps": new_accum_steps,
            "stepUpgradeReq": new_step_req,
            "goldUpgradeReq": new_gold_req,
            "statBonusValue": new_bonus,
            "passiveBuffValue": new_bonus
        }
    )

    try:
        await db.economylog.create(
            data={
                "characterId": character.id,
                "currency": "GOLD",
                "amount": -gold_req,
                "reason": f"Ascended {beast.name} to Level {new_level}",
                "source": "BEAST_UPGRADE"
            }
        )
    except Exception as e:
        print("EconomyLog error:", e)

    b_dict = updated_beast.dict() if hasattr(updated_beast, "dict") else dict(updated_beast)
    b_dict["passive_buff_type"] = updated_beast.passiveBuffType
    b_dict["passive_buff_value"] = updated_beast.passiveBuffValue
    b_dict["sprite_path"] = updated_beast.spritePath
    b_dict["is_equipped"] = updated_beast.isEquipped
    b_dict["level"] = new_level
    b_dict["accumulatedSteps"] = new_accum_steps
    b_dict["stepUpgradeReq"] = new_step_req
    b_dict["goldUpgradeReq"] = new_gold_req
    b_dict["user_id"] = character.id

    return {
        "success": True,
        "message": f"⚡ {beast.name} ascended to Level {new_level}! Passive bonus surged to +{new_bonus}%!",
        "beast": BeastResponse(**b_dict),
        "characterGold": character.gold - gold_req
    }

# =======================================================================
# 🏪 EGG MARKET & STORAGE ENDPOINTS
# =======================================================================
@router.post("/eggs/buy")
async def buy_egg(req: BuyEggRequest):
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

# =======================================================================
# 🎁 DAILY SCALED FREE MYSTERY EGG CLAIM
# =======================================================================
from pydantic import BaseModel as PyBaseModel

class ClaimDailyEggInput(PyBaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    level: Optional[int] = 1

@router.post("/eggs/claim-daily")
async def claim_daily_egg(req: ClaimDailyEggInput):
    char_id = req.characterId or req.user_id
    if not char_id:
        raise HTTPException(status_code=400, detail="characterId required")

    character = await ensure_character_exists(char_id)
    char_level = req.level or getattr(character, "level", 1) or 1

    if char_level >= 71:
        egg_type = "COSMIC"
    elif char_level >= 46:
        egg_type = "CYBER"
    elif char_level >= 26:
        egg_type = "SOLAR"
    elif char_level >= 11:
        egg_type = "FROST"
    else:
        egg_type = "WOODLAND"

    egg_config = EGG_SHOP_CATALOG[egg_type]

    new_egg = await db.egg.create(
        data={
            "name": f"Daily {egg_config['name']}",
            "eggType": egg_config["eggType"],
            "sprite": egg_config["sprite"],
            "rarity": egg_config["rarity"],
            "targetSteps": egg_config["targetSteps"],
            "currentSteps": 0,
            "targetEnergy": egg_config["targetSteps"],
            "currentEnergy": 0,
            "status": "INCUBATING",
            "characterId": character.id
        }
    )

    return {
        "success": True,
        "message": f"Claimed Daily Free {egg_config['name']} ({egg_config['rarity']} Tier)!",
        "egg": new_egg
    }

