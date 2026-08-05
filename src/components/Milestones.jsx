import { useState } from 'react'
import { addMilestone, updateMilestone, deleteMilestone } from '../lib/milestones'
import { PlusIcon, TrashIcon } from './Icons'

const STATUS_ORDER = ['not_started', 'in_progress', 'done']
const STATUS_LABEL = { not_started: 'Not started', in_progress: 'In progress', done: 'Done' }

/**
 * @param {object[]} entries - already filtered to this business
 * @param {string} business - 'nifar' or 'nifarise'
 */
export default function Milestones({ entries, business }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [saving, setSaving] = useState(false)

  const doneCount = entries.filter((m) => m.status === 'done').length
  const progress = entries.length === 0 ? 0 : Math.round((doneCount / entries.length) * 100)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await addMilestone({ business, title: title.trim(), targetDate: targetDate || null })
    setTitle('')
    setTargetDate('')
    setSaving(false)
    setOpen(false)
  }

  async function cycleStatus(m) {
    const nextIndex = (STATUS_ORDER.indexOf(m.status) + 1) % STATUS_ORDER.length
    await updateMilestone(m.id, { status: STATUS_ORDER[nextIndex] })
  }

  async function handleDelete(id, name) {
    if (confirm(`Delete milestone "${name}"?`)) {
      await deleteMilestone(id)
    }
  }

  return (
    <div className="milestones">
      <div className="milestones-progress">
        <div className="milestones-progress-track">
          <div className="milestones-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="milestones-progress-label">
          {progress}% · {doneCount}/{entries.length} milestones
        </span>
      </div>

      <div className="milestones-list">
        {entries.length === 0 && <div className="empty-hint">No milestones yet — add the big goals for this business</div>}
        {entries.map((m) => (
          <div className={`milestone-item milestone-${m.status}`} key={m.id}>
            <button className="milestone-status-btn" onClick={() => cycleStatus(m)} title="Click to advance status">
              <span className={`milestone-status-dot milestone-status-dot-${m.status}`} />
            </button>
            <div className="milestone-body">
              <span className="milestone-title">{m.title}</span>
              <span className="milestone-meta">
                {STATUS_LABEL[m.status]}
                {m.targetDate && ` · Target ${m.targetDate}`}
              </span>
            </div>
            <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => handleDelete(m.id, m.title)}>
              <TrashIcon width={13} height={13} />
            </button>
          </div>
        ))}
      </div>

      {!open ? (
        <button className="btn btn-outline btn-block" onClick={() => setOpen(true)}>
          <PlusIcon width={13} height={13} /> Add milestone
        </button>
      ) : (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder='Milestone, e.g. "Hit $1k revenue"'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <input className="input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          <div className="task-card-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !title.trim()}>
              Add
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
