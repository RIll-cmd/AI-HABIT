Absolutely. **Habits should be more detailed than Missions in terms of configuration**, because Habits are the long-term rules that continuously generate Missions.

The architecture should be:

```text
                    HABIT
              "What I want to do"
                       │
                       ▼
                 SCHEDULER
            "When should I do it?"
                       │
                       ▼
              MISSION GENERATOR
            "What should I do today?"
                       │
                       ▼
                  MISSION
                       │
                       ▼
                 COMPLETION
                       │
                       ▼
              HABIT STRENGTH
```

So when you build this section, think of **Habits as the user's long-term behavioral configuration**, while **Missions are the daily gameplay layer**.

---

# PHASE 3 — HABIT ENGINE

## 🔄 3.1 Habit System

### Goal

Allow the player to create, configure, schedule, monitor, modify, pause, and eventually let AI optimize their recurring habits.

The Habit system should answer:

> **What behavior is the player trying to build?**

While Missions answer:

> **What does the player need to do today?**

---

# 1. HABIT DASHBOARD

When the user clicks:

```text
🔄 Habits
```

Don't immediately show a giant table.

Make the page feel like a **Habit Management Center**.

I'd structure it like this:

```text
┌──────────────────────────────────────────────────────────┐
│ HABITS                                    [+ New Habit]  │
│                                                          │
│ Build your real-life progression.                       │
│                                                          │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │ ACTIVE      │ │ STRENGTH    │ │ COMPLETION  │        │
│ │ 7           │ │ 84%         │ │ 87%         │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                          │
│ ACTIVE HABITS                                            │
│                                                          │
│ ┌────────────────────────────────────────────────────┐   │
│ │ 💧 Drink Water                         87%          │   │
│ │ Health • Recovery • Daily                         │   │
│ │ ████████████████░░                                │   │
│ │ Today: ✓ Completed                                │   │
│ └────────────────────────────────────────────────────┘   │
│                                                          │
│ ┌────────────────────────────────────────────────────┐   │
│ │ 💻 Study Programming                   76%          │   │
│ │ Study • Knowledge • Mon–Fri                       │   │
│ │ █████████████░░░░░                                │   │
│ │ Today: Pending                                     │   │
│ └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

# 2. HABIT SUMMARY CARDS

At the top, show high-level information.

### Active Habits

```text
7
```

How many habits are currently active.

---

### Average Habit Strength

```text
84%
```

Average strength across active habits.

---

### Overall Completion

```text
87%
```

Percentage of scheduled Missions completed.

---

### Habits Improving

```text
↑ 4
```

Number of habits whose strength is improving.

---

### Habits at Risk

```text
⚠ 2
```

Habits whose completion has recently declined.

This becomes very useful later for Ciel.

---

# 3. HABIT CARD

Every habit should have its own card.

Example:

```text
┌─────────────────────────────────────────────┐
│ 💧 Drink Water                         ⋮    │
│                                             │
│ Health                                      │
│ Recovery                                    │
│                                             │
│ Daily                                       │
│                                             │
│ Habit Strength                             │
│ █████████████████░░ 87%                    │
│                                             │
│ Today                                       │
│ ✓ Normal Completed                         │
│                                             │
│ 15 EXP   20 GOLD                            │
│                                             │
│ [ View Habit ]                              │
└─────────────────────────────────────────────┘
```

The card should **not contain every statistic**.

It's a summary.

Clicking it opens the full Habit Detail page.

---

# 4. CREATE HABIT

This is one of the most important screens.

Don't make it a single giant form.

Use a **multi-step Habit Creation Wizard**.

Something like:

```text
Create Habit

① Basic Information
② Schedule
③ Difficulty
④ Completion Tiers
⑤ Rewards
⑥ Review
```

---

# STEP 1 — BASIC INFORMATION

Ask:

### Habit Name

```text
What habit do you want to build?

[ Drink Water                  ]
```

---

### Description

Optional.

```text
[ Drink at least 2 liters of water throughout the day. ]
```

This can later be shown inside the generated Mission.

---

### Category

Choose:

```text
Health
Fitness
Study
Work
Sleep
Personal
Mindfulness
Social
Finance
Other
```

You can eventually allow custom categories.

---

# 5. HABIT ICON

Allow the player to select an icon.

Example:

```text
💧 Water
📚 Reading
💻 Coding
🏋 Workout
🧘 Meditation
😴 Sleep
🚶 Walking
🧹 Cleaning
```

Later:

AI could automatically suggest an icon.

---

# 6. PRIMARY STAT

This connects the Habit system to your RPG progression.

Choose:

```text
Strength
Endurance
Knowledge
Recovery
Focus
Discipline
Social
```

Example:

```text
Drink Water

Primary Stat:
Recovery
```

---

# 7. OPTIONAL SECONDARY STAT

You could allow one secondary stat.

Example:

```text
Study Programming

Primary:
Knowledge +5

Secondary:
Discipline +1
```

But I'd be careful with this.

Too many stat rewards can make balancing difficult.

For the MVP:

> **One primary stat per Habit.**

Add secondary stats later.

---

# 8. HABIT DIFFICULTY

This determines the general difficulty of the Habit.

```text
EASY
MEDIUM
HARD
```

Example:

### Easy

```text
Drink Water
Make Bed
5-minute Stretch
```

### Medium

```text
Read 30 minutes
Study Programming
Meditate 20 minutes
```

### Hard

```text
2-hour Deep Work
Complete Workout
Run 10km
```

---

# 9. DIFFICULTY SHOULD NOT DETERMINE EVERYTHING

Don't make:

```text
Hard = automatically 500 EXP
```

Difficulty should be one factor.

Eventually:

```text
Reward =
Difficulty
× Completion Tier
× Habit Configuration
× System Balance
```

This gives you much more control over your progression economy.

---

# 10. SCHEDULER

This is probably the most complicated part of the Habit system.

The user needs to tell the application:

> **When should this Habit generate Missions?**

---

# Schedule Type

Give users:

```text
Daily
Weekly
Monthly
Specific Days
Custom
```

---

# 11. DAILY

Example:

```text
Drink Water

Frequency:
Every Day
```

Generates:

```text
Monday ✓
Tuesday ✓
Wednesday ✓
Thursday ✓
Friday ✓
Saturday ✓
Sunday ✓
```

---

# 12. WEEKLY

This shouldn't necessarily mean "once every week."

It could mean:

```text
Target:
3 times per week
```

Example:

```text
Gym

3× per week
```

The system can generate:

```text
Monday
Wednesday
Friday
```

or let the player choose preferred days.

---

# 13. SPECIFIC DAYS

Example:

```text
Study Programming

☑ Monday
☑ Tuesday
☑ Wednesday
☑ Thursday
☑ Friday

☐ Saturday
☐ Sunday
```

Mission generation:

```text
Monday → Mission
Tuesday → Mission
Wednesday → Mission
Thursday → Mission
Friday → Mission
Saturday → None
Sunday → None
```

---

# 14. MONTHLY

Example:

```text
Deep Clean Room

Once per month

Day:
1st Saturday
```

Or:

```text
Read 1 Book

Target:
1× per month
```

---

# 15. CUSTOM SCHEDULE

This is where the system becomes powerful.

Examples:

```text
Every 2 days
Every 3 days
Every 14 days
3 times per week
5 times per month
```

Eventually:

```text
Every weekday
Every weekend
Every other Monday
```

Don't implement every possible scheduling rule immediately.

For your first implementation:

```text
Daily
Specific Days
X times per week
X times per month
```

is enough.

---

# 16. SCHEDULE TIME

A Habit can optionally have a preferred time.

Example:

```text
Study Programming

Preferred Time:

18:00
```

This does **not necessarily mean the Mission expires at 18:00**.

It's a preferred activity time.

This distinction is important.

```text
Preferred time:
6:00 PM

Deadline:
10:00 PM
```

---

# 17. HABIT WINDOW

Allow:

```text
Start Time
End Time
```

Example:

```text
Workout

Available:
5:00 PM – 9:00 PM
```

Ciel can later use this information.

---

# 18. MINI / NORMAL / ELITE CONFIGURATION

This is where the Habit defines the Mission's completion tiers.

Example:

## Drink Water

```text
MINI

1 glass

+10 EXP
+1 Recovery
```

```text
NORMAL

2 liters

+30 EXP
+3 Recovery
```

```text
ELITE

3 liters

+60 EXP
+6 Recovery
```

---

# 19. Another Example

## Study Programming

```text
MINI

10 minutes

+20 EXP
+1 Knowledge
```

```text
NORMAL

30 minutes

+80 EXP
+5 Knowledge
```

```text
ELITE

60 minutes

+180 EXP
+10 Knowledge
```

The Habit stores these definitions.

When a Mission is generated, it copies the appropriate configuration.

---

# 20. Why Store Tier Definitions in the Habit?

Because you want:

```text
Habit
   │
   ├── Mini configuration
   ├── Normal configuration
   └── Elite configuration
```

Then:

```text
Mission
```

gets generated from those settings.

This prevents you from manually creating rewards for every Mission.

---

# 21. Reward Configuration

Allow the user/system to define:

### EXP

```text
Mini:
20

Normal:
80

Elite:
180
```

### Gold

```text
Mini:
5

Normal:
20

Elite:
50
```

### Stat

```text
Mini:
+1

Normal:
+5

Elite:
+10
```

For the MVP, I'd actually consider making these **system-calculated** rather than completely user-controlled.

Otherwise users could create:

```text
Drink Water

+999,999 EXP
```

and destroy your progression economy.

So:

> Let users configure the task, but let the system calculate balanced rewards.

---

# 22. Habit Creation Review

Before creating the Habit, show:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE HABIT

Drink Water

Category
Health

Stat
Recovery

Schedule
Daily

Difficulty
Easy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLETION TIERS

Mini
1 glass

Normal
2 liters

Elite
3 liters

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimated Rewards

Mini
+10 EXP

Normal
+30 EXP

Elite
+60 EXP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ Create Habit ]
```

This prevents mistakes.

---

# 23. HABIT DETAIL PAGE

When the player clicks a Habit:

```text
Drink Water
```

Open:

```text
Habit Overview
```

---

## Header

```text
💧 DRINK WATER

Health
Recovery

ACTIVE

Habit Strength
87%
```

---

# 24. Current Configuration

Show:

```text
Schedule
Daily

Difficulty
Easy

Primary Stat
Recovery

Created
July 20, 2026

Preferred Time
Throughout Day
```

---

# 25. Current Progress

```text
THIS WEEK

7 scheduled
6 completed

Completion:
86%

Strength:
87%
```

---

# 26. Habit Strength

This is where your system becomes different from a basic habit tracker.

Instead of:

```text
🔥 35 day streak
```

show:

```text
HABIT STRENGTH

87
█████████████████░░░
```

Then break it down.

```text
Consistency
91%

Success Rate
84%

Completion Quality
86%
```

---

# 27. What Each Metric Means

You need precise definitions.

### Consistency

> How reliably the user performs the Habit on its scheduled days.

Example:

```text
Scheduled:
20

Completed:
18

Consistency:
90%
```

---

### Success Rate

> How often the user successfully completes a generated Mission.

This can account for:

```text
Completed
Partial
Missed
```

---

### Completion Quality

Measures **which tier** the user usually achieves.

For example:

```text
Mini = 50%
Normal = 100%
Elite = 150%
```

Then average the results.

Someone who always does Mini isn't treated exactly the same as someone who consistently completes Elite.

---

# 28. Habit Strength Formula

Don't just randomly display a number.

Make the formula explicit in your code.

For example:

```text
Habit Strength =
    Consistency × 0.40
  + Success Rate × 0.35
  + Completion Quality × 0.25
```

Example:

```text
Consistency = 91
Success = 84
Quality = 86

Strength =
91 × .40
+ 84 × .35
+ 86 × .25

= 87.1
```

Display:

```text
87%
```

You can tune the weights later.

---

# 29. Habit Strength Should Change Slowly

This is important.

If the user misses one day:

```text
87%
```

shouldn't become:

```text
61%
```

That feels punishing.

Instead:

```text
87%
↓
85%
```

Likewise, one successful day shouldn't turn:

```text
50%
→
90%
```

Habit Strength should represent **long-term reliability**.

---

# 30. Habit Strength Levels

You can make it visually interesting.

```text
0–19
Unstable

20–39
Developing

40–59
Emerging

60–74
Reliable

75–89
Strong

90–99
Elite

100
Mastered
```

Example:

```text
87%

STRONG HABIT
```

---

# 31. Habit Analytics

Inside each Habit:

```text
ANALYTICS
```

---

## Weekly

```text
Mon  ✓
Tue  ✓
Wed  ✕
Thu  ✓
Fri  ✓
Sat  ✓
Sun  ✓
```

Or a graph:

```text
Completion

100% ┤     ●
 80% ┤ ●   ●     ●
 60% ┤ ● ● ●  ●  ●
 40% ┤
 20% ┤
     └────────────
       M T W T F S S
```

---

# 32. Monthly Calendar

Very useful.

```text
AUGUST

M T W T F S S

        1  2
3  4  5  6  7  8  9
10 11 12 13 14 15 16
...
```

Each day can show:

```text
✓ Normal
◆ Elite
○ Mini
✕ Missed
```

This is much more informative than a streak counter.

---

# 33. Best Days

Analyze when the user succeeds most.

Example:

```text
BEST DAYS

Monday
94%

Wednesday
91%

Friday
88%
```

---

# 34. Weak Days

```text
WEAK DAYS

Saturday
61%

Sunday
54%
```

This is useful because the system can later say:

> "You complete your programming Habit 30% less often on weekends. Would you like to change the schedule?"

That's exactly the kind of intelligence you want Ciel to eventually provide.

---

# 35. Time Analysis

Track:

```text
Morning
82%

Afternoon
74%

Evening
91%
```

For habits where timing matters.

This allows future AI recommendations like:

> "You have your highest success rate between 6–8 PM."

---

# 36. Mission Tier Distribution

For each Habit:

```text
COMPLETION QUALITY

Mini
████ 20%

Normal
██████████ 50%

Elite
██████ 30%
```

This gives the user a much better understanding of how they're performing.

---

# 37. Habit History

Show:

```text
RECENT ACTIVITY

Aug 7
Elite
+60 EXP

Aug 6
Normal
+30 EXP

Aug 5
Normal
+30 EXP

Aug 4
Missed

Aug 3
Elite
+60 EXP
```

---

# 38. Habit Management

Every Habit should have a menu:

```text
⋮
```

Options:

```text
Edit
Pause
Duplicate
Archive
Delete
```

But each needs different behavior.

---

# 39. EDIT

Edit configuration.

```text
Name
Description
Category
Difficulty
Stat
Schedule
Completion Tiers
Preferred Time
```

Important:

**Don't modify historical Missions.**

If the user changes:

```text
Normal:
30 minutes
```

to:

```text
Normal:
45 minutes
```

previous Missions should still say:

```text
30 minutes
```

Only future Missions use the new configuration.

This is a very important data-modeling decision.

---

# 40. PAUSE

Pause is temporary.

Example:

```text
Pause Habit

Until:
August 20
```

During the pause:

```text
No Missions generated.
```

But historical data remains.

---

# 41. Resume

When resumed:

```text
Habit
ACTIVE
```

Mission generation continues according to the schedule.

---

# 42. ARCHIVE

Archive means:

> "I don't want this Habit active anymore, but I want to preserve its history."

Example:

```text
Learn Spanish
```

User stops it.

Archive.

History remains:

```text
Strength
78%

Total Missions
142

Completed
118
```

---

# 43. DELETE

Be careful with Delete.

I'd make:

```text
Delete Habit?
```

Then:

> This will remove the Habit from your active system.

For your prototype, you could use **soft deletion** instead of physically deleting the database record.

```text
deletedAt
```

That gives you recovery and preserves historical integrity.

---

# 44. DUPLICATE

Very useful.

Example:

```text
Study Programming
```

User clicks:

```text
Duplicate
```

Creates:

```text
Study Algorithms
```

with the same:

- Schedule
- Difficulty
- Tiers
- Category

User changes the name/stat.

---

# 45. Habit States

I recommend:

```text
ACTIVE
PAUSED
ARCHIVED
DELETED
```

Do not just use:

```text
active = true
```

You will eventually need more states.

---

# 46. Habit Database

I'd structure the core model roughly like this:

```text
Habit

id
characterId

name
description
icon

category
difficulty

primaryStat

status

scheduleType

preferredTime
startDate
endDate

createdAt
updatedAt
pausedAt
archivedAt
```

Then separate the scheduling configuration.

---

# 47. Habit Schedule

```text
HabitSchedule

id
habitId

type

daysOfWeek
timesPerWeek
timesPerMonth

startTime
endTime

timezone

createdAt
updatedAt
```

Don't put every possible schedule field directly inside Habit.

Keep scheduling isolated.

That will make your scheduler much easier to maintain.

---

# 48. Habit Tier

I would also separate the tiers.

```text
HabitTier

id
habitId

tier

targetType

targetValue

targetUnit

baseExp
baseGold
statReward
```

Example:

```text
habitId:
123

tier:
NORMAL

targetValue:
30

targetUnit:
MINUTES

baseExp:
80

statReward:
5
```

Then:

```text
MINI
NORMAL
ELITE
```

are simply records.

This makes your system flexible.

---

# 49. Habit → Mission Generation

Your backend can have something like:

```text
generateDailyMissions(characterId, date)
```

Process:

```text
1. Find active Habits

2. Check their schedules

3. Determine which Habits are scheduled today

4. Check if a Mission already exists

5. Create Mission

6. Copy relevant Habit configuration

7. Save Mission
```

Example:

```text
Habit:
Gym

Schedule:
Mon/Wed/Fri

Today:
Wednesday

↓

Generate Mission

"Wednesday Workout"
```

---

# 50. Don't Generate Duplicate Missions

This is extremely important.

Imagine:

```text
User opens app
↓
generateDailyMissions()
```

Then opens it again:

```text
generateDailyMissions()
```

You don't want:

```text
Workout
Workout
Workout
Workout
```

Use a unique constraint such as:

```text
habitId + scheduledDate
```

for recurring Missions where appropriate.

---

# 51. Habit Progression Flow

The complete system becomes:

```text
USER CREATES HABIT
        ↓
CONFIGURES SCHEDULE
        ↓
CONFIGURES MINI/NORMAL/ELITE
        ↓
HABIT SAVED
        ↓
SCHEDULER CHECKS TODAY
        ↓
MISSION GENERATED
        ↓
USER COMPLETES MISSION
        ↓
MISSION COMPLETION SAVED
        ↓
EXP / GOLD / STAT REWARD
        ↓
HABIT ANALYTICS UPDATED
        ↓
HABIT STRENGTH RECALCULATED
```

---

# 52. AI Integration — Later

This is where your **Ciel** concept becomes really powerful.

Don't let Ciel simply create random habits.

Give her access to the Habit Engine.

For example:

### Detecting a Problem

```text
Ciel:

Your "Study Programming" Habit
has dropped from 88% → 71%
over the last 3 weeks.

Most missed Missions occur
after 8 PM.
```

Then:

```text
Recommendation:

Move your preferred study time
to 6:00 PM?

[ Accept ]
[ Keep Current Schedule ]
```

---

# 53. AI Habit Adjustment

If the player accepts:

```text
Ciel
↓
Habit Update Proposal
↓
Backend Validation
↓
Habit Schedule Updated
```

Not:

```text
AI
↓
Direct Database Modification
```

The AI should **recommend** changes, while your deterministic backend applies them.

---

# 54. AI Habit Creation

Eventually the player could tell Ciel:

> "I want to become more disciplined."

Ciel analyzes:

```text
Current Habits
Current Stats
Completion History
Available Time
Missed Missions
Goals
```

Then proposes:

```text
SYSTEM RECOMMENDATION

I recommend starting with:

1. 20 min Deep Work
2. 10 min Exercise
3. Sleep before 11:30 PM

Difficulty:
Moderate

Estimated daily time:
45 minutes

Primary Stats:
Focus
Discipline
Recovery
```

Then:

```text
[ Create These Habits ]
```

User approves.

Then the normal Habit Engine takes over.

---

# 55. Habit Risk Detection

Eventually calculate:

```text
Habit Risk
```

Example:

```text
⚠ AT RISK

Study Programming

Strength:
76%

Trend:
↓ 14%

Recent completion:
3/7

Most common failure:
Late evening
```

Ciel can intervene.

---

# 56. Habit Recovery

I would add one more concept because it fits your philosophy.

If a player misses several days:

Don't immediately punish them.

Show:

```text
HABIT RECOVERY

Your Study Habit has weakened.

Would you like to activate
Recovery Mode?

Normal:
30 minutes

Recovery:
10 minutes

Duration:
3 days
```

This allows the user to rebuild the Habit.

And it gives your AI something meaningful to manage.

---

# 57. Habit Lifecycle

The entire lifecycle becomes:

```text
                 CREATE
                    │
                    ▼
                 ACTIVE
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    IMPROVING     STABLE      DECLINING
                                │
                                ▼
                           AT RISK
                                │
                       ┌────────┴────────┐
                       ▼                 ▼
                  RECOVERY            PAUSE
                       │                 │
                       ▼                 ▼
                    ACTIVE            ACTIVE
                                         │
                                         ▼
                                      ARCHIVE
```

This is much more sophisticated than:

```text
Create → Complete → Streak
```

---

# 58. Habit Page Structure

For your actual frontend, I'd build the page with these sections:

```text
HABITS
│
├── Overview
│   ├── Active Habits
│   ├── Average Strength
│   ├── Completion Rate
│   └── At Risk
│
├── Active Habits
│   ├── Habit Card
│   ├── Habit Card
│   └── Habit Card
│
├── Paused
│
└── Archived
```

Then clicking a Habit:

```text
HABIT DETAIL

├── Overview
├── Configuration
├── Schedule
├── Completion Tiers
├── Habit Strength
├── Analytics
├── History
└── Management
```

---

# 59. What You Should Build First

Since you're actually implementing this now, **don't build the entire Habit system at once**.

I'd break it into these development steps:

### Step 1 — Habit Model

Build:

```text
Habit
HabitSchedule
HabitTier
```

Make sure CRUD works.

---

### Step 2 — Create Habit UI

Build the wizard:

```text
Basic Information
        ↓
Schedule
        ↓
Difficulty / Stat
        ↓
Mini / Normal / Elite
        ↓
Review
        ↓
Create
```

---

### Step 3 — Habit List

Build:

```text
Active
Paused
Archived
```

with Habit Cards.

---

### Step 4 — Scheduler

Implement:

```text
Daily
Specific Days
X times/week
```

Don't start with every possible custom schedule.

---

### Step 5 — Mission Generation

Connect:

```text
Habit
 ↓
Schedule
 ↓
Today's Mission
```

This is where your Habit system finally connects to the Mission system you just designed.

---

### Step 6 — Completion Tracking

Connect:

```text
Mission Completion
 ↓
Habit History
```

---

### Step 7 — Habit Strength

Implement:

```text
Consistency
Success Rate
Completion Quality
        ↓
Habit Strength
```

---

### Step 8 — Analytics

Add:

```text
Weekly
Monthly
Calendar
Tier distribution
Best days
Weak days
Trend
```

---

### Step 9 — Management

Implement:

```text
Edit
Pause
Resume
Archive
Duplicate
Delete
```

---

### Step 10 — AI Hooks

**Do not build Ciel yet.**

Just make sure your system exposes enough data for Ciel later:

```text
getHabit()
getHabitHistory()
getHabitStrength()
getHabitSchedule()
getHabitCompletionRate()
getHabitTrend()
getAtRiskHabits()
```

Then when you eventually build the AI System, Ciel can consume those functions.

---

# 60. Definition of Done

I would consider your **Habit Engine complete** when this works from beginning to end:

```text
USER
  │
  ▼
Create "Study Programming"
  │
  ├── Category: Study
  ├── Stat: Knowledge
  ├── Difficulty: Medium
  └── Schedule: Mon–Fri
  │
  ▼
Configure Tiers
  │
  ├── Mini: 10 min
  ├── Normal: 30 min
  └── Elite: 60 min
  │
  ▼
Save Habit
  │
  ▼
Scheduler
  │
  ▼
Monday
  │
  ▼
Generate Mission
  │
  ▼
"Study Programming"
  │
  ▼
User completes NORMAL
  │
  ├── +80 EXP
  ├── +20 Gold
  └── +5 Knowledge
  │
  ▼
Completion History
  │
  ▼
Habit Analytics
  │
  ├── Consistency
  ├── Success Rate
  └── Completion Quality
  │
  ▼
Habit Strength
  │
  ▼
87%
```

**That is the core Habit Engine.**

And architecturally, this is the important relationship to preserve going forward:

> **Habits don't give rewards directly. Missions do.**
> **Habits determine when Missions exist and what those Missions represent.**
> **Mission completion feeds the Progression Engine.**
> **Habit history feeds Habit Strength and Analytics.**
> **Later, Ciel observes all of this and recommends changes—but the deterministic Habit/Mission/Progression engines remain responsible for actually executing them.**

That separation will make the later **Tower → Inventory → Skills → Boss → AI System** phases much easier to build without turning the codebase into one giant interconnected system.
