# REST API Reference

Base Endpoint: `http://127.0.0.1:8000`

## System Routes

### `GET /`
Returns server operational health and version status.

### `GET /api/health`
Returns system status summary.

## User & Character Routes

### `GET /api/user/{user_id_or_email}`
Fetches user model by ID, email, or associated character name.

**Response**:
```json
{
  "id": "6327a7f2-ec86-48ca-b4cd-00ad659f5a84",
  "email": "shadowmonarch@ascend.os",
  "createdAt": "2026-08-03T08:17:09.000Z",
  "updatedAt": "2026-08-03T08:17:09.000Z",
  "character": {
    "id": "char-id",
    "name": "Shadow Monarch",
    "avatar": "/avatars/shadow-monarch.png",
    "theme": "dark-rpg",
    "title": "Shadow Seeker"
  }
}
```
