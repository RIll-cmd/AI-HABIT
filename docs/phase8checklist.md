PHASE 8 — Fitness Module (3 Weeks)
Goal
Create a comprehensive workout system that integrates seamlessly with the Habit Engine while rewarding physical progress through RPG mechanics.
By the end of this phase, users should be able to:

Build workout plans
Log exercises
Track progressive overload
Record personal records
Use rest timers
View workout history
Earn Strength, Endurance, and Recovery stats
Complete workout missions from the Habit Engine
The gym should feel like one path to becoming stronger, not the entire game.
Overall Architecture
FITNESS MODULE

              Workout Planner
                     │
                     ▼
              Exercise Database
                     │
                     ▼
              Workout Session
                     │
      ┌──────────────┴───────────────┐
      ▼                              ▼

Exercise Logger Rest Timer

      ▼                              ▼

Progressive Overload Workout History

      ▼

Character Engine

      ▼

Strength
Endurance
Recovery
Notice
Everything still feeds into the Character Engine.
STEP 1 — Database Design
Exercise
The master database.

Exercise

id

name

category

muscleGroup

equipment

difficulty

description

instructions

videoUrl

image

createdAt
Example

Bench Press

Chest

Barbell

Intermediate
Workout Plan
WorkoutPlan

id

characterId

name

goal

difficulty

estimatedDuration

createdAt
Examples

Push Pull Legs

Upper Lower

Beginner Full Body

Powerlifting

Hypertrophy

Home Workout
Workout Session
Each gym visit.

WorkoutSession

id

characterId

planId

duration

completed

startedAt

finishedAt
Exercise Log
Every set.

ExerciseLog

id

sessionId

exerciseId

set

weight

reps

rpe

restTime
Never overwrite.
Historical data is extremely valuable.
Personal Records
PersonalRecord

id

characterId

exerciseId

weight

reps

estimated1RM

date
STEP 2 — Exercise Database
Preload
Around
80–120 exercises.
Categories

Chest

Back

Legs

Shoulders

Biceps

Triceps

Core

Cardio

Mobility
Equipment

Barbell

Dumbbell

Cable

Machine

Bodyweight

Resistance Band
Future AI uses this.
STEP 3 — Workout Plan Builder
Wizard.
Step 1
Goal

Build Muscle

Strength

Lose Weight

General Fitness
Step 2
Frequency

2

3

4

5

6

Days
Step 3
Workout Split

Push Pull Legs

Upper Lower

Full Body

Bro Split

Custom
Step 4
Review
Save
STEP 4 — Workout Session
When entering the gym.
Press

Start Workout
Timer starts.
Exercises appear.
Player completes them.
Session ends.
Reward calculated.
STEP 5 — Exercise Logger
Each exercise
Stores

Weight

Reps

Sets

RPE

Notes
Example

Bench Press

60kg

8

8

7

RPE 8
History never disappears.
STEP 6 — Rest Timer
Built-in timer.
Options

30 sec

60 sec

90 sec

120 sec

Custom
After timer
Notification

SYSTEM

Rest Complete.

Next Set Ready.
Very Solo Leveling.
STEP 7 — Progressive Overload Engine
This is the smartest part.
After every session
Compare
Current
↓
Previous
If user improved
Suggest increase.
Example

Last Week

Bench

60kg

8 reps

Today

60kg

10 reps

Suggestion

Increase to

62.5kg
Never force.
Recommend.
STEP 8 — Personal Records
Automatically detect.
Examples

New PR!

Bench Press

70kg

×5
Or

Longest Run

6.2km
Show animation.
Reward
EXP
Gold
Achievement
STEP 9 — Workout Rewards
Don't reward every exercise.
Reward the session.
Example

Workout Complete

EXP

220

Strength

+5

Endurance

+2

Recovery

+1

Gold

40
Stats depend on workout type.
Strength Workout
↓
Strength
Cardio
↓
Endurance
Stretching
↓
Recovery
Balanced.
STEP 10 — Workout History
Beautiful timeline.

Yesterday

Push Day

68 min

12 Exercises

Today

Leg Day

74 min

Personal Record
Later
Analytics.
STEP 11 — Voice Logging (Phase 1)
Keep it simple.
Instead of full AI.
Support

Bench Press

60

8
or

Bench 60 for 8
Convert
↓
Exercise Log
AI improvements come later.
STEP 12 — Character Integration
Every completed workout
Triggers

Workout

↓

Fitness Engine

↓

Progression Engine

↓

Character Engine

↓

Strength

Endurance

Recovery

↓

Dashboard
No duplicate logic.
STEP 13 — Dashboard Widgets
Add

Today's Workout

Workout Streak (Fitness Only)

Current PR

Weekly Volume

Recovery Status
Keep these secondary to Habit widgets.
STEP 14 — APIs
GET /exercises

GET /workouts

POST /workouts

POST /workouts/start

POST /workouts/finish

POST /workouts/log

GET /workouts/history

GET /workouts/prs
Future AI will use these endpoints.
STEP 15 — Folder Structure
features/

fitness/

components/

ExerciseCard.tsx

WorkoutPlanner.tsx

WorkoutSession.tsx

ExerciseLogger.tsx

RestTimer.tsx

PRPopup.tsx

WorkoutHistory.tsx

WorkoutSummary.tsx

services/

FitnessEngine.ts

ProgressiveOverload.ts

WorkoutPlanner.ts

PRDetector.ts

utils/

volumeCalculator.ts

oneRM.ts

restTimer.ts

types/

exercise.ts

workout.ts

session.ts

pr.ts
Everything fitness-related remains isolated.
Character Progression Mapping
This is something I'd add because it ties workouts directly to your RPG system.
Workout TypePrimary StatSecondary StatStrength TrainingStrengthDisciplineHypertrophyStrengthRecoveryCardioEnduranceRecoveryHIITEnduranceDisciplineMobility / StretchingRecoveryFocusYogaRecoveryFocusSportsEnduranceConsistency
This makes every type of exercise valuable instead of pushing users toward only heavy lifting.
Definition of Done
FeatureStatusExercise database✅Workout plan builder✅Workout session flow✅Workout boss feature✅Exercise logging✅Rest timer✅Progressive overload engine✅Personal Record tracking✅Workout history✅Workout reward calculation✅Character stat integration✅Voice logging (basic)✅Fitness APIs✅Unit tests for overload & PR detection✅A feature I'd add that fits your vision: Workout Bosses
Instead of every workout being a normal session, let users mark one workout each week as a Boss Workout.
For example:

Weekly Boss Workout

Objective:
Bench Press
Target: 80 kg × 5

Current Success Chance:
78%

Rewards:
+500 EXP
+100 Gold
+1 Skill Point
Rare Equipment Chest
The Boss Workout isn't part of the Tower—it's a real-world challenge generated from the user's own progress. It bridges your fitness system with your RPG loop, making personal records feel like defeating mini-bosses before returning to climb the Tower. This reinforces your core idea that real-life improvement powers the game, rather than the game replacing real-life effort.
