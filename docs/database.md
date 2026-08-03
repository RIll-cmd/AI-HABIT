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
Stores user profile avatar, name, and customization preferences.
- `id` (String, PK, UUID)
- `userId` (String, Unique, FK -> User.id, Cascade Delete)
- `name` (String)
- `avatar` (String, Optional)
- `theme` (String, Optional)
- `title` (String, Optional)
- `createdAt` (DateTime)
