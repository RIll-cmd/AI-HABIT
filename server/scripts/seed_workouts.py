import asyncio
from prisma import Prisma

EXERCISES = [
    {
        "name": "Barbell Bench Press",
        "primaryMuscle": "Chest",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [30, 47, 64, 85, 110, 136, 150, 165]
    },
    {
        "name": "Squat",
        "primaryMuscle": "Legs",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [40, 60, 85, 115, 145, 175, 195, 215]
    },
    {
        "name": "Deadlift",
        "primaryMuscle": "Back",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [50, 75, 105, 140, 180, 215, 240, 265]
    },
    {
        "name": "Overhead Press",
        "primaryMuscle": "Shoulders",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [20, 30, 42, 57, 75, 92, 105, 115]
    },
    {
        "name": "Barbell Row",
        "primaryMuscle": "Back",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [30, 45, 65, 87, 112, 137, 150, 165]
    },
    {
        "name": "Pull-Up",
        "primaryMuscle": "Back",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 5, 15, 30, 45, 65, 80, 100] # Added weight
    },
    {
        "name": "Dumbbell Curl",
        "primaryMuscle": "Biceps",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [5, 7, 13, 21, 31, 42, 50, 60]
    },
    {
        "name": "Tricep Pushdown",
        "primaryMuscle": "Triceps",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 18, 28, 42, 58, 76, 85, 95]
    },
    {
        "name": "Leg Press",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [50, 90, 145, 215, 295, 385, 430, 480]
    },
    {
        "name": "Leg Curl",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [15, 25, 40, 60, 85, 110, 125, 140]
    },
    {
        "name": "Leg Extension",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [20, 35, 55, 80, 110, 145, 165, 185]
    },
    {
        "name": "Calf Raise",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [20, 40, 65, 95, 130, 170, 190, 210]
    },
    {
        "name": "Lateral Raise",
        "primaryMuscle": "Shoulders",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [2, 5, 9, 14, 20, 27, 32, 38]
    },
    {
        "name": "Front Raise",
        "primaryMuscle": "Shoulders",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [2, 6, 11, 17, 24, 32, 38, 45]
    },
    {
        "name": "Dumbbell Bench Press",
        "primaryMuscle": "Chest",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [8, 14, 22, 32, 44, 58, 68, 78]
    },
    {
        "name": "Incline Dumbbell Press",
        "primaryMuscle": "Chest",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [6, 12, 19, 28, 40, 52, 62, 72]
    },
    {
        "name": "Dips",
        "primaryMuscle": "Chest",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 5, 15, 30, 50, 75, 90, 110] # Added weight
    },
    {
        "name": "Lat Pulldown",
        "primaryMuscle": "Back",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [25, 40, 55, 75, 95, 120, 135, 155]
    },
    {
        "name": "Cable Row",
        "primaryMuscle": "Back",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [25, 40, 60, 80, 105, 135, 150, 170]
    },
    {
        "name": "Shrugs",
        "primaryMuscle": "Back",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [15, 25, 35, 48, 62, 78, 90, 105]
    },
    {
        "name": "Face Pulls",
        "primaryMuscle": "Shoulders",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 15, 22, 32, 42, 55, 65, 75]
    },
    {
        "name": "Skull Crusher",
        "primaryMuscle": "Triceps",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 15, 25, 35, 50, 65, 75, 85]
    },
    {
        "name": "Hammer Curl",
        "primaryMuscle": "Biceps",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [5, 8, 14, 22, 32, 44, 52, 62]
    },
    {
        "name": "Barbell Curl",
        "primaryMuscle": "Biceps",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [15, 22, 32, 45, 60, 78, 90, 105]
    },
    {
        "name": "Romanian Deadlift",
        "primaryMuscle": "Legs",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [40, 60, 85, 115, 150, 185, 210, 235]
    }
]

async def main():
    db = Prisma()
    await db.connect()
    
    await db.exercisestandard.delete_many()
    await db.exercisedefinition.delete_many()
    print("Cleared existing Exercise Definitions and Standards.")

    inserted = 0
    for ex in EXERCISES:
        # Create ExerciseDefinition
        exercise_def = await db.exercisedefinition.create(
            data={
                "name": ex["name"],
                "primaryMuscle": ex["primaryMuscle"],
                "equipment": ex["equipment"],
                "trackingMetrics": ex["trackingMetrics"]
            }
        )
        
        # Create ExerciseStandard
        st = ex["standards"]
        await db.exercisestandard.create(
            data={
                "exerciseId": exercise_def.id,
                "sex": "M",
                "bodyweightMin": 65.0,
                "bodyweightMax": 75.0,
                "rankE": st[0],
                "rankD": st[1],
                "rankC": st[2],
                "rankB": st[3],
                "rankA": st[4],
                "rankS": st[5],
                "rankSS": st[6],
                "rankSSS": st[7]
            }
        )
        inserted += 1

    print(f"Successfully seeded {inserted} exercises into ExerciseDefinition.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
