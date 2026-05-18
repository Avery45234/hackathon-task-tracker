// OWNER: Person 4
// Show counts per status.
export default function StatsBar({ tasks }) {
  const counts = { todo: 0, doing: 0, done: 0 }
  for (const t of tasks) counts[t.status] = (counts[t.status] || 0) + 1
  return (
    <div className="stats-bar">
      <span>todo: {counts.todo}</span>
      <span>doing: {counts.doing}</span>
      <span>done: {counts.done}</span>
    </div>
  )
}
