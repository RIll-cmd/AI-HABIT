# Fitness Engine & Boss Architecture

The Fitness Engine transforms real-world physical exercise into RPG progression, evaluating performance against scientific strength models, managing progressive overload, and facilitating Weekly Boss PR battles.

## 1. Unified API Routing (`/api/fitness`)

All workout systems communicate through the dedicated `fitness` router.
- **Session Management**: Workouts are initiated via `POST /api/fitness/sessions/start`. The frontend tracks the active `sessionId`.
- **Live Logging**: `POST /api/fitness/sessions/{id}/log` ensures sets are instantly synced, calculating e1RM (Brzycki formula) and injecting proportional damage into Bosses in real-time.
- **Finalization**: `POST /api/fitness/sessions/{id}/finish` aggregates session data, assigns RPG rewards (EXP, Gold, Stats), and returns new PR and Boss defeat statuses.

## 2. Hybrid Progressive Overload Engine

The overload engine computes recommendations dynamically (without relying on a static `ExerciseTarget` model) to avoid N+1 queries by leveraging a batch-fetch system (`POST /api/fitness/overload-batch`).

**Hybrid Scaling Logic:**
- **Compound Lifts (Chest, Legs, Back):** Evaluates history and RPE. If the user completes 8+ reps cleanly (RPE < 9), a **+2.5kg flat weight increase** is recommended. If RPE is high (>= 9), it recommends maintaining weight and pushing for more reps.
- **Isolation Lifts (Arms, Shoulders):** Uses a **percentage-based scale (+5%)** instead of a flat increase. This prevents unrealistic scaling on low-weight exercises (e.g., +2.5kg on a 10kg lateral raise is a 25% jump, whereas +5% is safely rounded).
- **UI Integration:** The UI receives this data on workout start and displays "TARGET" badges with an autofill `⚡` button.

## 3. Voice-to-Text Parsing & Natural Language

The `VoiceLogger` utilizes the browser's `SpeechRecognition` API to capture speech, routing it to `POST /api/fitness/sessions/{id}/log-text`.

**Parser Capabilities (`text_parser.py`):**
- **Fuzzy Matching**: Matches spoken names to the database (e.g., "db curls" -> "Dumbbell Bicep Curl").
- **Unit Conversion**: Automatically converts spoken "lbs" or "pounds" to kilograms.
- **Conversational Shorthand**: Recognizes phrases like "same weight" or "last set", fetching the previous set's weight from history.
- **Data Extraction**: Extracts `weight`, `reps`, and optional `RPE` using regex parsing.

## 4. Weekly Boss PR Battles

The Weekly Boss system converts strength progression into tangible RPG encounters. 
- **Boss Generation**: Weekly bosses are generated at ~90% of the character's highest 1RM for a target exercise.
- **Deterministic Sprites**: Based on the `characterId` hash, a boss sprite is deterministically selected from a pool of 14 custom assets.
- **Proportional Damage**: Bosses don't require binary pass/fail checks. Damage is dealt proportionally based on the ratio:
  `Damage = (logged_weight / target_weight)^1.5 * (logged_reps / target_reps)`
  This allows users to chip away at a boss's HP using slightly lighter weight with more reps.
- **Rewards**: Defeating a boss triggers a UI confetti explosion and grants massive EXP, Gold, and specific stat boosts.

## 5. Brzycki 1RM & Rank Engine

The engine uses the Brzycki formula for estimating 1 Rep Max:
`1RM = Weight / (1.0278 - (0.0278 * Reps))`

Based on this e1RM, the `evaluateRank` function checks performance against bodyweight/sex standards to assign a rank (E through SSS), which dictates the styling (color/glow) of the exercise badges.

## 6. Interactive Body Muscle Heatmap & Real-Time Time-Decay Recovery Engine

The Body Muscle Heatmap transforms physical workouts into an interactive bio-metric scanner visualizing anatomical fatigue and recovery in real-time.

### 16 Canonical Muscle Groups
- **Anterior (Front)**: `CHEST`, `FRONT_DELTS`, `SHOULDERS`, `BICEPS`, `FOREARMS`, `ABS`, `OBLIQUES`, `QUADS`, `CALVES`.
- **Posterior (Back)**: `TRAPS`, `REAR_DELTS`, `LATS`, `LOWER_BACK`, `TRICEPS`, `GLUTES`, `HAMSTRINGS`, `CALVES`.

### Mathematical Time-Decay Formula
Muscle recovery is calculated on-the-fly when fetching `/api/workouts/muscle-status/{character_id}`:
$$\text{elapsed\_hours} = \frac{\text{current\_utc\_timestamp} - \text{lastTrainedAt}}{3600}$$
$$\text{current\_fatigue} = \max\left(0, \text{initialFatigue} \times \left(1 - \frac{\text{elapsed\_hours}}{\text{fullRecoveryHours}}\right)\right)$$
$$\text{freshness} = 100 - \text{current\_fatigue}$$

### Recovery Timetable
- **Standard Muscles (48h)**: Chest, Arms (Biceps/Triceps/Forearms), Deltoids, Abs, Calves.
- **Heavy Compound Muscles (72h)**: Quads, Latissimus Dorsi, Hamstrings, Glutes.

### Cyberpunk Heatmap Shader
- **$80\%\text{--}100\%$ Fresh (Optimal Readiness)**: Neon Cyan (`#06b6d4`)
- **$40\%\text{--}79\%$ Recovering (Regeneration)**: Electric Amber (`#f59e0b`) / Solar Orange (`#fb923c`)
- **$0\%\text{--}39\%$ Fatigued (Rest/Exhaustion)**: Crimson / Neon Red (`#ef4444`) with animated warning pulse.

