Here is the refined, unified documentation ready to send to your agent. It integrates the clean 4-Elemental Tree structure, proper stat gating, and UI sprite mapping into a clear specification.

---

# ASCEND OS SKILL SYSTEM SPECIFICATION

`client/public/icons/skill-tree-config.json`

## System Overview

The skill tree utilizes the 4 elemental rows from `Free_Skills.png` as combat and active technique trees, while player base stats (**Strength, Knowledge, Endurance, Focus, Discipline, Recovery, Consistency**) serve as unlock prerequisites. The lower utility sprites are separated from the skill tree and reserved for combat log status indicators and FX.

---

## 1. Skill Trees & Node Definitions

### 🔥 Path 1: Flame (Row 1 — Fire & Combustion)

- **Theme:** Raw offensive power, thermal burst, physical momentum.
- **Primary Stat Scaling:** Strength & Focus

```json
[
  {
    "id": "flame_01",
    "name": "Ignition Pulse",
    "icon": "Row1_Col1",
    "type": "Active",
    "tier": 1,
    "requirements": { "Strength": 10 },
    "description": "Releases a fiery shockwave dealing 110% physical + fire damage."
  },
  {
    "id": "flame_02",
    "name": "Flame Touch",
    "icon": "Row1_Col2",
    "type": "Active",
    "tier": 1,
    "requirements": { "Strength": 20, "skills": ["flame_01"] },
    "description": "Deals 130% damage with a 15% chance to apply Burn for 2 turns."
  },
  {
    "id": "flame_03",
    "name": "Magma Palm",
    "icon": "Row1_Col3",
    "type": "Active",
    "tier": 2,
    "requirements": { "Strength": 35, "Focus": 20, "skills": ["flame_02"] },
    "description": "Strikes with molten intensity, dealing 160% damage and bypassing 10% defense."
  },
  {
    "id": "flame_04",
    "name": "Inferno Clutch",
    "icon": "Row1_Col4",
    "type": "Active",
    "tier": 3,
    "requirements": { "Strength": 55, "Focus": 35, "skills": ["flame_03"] },
    "description": "Grapples the target in searing flames, dealing heavy single-target damage."
  },
  {
    "id": "flame_05",
    "name": "Cinder Golem",
    "icon": "Row1_Col5",
    "type": "Stance",
    "tier": 4,
    "requirements": { "Strength": 80, "Focus": 50 },
    "description": "Surrounds player with a flame avatar. Strength damage +12% and burns attackers."
  },
  {
    "id": "flame_06",
    "name": "Searing Edge",
    "icon": "Row1_Col6",
    "type": "Ultimate",
    "tier": 5,
    "requirements": {
      "Strength": 110,
      "Focus": 70,
      "skills": ["flame_04", "flame_05"]
    },
    "description": "Summons a flaming sword strike dealing massive damage (+30% vs Bosses)."
  }
]
```

---

### ⚡ Path 2: Tempest (Row 2 — Wind & Gust)

- **Theme:** Speed, evasion, rapid air pressure, critical precision.
- **Primary Stat Scaling:** Focus & Discipline

```json
[
  {
    "id": "tempest_01",
    "name": "Gale Cyclone",
    "icon": "Row2_Col1",
    "type": "Active",
    "tier": 1,
    "requirements": { "Focus": 10 },
    "description": "Surrounds the player with cutting wind, increasing Evasion by 5%."
  },
  {
    "id": "tempest_02",
    "name": "Wind Bind",
    "icon": "Row2_Col2",
    "type": "Active",
    "tier": 1,
    "requirements": { "Focus": 20, "skills": ["tempest_01"] },
    "description": "Wraps currents around enemy hands, reducing their attack speed by 12%."
  },
  {
    "id": "tempest_03",
    "name": "Gale Burst",
    "icon": "Row2_Col3",
    "type": "Active",
    "tier": 2,
    "requirements": { "Focus": 35, "Discipline": 20, "skills": ["tempest_02"] },
    "description": "Fires a sphere of compressed air with a +15% Critical Hit chance."
  },
  {
    "id": "tempest_04",
    "name": "Whirlwind Grip",
    "icon": "Row2_Col4",
    "type": "Active",
    "tier": 3,
    "requirements": { "Focus": 55, "Discipline": 35, "skills": ["tempest_03"] },
    "description": "Unleashes wind currents striking multiple targets and applying Slow."
  },
  {
    "id": "tempest_05",
    "name": "Tempest Shroud",
    "icon": "Row2_Col5",
    "type": "Passive",
    "tier": 4,
    "requirements": { "Focus": 80, "Discipline": 50 },
    "description": "Evasion +8%, incoming ranged/magic damage reduced by 10%."
  },
  {
    "id": "tempest_06",
    "name": "Windblade Needle",
    "icon": "Row2_Col6",
    "type": "Ultimate",
    "tier": 5,
    "requirements": {
      "Focus": 110,
      "Discipline": 70,
      "skills": ["tempest_04", "tempest_05"]
    },
    "description": "Condenses air into a blade that pierces 50% of target armor."
  }
]
```

---

### 🪨 Path 3: Earth & Titan (Row 3 — Stone & Fortitude)

- **Theme:** Defense, poise, heavy structural impact, damage mitigation.
- **Primary Stat Scaling:** Endurance & Discipline

```json
[
  {
    "id": "earth_01",
    "name": "Stone Toss",
    "icon": "Row3_Col1",
    "type": "Active",
    "tier": 1,
    "requirements": { "Endurance": 10 },
    "description": "Hurls earth shard, dealing 100% damage with a chance to interrupt casting."
  },
  {
    "id": "earth_02",
    "name": "Earth Touch",
    "icon": "Row3_Col2",
    "type": "Active",
    "tier": 1,
    "requirements": { "Endurance": 20, "skills": ["earth_01"] },
    "description": "Coats fists in rock dust, increasing base Defense by 8% on hit."
  },
  {
    "id": "earth_03",
    "name": "Boulder Palm",
    "icon": "Row3_Col3",
    "type": "Active",
    "tier": 2,
    "requirements": {
      "Endurance": 35,
      "Discipline": 20,
      "skills": ["earth_02"]
    },
    "description": "Strikes with heavy earth force scaling off 50% Strength + 50% Endurance."
  },
  {
    "id": "earth_04",
    "name": "Earth Grasp",
    "icon": "Row3_Col4",
    "type": "Active",
    "tier": 3,
    "requirements": {
      "Endurance": 55,
      "Discipline": 35,
      "skills": ["earth_03"]
    },
    "description": "Erupts stone spikes from the ground to root an enemy and drop defense by 15%."
  },
  {
    "id": "earth_05",
    "name": "Obsidian Armor",
    "icon": "Row3_Col5",
    "type": "Passive",
    "tier": 4,
    "requirements": { "Endurance": 80, "Discipline": 50 },
    "description": "Max HP +15%, incoming physical damage reduced by 8%."
  },
  {
    "id": "earth_06",
    "name": "Titan Claymore",
    "icon": "Row3_Col6",
    "type": "Ultimate",
    "tier": 5,
    "requirements": {
      "Endurance": 110,
      "Discipline": 70,
      "skills": ["earth_04", "earth_05"]
    },
    "description": "Massive stone blade strike that shatters enemy shields."
  }
]
```

---

### 🌊 Path 4: Tide (Row 4 — Hydro Arcane)

- **Theme:** Resource sustain, tactical control, mana efficiency, restoration.
- **Primary Stat Scaling:** Knowledge & Recovery

```json
[
  {
    "id": "tide_01",
    "name": "Aqua Droplets",
    "icon": "Row4_Col1",
    "type": "Active",
    "tier": 1,
    "requirements": { "Knowledge": 10 },
    "description": "Launches hydro orbs that deal energy damage scaling with Knowledge."
  },
  {
    "id": "tide_02",
    "name": "Drenching Touch",
    "icon": "Row4_Col2",
    "type": "Active",
    "tier": 1,
    "requirements": { "Knowledge": 20, "skills": ["tide_01"] },
    "description": "Applies hydro pressure, reducing enemy elemental resistance by 10%."
  },
  {
    "id": "tide_03",
    "name": "Frost Palm",
    "icon": "Row4_Col3",
    "type": "Active",
    "tier": 2,
    "requirements": { "Knowledge": 35, "Recovery": 20, "skills": ["tide_02"] },
    "description": "Chills the target with freezing water while restoring a portion of energy."
  },
  {
    "id": "tide_04",
    "name": "Whirlpool Grip",
    "icon": "Row4_Col4",
    "type": "Active",
    "tier": 3,
    "requirements": { "Knowledge": 55, "Recovery": 35, "skills": ["tide_03"] },
    "description": "Traps target in current, dealing damage while cleansing 1 debuff."
  },
  {
    "id": "tide_05",
    "name": "Oceanic Guardian",
    "icon": "Row4_Col5",
    "type": "Stance",
    "tier": 4,
    "requirements": { "Knowledge": 80, "Recovery": 50 },
    "description": "Fluid water armor. Increases natural HP/Energy regeneration by +20%."
  },
  {
    "id": "tide_06",
    "name": "Hydro Lance",
    "icon": "Row4_Col6",
    "type": "Ultimate",
    "tier": 5,
    "requirements": {
      "Knowledge": 110,
      "Recovery": 70,
      "skills": ["tide_04", "tide_05"]
    },
    "description": "High-pressure stream of water piercing multiple target lines."
  }
]
```

---

## 2. Universal Ascension Passives (Non-Elemental)

```json
[
  {
    "id": "asc_01",
    "name": "Body Conditioning",
    "icon": "Row8_Col1",
    "type": "Passive",
    "tier": 1,
    "requirements": { "Strength": 20, "Endurance": 20 },
    "description": "Strength & Endurance stat efficiency +4%."
  },
  {
    "id": "asc_02",
    "name": "Mental Fortress",
    "icon": "Row9_Col6",
    "type": "Passive",
    "tier": 2,
    "requirements": { "Focus": 35, "Discipline": 35, "skills": ["asc_01"] },
    "description": "Focus & Discipline stat efficiency +5%."
  },
  {
    "id": "asc_03",
    "name": "Rapid Recovery",
    "icon": "Row6_Col2",
    "type": "Passive",
    "tier": 3,
    "requirements": { "Recovery": 50, "skills": ["asc_02"] },
    "description": "Energy regeneration speed +8%."
  },
  {
    "id": "asc_04",
    "name": "Tactical Mind",
    "icon": "Row8_Col8",
    "type": "Passive",
    "tier": 4,
    "requirements": { "Knowledge": 60, "Focus": 60, "skills": ["asc_03"] },
    "description": "Converts Knowledge into +5% Critical Damage."
  },
  {
    "id": "asc_05",
    "name": "Limitless Growth",
    "icon": "Row10_Col1",
    "type": "Ultimate",
    "tier": 5,
    "requirements": { "Consistency": 70, "skills": ["asc_04"] },
    "description": "EXP gain from daily habits and tower missions increased by +10%."
  }
]
```

---

## 3. UI combat Indicator Mapping (Rows 5–10)

_Do not register these in the Skill Tree. Map them to the Tower Combat Log UI component for dynamic status rendering._

- **Rows 5–7 (Status Indicators):**
- `Row5_Col1`–`Row5_Col4`: Active Debuffs (Blind, Attack Down, Slow, Bleed)
- `Row6_Col1`–`Row6_Col4`: Active Buffs (Defense Boost, HP Recovering, Haste)
- `Row7_Col1`–`Row7_Col4`: Severe Statuses (Poison, Stun, Shield Active)

- **Rows 8–10 (Left - Combat Action FX):**
- `Row8_Col1`: Basic Attack Frame
- `Row9_Col1`: Heavy Attack / Skill Hit Frame
- `Row10_Col1`: Critical Strike Burst FX Frame

- **Rows 8–10 (Right - Detection & Utility States):**
- `Row8_Col6–Col8`: Detection Level 1, Speech Indicator, Tome Icon
- `Row9_Col6–Col8`: Focus Level 2, Shout Buff Active, Research Active
- `Row10_Col6–Col8`: Maximum Perception, War Cry Active, Stealth Mask
