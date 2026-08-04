I think **Phase 6** is where your app finally starts feeling like a real RPG instead of just a productivity system.

But I would make one major architectural change.

> **Equipment should not directly increase stats.**

Instead:

```text
Base Character Stats
        +
Equipment Stats
        +
Relic Bonuses
        +
Temporary Buffs
        +
Title Bonuses
        =
Combat Stats
```

This separation makes balancing much easier. The player's real-life growth (habits) remains permanent, while equipment provides a temporary layer that can change as they progress.

---

# PHASE 6 — Inventory & Equipment System (3–4 Weeks)

## Goal

Create a complete RPG inventory system where players can:

- Collect loot from the Tower
- Equip items
- Upgrade their character
- Manage inventory
- Compare equipment
- View rarity
- Organize items
- Prepare for higher Tower floors

By the end of this phase, defeating a boss should feel exciting because players might discover a powerful new item.

---

# Architecture

```text
                 INVENTORY ENGINE

                 Tower Rewards
                       │
                       ▼
                 Loot Generator
                       │
                       ▼
                Inventory System
                       │
      ┌────────────────┴──────────────┐
      ▼                               ▼

 Equipment System              Consumables

      ▼                               ▼

 Character Combat Stats      Temporary Buffs

      ▼

 Tower Combat Engine
```

Notice that the Character Engine doesn't know about inventory.

Only the Combat Engine cares.

---

# STEP 1 — Database Design

## Inventory

Stores every item the player owns.

```text
Inventory

id

characterId

itemId

quantity

isEquipped

obtainedAt
```

---

## Item

Every object in the game.

```text
Item

id

name

description

category

rarity

icon

image

sellPrice

buyPrice

maxStack

levelRequirement

createdAt
```

---

## Equipment

Equipment-specific attributes.

```text
Equipment

id

itemId

slot

strength

knowledge

recovery

focus

discipline

endurance

attack

defense

hp

rarity
```

---

## Consumable

```text
Consumable

id

itemId

effect

duration

cooldown
```

---

# STEP 2 — Equipment Slots

Every character has fixed slots.

```text
Weapon

Helmet

Armor

Gloves

Boots

Ring

Necklace

Artifact

Relic
```

Each slot only accepts one item.

Example

```text
Weapon

Steel Sword

Helmet

Iron Helmet

Ring

Ring of Wisdom

Artifact

Ancient Crystal

Relic

Phoenix Feather
```

---

# STEP 3 — Equipment Screen

This becomes one of the main pages.

Layout

```text
Character

↓

Equipment Slots

↓

Inventory

↓

Item Details

↓

Compare Button
```

Imagine

```text
Helmet

Iron Guardian Helm

Epic

Defense +35

Recovery +12

Strength +5
```

---

# STEP 4 — Item Categories

Don't treat everything the same.

Create categories.

## Equipment

```text
Weapon

Helmet

Armor

Gloves

Boots

Ring

Necklace

Artifact

Relic
```

---

## Consumables

```text
Health Potion

Recovery Potion

Power Potion

Tower Key

Skill Scroll

EXP Booster

Gold Booster

Stat Booster
```

---

## Materials

```text
Monster Core

Dragon Scale

Magic Crystal

Ancient Fragment

Soul Stone
```

These become crafting materials later.

---

# STEP 5 — Loot Generator

Tower shouldn't always give the same reward.

Create a Loot Engine.

```text
Victory

↓

Enemy

↓

Loot Table

↓

Random Roll

↓

Inventory
```

Different enemies

Different loot.

Bosses

Guaranteed rewards.

---

# STEP 6 — Rarity System

Every item belongs to a rarity.

```text
Common

Gray

↓

Uncommon

Green

↓

Rare

Blue

↓

Epic

Purple

↓

Legendary

Orange

↓

Mythic

Red

↓

Ancient

Gold
```

Higher rarity

Higher stat ranges.

---

# STEP 7 — Equipment Generation

Instead of hand-making every sword.

Generate them.

Example

```text
Iron Sword

↓

Rare

↓

Attack

45–60

↓

Strength

5–10
```

Each drop is unique.

This increases replayability.

---

# STEP 8 — Equipment Comparison

Whenever a player gets new gear.

Show

```text
Current

Guardian Helmet

Defense

35

Recovery

12

-------------------

New

Titan Helmet

Defense

48 (+13)

Recovery

18 (+6)

Strength

8 (+8)
```

Buttons

```text
Equip

Keep

Sell
```

---

# STEP 9 — Equipment Bonuses

Never directly modify base stats.

Instead

```text
Base Strength

120

Equipment

+28

Relics

+15

Temporary Buff

+10

Total

173
```

The player always knows where their power comes from.

---

# STEP 10 — Relics

Relics are permanent collectibles.

Unlike equipment

They aren't replaced often.

Examples

```text
Phoenix Feather

Recovery +25
```

```text
Ancient Tome

Knowledge +30
```

```text
Titan Core

Strength +20
```

These become long-term progression items.

---

# STEP 11 — Consumables

Create useful temporary items.

Examples

```text
Recovery Potion

+50 HP
```

```text
Power Potion

+20% Damage

30 minutes
```

```text
Tower Key

Unlock Bonus Floor
```

```text
EXP Booster

+25% EXP

1 Hour
```

---

# STEP 12 — Inventory UI

Allow players to

Sort

```text
Newest

Rarity

Power

Alphabetical
```

Filter

```text
Weapons

Armor

Relics

Consumables

Materials
```

Search

```text
Guardian
```

Inventory should feel modern.

---

# STEP 13 — Equipment Set Bonuses

Introduce set mechanics.

Example

Guardian Set

```text
Helmet

Armor

Boots
```

Two pieces

```text
Defense +15
```

Three pieces

```text
Recovery +20

Damage Reduction +10%
```

Now players have reasons to collect complete sets.

---

# STEP 14 — Inventory History

Track

```text
Obtained

Equipped

Sold

Used

Discarded
```

Useful for analytics.

---

# STEP 15 — API

```text
GET    /inventory

GET    /inventory/equipment

POST   /inventory/equip

POST   /inventory/unequip

POST   /inventory/use

POST   /inventory/sell

GET    /inventory/history

GET    /items

GET    /loot
```

Everything inventory-related stays isolated.

---

# Folder Structure

```text
features/

inventory/

components/

InventoryGrid.tsx

EquipmentPanel.tsx

EquipmentSlot.tsx

ItemCard.tsx

ItemDetails.tsx

CompareDialog.tsx

LootPopup.tsx

InventoryFilters.tsx

services/

InventoryEngine.ts

EquipmentEngine.ts

LootEngine.ts

ItemGenerator.ts

utils/

rarityCalculator.ts

equipmentValidator.ts

dropTable.ts

types/

item.ts

equipment.ts

inventory.ts

loot.ts
```

---

# UI Pages

By the end of Phase 6

```text
/inventory

/inventory/equipment

/inventory/consumables

/inventory/materials

/inventory/history

/item/[id]
```

---

# Definition of Done

| Feature                         | Status |
| ------------------------------- | ------ |
| Inventory database              | ✅     |
| Item database                   | ✅     |
| Equipment slots                 | ✅     |
| Loot generator                  | ✅     |
| Rarity system                   | ✅     |
| Equipment generation            | ✅     |
| Equipment comparison            | ✅     |
| Equip/Unequip system            | ✅     |
| Consumables                     | ✅     |
| Relics                          | ✅     |
| Equipment set bonuses           | ✅     |
| Inventory filters & search      | ✅     |
| Inventory history               | ✅     |
| Inventory API                   | ✅     |
| Unit tests for loot & equipment | ✅     |

---

# A feature I think would make this system truly memorable: Item Lore & Collections

Instead of every item just being a stat stick, make important items feel like discoveries.

For example:

```text
Guardian's Broken Blade
──────────────────────────
Rarity: Epic

"The sword carried by the first hunter
who reached Floor 25 but never returned."

Collected: 3.4% of players
Found on: Floor 25 Boss
```

You can also create a **Codex** that automatically fills as players collect equipment, relics, monsters, and bosses they've encountered.

```text
Codex
├── Weapons (18/120)
├── Armor (9/80)
├── Relics (4/40)
├── Bosses (7/30)
└── Monsters (42/150)
```

This gives players another long-term progression goal beyond simply increasing Power. They aren't just collecting stronger gear—they're uncovering the world's history and completing their collection, which fits perfectly with your Solo Leveling-inspired universe while giving your app an identity beyond a standard RPG inventory.
