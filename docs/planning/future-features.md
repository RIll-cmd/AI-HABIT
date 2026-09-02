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

## 4. Phase 4: Progression Engine & Economy

Progression engine extensions, achievement UI, shop economy, and long-term analytics.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **Dedicated Achievements Gallery UI** | Gamification | `/achievements` | Interactive grid view displaying locked and unlocked achievements, category filters (*Habits, Workout, Social, Tower, AI, Special*), progress meters (e.g. `45/100 Missions`), and claim reward triggers. |
| **Complex Multi-Condition Event Evaluator** | Progression Engine | Backend / Engine | Background worker evaluating complex achievement conditions (`MISSIONS_100`, `LEVEL_20`, `GOLD_5000`, `STREAK_30`) whenever events publish to `EventBus`. |
| **Year-over-Year & Monthly Analytics** | Analytics Engine | `/analytics` | Expand backend analytics endpoints (`/api/analytics/{id}/monthly`, `/api/analytics/{id}/yearly`) with Recharts bar charts, category breakdown pie charts, and stat growth velocity trends. |
| **Hunter Shop & Gold Expenditure Vault** | Economy System | `/shop` | Merchant shop allowing users to spend earned Gold on consumable streak shields, double EXP tokens, cosmetic title scrolls, and glowing profile borders. |
| **Season Pass & Ascension Reward Track** | Gamification | `/season-pass` | 50-tier seasonal progression track awarding exclusive titles, emblems, and gold upon reaching seasonal EXP thresholds. |

---

## 5. Phase 5: Auth, Security & Infrastructure

Production security, session management, and authentication pipelines.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **FastAPI JWT Authentication Engine** | Backend Security | Auth Router | Secure password hashing via `passlib` (bcrypt) and JWT access/refresh token generation (`python-jose`). |
| **OAuth 2.0 Single Sign-On** | Authentication | Auth Pages | Social login support for Google, GitHub, and Discord OAuth 2.0 providers. |
| **Next.js Middleware Route Guarding** | Frontend Security | Middleware | Protect `/dashboard`, `/profile`, `/settings`, `/missions` routes, redirecting unauthenticated traffic to `/login`. |
| **Database Migration & PostgreSQL Deployment** | Infrastructure | Database | Migration target from local SQLite (`dev.db`) to production PostgreSQL / Supabase instance for multi-tenant scalability. |

---

## 6. Phase 6: Codex, Equipment Sets & AI Administrator (Ciel)

Lore compendiums, equipment set bonuses, alchemy crafting, and Generative AI habit optimization.

| Feature / Enhancement | Category | Target Scope | Description |
| :--- | :--- | :--- | :--- |
| **The Lore Codex Compendium UI** | Collection / Lore | `/codex` | Interactive compendium tracking discovered weapons, armor, relics, monsters, and bosses. Unlocks flavor lore entries, global collection percentages, and completion achievements. |
| **Equipment Set Bonus System** | RPG Mechanics | Inventory Engine | Grants passive attribute buffs when wearing matching set pieces (e.g. *2-piece Guardian: Defense +15*, *3-piece Guardian: Recovery +20 & Damage Reduction +10%*). |
| **Consumables & Alchemy Forge Crafting** | Economy System | `/crafting` | Potion consumption for temporary combat buffs and blacksmith forge crafting combining monster cores, dragon scales, and crystals into epic equipment. |
| **Multi-Tower Spire Expansions** | Dungeon World | `/tower` | Specialized themed towers (*Tower of Knowledge*, *Tower of Strength*, *Tower of Discipline*, *Tower of Eternity*) testing specific stat builds and awarding unique title trophies. |
| **AI Defeat Analysis Diagnostic** | AI System | Combat Modal | Automated post-combat diagnostic analyzing combat loss logs and recommending target real-life habits based on the attribute deficit that caused the defeat (e.g., *"Recovery too low. Complete 3 Sleep missions to increase HP"*). |
| **Ciel AI Dynamic Dialogue & Vector Feedback** | GenAI / LLM | AI System Panel | Integrate Gemini / LLM API for Ciel. Ciel analyzes user habit consistency, provides daily motivational dialogues, and suggests AI-generated mission adjustments. |
| **Multiplayer Guilds & Co-op Raid Bosses** | Social RPG | Guilds | Party up with other Ascendants to take down massive Raid Bosses requiring collective weekly habit completions. |
