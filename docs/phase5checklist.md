I think this is where your project becomes **something recruiters remember**.

Everything before this phase is productivity software.

**Phase 5 is where you build the actual game.**

And I think we should change one thing before we start.

> **The Tower should NOT be another habit tracker.**

The Tower should be a completely separate RPG mode.

Players spend the day improving themselves through habits.

When they're ready...

They enter the Tower.

The Tower tests the character they've built.

---

# PHASE 5 — TOWER ENGINE (4–5 Weeks)

## Goal

Build an AI-powered RPG dungeon where players use the stats they earned from real life to conquer increasingly difficult Tower floors.

By the end of this phase, users should be able to:

- Enter the Tower
- Browse every floor
- Challenge unlocked floors
- Fight enemies automatically
- Defeat bosses
- Obtain loot
- Equip rewards
- Unlock new floors

The Tower should feel like a completely different application inside your app.

---

# Tower Philosophy

Separate reality from gameplay.

```text
Real Life
──────────────

Habits

↓

Workout

↓

Study

↓

Sleep

↓

Character Growth

──────────────

Game World

Tower

↓

Combat

↓

Loot

↓

Equipment

↓

Power

↓

Harder Floors
```

Players don't beat the Tower by checking off habits.

They beat it because they built a stronger character.

---

# Overall Architecture

```text
                 TOWER ENGINE

                 Tower Map
                     │
                     ▼
              Floor Selection
                     │
                     ▼
           Requirement Validator
                     │
                     ▼
             Combat Simulator
                     │
         ┌───────────┴────────────┐
         ▼                        ▼

      Victory                 Defeat

         │                        │

         ▼                        ▼

 Reward Engine           AI Analysis

         │                        │

         ▼                        ▼

 Inventory             Training Advice

         │

         ▼

 Character Engine
```

---

# STEP 1 — Database

## Tower

```text
Tower

id

name

description

maxFloor

theme

background

createdAt
```

Example

```text
Tower of Ascension

100 Floors
```

---

## Floor

Every floor is its own entity.

```text
Floor

id

towerId

floorNumber

recommendedPower

recommendedLevel

minimumStrength

minimumKnowledge

minimumRecovery

minimumDiscipline

minimumFocus

minimumEndurance

bossId

background

music

rewardPool
```

---

## Floor Progress

```text
FloorProgress

id

characterId

floorNumber

status

bestTime

attempts

clearedAt
```

Status

```text
Locked

Unlocked

Cleared

Perfect
```

---

# STEP 2 — Tower Map

The Tower should NOT be a list.

Imagine

```text
Floor 100

▲

99

▲

98

▲

Boss

90

▲

...

20

▲

Boss

10

▲

...

1
```

Each floor should look like a stone platform.

Boss floors larger.

Animated.

The player climbs upward.

---

# STEP 3 — Floor Information

Before entering

Display

```text
Floor 18

────────────

Power

5500

Required

Strength

120

Knowledge

85

Recovery

60

Enemy

Stone Guardian

Rewards

Epic Chest
```

Everything visible.

No surprises.

---

# STEP 4 — Entry Validation

Before combat

The system checks.

```text
Current Power

↓

Enough?

↓

Stats

↓

Requirements

↓

Unlocked?

↓

Enter
```

Otherwise

```text
Tower Access Denied

Power too low.

Need

Strength

120

Current

104
```

---

# STEP 5 — Enemy Database

Create a complete monster system.

```text
Enemy

id

name

type

rarity

hp

attack

defense

speed

criticalChance

weakness

dropTable

lore

image
```

Types

```text
Beast

Undead

Machine

Spirit

Dragon

Titan

Shadow

Human
```

---

# STEP 6 — Enemy Scaling

Instead of manually creating 100 enemies

Generate stats.

Example

```text
HP

Base × Floor

Attack

Base × Difficulty

Defense

Floor Modifier

Drops

Randomized
```

Bosses remain handcrafted.

---

# STEP 7 — Combat Engine

This is the heart.

No tapping.

No buttons.

Just simulation.

```text
Character

↓

Equipment

↓

Stats

↓

Skills

↓

Enemy

↓

Combat Engine

↓

Battle Log

↓

Victory

or

Defeat
```

Everything calculated.

---

# STEP 8 — Combat Formula

Every turn

Calculate

```text
Damage

=

Attack

-

Defense

+

Random

+

Critical
```

Knowledge

Can

Ignore Defense

Strength

Higher Damage

Recovery

Regenerates HP

Discipline

Damage Reduction

Focus

Critical Chance

Endurance

Maximum HP

Consistency

Luck

Every stat finally matters.

---

# STEP 9 — Battle Screen

Imagine

```text
────────────────────

Floor 21

Stone Golem

██████████

Character

█████████░

Battle Log

↓

Critical Hit!

↓

Recovery +25

↓

Stone Golem Slam

↓

Victory

────────────────────
```

No user input.

Just watching.

---

# STEP 10 — Boss Engine

Every

10 floors.

Unique boss.

Never reuse mechanics.

Examples

---

Floor 10

```text
The Forgotten Knight

High Defense

Weak

Knowledge
```

---

Floor 20

```text
The Endless Sleeper

Recovery Check

Deals poison

Sleep attacks
```

---

Floor 30

```text
The False King

Balanced

Every stat matters
```

---

Floor 40

```text
The Time Devourer

Reduces Recovery

Punishes weak Discipline
```

Bosses should test different builds.

---

# STEP 11 — Reward Engine

Victory

↓

Reward Calculation

↓

Inventory

↓

Character

Rewards

```text
Gold

EXP

Relics

Equipment

Titles

Skill Points

Tower Gems

Artifacts
```

Never only Gold.

---

# STEP 12 — Loot System

Different rarities

```text
Common

Uncommon

Rare

Epic

Legendary

Mythic

Ancient
```

Drop chance

Based on

Consistency

Luck

Floor

Boss

Future AI buffs.

---

# STEP 13 — Relics

Permanent bonuses.

Examples

```text
Scholar's Tome

Knowledge

+20
```

```text
Titan Core

Strength

+15
```

```text
Phoenix Feather

Recovery

+25
```

These persist forever.

---

# STEP 14 — Equipment Preview

After combat

Show

```text
New Equipment

Epic

Guardian Helmet

Defense

+45

Recovery

+10

Equip?

YES

NO
```

Immediate excitement.

---

# STEP 15 — Defeat System

Failure shouldn't feel bad.

Instead

```text
Tower Analysis

Result

FAILED

Reason

Knowledge

Too Low

Recommendation

Complete

Reading Missions

3 Days

Estimated Success

91%
```

This connects back to your Habit Engine.

---

# STEP 16 — AI Tower Strategist (Placeholder)

Don't implement AI yet.

But prepare.

Panel

```text
SYSTEM ANALYSIS

Recommended

Power

6200

Current

5850

Win Probability

73%
```

Future AI plugs in here.

---

# STEP 17 — Tower History

Store

```text
TowerHistory

id

characterId

floor

enemy

result

damage

duration

rewards

createdAt
```

Later

Analytics.

---

# STEP 18 — APIs

```text
GET    /tower

GET    /tower/floors

GET    /tower/floor/:id

POST   /tower/start

GET    /tower/history

GET    /tower/rewards

POST   /tower/claim
```

Keep Tower completely isolated from the Habit Engine.

---

# Folder Structure

```text
features/

tower/

components/

TowerMap.tsx

TowerCard.tsx

FloorCard.tsx

CombatScreen.tsx

BattleLog.tsx

RewardDialog.tsx

BossCard.tsx

RequirementPanel.tsx

services/

CombatEngine.ts

TowerEngine.ts

RewardEngine.ts

FloorGenerator.ts

EnemyGenerator.ts

utils/

damageFormula.ts

dropCalculator.ts

floorValidator.ts

types/

enemy.ts

floor.ts

combat.ts

reward.ts
```

Everything Tower-related stays inside one feature module.

---

# Definition of Done

| Feature                        | Status |
| ------------------------------ | ------ |
| Tower map implemented          | ✅     |
| 100-floor progression          | ✅     |
| Floor requirement system       | ✅     |
| Floor unlock logic             | ✅     |
| Enemy database                 | ✅     |
| Boss system                    | ✅     |
| Automatic combat engine        | ✅     |
| Battle log                     | ✅     |
| Reward engine                  | ✅     |
| Loot rarity system             | ✅     |
| Relics                         | ✅     |
| Equipment preview              | ✅     |
| Defeat analysis                | ✅     |
| Tower history                  | ✅     |
| Tower API                      | ✅     |
| Unit tests for combat formulas | ✅     |

---

# One major improvement I'd make to your Tower

Instead of making the Tower a **single tower**, make it a **world**.

The **Tower of Ascension** is just the first tower.

Future expansions could include:

```text
Tower of Ascension
• Balanced progression
• Recommended for beginners

Tower of Knowledge
• Requires high Knowledge and Focus
• Puzzle-oriented enemies and magic-focused bosses

Tower of Strength
• Tests Strength and Endurance
• High-damage physical encounters

Tower of Discipline
• Rewards balanced, consistent characters
• Punishes glass-cannon builds

Tower of Eternity
• Endgame tower unlocked after clearing Ascension
• Endless floors with scaling difficulty and seasonal leaderboards
```

This architecture is much more scalable. You're not locked into designing 500 floors for one tower—you can build several themed towers, each encouraging different character builds and giving players new long-term goals. That makes future updates much easier while keeping the core gameplay fresh.
