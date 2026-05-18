// OWNER: Person 4
// Show counts per status.
export default function StatsBar({ tasks }) {
  const counts = { todo: 0, doing: 0, done: 0 }
  for (const t of tasks) counts[t.status] = (counts[t.status] || 0) + 1

  return (
    <div className="stats-bar">
      <div className="stats-bar__item">
        <span className="stats-bar__label">Todo</span>
        <strong>{counts.todo}</strong>
      </div>
      <div className="stats-bar__item">
        <span className="stats-bar__label">Doing</span>
        <strong>{counts.doing}</strong>
      </div>
      <div className="stats-bar__item">
        <span className="stats-bar__label">Done</span>
        <strong>{counts.done}</strong>
      </div>
    </div>
  )
}
