// OWNER: Person 3 (Avery)
// Render one task. The status select calls onStatusChange(task.id, newStatus).
const STATUSES = ['todo', 'doing', 'done']

function timeAgo(iso) {
  if (!iso) return ''
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function TaskCard({ task, onStatusChange }) {
  return (
    <li className={`task-card task-card--${task.status}`}>
      <div className="task-card__title">{task.title}</div>
      <div className="task-card__meta">
        <span className="task-card__assignee">@{task.assignee}</span>
        <span className="task-card__time">{timeAgo(task.created_at)}</span>
      </div>
      <select
        className="task-card__status"
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        aria-label={`Status for ${task.title}`}
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
