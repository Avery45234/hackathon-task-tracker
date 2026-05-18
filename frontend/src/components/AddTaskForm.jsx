// OWNER: Person 2
// Render a form with title + assignee inputs.
// Call onAdd({ title, assignee, status: 'todo' }) on submit.
import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !assignee.trim()) return
    onAdd({ title: title.trim(), assignee: assignee.trim(), status: 'todo' })
    setTitle('')
    setAssignee('')
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Assignee"
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}
