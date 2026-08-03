# REST API Reference

Base Endpoint: `http://127.0.0.1:8000`

## System Routes

### `GET /`
Returns server operational health and version status.

### `GET /api/health`
Returns system status summary.

## User & Identity Routes

### `GET /api/user/{user_id_or_email}`
Fetches user model by ID, email, or associated character name.

## Character Domain Routes

### `GET /api/character/{character_id}`
Fetches character record by ID, including relations to `CharacterStats` and `ProgressHistory`.

**Response**:
```json
{
  "id": "char-id-123",
  "userId": "user-1",
  "name": "Shadow Monarch",
  "avatar": "/avatars/shadow-monarch.png",
  "theme": "dark-rpg",
  "title": "Shadow Seeker",
  "level": 1,
  "exp": 0,
  "power": 50,
  "rank": "F",
  "gold": 0,
  "createdAt": "2026-08-03T22:00:00.000Z",
  "stats": {
    "id": "stats-1",
    "characterId": "char-id-123",
    "strength": 1,
    "knowledge": 1,
    "discipline": 1,
    "focus": 1,
    "endurance": 1,
    "recovery": 1,
    "consistency": 1
  },
  "history": []
}
```

### `PATCH /api/character/{character_id}`
Accepts optional JSON payload containing character identity attributes (`name`, `title`, `theme`, `avatar`) and updates the character record.

**Request Body**:
```json
{
  "name": "Shadow Sovereign",
  "title": "Shadow Seeker",
  "theme": "purple-rpg",
  "avatar": "/avatars/shadow-monarch.png"
}
```

**Response**: Updated `Character` object with included relations.

### `POST /api/character/{character_id}/sync-progression`
Accepts total experience, current level, power score, rank classification, and an optional activity history entry to sync character progression with the database.

**Request Body**:
```json
{
  "total_exp": 150,
  "level": 2,
  "power": 100,
  "rank": "F",
  "history_entry": {
    "amount": 150,
    "type": "LEVEL_UP",
    "description": "Leveled up to Level 2! (Completed Simulation Training)"
  }
}
```

**Response**: Updated `Character` object with refreshed history array.
