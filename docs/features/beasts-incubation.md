# Beast Egg Incubation & Hatching System Architecture

The **Beast Egg Incubation System** turns physical daily steps, active habit consistency, and workout sessions into energetic incubation power that cracks and hatches collectible elemental dragon companions granting passive RPG stat bonuses.

---

## 1. System Overview & Core Loop

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Physical Daily Steps  │      │  Workout Set Energy    │      │  Habit Clear Energy    │
└───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘
            │                               │                               │
            └───────────────────────┬───────┴───────────────────────────────┘
                                    ▼
                      ┌───────────────────────────┐
                      │    ACTIVE EGG INCUBATOR   │
                      │  (Target: 3,000 - 20,000) │
                      └─────────────┬─────────────┘
                                    ▼ (Energy Reached)
                      ┌───────────────────────────┐
                      │    READY TO HATCH EVENT   │
                      │  Hatch Celebration Modal  │
                      └─────────────┬─────────────┘
                                    ▼
                      ┌───────────────────────────┐
                      │   ANIMATED DRAGON PET     │
                      │ 20 Elemental Species GIF  │
                      │   Passive RPG Stat Buffs  │
                      └───────────────────────────┘
```

---

## 2. Egg Types & Rarity Tiers

| Egg Type | Theme / Element | Target Steps | Rarity Tier |
|---|---|---|---|
| **ELEMENTAL** | Fire, Frost, Earth | 3,000 - 5,000 | Common |
| **CYBER** | Neon, Kinetic, Storm | 6,000 - 8,000 | Rare |
| **VOID** | Abyssal, Dark Matter | 10,000 - 12,000 | Epic |
| **SOLAR** | Radiance, Holy Light | 14,000 - 16,000 | Legendary |
| **ASTRAL** | Cosmic, Celestial | 18,000 - 20,000 | Holographic / Mythic |

---

## 3. Dragon Pets & Animated GIF Assets

- **20 Animated Dragon GIFs**: Located in `client/public/beasts/beast_1.gif` $\dots$ `beast_20.gif` and `client/public/dragons/dragon_1.gif` $\dots$ `dragon_20.gif`.
- **Transparent 8-Frame Looping Animation**: Seamlessly renders across PaperDoll, Bestiary Grid, Dashboard Familiar mini-card, and Hatching celebration screens.

---

## 4. Passive Stat Buff Calculation

When a dragon pet is equipped, its element and rarity scale character attribute multipliers:
- **Fire / Infernal**: $+5\%\text{--}15\%$ Strength
- **Frost / Glacial**: $+5\%\text{--}15\%$ Endurance
- **Void / Cyber**: $+5\%\text{--}15\%$ Recovery
- **Collection Mastery Multiplier**: Unlocking more species in the Bestiary grants a cumulative $+1\%$ universal combat stat bonus per unique species discovered.

---

## 5. API Endpoints (`/api/beasts`)

- `GET /api/beasts/collection/{character_id}`: Retrieves unlocked beasts, owned eggs, active egg, and equipped beast.
- `POST /api/beasts/sync-steps`: Ingests device step counter, advancing active egg energy.
- `POST /api/beasts/feed-energy`: Feeds habit/workout energy directly to incubator.
- `POST /api/beasts/hatch`: Unlocks beast, generates animated sprite link, and auto-equips.
- `POST /api/beasts/equip`: Toggles active dragon companion.
- `POST /api/beasts/buy-egg`: Buys mystery elemental eggs from the Egg Shop.
- `POST /api/beasts/incubate`: Replaces active egg with another owned egg.
