# Instructions for AI coding assistants

This file applies to all AI assistants (Claude Code, Cursor, Copilot, ChatGPT, etc.) used by anyone on this team.

## Hard rules
- **Stay in your owner's lane.** Only edit files listed under that person in [README.md](README.md). If a change requires touching another owner's files, stop and tell the user — they need to coordinate with the team.
- **Never push to `main`.** Always work on a `person<N>/<feature>` branch.
- **Don't change the task object shape.** It's defined in [taskSchema.md](taskSchema.md) and is a contract between frontend, backend, and all four teammates. Treat it as immutable unless the user explicitly says otherwise.
- **Don't change `frontend/src/api.js` or `backend/app.py` route shapes** without the user explicitly asking. These are shared contracts.
- **Don't add new dependencies** without asking the user first. Four people on four branches all adding deps is how merge conflicts on `package.json` / `requirements.txt` start.

## Style
- Keep components small. No abstractions for hypothetical future requirements.
- No comments unless explaining *why*, not *what*.
- Match existing code style (functional React components, plain CSS, Flask blueprints kept flat).

## Before suggesting a commit
- Confirm every changed file is owned by the current user (check [README.md](README.md)).
- Confirm the user is on a `person<N>/<feature>` branch, not `main`.
- Suggest a short imperative commit message (`add status filter`, not `Updated FilterBar`).
