import os
import sys
import asyncio

# Ensure server root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import db
from db_utils import ensure_character_exists
from routers.beasts import (
    get_beast_collection,
    sync_steps,
    feed_energy,
    hatch_egg,
    equip_beast,
    buy_egg,
    incubate_egg,
    calculate_passive_buffs,
)
from schemas.beasts import (
    StepSyncRequest,
    HatchEggRequest,
    EquipBeastRequest,
    BuyEggRequest,
    IncubateEggRequest
)

async def run_tests():
    print("Connecting to DB for Beasts Test Suite...", flush=True)
    await db.connect()
    
    test_user_id = "test-beast-hunter"
    char = await ensure_character_exists(test_user_id)
    print(f"Character ready: id={char.id}, name={char.name}", flush=True)
    
    # 1. Test collection initialization (auto starter egg)
    coll = await get_beast_collection(character_id=char.id)
    assert coll.activeEgg is not None, "Starter egg should be auto-created"
    active_egg_id = coll.activeEgg.id

    # 2. Test Step Sync / Energy Feeding
    sync_res = await sync_steps(StepSyncRequest(characterId=char.id, stepCount=1500))
    assert sync_res.currentSteps >= 1500
    
    remaining = sync_res.targetSteps - sync_res.currentSteps
    if remaining > 0:
        sync_res2 = await sync_steps(StepSyncRequest(characterId=char.id, stepCount=remaining))
        assert sync_res2.isReadyToHatch or sync_res2.status == "READY_TO_HATCH"

    # 3. Test Hatching
    hatch_res = await hatch_egg(HatchEggRequest(characterId=char.id, eggId=active_egg_id))
    assert hatch_res['success'] == True
    hatched_beast_id = hatch_res['beast'].id

    # 4. Test Passive Buffs Calculation
    buffs = await calculate_passive_buffs(char.id)
    assert sum(buffs.values()) > 0, "Equipped beast + collection should give passive buffs"

    # 5. Test Buying Eggs from Shop
    await db.character.update(where={"id": char.id}, data={"gold": 10000, "gems": 500})
    buy_res = await buy_egg(BuyEggRequest(characterId=char.id, eggType="FROST", currencyType="GOLD"))
    new_egg_id = buy_res['egg'].id

    # 6. Test Incubating specific egg
    inc_res = await incubate_egg(IncubateEggRequest(characterId=char.id, eggId=new_egg_id))
    assert inc_res['egg'].status == "INCUBATING"

    # 7. Test Bestiary Matrix and Equipping
    coll_after = await get_beast_collection(character_id=char.id)
    assert coll_after.totalDiscovered >= 1
    
    # Unequip
    await equip_beast(EquipBeastRequest(characterId=char.id, beastId=None))
    coll_unequipped = await get_beast_collection(character_id=char.id)
    assert coll_unequipped.equippedBeast is None

    # Re-equip
    await equip_beast(EquipBeastRequest(characterId=char.id, beastId=hatched_beast_id))
    coll_reequipped = await get_beast_collection(character_id=char.id)
    assert coll_reequipped.equippedBeast is not None
    assert coll_reequipped.equippedBeast.id == hatched_beast_id

    print("[SUCCESS] All Beasts & Dragon Companion tests passed successfully!", flush=True)
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(run_tests())
