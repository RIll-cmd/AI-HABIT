# Product Roadmap

## Phase 1: SaaS MVP Skeleton (Completed)
- [x] Feature-based directory reorganization.
- [x] Dark SaaS design tokens injection (`#0B1020` & `#151C33`).
- [x] Zustand state slices initialization (`AuthStore`, `CharacterStore`, `ThemeStore`, `NavigationStore`).
- [x] Database pruning to `User` and `Character` models.
- [x] App Router routes (`/login`, `/register`, `/guest`, `/dashboard`, `/profile`, `/settings`).
- [x] System documentation initialization in `/docs`.

## Phase 2: The Character Engine (Completed)
- [x] Prisma database schema expansion (`level`, `exp`, `power`, `rank`, `gold`).
- [x] Normalized `CharacterStats` and `ProgressHistory` models in SQLite.
- [x] Pure RPG math utilities (`calculateLevel`, `calculatePower`, `calculateRank`).
- [x] Zustand Game Engine pipeline with optimistic state updates and `sonner` toast notifications.
- [x] Character Profile UI (`/profile`) with 8-stat attribute matrix, linear EXP bar, simulation trigger button, and activity feed.
- [x] Character Customization Settings UI (`/settings`) with live preview, name input, cosmetic title selection, theme color swatches, and class archetype avatars.
- [x] FastAPI Character API endpoints (`GET /api/character/{id}`, `PATCH /api/character/{id}`, `POST /api/character/{id}/sync-progression`).
- [x] Client API service integration (`character.service.ts`).

## Phase 3: The Habit Engine (Completed)
- [x] Database expansion (`Habit`, `HabitSchedule`, `HabitMetrics`, `Mission` models in SQLite via Prisma).
- [x] Template vs. Instance architecture implementation (Habit templates $\rightarrow$ Daily Mission instances).
- [x] Pure Habit Engine math utilities (`rewardFormula.ts` & `habitStrength.ts`).
- [x] Vitest test suite with 100% pass rate (`habitMath.test.ts`, 25/25 total client tests).
- [x] FastAPI REST endpoints & Daily Mission Generator (`/api/habits/{id}`, `/api/missions/today/{id}`, `/api/missions/{id}/complete`).
- [x] Client service layer & `useHabitStore` Zustand engine bridge to `useCharacterStore`.
- [x] Mission Creation Wizard UI (`MissionWizard.tsx`, 6-step Framer Motion wizard at `/missions/create`).
- [x] Daily Quest Board UI (`MissionCard.tsx` with MINI, NORMAL, ELITE completion tiers on `/dashboard`).

## Phase 4: Tower Engine & RPG Progression
- [ ] Simulated idle RPG Tower combat engine & floor progression.
- [ ] Stat point allocation wizard & gear inventory system.

## Phase 5: AI System Administrator (Ciel)
- [ ] Ciel AI reflective dialogue and mission optimization vector analysis.
