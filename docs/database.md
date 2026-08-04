# Database Schema Documentation

## Database Technology
- **ORM**: Prisma (Python Client & JS Client)
- **Database Engine**: SQLite (`server/dev.db`)

## Models

### User
Stores authentication credentials and account metadata.
- `id` (String, PK, UUID)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `character` (Relation 1:1 -> Character)

### Character
Stores user profile avatar, name, RPG level, EXP, power score, rank, and customization preferences.
- `id` (String, PK, UUID)
- `userId` (String, Unique, FK -> User.id, Cascade Delete)
- `name` (String)
- `avatar` (String, Optional)
- `theme` (String, Optional)
- `title` (String, Optional)
- `level` (Int, Default: 1)
- `exp` (Int, Default: 0)
- `power` (Int, Default: 0)
- `rank` (String, Default: "F")
- `gold` (Int, Default: 0)
- `createdAt` (DateTime)
- `stats` (Relation 1:1 -> CharacterStats)
- `history` (Relation 1:N -> ProgressHistory)
- `habits` (Relation 1:N -> Habit)
- `missions` (Relation 1:N -> Mission)

### CharacterStats
Normalized 1:1 relation to Character containing core RPG stat attributes.
- `id` (String, PK, UUID)
- `characterId` (String, Unique, FK -> Character.id, Cascade Delete)
- `strength` (Int, Default: 1)
- `knowledge` (Int, Default: 1)
- `discipline` (Int, Default: 1)
- `focus` (Int, Default: 1)
- `endurance` (Int, Default: 1)
- `recovery` (Int, Default: 1)
- `consistency` (Int, Default: 1)

### ProgressHistory
Normalized 1:N audit log tracking character experience gains, stat points, and level-up events.
- `id` (String, PK, UUID)
- `characterId` (String, FK -> Character.id, Cascade Delete)
- `type` (String, e.g. "EXP_GAIN", "LEVEL_UP")
- `amount` (Int)
- `description` (String)
- `createdAt` (DateTime, Default: now())

### Habit (Template)
Permanent template definition for recurring habits.
- `id` (String, PK, UUID)
- `characterId` (String, FK -> Character.id, Cascade Delete)
- `name` (String)
- `description` (String, Optional)
- `category` (String)
- `difficulty` (String, 'Easy' | 'Medium' | 'Hard')
- `primaryStat` (String, e.g. 'strength', 'knowledge')
- `isActive` (Boolean, Default: true)
- `icon` (String, Optional)
- `color` (String, Optional)
- `createdAt` (DateTime, Default: now())
- `updatedAt` (DateTime, UpdatedAt)
- `schedule` (Relation 1:1 -> HabitSchedule)
- `metrics` (Relation 1:1 -> HabitMetrics)
- `missions` (Relation 1:N -> Mission)

### HabitSchedule
Schedule configurations for a Habit template.
- `id` (String, PK, UUID)
- `habitId` (String, Unique, FK -> Habit.id, Cascade Delete)
- `type` (String, 'Daily' | 'Weekly' | 'Monthly' | 'Specific_Days' | 'Custom')
- `days` (String, Optional JSON string for specific days)
- `interval` (Int, Default: 1)
- `startDate` (DateTime)
- `endDate` (DateTime, Optional)

### HabitMetrics
Performance and consistency metrics for a Habit.
- `id` (String, PK, UUID)
- `habitId` (String, Unique, FK -> Habit.id, Cascade Delete)
- `habitStrength` (Float, Default: 100.0)
- `successRate` (Float, Default: 0.0)
- `completionRate` (Float, Default: 0.0)
- `currentConsistency` (Float, Default: 0.0)

### Mission (Instance)
Daily generated execution instance derived from a Habit template.
- `id` (String, PK, UUID)
- `habitId` (String, Optional, FK -> Habit.id, SetNull)
- `characterId` (String, FK -> Character.id, Cascade Delete)
- `date` (DateTime)
- `status` (String, 'PENDING' | 'COMPLETED' | 'MISSED', Default: 'PENDING')
- `completionType` (String, Optional, 'MINI' | 'NORMAL' | 'ELITE')
- `expEarned` (Int, Optional)
- `statsEarned` (Int, Optional)
- `completedAt` (DateTime, Optional)
