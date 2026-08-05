import { useState } from 'react'
import { addTask } from '../lib/tasks'
import { PlusIcon } from './Icons'

/**
 * @param {string} business - 'nifar' or 'nifarise'. Used unless "merged" is checked.
 */
export default function AddTaskForm({ business }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [merged, setMerged] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await addTask({
      title: title.trim(),
      business: merged ? 'merged' : business,
      status: 'todo',
      dueDate: dueDate || null,
    })
    setTitle('')
    setDueDate('')
    setMerged(false)
    setSaving(false)
    setOpen(false)
  }

  if (!open) {
    return (
      <button className="btn btn-outline btn-block" onClick={() => setOpen(true)}>
        <PlusIcon width={13} height={13} /> Add task
      </button>
    )
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Task title"
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
      <label className="checkbox-row">
        <input type="checkbox" checked={merged} onChange={(e) => setMerged(e.target.checked)} />
        Also show this on the other business board (merged)
      </label>
      <div className="task-card-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !title.trim()}>
          Add
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}
