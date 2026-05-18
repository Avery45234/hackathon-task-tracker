// OWNER: Person 3 (Avery)
// Group tasks by status into Todo / Doing / Done sections, each rendering TaskCards.
import TaskCard from './TaskCard.jsx'

const STATUS_ORDER = ['todo', 'doing', 'done']
const HEADINGS = { todo: 'Todo', doing: 'Doing', done: 'Done' }

export default function TaskList({ tasks, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet.</p>
  }

  const grouped = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status)
    return acc
  }, {})

  return (
    <div className="task-list">
      {STATUS_ORDER.map((status) =>
        grouped[status].length === 0 ? null : (
          <section
            key={status}
            className={`task-list__group task-list__group--${status}`}
          >
            <h2 className="task-list__heading">
              {HEADINGS[status]}{' '}
              <span className="task-list__count">({grouped[status].length})</span>
            </h2>
            <ul className="task-list__items">
              {grouped[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                />
              ))}
            </ul>
          </section>
        )
      )}
    </div>
  )
}
