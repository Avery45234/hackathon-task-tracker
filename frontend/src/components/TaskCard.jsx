// OWNER: Person 3 (Avery)
// Render one task. The status select calls onStatusChange(task.id, newStatus).
const STATUSES = ['todo', 'doing', 'done']

export default function TaskCard({ task, onStatusChange }) {
  return (
    <li className="task-card">
      <div className="task-card__title">{task.title}</div>
      <div className="task-card__assignee">@{task.assignee}</div>
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </li>
  )
}
