import TaskCard from './TaskCard'
import AddTaskForm from './AddTaskForm'

const COLUMNS = [
  { key: 'todo', label: 'To do', dotClass: 'status-dot-todo' },
  { key: 'doing', label: 'Doing', dotClass: 'status-dot-doing' },
  { key: 'done', label: 'Done', dotClass: 'status-dot-done' },
]

/**
 * @param {object[]} tasks - already filtered to this business (incl. merged)
 * @param {string} business - 'nifar' or 'nifarise', used when adding new tasks
 */
export default function TaskBoard({ tasks, business }) {
  return (
    <div className="board">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div className="board-column" key={col.key}>
            <div className="board-column-header">
              <span className="board-column-label">
                <span className={`status-dot ${col.dotClass}`} />
                {col.label}
              </span>
              <span className="board-count">{columnTasks.length}</span>
            </div>
            <div className="board-column-body">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {columnTasks.length === 0 && (
                <div className="empty-hint">Nothing here yet</div>
              )}
              {col.key === 'todo' && <AddTaskForm business={business} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
