# Skills & Inventory Architecture

The RPG systems of Ascend OS are powered by robust Skill Trees and an expansive Inventory System. These components seamlessly integrate into the Combat Engine to modify Character Stats dynamically.

## 1. Skill Definitions & Player Skills

The Skill Engine is driven by two main models in the Prisma schema:
- **`SkillDefinition`**: The master template database. It stores the intrinsic metadata for all skills in the game, including `id`, `name`, `description`, `elementPath` (e.g., Flame, Tide, Earth, Ascension), `tier`, `maxLevel`, `skillType` (Active/Passive), `baseCostSP`, `statRequirements`, `prerequisiteSkillId`, and `icon` coordinates.
- **`PlayerSkill`**: The ownership model. It associates a character with a `SkillDefinition` and tracks the `currentLevel`.

**Skill Points (SP):**
Characters earn SP periodically or upon leveling up. SP is consumed when unlocking or upgrading a skill. The `POST /api/skills/{character_id}/unlock` endpoint enforces strict validation checks:
1. Does the player have enough SP?
2. Does the player meet the stat requirements?
3. Does the player have the prerequisite skill unlocked?

## 2. Expanded Inventory System

The item ecosystem has been scaled up to support over 400 distinct items.
- **`ItemDefinition`**: The global catalog of items, parsed and seeded via JSON mappings (e.g., `seed_items.py`). Contains base stats, rarity, category, and visual properties.
- **`PlayerItem`**: Instantiated items belonging to characters, supporting equipping, locking, and favoriting.
- **`InventoryTransaction`**: An audit log that records item acquisitions, sales, drops, and usage.

The backend enforces strict equipment logic, such as single-slot auto-unequip, ensuring a character cannot wear two helmets or two weapons simultaneously.

## 3. Combat Engine & Stat Aggregation

The `combatStatCalculator` is the core utility that aggregates a character's base stats with all external modifiers.

**Passive Skill Buffs:**
When skills are unlocked, their passive benefits are automatically parsed and applied to total combat stats:
- **Body Conditioning (`asc_01`)**: +4% Strength and Endurance.
- **Mental Fortress (`asc_02`)**: +5% Focus and Discipline.
- **Rapid Recovery (`asc_03`)**: +8% Recovery.
- **Tactical Mind (`asc_04`)**: Converts 5% of Knowledge into Critical Damage.

These bonuses, alongside Equipment stat bonuses, are aggregated instantly on the client via Zustand (`useSkillStore`, `useInventoryStore`) and synchronized with the backend.

## 4. UI Rendering (CSS Sprite Engine)

The frontend visualizes skills and items using a lightweight CSS Sprite Engine. Instead of loading hundreds of individual image files, the engine loads a single spritesheet (e.g., `Free_Skills.png` or `items_spritesheet.png`) and calculates the background-position using `RowX_ColY` grid coordinates embedded in the definition's `icon` field.
