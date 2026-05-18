// OWNER: Person 3 (Avery)
// Render an array of tasks as TaskCards.
import TaskCard from './TaskCard.jsx'

export default function TaskList({ tasks, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet.</p>
  }
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
      ))}
    </ul>
  )
}
