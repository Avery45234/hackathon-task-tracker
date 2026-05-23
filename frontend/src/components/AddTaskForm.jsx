// OWNER: Person 2
// Render a form with title + assignee inputs.
// Call onAdd({ title, assignee, status: 'todo' }) on submit.
import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = title.trim() && assignee.trim() && !submitting

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedAssignee = assignee.trim()

    if (!trimmedTitle || !trimmedAssignee) {
      setError('Title and assignee are required.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await onAdd({
        title: trimmedTitle,
        assignee: trimmedAssignee,
        status: 'todo',
      })
      setTitle('')
      setAssignee('')
    } catch {
      setError('Could not add task. Check that the backend is running.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="add-task-form" aria-labelledby="add-task-heading">
      <h2 id="add-task-heading">Add a task</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-task-form__field">
          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            name="title"
            type="text"
            placeholder="e.g. Build homepage"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            required
            autoComplete="off"
          />
        </div>
        <div className="add-task-form__field">
          <label htmlFor="task-assignee">Assignee</label>
          <input
            id="task-assignee"
            name="assignee"
            type="text"
            placeholder="e.g. Avery"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            disabled={submitting}
            required
            autoComplete="off"
          />
        </div>
        {error && (
          <p className="add-task-form__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={!canSubmit}>
          {submitting ? 'Adding…' : 'Add task'}
        </button>
      </form>
    </section>
  )
}
