# Hackathon Task Tracker

Small dashboard for hackathon teams to track tasks, owners, and status. The point of this project is to **practice working together with Git** (branches, pull requests, ownership), not to ship the most original app.

## Stack
- Frontend: React (Vite)
- Backend: Flask + SQLite
- Styling: plain CSS

## File ownership

| Person | Files | Responsibility |
|--------|-------|----------------|
| Person 1 | `frontend/src/App.jsx`, `frontend/src/App.css` | App state, wires children together |
| Person 2 | `frontend/src/components/AddTaskForm.jsx` | Form to add a task |
| Person 3 (Avery) | `frontend/src/components/TaskList.jsx`, `frontend/src/components/TaskCard.jsx` | Render the task list |
| Person 4 | `frontend/src/components/FilterBar.jsx`, `frontend/src/components/StatsBar.jsx`, CSS polish | Filters + stats |

**Shared** (don't edit without team agreement):
- `frontend/src/api.js` — frontend API client
- `backend/app.py`, `backend/schema.sql` — backend routes + DB schema
- `taskSchema.md` — the agreed task object shape

## Setup

### Prerequisites
- Node.js LTS — https://nodejs.org/
- Python 3.11+ — https://www.python.org/downloads/ (on Windows, uncheck "Microsoft Store alias")

### Clone
```bash
git clone https://github.com/Avery45234/hackathon-task-tracker.git
cd hackathon-task-tracker
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Backend (in a second terminal)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
python app.py                   # http://localhost:5000
```

Run both. The Vite dev server proxies `/api/*` to Flask, so the React app talks to the backend transparently.

## Workflow
See [CONTRIBUTING.md](CONTRIBUTING.md). If you use an AI assistant, also read [AGENTS.md](AGENTS.md).
