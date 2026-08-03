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

## Phase 3: Auth & Identity Infrastructure (JWT & Authentication)
- [ ] Implement bcrypt password hashing and JWT token generation in FastAPI.
- [ ] Connect login/register frontend forms with authentication endpoints.
- [ ] Protect dashboard layout with route middleware.

## Phase 4: Reality Layer & Habit Tracking Domain
- [ ] Continuous Habit Strength modeling ($S_t \in [0.0, 1.0]$).
- [ ] Task completion and failure fractional decay logic.
- [ ] Daily Quest Board generation.

## Phase 5: Tower Engine & AI System Administrator (Ciel)
- [ ] Simulated idle RPG Tower combat engine.
- [ ] Ciel AI reflective dialogue and mission optimization vector analysis.
