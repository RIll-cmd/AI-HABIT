Yes — I would add this. In fact, I think **Exercise Rank** should become one of the signature features of your Workout system.

But there is one important change I'd make to your idea:

> **Don't rank someone from weight alone. Rank the performance relative to bodyweight, sex, exercise, equipment, and reps.**

For example, **20 kg on a bicep curl** means very different things if it's:

- 20 kg barbell for 1 rep
- 20 kg dumbbell **per hand** for 10 reps
- 20 kg cable stack
- 20 kg machine curl

Strength standards such as Strength Level already account for exercise and bodyweight, and their standards are based on large collections of logged lifts. For example, their male dumbbell-curl standards put 21 kg at Intermediate and 31 kg at Advanced for a 1RM, while their barbell-curl standards use completely different numbers. ([Strength Level][1])

So I'd build your system like this.

# 4. 🏋️ WORKOUTS — COMPLETE SYSTEM

## Purpose

The Workout system is the **30% fitness component** of your application.

It should function as:

> **Workout tracker + exercise database + progression system + strength ranking + RPG progression**

The user isn't just recording:

```text
Bench Press
60 kg × 8
```

The system interprets it:

```text
Bench Press
60 kg × 8

Estimated 1RM
76 kg

Exercise Rank
C

Strength Progress
↑ 4%

Character Impact
+Strength EXP

Personal Record
New rep PR
```

That makes the workout system much more connected to the rest of your RPG.

---

# 1. 🏋️ Workout Home

The main Workout page should show:

```text
╔════════════════════════════════════════════╗
║             WORKOUT                        ║
╠════════════════════════════════════════════╣
║                                            ║
║  TODAY                                     ║
║  PUSH DAY                                  ║
║                                            ║
║  5 Exercises                               ║
║  ~58 Minutes                               ║
║                                            ║
║       [ START WORKOUT ]                    ║
║                                            ║
╠════════════════════════════════════════════╣
║  FITNESS POWER                             ║
║                                            ║
║  Strength       A                          ║
║  Endurance      B                          ║
║  Recovery       C                          ║
║                                            ║
╠════════════════════════════════════════════╣
║  RECENT PRs                                ║
║                                            ║
║  Bench Press       80 kg                   ║
║  Squat             110 kg                  ║
║  Deadlift          140 kg                  ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

# 2. 📚 Exercise Database

This should be a major component.

Categories:

### Chest

- Barbell Bench Press
- Incline Bench Press
- Decline Bench Press
- Dumbbell Bench Press
- Incline Dumbbell Press
- Chest Press
- Dumbbell Fly
- Cable Fly
- Pec Deck
- Push-Up
- Dips

### Back

- Deadlift
- Barbell Row
- T-Bar Row
- Dumbbell Row
- Seated Cable Row
- Lat Pulldown
- Pull-Up
- Chin-Up
- Machine Row

### Shoulders

- Overhead Press
- Dumbbell Shoulder Press
- Arnold Press
- Lateral Raise
- Cable Lateral Raise
- Front Raise
- Rear Delt Fly
- Face Pull

### Biceps

- Barbell Curl
- Dumbbell Curl
- Hammer Curl
- Incline Dumbbell Curl
- Preacher Curl
- Cable Curl
- Machine Curl

### Triceps

- Close-Grip Bench Press
- Skull Crusher
- Tricep Pushdown
- Rope Pushdown
- Overhead Tricep Extension
- Dips

### Legs

- Back Squat
- Front Squat
- Leg Press
- Hack Squat
- Romanian Deadlift
- Stiff-Leg Deadlift
- Leg Extension
- Leg Curl
- Bulgarian Split Squat
- Lunges
- Calf Raise

### Core

- Sit-Up
- Crunch
- Hanging Leg Raise
- Ab Wheel
- Plank

### Cardio

- Running
- Cycling
- Rowing
- Swimming
- Stair Climber
- Walking

---

# 3. Exercise Information

Every exercise should have its own database entry.

Example:

```text
BARBELL BENCH PRESS

Primary Muscle
Chest

Secondary
Triceps
Front Delts

Equipment
Barbell

Movement
Push

Difficulty
Intermediate

Tracking
Weight
Reps
Sets

Ranking
Supported ✓

PR
Supported ✓
```

For exercises where external load isn't meaningful, such as planks, you should use different metrics.

---

# 4. ⚔️ EXERCISE RANK

This is the feature I would make unique to your app.

Instead of only:

```text
Bench Press
80 kg
```

show:

```text
BENCH PRESS

80 KG × 5

RANK
A

██████████████░░░

You are stronger than
approximately X% of
comparable lifters.
```

The exact percentile should come from your selected standards dataset, rather than being invented.

Strength Level describes its categories approximately as Beginner >5%, Novice >20%, Intermediate >50%, Advanced >80%, Elite >95% of lifters. ([Strength Level][2])

---

# 5. Your RPG Rank Mapping

I'd convert conventional strength levels into your RPG ranks:

| Fitness Standard              | Your Rank |
| ----------------------------- | --------- |
| Below Beginner                | E         |
| Beginner                      | D         |
| Novice                        | C         |
| Intermediate                  | B         |
| Advanced                      | A         |
| Elite                         | S         |
| Exceptional / custom top tier | SS        |
| Exceptional competitive level | SSS       |

So:

```text
E
↓
D
↓
C
↓
B
↓
A
↓
S
↓
SS
↓
SSS
```

This fits perfectly with your existing character rank system.

### Important:

**S should not mean "good."**

S should mean **exceptional performance**.

---

# 6. Example — Bicep Curl

Let's say the user enters:

```text
Dumbbell Curl

20 kg
8 reps
```

The app should first determine whether that means:

```text
20 kg PER DUMBBELL
```

Then estimate 1RM.

Using the Epley formula:

```text
Estimated 1RM
= Weight × (1 + Reps / 30)

= 20 × (1 + 8/30)

≈ 25.3 kg
```

Then compare that against the user's:

```text
Sex
Bodyweight
Exercise
Equipment
Estimated 1RM
```

Strength Level's male dumbbell-curl community standards are approximately:

```text
Beginner       7 kg
Novice        13 kg
Intermediate  21 kg
Advanced      31 kg
Elite         42 kg
```

for the exercise's 1RM metric. ([Strength Level][1])

So 25.3 kg would fall between Intermediate and Advanced.

Your RPG system could therefore display:

```text
DUMBBELL CURL

20 KG × 8

Estimated 1RM
25.3 KG

RANK
B+

Next Rank
A

Required estimated 1RM
≈31 KG
```

**This is much better than arbitrarily saying 20 kg = A.**

If you specifically want **20 kg dumbbells to feel like A-rank**, you could change the game's rank thresholds, but then you should label them as **your app's custom RPG standards**, not as real-world averages.

---

# 7. Don't Use One Global Ranking Table

This is extremely important.

Don't do:

```text
20 kg = A
40 kg = S
60 kg = SS
```

for every exercise.

Because:

```text
20 kg Bench Press
```

and

```text
20 kg Lateral Raise
```

are completely different performances.

Instead:

```text
Exercise
   ↓
Exercise-specific standard
   ↓
Bodyweight adjustment
   ↓
Sex category
   ↓
Performance metric
   ↓
Rank
```

---

# 8. Bodyweight Matters

For major compound movements, the system should normalize performance against bodyweight.

For example, Strength Level's male bench-press standards change significantly with bodyweight: at 70 kg bodyweight, their community thresholds are approximately 47/64/85/110/136 kg for Beginner through Elite; at 100 kg bodyweight they're approximately 73/95/120/149/179 kg. ([Strength Level][3])

So your app shouldn't tell:

```text
100 kg bench = S
```

for everyone.

Instead:

```text
USER

Bodyweight:
70 kg

Bench:
100 kg

RANK:
A/S
```

while another user:

```text
Bodyweight:
100 kg

Bench:
100 kg

RANK:
B
```

That is considerably more meaningful.

---

# 9. Exercise Rank Card

Every ranked exercise should have a card:

```text
┌──────────────────────────────────────┐
│ ⚔ BARBELL BENCH PRESS                │
│                                      │
│ CURRENT                              │
│ 80 KG × 5                            │
│                                      │
│ EST. 1RM                             │
│ 93 KG                                │
│                                      │
│ RANK                                 │
│             A                        │
│                                      │
│ ████████████████░░                   │
│                                      │
│ NEXT RANK                            │
│ S                                    │
│                                      │
│ Required                             │
│ ~110 KG 1RM                          │
│                                      │
│ PR                                   │
│ ✓ New 5-rep PR                      │
└──────────────────────────────────────┘
```

---

# 10. Rank Progression

The user should always know:

> **How do I reach the next rank?**

Example:

```text
DUMBBELL CURL

Rank B

Current:
25.3 kg estimated 1RM

Next:
A

Target:
31 kg estimated 1RM

Progress:

██████████████░░░ 82%
```

This gives the workout system its own progression loop.

---

# 11. Rank History

Track rank over time.

```text
BENCH PRESS

Aug 1
C

Aug 15
C+

Sep 2
B

Oct 10
B+

Nov 20
A
```

Then show:

```text
RANK HISTORY

E → D → C → B → A
```

That is much more satisfying than just seeing weight numbers.

---

# 12. Exercise PRs

You need several types of PR.

### Weight PR

```text
Previous:
70 kg

New:
75 kg
```

### Rep PR

```text
60 kg × 10

NEW REP PR
```

### Estimated 1RM PR

```text
Previous e1RM:
80 kg

New e1RM:
84 kg
```

### Volume PR

```text
Previous:
3,500 kg

New:
4,100 kg
```

### Rank PR

This is the coolest one:

```text
🔥 RANK UP

Bench Press

B → A
```

---

# 13. Workout → Rank

Your workout should automatically evaluate every qualifying exercise.

Example:

```text
WORKOUT COMPLETE

PUSH DAY

Bench Press
80 × 5
Rank A

Incline DB Press
30 × 8
Rank B

Shoulder Press
25 × 8
Rank B

Lateral Raise
10 × 12
Rank A

Tricep Pushdown
45 × 10
Rank B
```

Then:

```text
WORKOUT RESULT

Strength EXP
+420

EXP
+180

Gold
+120

PRs
2

Rank Ups
1
```

---

# 14. 🧬 Exercise Rank vs Character Rank

Don't mix these.

Your user can have:

```text
CHARACTER

Level 24
Rank A
Power 4,820
```

while:

```text
BENCH PRESS
A

SQUAT
B

DEADLIFT
A

BICEP CURL
S

RUNNING
C
```

This creates a very interesting character profile.

---

# 15. Overall Fitness Rank

You can calculate an overall fitness rank from multiple exercises.

For example:

```text
FITNESS RANK

Strength
A

Upper Body
A

Lower Body
B

Endurance
B

Overall
A
```

But don't simply average every exercise.

You could weight major movements more heavily.

Example:

```text
Squat
25%

Bench
20%

Deadlift
25%

Pull
15%

Endurance
15%
```

Or let the user select a goal:

```text
Strength
Hypertrophy
Athletic
Endurance
General Fitness
```

Then the weighting changes.

---

# 16. Different Ranking Metrics

Not every exercise should use 1RM.

### Barbell exercises

Use:

```text
Estimated 1RM
```

Examples:

- Bench
- Squat
- Deadlift
- Overhead Press
- Barbell Row

### Dumbbell exercises

Use:

```text
Per-hand load
+
reps
+
estimated 1RM
```

### Machines

Use:

```text
Machine-specific standard
```

because machine resistance varies between manufacturers.

For example, Strength Level has separate standards for machine/cable exercises rather than assuming every exercise is interchangeable. Their cable bicep-curl standards, for example, differ substantially from barbell-curl standards. ([Strength Level][4])

### Bodyweight

Use:

```text
Reps
OR
Added weight
```

Examples:

```text
Push-Up
50 reps

Pull-Up
15 reps

Weighted Pull-Up
+20 kg × 5
```

### Running

Use:

```text
Distance
Time
Pace
```

Not kilograms.

---

# 17. Running Rank

For running:

```text
5 KM

Time:
24:32

Pace:
4:54/km

Rank:
B
```

Possible ranking categories:

```text
E
D
C
B
A
S
SS
SSS
```

And you can eventually support:

```text
1 KM
3 KM
5 KM
10 KM
Half Marathon
Marathon
```

The ranking should be distance-specific.

---

# 18. Pull-Up Rank

For bodyweight exercises:

```text
PULL-UP

12 reps

RANK
A

Next:
S

Required:
18 reps
```

For weighted:

```text
WEIGHTED PULL-UP

Bodyweight:
70 kg

Added:
+25 kg

Reps:
5

Estimated performance:
...

Rank:
S
```

This is much more useful than simply recording "12 pull-ups."

---

# 19. Exercise Standards Database

I would actually make this a dedicated database table.

```text
ExerciseStandard

id
exercise_id
sex
bodyweight_min
bodyweight_max

beginner_threshold
novice_threshold
intermediate_threshold
advanced_threshold
elite_threshold

metric_type
source
version
```

Example:

```text
Bench Press

Male
70 kg

Beginner:
47

Novice:
64

Intermediate:
85

Advanced:
110

Elite:
136
```

Those example thresholds come from Strength Level's 70 kg male bench table. ([Strength Level][3])

Then your application doesn't hard-code:

```text
if weight > 100:
    rank = S
```

Instead it performs an actual lookup.

---

# 20. Source / Standards Transparency

I'd add this to the exercise page:

```text
RANKING STANDARD

Based on community strength
standards.

Last updated:
2026

Population:
Male / 70 kg

Metric:
Estimated 1RM

[ View Standard ]
```

This is important because these aren't universal laws of human strength. They're comparison standards from a particular dataset.

Strength Level says its standards are based on user-submitted lifts and describes its categories in percentile-like terms; your app should therefore present them as **comparison standards**, not medical or universal fitness requirements. ([Strength Level][2])

---

# 21. Progressive Overload

Now connect ranking to progression.

Example:

```text
BENCH PRESS

Current Rank:
B

Last workout:
60 × 8

Current:
60 × 10

System:

Your estimated 1RM increased
from 76 kg → 80 kg.

Progress:
+5.2%

Recommendation:

Try 62.5 kg × 8
```

But make the recommendation conservative and based on the user's logged performance/RPE rather than blindly increasing weight.

---

# 22. RPE

Record:

```text
RPE
1–10
```

Example:

```text
Bench Press

60 kg × 8

RPE:
7
```

Then your system knows:

```text
User completed target
+
RPE was low
```

Potential recommendation:

```text
Increase load slightly next session.
```

Whereas:

```text
60 kg × 8
RPE 10
```

would suggest maintaining or reducing load/volume rather than automatically increasing it.

---

# 23. Workout Session

Your actual workout screen:

```text
╔════════════════════════════════════╗
║ PUSH DAY                           ║
║ 42:18                              ║
╠════════════════════════════════════╣
║                                    ║
║ BENCH PRESS                        ║
║                                    ║
║ Set 1    60 kg × 8     ✓           ║
║ Set 2    60 kg × 8     ✓           ║
║ Set 3    62.5 kg × 6   ✓           ║
║                                    ║
║ RPE       8                         ║
║                                    ║
║ Current Rank: B                    ║
║                                    ║
║ [ REST 02:00 ]                     ║
╠════════════════════════════════════╣
║                                    ║
║ NEXT                                ║
║ Incline Dumbbell Press             ║
║                                    ║
╚════════════════════════════════════╝
```

---

# 24. Rest Timer

When a set is completed:

```text
SET COMPLETE ✓

60 kg × 8

RPE 8

REST

02:00

[ SKIP ]
```

Preset:

```text
30 sec
60 sec
90 sec
120 sec
180 sec
Custom
```

---

# 25. Workout Templates

Support:

```text
Push
Pull
Legs

Upper
Lower

Full Body

Custom
```

But don't force users into PPL.

The app should allow:

```text
Custom Workout
```

because your application is supposed to support many lifestyles.

---

# 26. Workout → Habit

This is another important connection.

A workout plan can create a recurring habit:

```text
Workout:

Push Day

Schedule:
Monday / Thursday
```

becomes:

```text
HABIT

Push Workout

Mon / Thu

↓

MISSION

Push Workout — Today
```

Then:

```text
Complete Workout
       ↓
Mission Complete
       ↓
EXP
Gold
Strength
       ↓
Exercise Rank
       ↓
Boss Damage
```

Now your entire system connects.

---

# 27. Workout → Real-Life Boss

Example:

```text
BOSS

100 KG BENCH PRESS

HP:
5,000
```

User does:

```text
80 kg × 8
```

The system records:

```text
Workout Progress
+Strength

PR tracking

Boss Damage
+350
```

Eventually:

```text
Estimated 1RM

101 kg

↓

👹 BOSS DEFEATED

100 KG BENCH PRESS
```

That's a **fantastic use of your Boss system**.

---

# 28. Workout → Tower

This is different.

The workout doesn't directly beat the Tower.

Instead:

```text
Workout
 ↓
Strength / Endurance / Recovery
 ↓
Character Stats
 ↓
Power
 ↓
Tower Combat
```

So your original rule stays intact:

> **The Tower is defeated by the character's accumulated strength, not by simply completing habits.**

---

# 29. AI Workout Analysis

Ciel can analyze the actual data.

Example:

> **Ciel:** "Your bench press has increased from an estimated 72 kg 1RM to 86 kg over the last eight weeks. Your current rank is B, and you're approximately 8 kg from the A threshold for your current bodyweight category."

Or:

> **Ciel:** "Your pushing strength is improving faster than your pulling strength. Your bench is Rank A, while your row is Rank C. Consider adding another pulling movement to your weekly plan."

That's where your AI becomes genuinely useful.

---

# 30. Voice Logging

Eventually:

> "Ciel, I just finished bench press. 60 kilos, 8 reps, three sets."

AI converts it to:

```text
BENCH PRESS

Set 1
60 × 8

Set 2
60 × 8

Set 3
60 × 8
```

Then:

```text
Rank calculated
PR checked
EXP calculated
Stats updated
Boss damage calculated
```

---

# 31. Your Final Workout Progression Loop

This is what I'd ultimately aim for:

```text
                  🏋️ WORKOUT
                       │
              ┌────────┴────────┐
              │                 │
           EXERCISE          SESSION
              │                 │
              ▼                 ▼
          Sets/Reps/Weight    RPE
              │                 │
              └────────┬────────┘
                       ▼
                 PERFORMANCE
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        PRs          RANK        PROGRESSION
          │            │            │
          │            ▼            │
          │       E D C B A S       │
          │         SS SSS           │
          │                          │
          └────────────┬─────────────┘
                       ▼
              CHARACTER PROGRESS
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
           Strength Endurance Recovery
              │        │        │
              └────────┼────────┘
                       ▼
                     POWER
                       │
                       ▼
                   🏰 TOWER
```

And separately:

```text
WORKOUT
   │
   ▼
REAL-WORLD BOSS
   │
   ▼
DAMAGE
   │
   ▼
👹 BOSS DEFEATED
```

## One thing I'd lock down before coding

For your MVP, I would **not try to rank every exercise immediately**.

Start with perhaps **20–30 highly standardized exercises**:

**Bench Press, Squat, Deadlift, Overhead Press, Barbell Row, Dumbbell Curl, Barbell Curl, Lat Pulldown, Pull-Up, Chin-Up, Leg Press, Leg Extension, Leg Curl, Romanian Deadlift, Tricep Pushdown, Dumbbell Bench, Incline Dumbbell Bench, Shoulder Press, Lateral Raise, Push-Up, Bodyweight Squat, Plank, 1K Run, 5K Run, 10K Run.**

Then build the ranking engine correctly around **exercise + sex + bodyweight + reps + load + equipment + estimated 1RM**. Once that works, you can expand the exercise database.

That will make the Workout section feel like a **real fitness progression system**, rather than just a workout logger. ([Strength Level][3])

[1]: https://strengthlevel.com/strength-standards/dumbbell-curl/kg?utm_source=chatgpt.com "Dumbbell Curl Standards for Men and Women (kg) - Strength Level"
[2]: https://strengthlevel.com/strength-standards/lat-pulldown/kg?utm_source=chatgpt.com "Lat Pulldown Standards for Men and Women (kg) - Strength Level"
[3]: https://strengthlevel.com/strength-standards/bench-press/kg?utm_source=chatgpt.com "Bench Press Standards for Men and Women (kg) - Strength Level"
[4]: https://strengthlevel.com/strength-standards/cable-bicep-curl/kg?utm_source=chatgpt.com "Cable Bicep Curl Standards for Men and Women (kg) - Strength Level"
