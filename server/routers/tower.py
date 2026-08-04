from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from db import db
from db_utils import ensure_character_exists, ensure_tower_seeded
from schemas.tower import CombatResultSchema

router = APIRouter(prefix="/api/tower", tags=["tower"])


@router.get("")
@router.get("/")
async def get_towers():
    """
    Return all Tower records (defaults to Tower of Ascension).
    """
    await ensure_tower_seeded()
    towers = await db.tower.find_many(
        order={"createdAt": "asc"},
        take=1,
    )
    return towers


@router.get("/{tower_id}/floors/{character_id}")
async def get_tower_floors(tower_id: str, character_id: str):
    """
    Fetch all Floor records for the tower including boss relations,
    and merge character's FloorProgress data.
    """
    await ensure_tower_seeded(character_id)

    floors = await db.floor.find_many(
        where={"towerId": tower_id},
        include={"boss": True},
        order={"floorNumber": "asc"},
    )

    progress_records = await db.floorprogress.find_many(
        where={"characterId": character_id}
    )

    progress_map = {p.floorId: p for p in progress_records}

    merged_floors = []
    for floor in floors:
        prog = progress_map.get(floor.id)
        if prog:
            floor_status = prog.status
            attempts = prog.attempts
            best_time = prog.bestTime
            cleared_at = prog.clearedAt
        else:
            floor_status = "UNLOCKED" if floor.floorNumber == 1 else "LOCKED"
            attempts = 0
            best_time = None
            cleared_at = None

        floor_dict = floor.model_dump() if hasattr(floor, "model_dump") else dict(floor)
        floor_dict["status"] = floor_status
        floor_dict["attempts"] = attempts
        floor_dict["bestTime"] = best_time
        floor_dict["clearedAt"] = cleared_at
        merged_floors.append(floor_dict)

    return merged_floors


@router.post("/floors/{floor_id}/combat/{character_id}")
async def record_floor_combat(
    floor_id: str,
    character_id: str,
    payload: CombatResultSchema,
):
    """
    Record combat result for a floor. If victory, marks floor CLEARED,
    updates best time, and unlocks the next floor in the tower.
    """
    await ensure_character_exists(character_id)

    floor = await db.floor.find_unique(where={"id": floor_id})
    if not floor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Floor with ID '{floor_id}' not found.",
        )

    progress = await db.floorprogress.find_first(
        where={"characterId": character_id, "floorId": floor_id}
    )

    if not progress:
        progress = await db.floorprogress.create(
            data={
                "characterId": character_id,
                "floorId": floor_id,
                "status": "UNLOCKED",
                "attempts": 1,
            }
        )
    else:
        progress = await db.floorprogress.update(
            where={"id": progress.id},
            data={"attempts": progress.attempts + 1},
        )

    if payload.isVictory:
        new_best = (
            min(progress.bestTime, payload.totalTurns)
            if progress.bestTime is not None
            else payload.totalTurns
        )

        progress = await db.floorprogress.update(
            where={"id": progress.id},
            data={
                "status": "CLEARED",
                "clearedAt": datetime.now(timezone.utc),
                "bestTime": new_best,
            },
            include={"floor": True},
        )

        # Automatically unlock next floor if it exists
        next_floor = await db.floor.find_first(
            where={"towerId": floor.towerId, "floorNumber": floor.floorNumber + 1}
        )

        if next_floor:
            next_prog = await db.floorprogress.find_first(
                where={"characterId": character_id, "floorId": next_floor.id}
            )
            if not next_prog:
                await db.floorprogress.create(
                    data={
                        "characterId": character_id,
                        "floorId": next_floor.id,
                        "status": "UNLOCKED",
                        "attempts": 0,
                    }
                )
            elif next_prog.status == "LOCKED":
                await db.floorprogress.update(
                    where={"id": next_prog.id},
                    data={"status": "UNLOCKED"},
                )

    return progress
