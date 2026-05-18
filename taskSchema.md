# Task object shape

This is the agreed shape passed between frontend, API, and database. **Do not change without team agreement** — Person 2's form output and Person 3's TaskCard props both depend on it.

## Shape

```json
{
  "id": 1,
  "title": "Build homepage",
  "assignee": "Avery",
  "status": "todo",
  "created_at": "2026-05-17T18:30:00+00:00"
}
```

## Fields

| Field | Type | Notes |
|-------|------|-------|
| `id` | integer | Server-assigned. Don't set on the client. |
| `title` | string | Required. Non-empty. |
| `assignee` | string | Required. Just a name string — no user system. |
| `status` | string | One of `"todo"`, `"doing"`, `"done"`. |
| `created_at` | string | ISO 8601 timestamp. Server-assigned. |

## API endpoints

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/api/tasks` | — | `Task[]` |
| POST | `/api/tasks` | `{ title, assignee, status? }` (status defaults to `"todo"`) | `Task` (201) |
| PATCH | `/api/tasks/:id` | `{ status }` | `Task` |
