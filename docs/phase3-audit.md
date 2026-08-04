# Phase 3 Codebase Audit & Architecture Blueprint: The Habit Engine

**Project**: Ascend OS (AI-Powered Life RPG Platform)  
**Audit Date**: August 4, 2026  
**Status**: 100% Phase 3 Deliverables Verified & Functional

---

## 1. Executive Summary

Phase 3 transitions Ascend OS into **The Habit Engine**, establishing a **Template vs. Instance** architecture:
- **Habit (Template)**: The permanent, configurable template representing a user's real-world behavioral routine, schedule rules, and strength metrics.
- **Mission (Instance)**: The daily generated task instance derived from active Habit templates, tracking daily completion status, tier (`MINI`, `NORMAL`, `ELITE`), and EXP/Stat rewards.

This document outlines the architectural foundation, schema extensions, directory organization, and execution roadmap for Phase 3.

---

## 2. Database Schema Architecture (`server/prisma/schema.prisma`)

Four normalized models added to SQLite schema via Prisma:

1. **`Habit` (Template Model)**
   - `id`: UUID primary key
   - `characterId`: Foreign key to `Character`
   - `name`: Name of habit template
   - `description`: Optional text summary
   - `category`: Habit domain/category
   - `difficulty`: String enum (`'Easy'`, `'Medium'`, `'Hard'`)
   - `primaryStat`: Associated character stat attribute (`'strength'`, `'knowledge'`, `'discipline'`, etc.)
   - `isActive`: Boolean flag (default `true`)
   - `icon` / `color`: Optional cosmetic metadata
   - `createdAt` / `updatedAt`: Timestamps

2. **`HabitSchedule` (1:1 Relation with `Habit`)**
   - `id`: UUID primary key
   - `habitId`: Unique foreign key to `Habit` (Cascade delete)
   - `type`: Frequency type (`'Daily'`, `'Weekly'`, `'Monthly'`, `'Specific_Days'`, `'Custom'`)
   - `days`: Optional JSON string for specific days array (e.g. `["MON", "WED", "FRI"]`)
   - `interval`: Schedule repetition interval (default `1`)
   - `startDate` / `endDate`: Validity window

3. **`HabitMetrics` (1:1 Relation with `Habit`)**
   - `id`: UUID primary key
   - `habitId`: Unique foreign key to `Habit` (Cascade delete)
   - `habitStrength`: Float score (default `100.0`)
   - `successRate`: Float ratio (default `0.0`)
   - `completionRate`: Float ratio (default `0.0`)
   - `currentConsistency`: Float ratio (default `0.0`)

4. **`Mission` (Instance Model)**
   - `id`: UUID primary key
   - `habitId`: Optional foreign key to `Habit` (allows standalone/AI missions)
   - `characterId`: Foreign key to `Character` (Cascade delete)
   - `date`: Daily target date timestamp
   - `status`: String enum (`'PENDING'`, `'COMPLETED'`, `'MISSED'`, default `'PENDING'`)
   - `completionType`: Optional tier enum (`'MINI'`, `'NORMAL'`, `'ELITE'`)
   - `expEarned` / `statsEarned`: Gamification reward yields
   - `completedAt`: Timestamp when marked completed

---

## 3. Client Feature Directory & Type System (`client/src/features/habits/`)

Feature directory structure initialized:
```
client/src/features/habits/
├── components/   # Habit cards, Mission boards, Creation modals
├── hooks/        # Custom habit management hooks
├── services/     # API fetch wrapper for Habit REST endpoints
├── utils/        # Mathematical strength modeling & mission generation utilities
├── types/        # TypeScript interfaces and literal unions
│   ├── habit.ts
│   └── index.ts
└── store/        # Zustand slice for habits and daily missions
```

Strict TypeScript interfaces defined in `client/src/features/habits/types/habit.ts`:
- `HabitDifficulty`: `'Easy' | 'Medium' | 'Hard'`
- `ScheduleType`: `'Daily' | 'Weekly' | 'Monthly' | 'Specific_Days' | 'Custom'`
- `MissionStatus`: `'PENDING' | 'COMPLETED' | 'MISSED'`
- `CompletionType`: `'MINI' | 'NORMAL' | 'ELITE'`
- Fully mirrors Prisma model definitions with nullable optional fields.

---

## 4. Phase 3 Deliverable Roadmap

1. **Step 1: Data Model & Type System (Completed)**
   - Prisma schema updated, formatted, and synced.
   - Client habit types created & verified via Next.js TypeScript check.

2. **Step 2: Core Math Engine & Utilities (Completed)**
   - Implemented `rewardFormula.ts`: `getBaseReward` (Easy: 15 EXP/5 Gold/2 Stat, Medium: 35 EXP/12 Gold/5 Stat, Hard: 75 EXP/25 Gold/10 Stat) & `calculateFinalReward` (MINI: 40%, NORMAL: 100%, ELITE: 170%).
   - Implemented `habitStrength.ts`: `calculateConsistency` (with zero-division protection) & `calculateNewHabitStrength` (MINI: +0.5, NORMAL: +1.0, ELITE: +2.0, MISSED: -5.0, clamped 0.0–100.0).
   - Created Vitest test suite `habitMath.test.ts` (16/16 tests passed cleanly).

3. **Step 3: Backend REST Services & FastAPI Routers (Completed)**
   - Created Pydantic validation schemas (`HabitCreateSchema`, `MissionCompleteSchema`) in `server/schemas/habit.py`.
   - Created Habits router `server/routers/habits.py`: `POST /api/habits/{character_id}` (creates Habit, HabitSchedule, HabitMetrics) & `GET /api/habits/{character_id}`.
   - Created Missions router `server/routers/missions.py`: `GET /api/missions/today/{character_id}` (Daily Mission Generator auto-instantiating today's missions) & `POST /api/missions/{mission_id}/complete` (logs completion & updates HabitMetrics).
   - Mounted `habits.router` and `missions.router` in `server/main.py` and synced `docs/api.md`.

6. **Step 6: Daily Dashboard & Completion Flow (Completed)**
   - Built `MissionCard.tsx` with MINI (40%), NORMAL (100%), and ELITE (170%) completion tier action buttons.
   - Connected Dashboard Overview to `useHabitStore` and `useCharacterStore` via `useEffect` hooks.
   - Wired live quest completion to `executeMissionCompletion` (triggering instant level-ups, power score updates, EXP bar animations, and Sonner toasts).
