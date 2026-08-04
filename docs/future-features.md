# Ascend OS - Future Features & Product Backlog

This document serves as the official product backlog for **Ascend OS (AI-Powered Life RPG Platform)**. It consolidates all planned enhancements, deferred technical debt, future game engines, and "Nice-to-Have" recommendations extracted from Phase 1, Phase 2, and Phase 3 master checklists.

---

## 1. Phase 1: Core UI/UX & Platform Shell

Enhancements to user interaction, account management, dashboard customization, and sensory feedback.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **Guest Account Conversion Pipeline** | Auth / Identity | `/guest` $\rightarrow$ `/register` | Allow temporary guest accounts (e.g. `Guest-4839`) to seamlessly convert into permanent registered accounts without losing character identity, EXP, or habit history. |
| **Drag-and-Drop Dashboard Widgets** | Frontend UI | Dashboard | Allow users to reorder, resize, and toggle dashboard cards (Character Overview, Quest Board, AI Panel, Inventory, Tower) using `@hello-pangea/dnd` or `dnd-kit`. |
| **Dynamic Theme Swatch CSS Injector** | Frontend Styling | System Theme | Inject custom CSS variables based on selected theme swatch (Blue `#2563EB`, Purple `#9333EA`, Green `#10B981`, Red `#EF4444`, Gold `#F59E0B`) affecting borders, ambient glows, and progress gradients. |
| **Ambient Audio & Sound Effects Engine** | Audio UX | Global | Optional Web Audio API engine providing tactile sound effects for button clicks, mission completions, tier selections, and level-up chimes. |
| **Global Command Palette (`Ctrl+K`)** | Navigation | Topbar | Interactive search modal allowing instant navigation, habit creation shortcuts, character stat lookup, and command execution. |
| **Unlockable Avatar Archetypes** | Customization | Settings / Profile | Expand initial 12 avatar emblems with unlockable prestige avatar archetypes awarded via level milestones or Tower floor victories. |

---

## 2. Phase 2: Character Engine & RPG Mechanics

Advanced character progression, stat allocation, equipment armory, and class evolution.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **Unallocated Stat Points Allocation Wizard** | Game Logic | Profile / Level Up | Award unallocated attribute points upon level-up. Provide an interactive stat allocation wizard allowing users to distribute points into Strength, Knowledge, Discipline, Focus, Endurance, Recovery, or Consistency. |
| **Equipment & Inventory Armory System** | RPG System | `/inventory` | Full equipment system supporting 4 slots (Weapon, Armor, Relic, Accessory). Items provide stat bonuses and power score multipliers (`Power = Level*50 + Stats*10 + EquipmentBonus + Titles`). |
| **Character Class Evolution & Skill Trees** | RPG System | Profile | Class specialization branching (e.g. *Warrior* $\rightarrow$ *Paladin* / *Berserker*, *Mage* $\rightarrow$ *Stormweaver* / *Archmage*) with unlocked passive perks based on stat distributions. |
| **Milestone Achievement Titles** | Gamification | Settings | Unlockable cosmetic titles (e.g. *Hydration Monarch*, *Century Reader*, *Tower Conqueror*, *The Survivor*) earned by reaching specific habit strength or level thresholds. |
| **Dedicated Profile Sub-Routes** | Navigation | `/profile/*` | Build dedicated sub-routes `/profile/stats` (attribute matrix detail), `/profile/history` (chronological timeline), and `/profile/customize` (avatar & theme manager). |

---

## 3. Phase 3: Habit Engine & Reality Layer

Automated backend jobs, advanced scheduling, consistency tracking, and dedicated sub-views.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **Automated Midnight Strength Decay Cron Job** | Backend Job | FastAPI / Celery | Scheduled background job running at midnight UTC. Evaluates yesterday's uncompleted missions, marks them `MISSED`, and applies the `-5.0` strength decay formula to `HabitMetrics`. |
| **Complex Specific-Days & Cron Parsing** | Engine Utility | Schedule Engine | Implement full RRule / Cron expression parser supporting specific days (e.g. "Every Monday & Thursday", "Alternate Weeks") in `HabitSchedule`. |
| **Dedicated `/calendar` Consistency Grid View** | Frontend UI | `/calendar` | Interactive monthly calendar view displaying daily completion heatmaps (GitHub-style contribution grid) color-coded by completion rate. |
| **Dedicated `/missions/history` Timeline UI** | Frontend UI | `/missions/history` | Chronological activity feed showing historical mission completion logs, earned EXP/Stats, and completion tier breakdown (`MINI`, `NORMAL`, `ELITE`) with date filtering. |
| **Dedicated `/missions` & `/missions/[id]` Views** | Frontend UI | `/missions` | Full habit manager list view for editing/deactivating habit templates and detailed habit inspect page (`/missions/[id]`). |
| **Streak Freeze Shields & Streak Tokens** | Gamification | Habit Store | Consumable item shields purchased with earned Gold to protect Habit Strength from decaying on emergency missed days. |

---

## 4. Phase 4: Auth, Security & Infrastructure

Production security, session management, and authentication pipelines.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **FastAPI JWT Authentication Engine** | Backend Security | Auth Router | Secure password hashing via `passlib` (bcrypt) and JWT access/refresh token generation (`python-jose`). |
| **OAuth 2.0 Single Sign-On** | Authentication | Auth Pages | Social login support for Google, GitHub, and Discord OAuth 2.0 providers. |
| **Next.js Middleware Route Guarding** | Frontend Security | Middleware | Protect `/dashboard`, `/profile`, `/settings`, `/missions` routes, redirecting unauthenticated traffic to `/login`. |
| **Database Migration & PostgreSQL Deployment** | Infrastructure | Database | Migration target from local SQLite (`dev.db`) to production PostgreSQL / Supabase instance for multi-tenant scalability. |

---

## 5. Phase 5: Ascension Tower & AI Administrator (Ciel)

Simulated idle RPG combat engine and Generative AI mission optimization.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **Ascension Tower Combat Engine** | Idle RPG Game | `/tower` | Turn-based idle dungeon combat where floor bosses (e.g. *Floor 1: Procrastination Specter*) challenge the character. Victory depends on Level, Power Score, and Stat Distribution. |
| **Ciel AI Dynamic Dialogue & Reflective Feedback** | GenAI / LLM | AI System Panel | Integrate Gemini / LLM API for Ciel. Ciel analyzes user habit consistency, provides daily motivational dialogues, and suggests AI-generated mission adjustments. |
| **Multiplayer Guilds & Co-op Raid Bosses** | Social RPG | Guilds | Party up with other Ascendants to take down massive Raid Bosses requiring collective weekly habit completions. |
