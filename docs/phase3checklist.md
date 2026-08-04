I think this is the **most important phase of your entire application**.

Not because it's technically the hardest (AI will be harder), but because **this is where users will spend 90% of their time**.

Everything should revolve around the Habit Engine.

Don't think of it as a CRUD system.

Think of it as **the engine that converts real-life actions into RPG progression.**

---

# PHASE 3 — Habit Engine (3–4 Weeks)

## Goal

Transform the application from a static RPG profile into a **living progression system**.

By the end of this phase, users should be able to:

- Create missions
- Schedule them
- Complete them
- Earn EXP
- Gain Stats
- Increase Habit Strength
- View daily progress
- Feel rewarded every day

This is the first time the app becomes "fun."

---

# Overall Architecture

```text
                    HABIT ENGINE

                ┌─────────────────┐
                │ Mission Creator │
                └────────┬────────┘
                         │
        ┌──────────────────────────────────┐
        │                                  │
        ▼                                  ▼

 Mission Scheduler                 Habit Database

        │                                  │

        └──────────────┬───────────────────┘
                       ▼

              Daily Mission Generator

                       ▼

              Completion Engine

                       ▼

      EXP • Stats • Habit Strength

                       ▼

            Character Engine

                       ▼

          Dashboard Updates
```

Notice something.

The Habit Engine doesn't directly modify the character.

Everything passes through the Character Engine you built in Phase 2.

---

# STEP 1 — Database Design

This phase introduces several new tables.

## Mission

Represents the habit itself.

```text
Mission

id

characterId

name

description

category

difficulty

primaryStat

scheduleType

isActive

icon

color

createdAt

updatedAt
```

Example

```text
Drink Water

Recovery

Easy

Daily

Blue
```

---

## MissionSchedule

Instead of storing schedules inside Mission.

Normalize them.

```text
MissionSchedule

id

missionId

type

days

interval

startDate

endDate
```

Supports

Daily

Weekly

Monthly

Specific Days

Custom

---

## MissionCompletion

Every completion is recorded.

Never overwrite.

```text
MissionCompletion

id

missionId

date

completionType

expEarned

statsEarned

completedAt
```

This becomes your analytics later.

---

## HabitMetrics

Don't calculate everything every page load.

Store

```text
HabitMetrics

missionId

habitStrength

successRate

completionRate

currentConsistency
```

---

# STEP 2 — Mission Categories

Don't let users type random categories.

Create predefined ones.

Example

```text
Fitness

Learning

Productivity

Mindfulness

Health

Nutrition

Finance

Social

Personal

Custom
```

Later

Each category gets its own icon.

---

# STEP 3 — Mission Creation Wizard

Instead of one long form.

Use a wizard.

---

## Step 1

Mission Name

```text
Drink Water
```

---

## Step 2

Choose Category

```text
Health
```

---

## Step 3

Choose Primary Stat

```text
Recovery
```

Only one primary stat.

Simple.

---

## Step 4

Choose Difficulty

```text
Easy

Medium

Hard
```

Difficulty affects

EXP

Gold

Stat rewards.

---

## Step 5

Choose Schedule

Daily

Weekly

Monthly

Specific Days

Custom

---

## Step 6

Confirmation

Preview

```text
Drink Water

Daily

Recovery

Easy

15 EXP

+3 Recovery
```

---

# STEP 4 — Mission Reward Formula

Never hardcode rewards.

Create formulas.

Example

Easy

```text
EXP

15

Gold

5

Stat

2
```

Medium

```text
EXP

35

Gold

12

Stat

5
```

Hard

```text
EXP

75

Gold

25

Stat

10
```

Future AI can modify these values.

---

# STEP 5 — Completion Types

This replaces

Done.

Users choose

Mini

Normal

Elite

---

Example

Workout

Mini

```text
10 Pushups
```

Normal

```text
45 Minutes
```

Elite

```text
90 Minutes
```

Each completion has different rewards.

Example

Mini

```text
40%

Reward
```

Normal

```text
100%

Reward
```

Elite

```text
170%

Reward
```

This is psychologically better than forcing perfection.

---

# STEP 6 — Daily Mission Generator

Every midnight

(or app launch)

Generate today's mission list.

Pseudo Flow

```text
User Opens App

↓

Scheduler Checks Date

↓

Collect Today's Missions

↓

Sort by Priority

↓

Display Dashboard
```

Never ask the user

"What habits do you want today?"

The scheduler already knows.

---

# STEP 7 — Daily Dashboard

This page becomes the heart of the app.

---

Morning Greeting

```text
Good Morning,

Cyrill
```

---

Progress Ring

```text
Today's Progress

65%
```

---

Mission List

```text
Drink Water

Mini

Normal

Elite
```

---

Quick Stats

```text
Today's EXP

Today's Gold

Current Level

Power
```

---

Quick Actions

```text
Complete Mission

Create Mission

History
```

---

# STEP 8 — Completion Flow

Imagine pressing

Complete.

Instead of instantly finishing.

Show

```text
Choose Completion

Mini

Normal

Elite
```

Then

Animation

↓

Reward Screen

```text
Mission Complete!

+25 EXP

+3 Recovery

+8 Gold
```

↓

Character updates

↓

Dashboard refreshes

This dopamine loop is important.

---

# STEP 9 — Habit Strength

This replaces streaks.

Never show

```text
Day 42
```

Instead

Every habit has

```text
Habit Strength

82%
```

Based on

Consistency

Completion Quality

Schedule Accuracy

Recent Activity

Recovery From Misses

---

Example

Week 1

100%

Week 2

95%

Week 3

90%

Miss

↓

85%

Not

0%

Missing one day shouldn't erase months of progress.

---

# STEP 10 — Consistency Algorithm

Instead of

Consecutive Days.

Calculate

```text
Consistency

=

Completed Sessions

/

Expected Sessions
```

Example

Expected

20

Completed

18

Consistency

90%

Simple.

Fair.

---

# STEP 11 — Activity Timeline

Every completion

Appears

```text
9:10 AM

Drink Water

Elite

+20 EXP

+4 Recovery

11:45 AM

Reading

Normal

+30 EXP

+5 Knowledge
```

Later

AI

Tower

Bosses

Everything writes here.

---

# STEP 12 — Dashboard Widgets

Build reusable cards.

Examples

```text
Mission Card

Progress Card

Daily EXP

Habit Strength

Today's Stats

Recent Activity
```

These will later be rearrangeable.

---

# STEP 13 — API

Backend

```text
GET

/missions

POST

/missions

PATCH

/missions/:id

DELETE

/missions/:id

GET

/missions/today

POST

/missions/:id/complete

GET

/missions/history
```

Keep the API RESTful.

---

# STEP 14 — Testing

Test

Mission Creation

Scheduler

Completion

Reward Formula

Habit Strength

Dashboard

History

Don't skip testing.

This engine powers everything.

---

# Folder Structure

Expand

```text
features/

missions/

components/

MissionCard.tsx

MissionWizard.tsx

CompletionDialog.tsx

MissionList.tsx

ProgressRing.tsx

QuickActions.tsx

hooks/

useMissions.ts

services/

mission.service.ts

scheduler.service.ts

reward.service.ts

utils/

habitStrength.ts

rewardFormula.ts

scheduleGenerator.ts

types/

mission.ts

schedule.ts

completion.ts
```

---

# UI Pages

By the end of Phase 3

```text
/dashboard

/missions

/missions/create

/missions/history

/missions/[id]

/calendar
```

---

# Definition of Done

| Feature                         | Status |
| ------------------------------- | ------ |
| Mission creation wizard         | ✅     |
| Daily/Weekly/Monthly scheduling | ✅     |
| Custom scheduling               | ✅     |
| Mission categories              | ✅     |
| Difficulty system               | ✅     |
| Mini/Normal/Elite completion    | ✅     |
| Reward formulas                 | ✅     |
| Character receives EXP & stats  | ✅     |
| Habit Strength algorithm        | ✅     |
| Daily dashboard                 | ✅     |
| Progress ring                   | ✅     |
| Activity timeline               | ✅     |
| Mission history                 | ✅     |
| Mission CRUD API                | ✅     |
| Unit tests                      | ✅     |

---

# One change I would make to your original design

I would **separate "Mission" from "Habit."**

Instead of treating them as the same thing:

```text
Drink Water (Habit)
        │
        ▼
Today's Drink Water (Mission)
```

A **Habit** is the permanent definition ("Drink Water every day"), while a **Mission** is today's generated instance ("Drink Water — August 4, 2026").

This architecture gives you enormous flexibility later:

- The AI can modify today's mission without changing the underlying habit.
- Temporary events (e.g., "Weekend Double EXP") can create extra missions.
- Penalty quests and special Tower preparation missions become easy to add.
- Seasonal events can inject missions without affecting the user's long-term habit setup.
