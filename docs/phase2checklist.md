This is where your app actually **becomes an RPG**.

Phase 1 built the **operating system** (authentication, navigation, layouts, onboarding).

Phase 2 builds the **Character Engine**, which is the heart of your application.

Every feature in the future—AI, habits, workouts, tower, inventory—will interact with the Character Engine.

> **If Phase 1 is the skeleton, Phase 2 is the heart.**

---

# PHASE 2 — Character Engine (2–3 Weeks)

## Goal

At the end of this phase, the player should have a persistent RPG character.

The player won't have habits or towers yet, but they'll already feel like they own a character that can grow.

---

# Deliverables

By the end of Phase 2, the user can:

- View their character
- See Level, Rank, Power
- View Stats
- Gain EXP (test button)
- Level Up
- View progression history
- Customize profile
- See animations when leveling

Still no habits.

Still no Tower.

Everything is simulated.

---

# Architecture

```id="d9k3aq"
Character Engine

│

├── Level System

├── EXP System

├── Stats

├── Rank

├── Power Score

├── Titles

├── Progress History

├── Character Profile

└── Character UI
```

Everything else will connect here later.

---

# STEP 1 — Database Expansion

Expand your Prisma schema.

Instead of only

```id="q9rjtu"
User

Character
```

Now create

## Character

```id="j3a0zl"
id

userId

name

avatar

theme

title

level

exp

expToNext

power

rank

gold

createdAt

updatedAt
```

---

## CharacterStats

Separate table.

```id="rnk02l"
id

characterId

strength

knowledge

discipline

focus

endurance

recovery

consistency
```

Never store stats inside Character.

Keep them normalized.

---

## ProgressHistory

```id="8y9qwf"
id

characterId

type

amount

description

createdAt
```

Example

```id="hbk17n"
EXP +50

Level Up

Power +12

Title Changed
```

Later

Habits

AI

Tower

will all write here.

---

# STEP 2 — Character Model

Design the RPG identity.

---

## Character

Display

```id="b8dbz6"
Avatar

Name

Level

Rank

Power

Title
```

Example

```id="nnbdbm"
Level 12

Rank E

Power 1,280

Title

The Wanderer
```

---

## Character Card

Large card.

Should become the centerpiece.

Contains

```id="6g1ntb"
Avatar

Rank Badge

Power

Current EXP

Current Title

Theme Color
```

---

# STEP 3 — Stats

Design them carefully.

Every stat should have ONE clear purpose.

| Stat        | Real Life        | Future RPG Effect                 |
| ----------- | ---------------- | --------------------------------- |
| Strength    | Exercise         | Physical attack                   |
| Knowledge   | Reading, Study   | Magic damage & puzzles            |
| Discipline  | Consistency      | Defense & resistance              |
| Recovery    | Sleep, Rest      | Healing & HP regeneration         |
| Endurance   | Cardio           | Maximum HP & stamina              |
| Focus       | Deep work        | Critical chance & accuracy        |
| Consistency | Long-term habits | Luck, loot quality, Tower bonuses |

Don't create unnecessary stats.

Every stat should matter.

---

# STEP 4 — EXP System

Build a reusable EXP engine.

Don't write calculations inside components.

Instead

```id="d7w0yx"
lib/

progression/

calculateEXP.ts

calculateLevel.ts

calculatePower.ts

calculateRank.ts
```

---

Functions

```id="w1ns9v"
gainEXP()

levelUp()

loseEXP()

getNextLevel()

getProgress()

calculatePower()
```

Everything future modules use should call these functions.

---

# STEP 5 — Level Formula

Avoid

```id="v6m13t"
Level = EXP / 100
```

Too boring.

Instead

Use exponential growth.

Example

```id="v6cw7t"
Level 1

100 EXP

Level 2

250 EXP

Level 3

450 EXP

Level 4

700 EXP

...
```

This makes later levels feel rewarding.

---

# STEP 6 — Power Formula

Power isn't just Level.

It should represent the character's overall capability.

Example

```id="9i5ec7"
Power =

(Level × 50)

+

Total Stats × 10

+

Equipment Bonus

+

Titles

+

Achievements
```

Right now

Equipment

Achievements

= 0

Later

Those values plug in automatically.

---

# STEP 7 — Rank System

Ranks feel more exciting than levels.

Example

```id="98v6gc"
F

E

D

C

B

A

S

SS

SSS
```

Ranks depend on Power.

Example

```id="s7zv5q"
Power

0-500

↓

F

500-1500

↓

E

1500-3000

↓

D
```

The thresholds should live in configuration files, not hard-coded into components.

---

# STEP 8 — Titles

Titles are cosmetic.

Examples

```id="mkn08e"
The Wanderer

The Curious

The Scholar

The Survivor

The Rookie
```

No bonuses.

Just identity.

---

# STEP 9 — Character Profile Page

This should become one of your best-looking pages.

Sections

```id="njzbvl"
Avatar

Basic Info

Stats

Progress

Titles

History
```

Even if some are empty.

---

# STEP 10 — Character Animations

Every RPG needs satisfying feedback.

Examples

Level Up

EXP Gain

Power Increase

Rank Promotion

Use Framer Motion.

Nothing flashy.

Just polished.

---

# STEP 11 — Mock Progression

Since Habits don't exist yet...

Create a temporary button.

```id="u6jvhn"
Gain 100 EXP
```

Click

↓

Character gains EXP.

↓

Maybe levels.

↓

Power recalculates.

↓

History updates.

This lets you fully test your progression engine before connecting it to habits.

---

# STEP 12 — Progress History

Every important action should appear here.

Example

```id="vq1nfh"
+100 EXP

Level 4 Reached

Power +80

Title Changed
```

Later

The AI

Tower

Habits

Bosses

All write here.

Think of it as the player's timeline.

---

# STEP 13 — Character Settings

Allow the user to change

Avatar

Theme

Display Name

Title (if unlocked)

Not gameplay stats.

---

# STEP 14 — Character API

Your backend should already expose stable endpoints.

Example

```id="1oz0hn"
GET

/character

PATCH

/character

GET

/character/stats

POST

/character/exp

GET

/character/history
```

Future systems won't touch the database directly.

They'll call these APIs.

---

# STEP 15 — Testing

Test

Level calculation

Power calculation

Rank calculation

EXP overflow

Level up

Multiple level ups

Maximum level

Future-proof the engine now.

---

# UI Pages

At the end of Phase 2, your app should contain:

```id="w0xvfe"
/dashboard

/profile

/profile/stats

/profile/history

/profile/customize
```

The navigation from Phase 1 should now lead to real pages.

---

# Folder Structure

Expand your project like this:

```id="qh8r0s"
features/

character/

components/

CharacterCard.tsx

LevelBar.tsx

StatGrid.tsx

RankBadge.tsx

TitleBadge.tsx

ProgressHistory.tsx

hooks/

useCharacter.ts

services/

character.service.ts

utils/

calculatePower.ts

calculateRank.ts

calculateEXP.ts

types/

character.ts

stats.ts
```

Keep all Character logic isolated inside its feature folder.

---

# Definition of Done (End of Phase 2)

| Feature                              | Status |
| ------------------------------------ | ------ |
| Character persists in the database   | ✅     |
| Character profile page complete      | ✅     |
| Stats table implemented              | ✅     |
| EXP system working                   | ✅     |
| Level progression working            | ✅     |
| Rank calculation working             | ✅     |
| Power calculation working            | ✅     |
| Progress history recorded            | ✅     |
| Profile customization working        | ✅     |
| Character animations implemented     | ✅     |
| Character APIs tested                | ✅     |
| Unit tests for progression functions | ✅     |

---

# One architectural improvement I'd make

I would introduce a **Game Engine** abstraction now, even though most of its features won't exist until later.

Instead of having habits directly modify the database in future phases, every gameplay action should pass through a central service:

```text
Habit Completed
        │
        ▼
Game Engine
        │
 ├── Calculate EXP
 ├── Update Stats
 ├── Recalculate Power
 ├── Check Level Up
 ├── Check Achievements
 ├── Write History
 └── Trigger Notifications
```

That way, when you add AI-generated missions, workouts, Tower rewards, achievements, or inventory, they all use the same progression pipeline. This keeps the project modular, easier to test, and much closer to how large game backends and complex SaaS applications are designed.
