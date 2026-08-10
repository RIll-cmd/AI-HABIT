import asyncio
from prisma import Prisma

EXERCISES = [
    # CHEST
    {
        "name": "Barbell Bench Press",
        "primaryMuscle": "Chest",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [30, 50, 70, 95, 120, 145, 165, 185]
    },
    {
        "name": "Incline Dumbbell Press",
        "primaryMuscle": "Chest",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 18, 26, 36, 48, 60, 72, 85]
    },
    {
        "name": "Chest Flyes",
        "primaryMuscle": "Chest",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [6, 12, 18, 25, 34, 44, 54, 65]
    },
    {
        "name": "Dips",
        "primaryMuscle": "Chest",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 10, 20, 35, 55, 75, 95, 115]
    },
    {
        "name": "Push-ups",
        "primaryMuscle": "Chest",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 5, 15, 30, 45, 65, 85, 105]
    },

    # BACK
    {
        "name": "Barbell Deadlift",
        "primaryMuscle": "Back",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [40, 75, 110, 150, 190, 230, 260, 290]
    },
    {
        "name": "Lat Pulldown",
        "primaryMuscle": "Back",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [25, 45, 65, 85, 105, 130, 150, 170]
    },
    {
        "name": "Bent-over Barbell Row",
        "primaryMuscle": "Back",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [25, 45, 65, 88, 115, 140, 160, 180]
    },
    {
        "name": "Seated Cable Row",
        "primaryMuscle": "Back",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [25, 45, 65, 88, 115, 140, 160, 180]
    },
    {
        "name": "Pull-ups",
        "primaryMuscle": "Back",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 5, 15, 30, 50, 70, 90, 110]
    },

    # LEGS
    {
        "name": "Barbell Back Squat",
        "primaryMuscle": "Legs",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [35, 65, 95, 130, 165, 200, 230, 260]
    },
    {
        "name": "Romanian Deadlift",
        "primaryMuscle": "Legs",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [35, 60, 90, 125, 160, 195, 220, 250]
    },
    {
        "name": "Leg Press",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [60, 110, 170, 240, 320, 410, 470, 530]
    },
    {
        "name": "Lying Leg Curl",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [15, 30, 45, 65, 90, 115, 135, 155]
    },
    {
        "name": "Calf Raises",
        "primaryMuscle": "Legs",
        "equipment": "Machine",
        "trackingMetrics": "Weight, Reps",
        "standards": [20, 45, 75, 110, 150, 190, 220, 250]
    },

    # SHOULDERS
    {
        "name": "Overhead Barbell Press",
        "primaryMuscle": "Shoulders",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [20, 35, 50, 68, 88, 108, 125, 140]
    },
    {
        "name": "Dumbbell Lateral Raise",
        "primaryMuscle": "Shoulders",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [4, 8, 14, 20, 28, 36, 44, 52]
    },
    {
        "name": "Face Pulls",
        "primaryMuscle": "Shoulders",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 18, 28, 40, 55, 70, 85, 100]
    },
    {
        "name": "Arnold Press",
        "primaryMuscle": "Shoulders",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [8, 14, 22, 32, 44, 56, 68, 80]
    },

    # ARMS
    {
        "name": "Dumbbell Bicep Curl",
        "primaryMuscle": "Arms",
        "equipment": "Dumbbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [5, 10, 15, 20, 25, 30, 38, 45]
    },
    {
        "name": "Barbell Preacher Curl",
        "primaryMuscle": "Arms",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [12, 20, 30, 42, 56, 72, 85, 100]
    },
    {
        "name": "Tricep Rope Pushdown",
        "primaryMuscle": "Arms",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 20, 32, 46, 62, 80, 95, 110]
    },
    {
        "name": "Skullcrushers",
        "primaryMuscle": "Arms",
        "equipment": "Barbell",
        "trackingMetrics": "Weight, Reps",
        "standards": [12, 20, 30, 42, 56, 72, 85, 100]
    },

    # CORE/ABS
    {
        "name": "Cable Woodchoppers",
        "primaryMuscle": "Core",
        "equipment": "Cable",
        "trackingMetrics": "Weight, Reps",
        "standards": [10, 18, 28, 40, 54, 70, 85, 100]
    },
    {
        "name": "Hanging Leg Raises",
        "primaryMuscle": "Core",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 5, 12, 22, 35, 50, 65, 80]
    },
    {
        "name": "Planks",
        "primaryMuscle": "Core",
        "equipment": "Bodyweight",
        "trackingMetrics": "Weight, Reps",
        "standards": [0, 10, 25, 45, 70, 100, 130, 160]
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

    print(f"Successfully seeded {inserted} exercises across Chest, Back, Legs, Shoulders, Arms, and Core.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
