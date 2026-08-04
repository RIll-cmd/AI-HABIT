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

## Phase 4: Progression Engine & Core Math (Completed)
- [x] Database Expansion (`Achievement`, `CharacterAchievement`, `EconomyLog` in SQLite via Prisma).
- [x] Pure Core Math Utilities (`levelFormula.ts`, `powerFormula.ts`, `rankFormula.ts`) & Vitest test suite (`progressionMath.test.ts`).
- [x] Decoupled Event Bus & Progression Engine (`EventBus.ts` & `ProgressionEngine.ts`).
- [x] FastAPI REST Endpoints & Schemas (`/api/progression/{id}/gold`, `/api/progression/{id}/history`, `/api/achievements`, `/api/analytics/{id}/weekly`).
- [x] Client Services & State Management (`progression.service.ts`, `analytics.service.ts`, `useProgressionStore.ts`).
- [x] Visual Analytics & Timeline UI (`WeeklyExpChart.tsx` with Recharts, `HistoryTimeline.tsx`, `RankAscensionModal.tsx`, `useProgressionEvents.tsx`).

## Phase 5: Ascension Tower Engine (Completed)
- [x] Database expansion (`Tower`, `Enemy`, `Floor`, `FloorProgress` in SQLite via Prisma).
- [x] Pure combat math & scaling utilities (`floorValidator.ts`, `enemyGenerator.ts`, `damageFormula.ts`).
- [x] Automated turn-based RPG Combat Engine & Loot Reward Engine (`CombatEngine.ts`, `RewardEngine.ts`).
- [x] Vitest test suite with 100% pass rate (`towerMath.test.ts`, `combatEngine.test.ts`, 38/38 total client tests).
- [x] FastAPI REST Endpoints & Auto-seeder (`/api/tower`, `/api/tower/{id}/floors/{char_id}`, `/api/tower/floors/{id}/combat/{char_id}`).
- [x] Client services, Zustand store & UI components (`TowerMap.tsx`, `CombatScreen.tsx`, `/tower` page route).

## Phase 6: Inventory & Equipment Engine (Completed)
- [x] Database Expansion (`Item`, `Equipment`, `Consumable`, `Inventory` in SQLite via Prisma).
- [x] Pure Loot & Combat Stat Math (`rarityCalculator.ts`, `equipmentGenerator.ts`, `combatStatCalculator.ts`).
- [x] Vitest test suite with 100% pass rate (`inventoryMath.test.ts`, 43/43 total client tests).
- [x] FastAPI REST Endpoints & Single-Slot Logic (`/api/inventory/{id}`, `/grant`, `/equip`, `/unequip`).
- [x] Client Services, Zustand Store & UI Components (`EquipmentPanel.tsx`, `InventoryGrid.tsx`, `ItemCard.tsx`, `/inventory` page route).
- [x] Procedural Tower Loot Drop Integration (`useTowerStore.ts` & `CombatScreen.tsx`).

## Phase 7: AI System Administrator (AIRA - Ciel Persona) (Completed - v1.0 Release)
- [x] Google Gemini Generative AI Integration & Ciel System Prompt (`aira_service.py`).
- [x] Tactical Tower Defeat Diagnostics & Daily Morning Briefing (`generate_daily_report`).
- [x] FastAPI REST Endpoints & Pydantic Schemas (`/api/aira/chat`, `/diagnose-defeat`, `/daily-report`).
- [x] SSR-Safe System Audio Manager & Custom Ciel Voice Assets (`useSystemAudio.ts`).
- [x] Client Services, Zustand Store & Automatic Voice Cues (`useAiraStore.ts`).
- [x] Holographic Sci-Fi Terminal UI (`/aira` page route) & Global Sidebar Audio Hookup (`Sidebar.tsx`).

