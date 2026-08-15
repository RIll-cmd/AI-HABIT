# Repository Folder Structure

```
/ (Root Workspace)
├── client/                              # Next.js 16 Frontend (App Router + Turbopack)
│   ├── public/                          # Static Assets (Sprites, Icons, Sound Effects)
│   │   ├── beasts/                      # Animated Dragon GIFs (beast_1.gif - beast_20.gif)
│   │   ├── dragons/                     # HD Dragon GIFs (dragon_1.gif - dragon_20.gif)
│   │   ├── eggs/                        # Elemental Egg Icons (egg_1.png - egg_20.png)
│   │   ├── pets and eggs_icons/         # Hatching Sprite Catalogs
│   │   └── sounds/                      # Web Audio Library (AIRA Persona, Battle SFX, UI SFX)
│   ├── src/
│   │   ├── app/                         # Next.js App Router
│   │   │   ├── (auth)/                  # Auth Route Group (/login, /register, /guest)
│   │   │   ├── (dashboard)/             # Main App Route Group
│   │   │   │   ├── beasts/              # /beasts (Egg Incubator & Bestiary Matrix)
│   │   │   │   ├── bosses/              # /bosses (Raid Encounters)
│   │   │   │   ├── dashboard/           # /dashboard (Main HUD Overview)
│   │   │   │   ├── habits/              # /habits (Habits & Kanban Quests)
│   │   │   │   ├── inventory/           # /inventory (PaperDoll & Items)
│   │   │   │   ├── shop/                # /shop (Merchant & Egg Shop)
│   │   │   │   ├── skills/              # /skills (Skill Tree & Elemental Paths)
│   │   │   │   ├── tower/               # /tower (Tower of Ascension)
│   │   │   │   ├── workouts/            # /workouts (Body Heatmap & Workout Logger)
│   │   │   │   │   └── boss-pr/         # /workouts/boss-pr (Weekly PR Challenge)
│   │   │   │   └── settings/            # /settings (Sound, Theme, Audio Sliders)
│   │   │   ├── layout.tsx               # Root Layout
│   │   │   └── page.tsx                 # Root Landing / Redirect
│   │   ├── components/                  # Shared Design Components
│   │   │   ├── ui/                      # Base UI Kit (SystemTooltip, Button, Badge, Card, etc.)
│   │   │   └── workout/                 # Workout Components (BodyHeatmap, MuscleRecoveryHUD, LoggerModal)
│   │   ├── features/                    # Feature-Based Modules
│   │   │   ├── beasts/                  # Beast Incubator & Bestiary Domain
│   │   │   ├── bosses/                  # Boss Raids Domain
│   │   │   ├── character/               # Character & Progression Domain
│   │   │   ├── dashboard/               # Dashboard Overview & Widgets
│   │   │   ├── habits/                  # Habit & Kanban Mission Domain
│   │   │   ├── inventory/               # PaperDoll & Inventory Domain
│   │   │   ├── shop/                    # Merchant & Shop Domain
│   │   │   ├── skills/                  # Skill Tree Domain
│   │   │   ├── tower/                   # Dungeon Tower Domain
│   │   │   └── workouts/                # Fitness & Muscle Recovery Domain
│   │   ├── hooks/                       # Shared React Hooks
│   │   ├── types/                       # Global TypeScript Interfaces
│   │   ├── utils/                       # Utilities (Audio, Sprites, Animations)
│   │   └── store/                       # Zustand Global Stores
├── server/                              # FastAPI Python Backend
│   ├── main.py                          # Server Entry Point & Router Registration
│   ├── db.py                            # Prisma Client Database Connection
│   ├── db_utils.py                      # Character Auto-Initialization Utilities
│   ├── prisma/                          # Prisma Schema & SQLite DB
│   │   ├── dev.db                       # Local SQLite Database
│   │   └── schema.prisma                # Relational Database Schema
│   ├── routers/                         # Domain API Routers
│   │   ├── auth.py                      # User Authentication & JWT
│   │   ├── beasts.py                    # Dragon Incubation & Bestiary API
│   │   ├── bosses.py                    # Boss Raid Encounters
│   │   ├── character.py                 # Character Progression & Stats
│   │   ├── crafting.py                  # Blacksmith Crafting & Materials
│   │   ├── fitness.py                   # Fitness Sessions & PRs
│   │   ├── habits.py                    # Habit CRUD & Schedules
│   │   ├── inventory.py                 # Player Items & Equipment
│   │   ├── missions.py                  # Daily Quests & Kanban
│   │   ├── shop.py                      # Daily Store & Egg Shop
│   │   ├── skills.py                    # SP Unlocks & Skill Tree
│   │   ├── tower.py                     # Tower Floors & Combat
│   │   └── workouts.py                  # Muscle Recovery Engine & Logger
│   ├── schemas/                         # Pydantic v2 Validation Schemas
│   ├── services/                        # Business Logic & Math Engines
│   ├── tests/                           # Automated Backend Test Suites
│   │   ├── test_beasts.py               # Beast Incubation & Hatching Tests
│   │   └── test_muscle_recovery.py      # Muscle Recovery & Fatigue Tests
│   └── venv/                            # Python Virtual Environment
├── docs/                                # System & Architecture Documentation
│   ├── api.md                           # REST API Specifications
│   ├── architecture.md                  # System Architecture
│   ├── beasts-incubation-architecture.md# Beast Incubator & Dragon Hatching Spec
│   ├── changelog.md                     # Development Changelog
│   ├── database.md                      # Database Schema & Relational Models
│   ├── fitness-architecture.md          # Fitness, Heatmap & Boss Architecture
│   ├── folder-structure.md              # Repository File Tree Guide
│   └── roadmap.md                       # Strategic Roadmap
└── README.md                            # Production README & Setup Guide
```
