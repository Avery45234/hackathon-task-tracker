// OWNER: Person 4
// Render filter buttons. Call onChange('all' | 'todo' | 'doing' | 'done').
const OPTIONS = ['all', 'todo', 'doing', 'done']

export default function FilterBar({ filter, onChange }) {
  return (
    <div className="filter-bar">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          aria-pressed={filter === opt}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
