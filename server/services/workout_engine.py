from prisma import Prisma

def calculate_e1rm(weight: float, reps: int) -> float:
    """
    Epley formula for 1RM calculation: Weight * (1 + Reps / 30).
    Accurately calculates the estimated 1RM from any logged sets.
    """
    if reps == 1:
        return weight
    return weight * (1.0 + (reps / 30.0))

def determine_rank(e1rm: float, standard) -> str:
    """
    Compares the calculated 1RM against the threshold brackets (E through SSS)
    and assigns the final RPG Rank.
    """
    if e1rm >= standard.rankSSS:
        return "SSS"
    elif e1rm >= standard.rankSS:
        return "SS"
    elif e1rm >= standard.rankS:
        return "S"
    elif e1rm >= standard.rankA:
        return "A"
    elif e1rm >= standard.rankB:
        return "B"
    elif e1rm >= standard.rankC:
        return "C"
    elif e1rm >= standard.rankD:
        return "D"
    else:
        return "E"

async def get_exercise_standard(db: Prisma, exercise_id: str, sex: str, bodyweight: float):
    """
    Fetches the correct ExerciseStandard based on the character's sex and bodyweight.
    """
    standard = await db.exercisestandard.find_first(
        where={
            "exerciseId": exercise_id,
            "sex": sex,
            "bodyweightMin": {"lte": bodyweight},
            "bodyweightMax": {"gte": bodyweight}
        }
    )
    
    # Fallback if no exact bracket found, grab any standard for this exercise
    if not standard:
        standard = await db.exercisestandard.find_first(
            where={
                "exerciseId": exercise_id
            }
        )
        
    return standard
