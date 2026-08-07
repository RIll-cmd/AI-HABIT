# Ascend OS - Development Changelog

All notable changes and architectural implementations for **Ascend OS (AI-Powered Life RPG Platform)** are documented in this file.

## [Phase 7 Completion - The Skill System & Expanded Inventory System] - 2026-08-08

### 1. Database Architecture & Seeding (`server/prisma/schema.prisma`)
- **`ItemDefinition` / `PlayerItem` / `InventoryTransaction`**: Replaced legacy item models with a scalable 400-item global template database (`ItemDefinition`), player instance database (`PlayerItem`), and audit log (`InventoryTransaction`).
- **`SkillDefinition`**: Master skill template database storing skill metadata (`id`, `name`, `description`, `elementPath`, `tier`, `maxLevel`, `skillType`, `baseCostSP`, `statRequirements`, `prerequisiteSkillId`, `icon`).
- **`PlayerSkill`**: Character skill ownership model tracking unlocked skills and current levels (`id`, `characterId`, `skillDefinitionId`, `currentLevel`).
- **Character Model Upgrade**: Added `availableSP` (Skill Points) field to track earnable skill points.
- **Python Seeding Engines**: Created `seed_items.py` (parsing 400 icons and item mapping JSON) and `seed_skills.py` (populating 29 elemental and ascension skills across Flame, Tempest, Earth, Tide, and Ascension paths).

### 2. Backend API Services & Validation (`server/routers/` & `server/schemas/`)
- **Inventory API** (`server/routers/inventory.py`): Pydantic schemas and endpoints for fetching player inventory, toggling item equipping (enforcing single-slot auto-unequip), toggling lock, and toggling favorite.
- **Skills API** (`server/routers/skills.py`): Endpoints `GET /api/skills/{character_id}` and `POST /api/skills/{character_id}/unlock` enforcing strict multi-layer checks: available SP cost validation, max level validation, stat requirements parsing, and prerequisite skill dependency verification.

### 3. Client Domain Stores & Combat Engine Integration (`client/src/features/`)
- **Zustand Inventory Store** (`features/inventory/store/useInventoryStore.ts`): Manages item fetching, lock/favorite toggles, auto-unequip logic, and instant power recalculation upon equipment change.
- **Zustand Skill Store** (`features/skills/store/useSkillStore.ts`): Manages global skill definitions, owned player skills, available SP tracking, optimistic unlocks, and instant dynamic power recalculation upon skill upgrades.
- **CSS Sprite Engine** (`features/skills/components/SkillIcon.tsx`): 32x32 CSS background-position mapper translating `RowX_ColY` grid coordinates from `Free_Skills.png`.
- **Stat Aggregation Engine** (`features/inventory/utils/combatStatCalculator.ts` & `hooks/useCombatStats.ts`): Incorporated skill passives into total combat stat calculation:
  - **Body Conditioning (`asc_01`)**: +4% Strength and Endurance.
  - **Mental Fortress (`asc_02`)**: +5% Focus and Discipline.
  - **Rapid Recovery (`asc_03`)**: +8% Recovery.
  - **Tactical Mind (`asc_04`)**: Converts 5% of Knowledge into Critical Damage.
  - **Limitless Growth (`asc_05`)**: Intercepts `gainExp` in `useCharacterStore.ts` to grant +10% bonus EXP on all activities.

### 4. Interactive Skill Tree UI (`client/src/app/(dashboard)/skills/page.tsx`)
- **Elemental Tree Grid**: Visual layout organizing skills across Flame, Tempest, Earth, Tide, and Ascension columns.
- **Interactive Nodes (`SkillNode.tsx`)**: Dynamic node states (Locked grayscale, Available glowing neon element borders, Unlocked golden border with Level badge).
- **Skill Detail Modal (`SkillDetailModal.tsx`)**: `#151C33` RPG modal displaying skill lore, stats, requirements, and unlock/upgrade triggers.

---

## [Phase 8 Completion - The Fitness Engine & Workout Boss System] - 2026-08-05

### 1. Database Schema & Models (`server/prisma/schema.prisma`)
- **`Exercise` (Master Database)**: Created master exercise repository (`id`, `name`, `category`, `muscleGroup`, `equipment`, `difficulty`, `description`, `instructions`, `videoUrl`, `image`).
- **`WorkoutPlan`**: Added workout plan model (`id`, `characterId`, `name`, `goal`, `difficulty`, `estimatedDuration`).
- **`WorkoutSession`**: Active/completed gym visit records (`id`, `characterId`, `planId`, `duration`, `completed`, `startedAt`, `finishedAt`).
- **`ExerciseLog`**: Append-only log of set entries (`id`, `sessionId`, `exerciseId`, `set`, `weight`, `reps`, `rpe`, `restTime`, `notes`).
- **`PersonalRecord`**: Tracked personal bests per exercise (`id`, `characterId`, `exerciseId`, `weight`, `reps`, `estimated1RM`, `date`).
- **`WeeklyBoss`**: Real-world fitness boss challenges (`id`, `characterId`, `name`, `targetExercise`, `targetWeight`, `targetReps`, `rewards`, `isDefeated`, `expiresAt`).

### 2. Backend Services & Engine Algorithms (`server/services/` & `server/utils/`)
- **Brzycki 1RM Personal Record Engine** (`server/utils/fitness_math.py`): Implemented $\text{1RM} = \frac{\text{Weight}}{1.0278 - (0.0278 \times \text{Reps})}$, with rep capping $>30$ for stability.
- **Progressive Overload Engine** (`server/services/fitness_engine.py`): Recommends $+2.5\text{ kg}$ weight increase when user cleanly hits $\ge 8$ reps in recent sessions.
- **Natural Language Text & Voice Parser** (`server/services/text_parser.py`): Regular expression extraction for weight/reps/RPE and token fuzzy matching for exercise names.
- **Weekly Boss Slaying Engine** (`server/services/fitness_engine.py`): Generates weekly bosses scaled to $\approx 90\%$ 1RM for 5 reps, automatically detecting defeat in finished sessions and awarding $+500\text{ EXP}$, $+100\text{ Gold}$, and $+1\text{ Strength}$.

### 3. FastAPI REST Router & Endpoints (`server/routers/fitness.py`)
- **API Endpoints**: Built 11 REST endpoints under `/api/fitness/*` (`GET /exercises`, `POST /sessions/start`, `POST /sessions/{id}/log`, `POST /sessions/{id}/log-text`, `POST /sessions/{id}/finish`, `GET /sessions/active/{char_id}`, `GET /sessions/history/{char_id}`, `GET /sessions/{id}`, `GET /prs/{char_id}`, `GET /overload/{char_id}/{ex_id}`, `GET /boss/{char_id}`).
- **RPG Engine Integration**: Calculates EXP, Gold, and attribute stat increases (`Strength`, `Endurance`, `Recovery`, `Discipline`, `Focus`) dynamically based on total session volume and goal, logging into `EconomyLog` and `ProgressHistory`.

### 4. Client Domain Types & Zustand Store (`client/src/features/fitness/`)
- **Domain Types** (`types/`): Formatted `Exercise`, `WorkoutPlan`, `WorkoutSession`, `ExerciseLog`, `PersonalRecord`, `WeeklyBoss` models.
- **Zustand Fitness Store** (`store/useFitnessStore.ts`): Manages active session state, rest timers, PR popup triggers, boss defeat status, and optimistic set logging.
- **API Service Layer** (`services/fitness.service.ts`): Connected frontend store to `/api/fitness` REST endpoints.

### 5. UI Component Matrix & Dashboard Widgets (`client/src/features/fitness/components/`)
- **`WorkoutSession.tsx`**: Interactive gym session interface with live session timer, progressive overload suggestions, set logger, and finish summary trigger.
- **`ExerciseLogger.tsx`**: Multi-set logger with manual input fields and quick text/voice simulation.
- **`RestTimer.tsx`**: Audio-visual countdown timer with preset intervals (30s, 60s, 90s, 120s, custom).
- **`PRPopup.tsx`**: Celebration modal for newly set personal records.
- **`WorkoutSummary.tsx`**: Post-workout summary showcasing total volume, EXP/Gold earned, stat gains, and PR badges.
- **`WorkoutHistory.tsx`**: Timeline of past workouts with expandable volume and set details.
- **`FitnessWidgets.tsx`**: Dashboard widgets displaying weekly volume, workout streak, active PRs, and recovery status.
- **`WorkoutBossCard.tsx`**: Boss card displaying weekly target exercise, defeat progress, time remaining, and boss rewards.

### 6. Verification Test Suite (`server/scripts/`)
- **Database Seeding**: Created `seed_exercises.py` populating 100+ master exercises.
- **Test Scripts**: Created `test_fitness_api.py`, `test_pr_engine.py`, `test_rewards_history.py`, `test_text_parser.py`, `test_weekly_boss.py`, and `test_workout_flow.py` for automated backend verification.

---

## [Phase 7 Completion & v1.0 Release - The AIRA Engine & Ciel Terminal] - 2026-08-04

### 1. Google Gemini API Service & Ciel System Prompt (`server/services/aira_service.py`)
- **Gemini API Model**: Initialized `google-generativeai` Python SDK with `gemini-2.5-flash` model (`gemini-1.5-flash` fallback).
- **Ciel Persona System Prompt**: Implemented strict persona instruction formatting responses with `<< Notice. >>`, `<< Report. >>`, and `<< Answer. >>` prefixes, referring to habits as *Skill Acquisition* routines and attributes as *Enhancement Coefficients*.
- **Defeat Diagnostic Engine**: Built `diagnose_tower_defeat()` analyzing turn battle logs and character attributes to pinpoint stat deficits causing defeat and recommend target real-life habits.
- **Daily Morning Briefing**: Built `generate_daily_report()` generating morning briefings on consistency, power score, and pending daily missions.

### 2. FastAPI AIRA Router & Validation Schemas (`server/routers/aira.py` & `schemas/aira.py`)
- **`POST /api/aira/chat`**: Accepts `AIRAChatSchema` (`prompt`, `characterId`), injects live character stats context, and returns AIRA's Ciel response.
- **`POST /api/aira/diagnose-defeat`**: Accepts `AIRADefeatSchema` (`battleLogs`, `characterId`, `floorNumber`), processes battle logs, and returns tactical defeat recommendations.
- **`GET /api/aira/daily-report/{character_id}`**: Fetches character attributes and pending habit counts to generate AIRA's morning briefing.
- **Main Server Integration**: Mounted `aira.router` in `server/main.py` and updated `docs/api.md`.

### 3. System Audio Manager & Custom Ciel Sound Assets (`client/src/features/audio/useSystemAudio.ts`)
- **SSR-Safe Sound Player**: Built `playSystemSound()` safely handling SSR checks and browser autoplay restrictions.
- **Voice Sound Triggers**: Created trigger helpers for notice (`AI-NOTICE.mp3`), understood (`AI-UNDERSTOOD.mp3`), confirmed (`AI-CONFRIMED.mp3`), system open (`SYSTEM--OPEN.mp3`), and skill acquired (`AI-ALL PHYSICAL ABILITIES HAVE BEEN IMPROVED.mp3`).

### 4. AIRA Store & Holographic Terminal UI (`client/src/features/aira/` & `/aira` page route)
- **Zustand AIRA Store** (`store/useAiraStore.ts`): Manages `messages`, `dailyReport`, `isLoading`, `activeInsight`, and automatically triggers `playNoticeSound()` audio cues.
- **Holographic Sci-Fi HUD** (`client/src/app/(dashboard)/aira/page.tsx`): Dark holographic UI (`#0B1020` base, `#151C33` containers), glowing cyan/purple borders, monospace telemetry, real-time prompt input, calculation stream indicators, and quick query buttons.
- **Global Sidebar Audio Integration** (`client/src/components/Sidebar.tsx`): Added **AIRA Terminal** to sidebar and hooked `playSystemOpen()` to navigation link clicks.

---

## [Phase 6 Completion - The Inventory Engine & Procedural Loot] - 2026-08-04

### 1. Database Schema & Data Layer (`server/prisma/schema.prisma`)
- **`Item` (Template Model)**: Normalized item templates (`id`, `name`, `description`, `lore`, `category`, `rarity`, `icon`, `sellPrice`, `buyPrice`, `maxStack`, `levelRequirement`, `createdAt`).
- **`Equipment` (Details Model)**: 1:1 relation to `Item` storing equipment slot (`Weapon`, `Helmet`, `Armor`, `Gloves`, `Boots`, `Ring`, `Necklace`, `Artifact`, `Relic`), attribute bonuses (`strength`, `knowledge`, `recovery`, `focus`, `discipline`, `endurance`, `attack`, `defense`, `hp`), and `setName`.
- **`Consumable` (Details Model)**: 1:1 relation to `Item` storing `effect`, `duration`, and `cooldown`.
- **`Inventory` (Instance Model)**: 1:N character instance relation linking `Character` to `Item` with `quantity`, `isEquipped`, and `obtainedAt`.
- **ORM Synchronization**: Formatted schema, updated SQLite database (`prisma db push`), and regenerated JS `@prisma/client` and Python `prisma` SDKs.

### 2. Client Domain Types & Pure Math Utilities (`client/src/features/inventory/`)
- **TypeScript Domain Types** (`types/inventory.ts`): Defined `ItemCategory`, `ItemRarity`, `EquipmentSlot` literal unions and `Item`, `Equipment`, `Consumable`, `InventoryRecord` interfaces.
- **Rarity Calculator** (`utils/rarityCalculator.ts`): Weighted rarity generator (`Common` to `Ancient`) scaled by character `Consistency` luck modifier, with rarity multiplier table ($1.0\times$ to $10.0\times$).
- **Equipment Generator** (`utils/equipmentGenerator.ts`): Procedural equipment generator scaling slot-appropriate attributes by floor height and rarity multipliers.
- **Combat Stat Calculator** (`utils/combatStatCalculator.ts`): Pure function merging base character attributes with equipped item bonuses into combined `CombatStats` without mutating `baseStats`.
- **Unit Test Suite** (`utils/inventoryMath.test.ts`): Vitest test suite verifying rarity rolling, equipment stat scaling, and base stats immutability (`43/43 tests passing`).

### 3. FastAPI REST Router & Server Logic (`server/routers/inventory.py`)
- **`GET /api/inventory/{character_id}`**: Fetches all character inventory records with nested `Item`, `Equipment`, and `Consumable` relations.
- **`POST /api/inventory/{character_id}/grant`**: Grants item template and inventory record to character.
- **`POST /api/inventory/{character_id}/equip/{inventory_id}`**: Equips item and enforces **single-slot equipment swapping** by setting `isEquipped = false` on any item currently occupying the same equipment slot.
- **`POST /api/inventory/{character_id}/unequip/{inventory_id}`**: Sets `isEquipped = false` on target inventory record.
- **Main Server Integration**: Mounted `inventory.router` in `server/main.py` and updated `docs/api.md`.

### 4. Inventory Store & UI Components (`client/src/features/inventory/`)
- **Zustand Store** (`store/useInventoryStore.ts`): Manages `inventory` records, `loadInventory`, `equip`, and `unequip` server synchronization.
- **`ItemCard.tsx`**: Dynamic item card styled with rarity borders and subtle glows (`Common` to `Ancient`), featuring equipment stat callouts and Equip/Unequip triggers.
- **`EquipmentPanel.tsx`**: Visual 9-slot paper doll matrix (`Weapon`, `Helmet`, `Armor`, `Gloves`, `Boots`, `Ring`, `Necklace`, `Artifact`, `Relic`) with total combined combat stats banner.
- **`InventoryGrid.tsx`**: Responsive grid of unequipped bag items with category filters (*All, Equipment, Consumable, Material, Relic*) and search bar.
- **Inventory Page Route** (`client/src/app/(dashboard)/inventory/page.tsx`): Mounted at `/inventory` route with top vault header overview.

### 5. Procedural Tower Loot Integration (`client/src/features/tower/store/useTowerStore.ts`)
- **Tower Loot Engine**: Triggers $100\%$ drop rate on Boss floors ($25\%$ standard), selects random equipment slot, generates scaled equipment stats, and persists loot via server `grantItem` endpoint.
- **Loot Drop Banner** (`CombatScreen.tsx`): Displays animated **"✨ LOOT ACQUIRED!"** banner on floor victory whenever loot drops.

---

## [Phase 5 Completion - The Tower Engine] - 2026-08-04

### 1. Database Schema & Data Layer (`server/prisma/schema.prisma`)
- **`Tower` Model**: Dungeon spire container (`id`, `name`, `description`, `theme`, `maxFloor`, `createdAt`).
- **`Enemy` Model**: Monster database (`id`, `name`, `type`, `rarity`, `baseHp`, `baseAttack`, `baseDefense`, `baseSpeed`, `image`).
- **`Floor` Model**: Dungeon floor model (`id`, `towerId`, `floorNumber`, `recommendedPower`, 6 attribute thresholds, `bossId`, `rewardPool`).
- **`FloorProgress` Model**: 1:N character floor status model (`id`, `characterId`, `floorId`, `status`, `attempts`, `bestTime`, `clearedAt`) with `@@unique([characterId, floorId])`.
- **Automatic Database Seeding**: Updated `server/db_utils.py` to auto-seed *Tower of Ascension*, *Shadow Overlord* boss enemy, Floors 1–5, and character Floor 1 progress in SQLite (`dev.db`).

### 2. Client Domain Types & Combat Utilities (`client/src/features/tower/`)
- **Domain Types** (`types/tower.ts` & `combat.ts`): Built strict TypeScript interfaces (`Tower`, `Floor`, `Enemy`, `FloorProgress`, `BattleResult`) and literal union types (`EnemyType`, `EnemyRarity`, `FloorStatus`).
- **Floor Validator** (`utils/floorValidator.ts`): Evaluates power score and 6 attribute requirements (`minStrength`, `minKnowledge`, `minRecovery`, `minDiscipline`, `minFocus`, `minEndurance`) returning human-readable requirement callouts.
- **Procedural Enemy Scaler** (`utils/enemyGenerator.ts`): Scales enemy HP ($+25\%/\text{FL}$), Attack ($+15\%/\text{FL}$), Defense ($+10\%/\text{FL}$), and Speed ($+5\%/\text{FL}$) based on floor height.
- **Turn Combat Math** (`utils/damageFormula.ts`): Knowledge armor penetration, Focus critical strikes ($1.5\times$), and Discipline damage mitigation.
- **Unit Test Suite** (`utils/towerMath.test.ts` & `services/combatEngine.test.ts`): Vitest test suite verifying access validation, floor scaling, combat damage math, and auto-battler simulations (`38/38 tests passing`).

### 3. Automated Combat Engine & Reward Calculation (`client/src/features/tower/services/`)
- **`CombatEngine.ts`**: Pure automated auto-battler turn loop simulating character vs enemy combat with Endurance HP scaling, Recovery turn healing, log streaming, and a 100-turn timeout safety cap.
- **`RewardEngine.ts`**: Pure reward calculator awarding Gold ($\lfloor 50 \times \text{floor} + \text{consistency} \times 2 \rfloor$) and EXP ($\lfloor 100 \times \text{floor} + \text{floor} \times 1.5 \rfloor$) upon floor victory.
- **Zustand Store Integration** (`store/useTowerStore.ts`): Manages active tower, floor progress, combat simulation state, server persistence syncing, and reward allocation to `useCharacterStore`.

### 4. FastAPI Backend Endpoints (`server/routers/tower.py`)
- **`GET /api/tower`**: Returns all tower spire records.
- **`GET /api/tower/{tower_id}/floors/{character_id}`**: Fetches all floors with included boss relations, merging character `FloorProgress` state (`LOCKED`, `UNLOCKED`, `CLEARED`).
- **`POST /api/tower/floors/{floor_id}/combat/{character_id}`**: Records attempt count, updates status to `CLEARED`, updates `bestTime`, and automatically unlocks the next floor ($\text{floorNumber} + 1$).
- **Main Server Integration**: Mounted `tower.router` in `server/main.py` and updated `docs/api.md`.

### 5. Spire UI & Auto-Battler Components (`client/src/features/tower/components/`)
- **`TowerMap.tsx`**: Vertical spire floor card list rendering floors 100 down to 1 with locked/unlocked/cleared badges, boss card accents, and missing requirement popovers.
- **`CombatScreen.tsx`**: Live auto-battler modal with character vs enemy health bars, staggered log streaming every $350\text{ms}$, and Victory/Defeat modal banners.
- **Tower App Page Route** (`client/src/app/(dashboard)/tower/page.tsx`): Mounted at `/tower` route with top power banner overview.

---

## [Phase 4 Completion - The Progression Engine] - 2026-08-04

### 1. Database Schema Expansion (`server/prisma/schema.prisma`)
- **`Achievement` (Template Model)**: Normalized model for permanent game achievements (`id`, `name`, `description`, `icon`, `rewardType`, `rewardAmount`, `condition`, `category`, `createdAt`, `updatedAt`).
- **`CharacterAchievement` (Instance Model)**: 1:N instance relation linking `Character` to `Achievement` with `@unique([characterId, achievementId])` and `unlockedAt`.
- **`EconomyLog` Model**: 1:N relation to `Character` tracking gold/EXP economy transactions (`id`, `characterId`, `currency`, `amount`, `reason`, `source`, `createdAt`).
- **ORM Synchronization**: Formatted schema, updated SQLite database (`prisma db push`), and regenerated JS `@prisma/client` and Python `prisma` SDKs.

### 2. Client Progression Feature & Pure Game Math (`client/src/features/progression/`)
- **Directory Architecture**: Initialized `client/src/features/progression/` directories (`components`, `hooks`, `services`, `utils`, `types`, `store`).
- **TypeScript Domain Types** (`progression.ts`): Created `CurrencyType`, `RewardType`, `LogSource`, `Achievement`, `CharacterAchievement`, and `EconomyLog` interfaces.
- **Pure Math Utilities** (`utils/`):
  - `levelFormula.ts`: Infinite exponential curve $\lfloor 100 \times \text{level}^{1.5} \rfloor$ (`calculateExpForLevel`) and dynamic level solver (`calculateLevelData`).
  - `powerFormula.ts`: Dynamic weighted stat power scoring (`(Level*50) + (Strength*8) + (Knowledge*8) + (Recovery*6) + (Focus*7) + (Endurance*7) + (Discipline*6) + (Consistency*5)`).
  - `rankFormula.ts`: Strict rank threshold mapper (`determineRank`: F, E, D, C, B, A, S, SS, SSS).
- **Unit Testing** (`progressionMath.test.ts`): Built Vitest test suite testing stat weights, missing stat fallbacks, 0 EXP edge cases, level rollover, and rank boundaries.

### 3. Decoupled Event Bus & Central Game Engine (`client/src/features/progression/services/`)
- **`EventBus.ts`**: Pure TypeScript singleton event bus supporting `'MISSION_COMPLETED'`, `'LEVEL_UP'`, `'RANK_ASCENDED'`, and `'ACHIEVEMENT_UNLOCKED'` with typed payloads.
- **`ProgressionEngine.ts`**: Central game loop listening for `'MISSION_COMPLETED'`. Computes `calculateFinalReward` and sequentially executes `addStat()`, `gainGold()`, and `gainExp()` on `useCharacterStore`.
- **Store Refactoring** (`useCharacterStore.ts` & `useHabitStore.ts`):
  - Refactored `useCharacterStore` to use `@/features/progression/utils` as single source of truth, added `gainGold` & `addStat` actions, and published `LEVEL_UP` / `RANK_ASCENDED` events.
  - Refactored `useHabitStore` to publish `MISSION_COMPLETED` to `EventBus` instead of directly mutating character state.
  - Removed deprecated `features/character/utils/` directory.

### 4. FastAPI Backend Endpoints (`server/`)
- **Pydantic Validation** (`schemas/progression.py`): Created `GoldLogSchema`.
- **Progression Router** (`routers/progression.py`): `POST /api/progression/{id}/gold` (creates economy log and updates character gold balance) & `GET /api/progression/{id}/history` (returns recent economy logs).
- **Achievements Router** (`routers/achievements.py`): `GET /api/achievements` (lists achievement templates) & `POST /api/achievements/{id}/{ach_id}` (unlocks achievement with duplicate handling).
- **Analytics Router** (`routers/analytics.py`): `GET /api/analytics/{id}/weekly` (aggregates completed mission EXP for past 7 days formatted for Recharts).
- **Main Server Integration**: Mounted routers in `server/main.py` and updated `docs/api.md`.

### 5. Client Services, Zustand Store & UI Components (`client/`)
- **Service & Store Layer**: Built `progression.service.ts`, `analytics.service.ts`, and `useProgressionStore.ts` (`goldLogs`, `weeklyExpData`, `loadGoldHistory`, `loadWeeklyAnalytics`).
- **`WeeklyExpChart.tsx` Component**: Responsive Recharts `<AreaChart>` styled with dark RPG tokens (`#0D1322` container, `#8B5CF6` gradient fill, custom tooltip).
- **`HistoryTimeline.tsx` Component**: Vertical economy ledger timeline mapping over `goldLogs` with date, reason, source badge, and color indicators.
- **`RankAscensionModal.tsx` Component**: Full-screen animated Framer Motion modal featuring rank transition animations and glowing text effects.
- **`useProgressionEvents.tsx` Hook**: Event listener hook subscribing to `EventBus` events, controlling modal state, and triggering Sonner toast celebrations.
- **Dashboard Overview Integration**: Integrated `WeeklyExpChart`, `HistoryTimeline`, and `RankAscensionModal` into `DashboardOverview.tsx`.

---

## [Phase 3 Completion - The Habit Engine] - 2026-08-04

### 1. Database Schema & Data Models (`server/prisma/schema.prisma`)
- **`Habit` (Template Model)**: Normalized model for permanent habit templates (`id`, `characterId`, `name`, `description`, `category`, `difficulty`, `primaryStat`, `isActive`, `icon`, `color`, `createdAt`, `updatedAt`).
- **`HabitSchedule` Model**: 1:1 relation with `Habit` for schedule configuration (`type`, `days`, `interval`, `startDate`, `endDate`).
- **`HabitMetrics` Model**: 1:1 relation with `Habit` tracking `habitStrength` (default 100.0), `successRate`, `completionRate`, and `currentConsistency`.
- **`Mission` (Instance Model)**: Normalized model for daily generated instances (`id`, `habitId`, `characterId`, `date`, `status`, `completionType`, `expEarned`, `statsEarned`, `completedAt`).
- **Database & Client Sync**: Ran Prisma format, SQLite db push, and client code generators (`@prisma/client` JS & Python `prisma` SDK).

### 2. Client Feature Directory & Type System (`client/src/features/habits/`)
- **Directory Structure**: Initialized `client/src/features/habits/` subdirectories: `components`, `hooks`, `services`, `utils`, `types`, `store`.
- **TypeScript Type System** (`client/src/features/habits/types/habit.ts`): Built strict TypeScript interfaces and literal unions (`HabitDifficulty`, `ScheduleType`, `MissionStatus`, `CompletionType`, `Habit`, `HabitSchedule`, `HabitMetrics`, `Mission`).
- **Verification**: Confirmed clean TypeScript compilation (`npx tsc --noEmit`) with 0 errors across Next.js client.

---

### 3. Core Habit Engine Pure Math & Unit Tests (`client/src/features/habits/utils/`)
- **`rewardFormula.ts`**: Pure functions `getBaseReward(difficulty)` (Easy: 15 EXP/5 Gold/2 Stat, Medium: 35 EXP/12 Gold/5 Stat, Hard: 75 EXP/25 Gold/10 Stat) & `calculateFinalReward(baseReward, completionType)` scaling by MINI (0.4x), NORMAL (1.0x), ELITE (1.7x) rounded.
- **`habitStrength.ts`**: Pure functions `calculateConsistency(completed, expected)` with zero-division guard and `calculateNewHabitStrength(currentStrength, status, completionType)` applying gains (MINI: +0.5, NORMAL: +1.0, ELITE: +2.0) or miss decay (-5.0) clamped to [0.0, 100.0].
- **Unit Testing** (`client/src/features/habits/utils/habitMath.test.ts`): Built Vitest test suite covering 16 edge cases (reward scaling, rounding, consistency division safety, strength growth/decay caps). Executed with 100% pass rate (25/25 total client unit tests passing).

---

### 4. FastAPI Backend Endpoints & Daily Mission Generator (`server/`)
- **Pydantic Validation Schemas** (`server/schemas/habit.py`): Defined `HabitCreateSchema` (validating name, description, category, difficulty, primaryStat, scheduleType, scheduleDays) and `MissionCompleteSchema` (strict `Literal['MINI', 'NORMAL', 'ELITE']` completionType, expEarned, statsEarned).
- **Habits Router** (`server/routers/habits.py`):
  - `POST /api/habits/{character_id}`: Creates a Habit template record along with 1:1 `HabitSchedule` and 1:1 `HabitMetrics` default relations.
  - `GET /api/habits/{character_id}`: Returns all habit templates for a character.
- **Missions Router** (`server/routers/missions.py`):
  - `GET /api/missions/today/{character_id}` (Daily Mission Generator): Evaluates active habit templates, checks today's date boundary, auto-generates missing `PENDING` mission instances, and returns all today's missions.
  - `POST /api/missions/{mission_id}/complete`: Marks a mission instance as `COMPLETED`, records completion tier and rewards, and updates parent `HabitMetrics` habit strength.
- **Server Integration & API Documentation**: Mounted routers in `server/main.py` and updated `docs/api.md`. Verified clean Python bytecode compilation.


---

### 7. Daily Dashboard & Tier Completion Flow (`client/`)
- **`MissionCard.tsx` Component** (`client/src/features/habits/components/MissionCard.tsx`): Reusable mission item card displaying habit metadata, category badge, difficulty tier, primary stat icon, and completion tier actions (**MINI 40%**, **NORMAL 100%**, **ELITE 170%**). Displays completion badge when finished.
- **Dashboard Overview Integration** ([`client/src/features/dashboard/components/DashboardOverview.tsx`](file:///d:/real%20ascend%20os/client/src/features/dashboard/components/DashboardOverview.tsx)):
  - Connected `useHabitStore` and `useCharacterStore` with auto-mounting `useEffect` hooks.
  - Rendered personalized greeting (*"Good Morning, {character.name}"*).
  - Integrated Daily Mission Board feed mapping `todayMissions` to `MissionCard` components.
  - Wired live completion actions to `executeMissionCompletion`, instantly rewarding EXP/Stats, updating power scores, animating level-ups, and logging activity history.
  - Added empty state card with "+ Forge Habit Mission" CTA.
- **Verification**: Clean TypeScript compilation (`npx tsc --noEmit`) and 25/25 unit tests passing.


### 6. Mission Creation Wizard UI Component & Page Route (`client/`)
- **`MissionWizard.tsx` Component** (`client/src/features/habits/components/MissionWizard.tsx`): 6-step animated wizard using Framer Motion (`AnimatePresence`, `motion.div`) styled with dark RPG tokens (`#151C33` card surface, `#0B1020` inputs/previews, ambient blue/purple radial glows).
  - Step 1: Habit Name & Description.
  - Step 2: Domain Category grid selector (*Health, Fitness, Productivity, Mindfulness, Learning, Finance*).
  - Step 3: Primary Stat attribute selector (*Strength, Knowledge, Discipline, Focus, Endurance, Recovery, Consistency*).
  - Step 4: Difficulty tier selector (*Easy, Medium, Hard*).
  - Step 5: Schedule cadence selector (*Daily, Weekly, Monthly*).
  - Step 6: Confirmation Summary Card showing selected parameters and dynamic `getBaseReward` yield calculation (EXP, Gold, Stat points).
- **Dedicated Page Route** ([`client/src/app/(dashboard)/missions/create/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28dashboard%29/missions/create/page.tsx)): Centered wizard page.
- **Verification**: Clean TypeScript compilation (`npx tsc --noEmit`) and 25/25 unit tests passing.


### 5. Habit Service Layer & Zustand Engine Bridge (`client/src/features/habits/`)
- **Client API Service** (`client/src/features/habits/services/habit.service.ts`): Async fetch wrappers for FastAPI backend endpoints (`createHabit`, `fetchHabits`, `fetchTodayMissions`, `completeMission`).
- **Habit Zustand Store** (`client/src/features/habits/store/useHabitStore.ts`):
  - State: `habits: Habit[]`, `todayMissions: Mission[]`, `isLoading: boolean`.
  - Actions: `loadHabits`, `loadTodayMissions`, `createNewHabit` (creates habit and refreshes mission board), `executeMissionCompletion`.
- **Habit $\rightarrow$ Character Engine Bridge**: `executeMissionCompletion` calculates exact EXP/Stat yields via pure math (`getBaseReward`, `calculateFinalReward`), optimistically updates `todayMissions` state to `COMPLETED`, triggers `useCharacterStore.getState().gainExp(calculatedExp, reason)` (leveling up character, updating power/rank, showing toast notifications), and fires non-blocking background API persistence.
- **Verification**: Clean TypeScript compilation (`npx tsc --noEmit`) and 25/25 unit test suite pass.


## [Phase 2 Completion] - 2026-08-03

### 1. Database Schema Expansion & Normalization (`server/prisma/schema.prisma`)
- **Character Model Expansion**: Added RPG attributes `level` (default 1), `exp` (default 0), `power` (default 0), `rank` (default "F"), and `gold` (default 0).
- **CharacterStats Model**: Created normalized 1:1 relation to `Character` tracking 7 core stat attributes (`strength`, `knowledge`, `discipline`, `focus`, `endurance`, `recovery`, `consistency`).
- **ProgressHistory Model**: Created normalized 1:N relation to `Character` logging audit logs (`type`, `amount`, `description`, `createdAt`).

---

### 2. Isolated Pure Game Math Engine (`client/src/features/character/utils/`)
- **`calculateLevel.ts`**: Pure function `calculateLevelData(totalExp)` returning `{ currentLevel, currentExpInLevel, expToNextLevel, progressPercentage }` based on progressive EXP thresholds (Level 1: 100 EXP, Level 2: 250 EXP, Level 3: 450 EXP, etc.).
- **`calculatePower.ts`**: Pure function `calculatePower(level, stats)` using the RPG formula `(level * 50) + (Total sum of stats * 10)`.
- **`calculateRank.ts`**: Pure function `calculateRank(power)` mapping power scores to RPG ranks (F: 0-499, E: 500-1499, D: 1500-2999, C: 3000-4999, B: 5000-7999, A: 8000-11999, S: 12000-17999, SS: 18000-24999, SSS: 25000+).
- **Barrel Export**: Clean re-export of all math functions from `index.ts`.

---

### 3. Zustand Game Engine Pipeline (`client/src/store/useCharacterStore.ts`)
- **State Initialization**: Set default RPG character state with initial stats, power (50), rank ("F"), and empty history array.
- **Core Game Loop (`gainExp`)**: Calculates updated level progression, computes new power score and rank, triggers `sonner` level up toast notifications, optimistically updates state, and fires asynchronous background persistence sync.
- **Identity Customization (`updateIdentity`)**: Merges partial identity fields and fires background identity updates.
- **Profile Loader (`loadCharacter`)**: Fetches profile data from backend.

---

### 4. FastAPI Character Router & Pydantic Schemas (`server/`)
- **Pydantic Schemas** (`server/schemas/character.py`): Defined `CharacterUpdateSchema`, `HistoryEntrySchema`, and `ProgressionSyncSchema`.
- **Modular Router** (`server/routers/character.py`):
  - `GET /api/character/{character_id}`: Fetches character profile with included `stats` and `history`.
  - `PATCH /api/character/{character_id}`: Performs partial updates on identity attributes.
  - `POST /api/character/{character_id}/sync-progression`: Syncs progression attributes and logs a `ProgressHistory` record.
- **Main Server Integration** (`server/main.py`): Created shared `server/db.py` module and mounted `character.router`.

---

### 5. Frontend Service Layer & UI Interfaces
- **Character API Service** (`client/src/features/character/services/character.service.ts`): Client-side fetch wrapper pointing to FastAPI backend endpoints.
- **Character Profile Page** ([`client/src/app/(dashboard)/profile/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28dashboard%29/profile/page.tsx)): High-fidelity dark RPG hero card, EXP progress bar, **"Simulate Training (+150 EXP)"** trigger button, 8-stat matrix grid, and Progress History activity feed.
- **Settings Page** ([`client/src/app/(dashboard)/settings/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28dashboard%29/settings/page.tsx)): Character customization dashboard with live identity preview, name input (max 20 chars), title selection pills, 5 color accent swatches, and 5 class avatar archetype cards.

---

## [Phase 1 Completion] - 2026-08-03

### 1. Foundational UI Components & Entry Point
- **Shadcn/UI Installation**: Initialized `components.json` with slate base color, CSS variables, and path aliases (`@/components`, `@/components/ui`, `@/lib/utils`).
- **Core UI Primitives**: Added 6 foundational components in [`client/src/components/ui/`](file:///d:/real%20ascend%20os/client/src/components/ui):
  - [`button.tsx`](file:///d:/real%20ascend%20os/client/src/components/ui/button.tsx): Extended with RPG color variants (`default`, `gold`, `secondary`, `destructive`, `outline`, `ghost`, `link`).
  - [`card.tsx`](file:///d:/real%20ascend%20os/client/src/components/ui/card.tsx): `#151C33` dark RPG surface with rounded `20px` corners.
  - [`input.tsx`](file:///d:/real%20ascend%20os/client/src/components/ui/input.tsx): Form inputs styled with `#0B1020` background and focus glows.
  - [`badge.tsx`](file:///d:/real%20ascend%20os/client/src/components/ui/badge.tsx): Status badges for RPG ranks and titles.
  - [`skeleton.tsx`](file:///d:/real%20ascend%20os/client/src/components/ui/skeleton.tsx): Pulse loading placeholders.
  - [`dropdown-menu.tsx`](file:///d:/real%20ascend%20os/client/src/components/ui/dropdown-menu.tsx): Accessible Radix UI dropdown menus.
- **Public Layout** ([`client/src/app/(public)/layout.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28public%29/layout.tsx)): Created a clean layout featuring exclusively the minimal Ascend OS logo header.
- **Landing Page** ([`client/src/app/(public)/landing/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28public%29/landing/page.tsx)): Built a dark-themed hero page using `#0B1020` background, `#151C33` surface cards, radial ambient lights, stat callouts, and two primary Shadcn CTA buttons (**"Log In"** and **"Start Journey"**).
- **Root Redirect** ([`client/src/app/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/page.tsx)): Set root page to automatically redirect visitors to `/landing`.

---

### 2. Authentication Layout & Guest Flow
- **Auth Layout Container** ([`client/src/components/layouts/AuthLayout.tsx`](file:///d:/real%20ascend%20os/client/src/components/layouts/AuthLayout.tsx)): Built centered auth layout with radial blue background glow and top-left **"Back to Home"** link (`/landing`).
- **Registration Form** ([`client/src/app/(auth)/register/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28auth%29/register/page.tsx)):
  - Fields: Email, Password, Confirm Password.
  - Live **Password Validation Checklist** (Min 8 Characters, Uppercase Letter, Number, Special Character) with real-time green checkmark state indicators.
  - Primary **"Create Account"** button pushing to `/onboarding`.
- **Login Form** ([`client/src/app/(auth)/login/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28auth%29/login/page.tsx)): Clean login form with credential inputs, **"Sign In"** CTA pushing to `/onboarding`, and navigation links.
- **Guest Sandbox Mode** ([`client/src/app/(auth)/guest/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28auth%29/guest/page.tsx)): Informational guest sandbox card with assigned identity preview (`Guest-4839`) and **"Generate Guest Identity"** button pushing to `/onboarding`.

---

### 3. Character Creation Onboarding Wizard
- **Onboarding Page** ([`client/src/app/onboarding/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/onboarding/page.tsx)):
  - **Identity Input**: Text input for character Name (max 20 chars, `"Cyrill"` placeholder).
  - **12 Avatar Archetype Grid**: Selectable class emblem cards (*Warrior, Paladin, Monarch, Pyromancer, Stormweaver, Pathfinder, Sage, Deadeye, Astral, Alchemist, Shadow, Reaper*) with blue ring glows.
  - **5 UI Theme Color Swatches**: Swatches for **Blue** (`#2563EB`), **Purple** (`#9333EA`), **Green** (`#10B981`), **Red** (`#EF4444`), and **Gold** (`#F59E0B`).
  - **Cosmetic Starting Titles**: Selectable pills (*Wanderer, Dreamer, Scholar, Adventurer, Rookie*).
  - **Live RPG Character Card Preview**: Real-time rendering card reflecting chosen Name, Title, Avatar Emblem, Level 1 rank, theme bar, and initial attribute meters.
  - **Confirmation Action**: **"Begin Journey"** CTA button pushing to `/dashboard`.

---

### 4. Dashboard Layout & Navigation Layer
- **Persisted Theme Store** ([`client/src/store/useThemeStore.ts`](file:///d:/real%20ascend%20os/client/src/store/useThemeStore.ts)): Configured Zustand `persist` middleware supporting **Dark**, **Light**, and **System** modes saved to `localStorage`.
- **Desktop Sidebar** ([`client/src/components/Sidebar.tsx`](file:///d:/real%20ascend%20os/client/src/components/Sidebar.tsx)): Responsive sidebar (`hidden md:flex`) containing 8 core navigation links (**Dashboard**, **Character**, **Missions**, **Tower**, **Inventory**, **Analytics**, **AI System**, **Settings**).
- **Topbar with Theme Switcher** ([`client/src/components/Topbar.tsx`](file:///d:/real%20ascend%20os/client/src/components/Topbar.tsx)):
  - Search input (`Search quests, stats, items... (Ctrl+K)`).
  - Notifications bell with pulsing alert badge.
  - Theme Switcher dropdown toggle (Dark, Light, System).
  - Profile Avatar dropdown menu using Shadcn `DropdownMenu`.
- **Mobile Bottom Navigation** ([`client/src/components/MobileBottomNav.tsx`](file:///d:/real%20ascend%20os/client/src/components/MobileBottomNav.tsx)): Sticky bottom bar (`md:hidden fixed bottom-0`) with tabs for **Home**, **Missions**, **Tower**, **Profile**, and **Settings**.
- **Final Mock Dashboard Grid** ([`client/src/features/dashboard/components/DashboardOverview.tsx`](file:///d:/real%20ascend%20os/client/src/features/dashboard/components/DashboardOverview.tsx)):
  - **Character Overview Card**: Level 1, Rank E, Power 0, XP progress bar.
  - **AI System Panel Card**: *"Ciel Initialization Pending..."* AI greeting.
  - **Today's Missions Card**: *"No active missions. Generate a daily plan."* with CTA button.
  - **Tower Access Card**: *"Floor 1 Locked - Requires Level 5"* with lock badge.
  - **Inventory Preview Card**: 4 empty equipment slots with dashed borders.
  - **Recent Activity & Analytics Card**: *"Data collection initiating..."* timeline placeholder.

---

### 5. Loading Experiences & Error Pages
- **Dashboard Skeleton** ([`client/src/app/(dashboard)/loading.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28dashboard%29/loading.tsx)): Next.js App Router skeleton using Shadcn `<Skeleton>` to mirror the 6-card grid layout during navigation.
- **Global Loading Screen** ([`client/src/app/loading.tsx`](file:///d:/real%20ascend%20os/client/src/app/loading.tsx)): Centered transition screen with a pulsing Ascend OS logo badge (`Sparkles`), ambient radial blue light, and spinner (`Loader2`).
- **404 Lost in the Void Page** ([`client/src/app/not-found.tsx`](file:///d:/real%20ascend%20os/client/src/app/not-found.tsx)): Thematic 404 screen with void anomaly visual, error code badge (`0x404_ROUTE_UNBOUND`), and **"Return to Dashboard"** button.
- **Reusable Empty State Component** ([`client/src/components/shared/EmptyState.tsx`](file:///d:/real%20ascend%20os/client/src/components/shared/EmptyState.tsx)): Generic UI component accepting `icon`, `title`, `description`, and `action` for empty lists/inventories.
- **Unauthorized Page** ([`client/src/app/(auth)/unauthorized/page.tsx`](file:///d:/real%20ascend%20os/client/src/app/%28auth%29/unauthorized/page.tsx)): Route protection screen titled **"Access Denied - Ascendant Status Required"** with a link to `/login`.

---

## Technical Verification Summary
- **TypeScript Compilation**: Clean compilation across `/client` and `/server`.
- **Responsive Layout**: Fully responsive application shell supporting Mobile, Tablet, and Desktop breakpoints.
