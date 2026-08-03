# Product Roadmap

## Phase 1: SaaS MVP Skeleton (Completed)
- [x] Feature-based directory reorganization.
- [x] Dark SaaS design tokens injection (`#0B1020` & `#151C33`).
- [x] Zustand state slices initialization (`AuthStore`, `CharacterStore`, `ThemeStore`, `NavigationStore`).
- [x] Database pruning to `User` and `Character` models.
- [x] App Router routes (`/login`, `/register`, `/guest`, `/dashboard`, `/profile`, `/settings`).
- [x] System documentation initialization in `/docs`.

## Phase 2: Auth Implementation & JWT Sessions
- [ ] Implement bcrypt hashing and JWT token generation in FastAPI.
- [ ] Connect login/register frontend forms with authentication endpoints.
- [ ] Protect dashboard layout with route middleware.

## Phase 3: Domain Modules & Systems
- [ ] Habit tracking domain integration.
- [ ] Progression engine and analytics visualizations.
