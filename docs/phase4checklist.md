This is where your app stops feeling like a **habit tracker** and starts feeling like an actual **RPG progression system**.

If Phase 3 is the **heart**, then **Phase 4 is the brain**.

Every action in the app now becomes connected.

Completing a mission doesn't just give EXP anymore.

It can:

- Increase stats
- Unlock achievements
- Increase Power
- Change Rank
- Earn Gold
- Update analytics
- Unlock titles
- Trigger notifications
- Prepare the player for the Tower

Everything begins here.

---

# PHASE 4 — Progression Engine (3 Weeks)

## Goal

Create one centralized progression system that every future feature uses.

Nothing in your app should directly modify the player anymore.

Everything goes through the Progression Engine.

---

# Architecture

```text
                    PROGRESSION ENGINE

Habit Engine ───────────────┐
Workout Engine ─────────────┤
AI System ──────────────────┤
Tower Rewards ──────────────┤
Achievements ───────────────┤
Special Events ─────────────┤
                             ▼
                  Progression Engine
                             │
     ┌────────────────────────────────────────┐
     │                                        │
     ▼                                        ▼

 Character Engine                   Analytics Engine

     │                                        │

     ▼                                        ▼

Rank • Level • Power              Charts • History

     │
     ▼

Dashboard
```

This becomes the center of your entire application.

---

# STEP 1 — Build the Game Engine

Don't let features update the database.

Instead create

```text
features/

progression/

ProgressionEngine.ts
```

Every reward passes through here.

Example

```text
Mission Completed

↓

ProgressionEngine

↓

Calculate Rewards

↓

Gain EXP

↓

Gain Stats

↓

Gain Gold

↓

Update Power

↓

Check Level Up

↓

Check Rank Up

↓

Check Achievements

↓

Write History

↓

Update Dashboard
```

One engine.

One source of truth.

---

# STEP 2 — EXP Engine

You already made EXP.

Now improve it.

Instead of

```text
Character.exp += 50
```

Use

```text
ProgressionEngine.gainEXP()

↓

Animation

↓

History

↓

Power Update

↓

Rank Check

↓

Achievement Check
```

Everything becomes automatic.

---

# STEP 3 — Level Formula

Never hardcode.

Create

```text
lib/

game/

levelFormula.ts
```

Example

```text
Level 1

100 EXP

Level 2

250 EXP

Level 3

450 EXP

Level 4

700 EXP

Level 5

1000 EXP
```

Use a mathematical formula so you can generate unlimited levels.

---

# STEP 4 — Stat Growth

Leveling shouldn't only increase the level number.

Example

Level Up

↓

```text
+1 Strength

+1 Recovery

+2 HP

+15 Power
```

Even before equipment exists.

Players should feel stronger.

---

# STEP 5 — Power Formula

Power should become dynamic.

Instead of

```text
Level × 50
```

Use weighted stats.

Example

```text
Power =

(Level × 50)

+

Strength × 8

+

Knowledge × 8

+

Recovery × 6

+

Focus × 7

+

Endurance × 7

+

Discipline × 6

+

Consistency × 5

+

Equipment Bonus

+

Title Bonus

+

Achievement Bonus
```

Later

Tower

AI

Equipment

will automatically increase Power.

---

# STEP 6 — Gold System

Gold finally becomes useful.

Create

```text
Gold Wallet
```

Tracks

Current Gold

Lifetime Earned

Lifetime Spent

---

Database

```text
GoldHistory

id

characterId

type

amount

source

createdAt
```

Example

```text
+25 Gold

Mission Complete

-500 Gold

Hunter Shop
```

---

# STEP 7 — Achievement Engine

This deserves its own feature.

---

Database

```text
Achievement

id

name

description

icon

reward

condition

category
```

---

CharacterAchievement

```text
id

characterId

achievementId

unlockedAt
```

---

Categories

```text
Habits

Workout

Tower

Character

Social

AI

Special

Seasonal
```

---

Examples

```text
First Mission

Complete 1 Mission

Reward

100 Gold
```

---

```text
Iron Discipline

Complete 100 Missions

Reward

Title
```

---

```text
Knowledge Seeker

Read 100 Times

Reward

Scholar Border
```

---

```text
Level 20

Reward

Tower Key
```

Achievements should reward more than badges—give meaningful progression where appropriate.

---

# STEP 8 — Rank System

Ranks are determined entirely by Power.

Example

```text
F

0

↓

499

E

500

↓

1499

D

1500

↓

2999

C

3000

↓

5999

B

6000

↓

9999

A

10000+

S

25000+

SS

50000+

SSS

100000+
```

Store these thresholds in a configuration file so they're easy to rebalance.

---

# STEP 9 — Rank Promotion

Don't silently update Rank.

Make it an event.

Imagine

```text
=========================

RANK ASCENSION

E

↓

D

Power

1500

=========================
```

The screen darkens.

Particles appear.

Sound.

AI speaks.

This is a milestone.

---

# STEP 10 — Economy System

Track every reward.

Every expense.

Every source.

Database

```text
EconomyLog

id

characterId

currency

amount

reason

source

createdAt
```

Later

Tower

Shop

AI

Season Pass

Everything uses this.

---

# STEP 11 — Activity History

Every progression event.

Example

```text
+40 EXP

Mission Complete

+5 Recovery

Drink Water

Achievement

Unlocked

Power +120

Rank Up

Gold +50
```

Eventually this becomes a timeline.

---

# STEP 12 — Analytics Engine

One of the strongest portfolio features.

Create a dedicated Analytics service.

```text
AnalyticsService

↓

Collect Data

↓

Aggregate

↓

Return Charts
```

Don't compute charts directly inside React components.

---

## Weekly Analytics

Show

- Missions Completed
- EXP Earned
- Gold Earned
- Average Habit Strength
- Stat Growth

Example trend:

---

## Monthly Analytics

Track

- Success Rate
- Mission Completion
- Workout Sessions
- Reading Sessions
- Gold Income
- Level Growth

---

## Yearly Analytics

Long-term trends.

Examples

- Total Missions
- Total EXP
- Total Gold
- Rank History
- Power Growth
- Most Improved Stat

This helps users see how they've grown over months, not just days.

---

# STEP 13 — Milestone Notifications

When

Level Up

Achievement

Rank Up

Power Milestone

Show

```text
Achievement Unlocked!

Iron Discipline

+500 Gold
```

Don't just update numbers.

Celebrate progress.

---

# STEP 14 — API

```text
GET    /progression

POST   /progression/exp

POST   /progression/gold

GET    /progression/history

GET    /achievements

GET    /analytics/weekly

GET    /analytics/monthly

GET    /analytics/yearly

GET    /rank
```

Notice

Everything has its own endpoint.

---

# STEP 15 — Folder Structure

```text
features/

progression/

components/

LevelBar.tsx

PowerCard.tsx

RankCard.tsx

AchievementPopup.tsx

GoldWallet.tsx

HistoryTimeline.tsx

services/

ProgressionEngine.ts

AchievementEngine.ts

EconomyEngine.ts

AnalyticsService.ts

utils/

levelFormula.ts

powerFormula.ts

rankFormula.ts

achievementChecker.ts

economy.ts

types/

achievement.ts

progression.ts

gold.ts

rank.ts
```

Everything progression-related stays together.

---

# Definition of Done

| Feature                             | Status |
| ----------------------------------- | ------ |
| Central Progression Engine          | ✅     |
| EXP pipeline complete               | ✅     |
| Dynamic level calculation           | ✅     |
| Automatic stat growth               | ✅     |
| Dynamic Power calculation           | ✅     |
| Gold wallet & history               | ✅     |
| Achievement system                  | ✅     |
| Rank system                         | ✅     |
| Rank ascension animation            | ✅     |
| Economy log                         | ✅     |
| Activity timeline                   | ✅     |
| Weekly analytics                    | ✅     |
| Monthly analytics                   | ✅     |
| Yearly analytics                    | ✅     |
| Progression API                     | ✅     |
| Unit tests for progression formulas | ✅     |

---

# One improvement I'd make

I would introduce an **Event Bus** now, before you build the Tower or AI.

Instead of calling systems directly:

```text
Mission Completed
    │
    ├── Update EXP
    ├── Update Gold
    ├── Update Achievements
    └── Update Analytics
```

Use events:

```text
Mission Completed
        │
        ▼
 Event Bus
        │
 ├── Progression Engine
 ├── Achievement Engine
 ├── Analytics Engine
 ├── Notification Engine
 └── Future AI Engine
```

This makes the architecture much cleaner. When you later add the AI System, Tower rewards, seasonal events, or multiplayer features, they simply subscribe to events like `mission.completed`, `level.up`, or `rank.ascended` without changing existing code. That's a common pattern in scalable game backends and keeps your project maintainable as it grows.

Weekly EXP Progress

Example trend of EXP earned throughout a week.

day exp
Mon 120
Tue 180
Wed 90
Thu 240
Fri 200
Sat 300
Sun 150
