// Shared API client. Touch only with team agreement — the URLs and request/response
// shapes are a contract that every component and the backend depend on.
const BASE = '/api'

export async function fetchTasks() {
  const r = await fetch(`${BASE}/tasks`)
  if (!r.ok) throw new Error('failed to load tasks')
  return r.json()
}

export async function createTask(task) {
  const r = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!r.ok) throw new Error('failed to create task')
  return r.json()
}

export async function updateTaskStatus(id, status) {
  const r = await fetch(`${BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!r.ok) throw new Error('failed to update task')
  return r.json()
}
