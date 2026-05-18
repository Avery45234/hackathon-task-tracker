"""
Backend for Hackathon Task Tracker.
Shared file — change route shapes only with team agreement (see taskSchema.md).
"""
from datetime import datetime, timezone
from pathlib import Path
import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "tasks.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"

app = Flask(__name__)
CORS(app)

VALID_STATUSES = ("todo", "doing", "done")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn, open(SCHEMA_PATH) as f:
        conn.executescript(f.read())


@app.route("/api/tasks", methods=["GET"])
def list_tasks():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM tasks ORDER BY id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    assignee = (data.get("assignee") or "").strip()
    status = data.get("status", "todo")

    if not title or not assignee:
        return jsonify({"error": "title and assignee are required"}), 400
    if status not in VALID_STATUSES:
        return jsonify({"error": f"status must be one of {VALID_STATUSES}"}), 400

    created_at = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cur = conn.execute(
            "INSERT INTO tasks (title, assignee, status, created_at) VALUES (?, ?, ?, ?)",
            (title, assignee, status, created_at),
        )
        row = conn.execute("SELECT * FROM tasks WHERE id = ?", (cur.lastrowid,)).fetchone()
    return jsonify(dict(row)), 201


@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    data = request.get_json() or {}
    status = data.get("status")
    if status not in VALID_STATUSES:
        return jsonify({"error": f"status must be one of {VALID_STATUSES}"}), 400

    with get_db() as conn:
        conn.execute("UPDATE tasks SET status = ? WHERE id = ?", (status, task_id))
        row = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if not row:
        return jsonify({"error": "task not found"}), 404
    return jsonify(dict(row))


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
