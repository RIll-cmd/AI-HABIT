# 🌌 Ascend OS

> **The Next-Generation Gamified Self-Mastery & Physical Evolution Operating System**  
> *Transform real-world workouts, habit streaks, mental focus, and physical discipline into an RPG ascension system.*

---

## ⚡ System Architecture Overview

Ascend OS is built as a high-performance, modular full-stack application combining a modern Next.js React frontend with a FastAPI Python backend and SQLite/Prisma ORM data engine.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               ASCEND OS FRONTEND                            │
│  Next.js 16 (App Router) • TypeScript • Tailwind CSS • Framer Motion        │
│  Anatomical SVG Heatmap • Web Audio SFX • Cyberpunk HUD Design System       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (JSON)
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                               ASCEND OS BACKEND                             │
│  FastAPI • Python 3.12+ • Prisma Client Python • Pydantic v2                │
│  Time-Decay Recovery Engine • Combat Power Score Engine • Beast Incubator   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ ORM
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                              DATABASE STORAGE                               │
│  SQLite (dev.db) / Prisma ORM • Full Relational Schema                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏆 Core Feature Modules

### 1. 🩻 Interactive Anatomical Body Muscle Heatmap & Recovery Engine
- **Vector Anatomical Silhouette**: Multi-layer interactive SVG covering all 16 canonical muscle groups across anterior (front) and posterior (back) views.
- **Dynamic Time-Decay Math**: Muscles automatically regenerate in real-time ($48\text{h}$ standard, $72\text{h}$ compound) on fetch using UTC timestamps.
- **Color Coded Telemetry**:
  - `80%–100%`: Neon Cyan (Optimal Readiness)
  - `40%–79%`: Electric Amber (Active Regeneration)
  - `0%–39%`: Crimson / Neon Red (Heavy Fatigue)
- **Workout Logger**: Multi-set logger with auto-suggest exercise database, KG/LBS conversion, and live fatigue projection.

### 2. 🐉 Beast Egg Incubation & Hatching System
- Physical step counts and energy workouts feed into incubating elemental beast eggs.
- Crack and hatch **20 unique animated dragon pets** (`beast_1.gif` $\dots$ `beast_20.gif`) granting passive stat boosts.

### 3. ⚔️ Dungeon Tower of Ascension & Boss Raids
- Battle through escalating monster floors with turn-based combat scaling.
- Challenge weekly community & solo PR bosses to test estimated 1-Rep Max benchmarks.

### 4. 🧙 Character Identity, Equipment & PaperDoll
- Visual PaperDoll with 9 equipment slots (Helmet, Weapon, Armor, Gloves, Boots, Ring, Necklace, Artifact, Relic).
- RPG Power Score calculations driven by Level, Attributes, Titles, and Specializations.

### 5. 🎯 Habit Mastery & Kanban Quests
- Daily repeatable habit tracking with streak multipliers and freeze mechanics.
- Interactive Kanban mission board for long-term quest progression.

---

## 🛠️ Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: 3.10+ (3.12+ recommended)
- **Git**

---

### Backend Setup (`server/`)

```bash
cd server

# Create and activate Python virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate Prisma Client & Sync Database
prisma db push
prisma generate

# Start FastAPI Core Server
python main.py
```
*Backend server runs at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.*

---

### Frontend Setup (`client/`)

```bash
cd client

# Install NPM dependencies
npm install

# Start Next.js Development Server
npm run dev
```
*Frontend application runs at `http://localhost:3000`.*

---

### Running Production Build

```bash
cd client
npm run build
npm run start
```

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests
```bash
cd server
python -u tests/test_muscle_recovery.py
python -u tests/test_beasts.py
```

### Frontend Typechecking & Compilation
```bash
cd client
npm run build
```

---

## 🔒 Security & Privacy

- Sensitive `.env` configuration files and local SQLite databases are strictly ignored by `.gitignore`.
- Password hashing powered by bcrypt.
- Input validation enforced at runtime via Pydantic v2 schemas.

---

## 📜 License
Ascend OS is distributed under the MIT License.
