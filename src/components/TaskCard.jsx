import { useState } from 'react'
import { updateTask, deleteTask } from '../lib/tasks'

const STATUS_ORDER = ['todo', 'doing', 'done']
const STATUS_LABEL = { todo: 'To do', doing: 'Doing', done: 'Done' }

export default function TaskCard({ task }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [saving, setSaving] = useState(false)

  const currentIndex = STATUS_ORDER.indexOf(task.status)

  async function move(direction) {
    const nextIndex = currentIndex + direction
    if (nextIndex < 0 || nextIndex >= STATUS_ORDER.length) return
    await updateTask(task.id, { status: STATUS_ORDER[nextIndex] })
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await updateTask(task.id, { title: title.trim(), dueDate: dueDate || null })
    setSaving(false)
    setEditing(false)
  }

  async function handleDelete() {
    if (confirm(`Delete "${task.title}"? This can't be undone.`)) {
      await deleteTask(task.id)
    }
  }

  if (editing) {
    return (
      <form className="task-card task-card-editing" onSubmit={saveEdit}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <input
          className="input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="task-card-actions">
          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            Save
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="task-card">
      <div className="task-card-top">
        <span className="task-title">{task.title}</span>
        {task.business === 'merged' && <span className="badge badge-merged">Merged</span>}
      </div>
      {task.dueDate && <div className="task-due">Due {task.dueDate}</div>}
      <div className="task-card-actions">
        <button
          className="icon-btn"
          title="Move left"
          onClick={() => move(-1)}
          disabled={currentIndex === 0}
        >
          ←
        </button>
        <button
          className="icon-btn"
          title="Move right"
          onClick={() => move(1)}
          disabled={currentIndex === STATUS_ORDER.length - 1}
        >
          →
        </button>
        <button className="icon-btn" title="Edit" onClick={() => setEditing(true)}>
          ✎
        </button>
        <button className="icon-btn icon-btn-danger" title="Delete" onClick={handleDelete}>
          ✕
        </button>
      </div>
      <div className="task-status-tag">{STATUS_LABEL[task.status]}</div>
    </div>
  )
}
