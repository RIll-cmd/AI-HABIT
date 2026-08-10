# Economy & Progression Architecture

Phase 4 introduced the core progression loops, gamifying long-term commitment through Achievements, Seasonal Ascension Passes, and the Hunter Shop.

## 1. Seasonal Ascension Pass

The Season Pass provides an escalating reward track spanning 50 tiers.
- **Dual EXP Integration**: Season Pass EXP is earned simultaneously alongside regular Character EXP. 1 Character EXP = 1 Pass EXP.
- **Weekly Season Quests**: Provides a supplementary way to earn Pass EXP quickly (e.g., "Complete 10 Workouts this week" grants +500 Pass EXP).
- **Reward Engine**: Each tier unlocks specific items, gold drops, or unique cosmetics (titles/avatars). Premium tracks (if activated) provide secondary rewards on the same tier.

## 2. Hunter Shop & Economy Vault

The game economy revolves around `Gold` earned via missions, workouts, and boss defeats.
- **Consumables**: The shop sells tactical items. Consumables are architected with a **Time Duration** and **Charge Count** (e.g., *Double EXP Potion* lasts 60 minutes or 5 missions).
- **Cosmetics**: Users can purchase Titles and Avatar frames using premium or highly-priced standard currencies.

## 3. Achievements Gallery & Event Evaluator

Achievements are designed to provide long-term milestones.
- **Multi-Condition Evaluator**: Achievements aren't hardcoded into endpoints; instead, a background event evaluator listens for changes in character state (`MISSIONS_100`, `LEVEL_20`, `STREAK_30`) and unlocks achievements automatically.
- **Gallery UI**: A visual repository organized by categories (Habits, Workout, Tower, Social, Special) displaying progress meters and claimable rewards upon completion.
