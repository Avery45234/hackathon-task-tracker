// OWNER: Person 4
// Render filter buttons. Call onChange('all' | 'todo' | 'doing' | 'done').
const OPTIONS = ['all', 'todo', 'doing', 'done']

export default function FilterBar({ filter, onChange }) {
  return (
    <div className="filter-bar" aria-label="Filter tasks by status">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          className={filter === opt ? 'filter-bar__button is-active' : 'filter-bar__button'}
          onClick={() => onChange(opt)}
          aria-pressed={filter === opt}
        >
          {opt[0].toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  )
}
