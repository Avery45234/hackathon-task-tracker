// OWNER: Person 1
// Holds app state. Fetches tasks on mount. Passes tasks + handlers to children.
import { useEffect, useState } from 'react'
import AddTaskForm from './components/AddTaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import FilterBar from './components/FilterBar.jsx'
import StatsBar from './components/StatsBar.jsx'
import { fetchTasks, createTask, updateTaskStatus } from './api.js'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTasks().then(setTasks).catch(console.error)
  }, [])

  async function handleAdd(task) {
    const created = await createTask(task)
    setTasks((prev) => [created, ...prev])
  }

  async function handleStatusChange(id, status) {
    const updated = await updateTaskStatus(id, status)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <div className="app">
      <h1>Hackathon Task Tracker</h1>
      <StatsBar tasks={tasks} />
      <AddTaskForm onAdd={handleAdd} />
      <FilterBar filter={filter} onChange={setFilter} />
      <TaskList tasks={visible} onStatusChange={handleStatusChange} />
    </div>
  )
}
