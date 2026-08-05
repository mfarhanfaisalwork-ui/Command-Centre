import { useState } from 'react'
import { completeWeekTask, pushTaskToTomorrow, deleteWeekTask } from '../lib/weekTasks'
import { getPriority, getTimeSlotLabel, todayStr } from '../lib/scheduler'
import { CheckIcon, SkipIcon, AlertIcon, TrashIcon } from './Icons'

const BUSINESS_LABEL = { nifar: 'NIFAR', nifarise: 'Nifarise', merged: 'Both' }
const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' }

/**
 * @param {object[]} tasks - already filtered to "today" for the relevant business scope
 * @param {object[]} allOpenTasks - every not-done weekTask (needed to rebalance the week on push)
 * @param {boolean} [showBusinessTag] - show a NIFAR/Nifarise badge per row (used on Home's merged view)
 */
export default function TodayTasks({ tasks, allOpenTasks, showBusinessTag = false }) {
  const [busyId, setBusyId] = useState(null)
  const today = todayStr()

  const sorted = [...tasks].sort((a, b) => a.order - b.order)

  async function handleDone(task) {
    setBusyId(task.id)
    await completeWeekTask(task.id)
    setBusyId(null)
  }

  async function handlePush(task) {
    setBusyId(task.id)
    await pushTaskToTomorrow(task, allOpenTasks)
    setBusyId(null)
  }

  async function handleDelete(task) {
    if (confirm(`Delete "${task.title}"? This can't be undone.`)) {
      setBusyId(task.id)
      await deleteWeekTask(task.id)
      setBusyId(null)
    }
  }

  if (sorted.length === 0) {
    return <div className="empty-hint">Nothing scheduled for today. Upload the week's tasks to fill this in.</div>
  }

  return (
    <div className="today-list">
      {sorted.map((task) => {
        const priority = getPriority(task.deadlineDate, today, task.conflict)
        const isDone = task.status === 'done'
        return (
          <div
            className={`today-item today-item-${priority} ${isDone ? 'today-item-done' : ''}`}
            key={task.id}
          >
            <div className="today-item-main">
              <span className="today-slot">{getTimeSlotLabel(task.order)}</span>
              <span className="today-title">{task.title}</span>
              {showBusinessTag && (
                <span className={`badge badge-biz badge-biz-${task.business}`}>
                  {BUSINESS_LABEL[task.business]}
                </span>
              )}
              {task.conflict && !isDone && (
                <span className="badge badge-conflict" title="Deadline may slip">
                  <AlertIcon width={11} height={11} /> Conflict
                </span>
              )}
            </div>
            <div className="today-item-meta">
              <span className={`priority-pill priority-${priority}`}>{PRIORITY_LABEL[priority]}</span>
              <span className="today-hours">{task.estimatedHours}h</span>
              <span className="today-deadline">Due {task.deadlineDate}</span>
              {task.notes && <span className="today-notes">{task.notes}</span>}
            </div>
            <div className="task-card-actions">
              {!isDone && (
                <>
                  <button
                    className="icon-btn"
                    title="Mark done"
                    onClick={() => handleDone(task)}
                    disabled={busyId === task.id}
                  >
                    <CheckIcon width={13} height={13} />
                  </button>
                  <button
                    className="icon-btn"
                    title="Skip — push to tomorrow"
                    onClick={() => handlePush(task)}
                    disabled={busyId === task.id}
                  >
                    <SkipIcon width={13} height={13} />
                  </button>
                </>
              )}
              <button
                className="icon-btn icon-btn-danger"
                title="Delete"
                onClick={() => handleDelete(task)}
                disabled={busyId === task.id}
              >
                <TrashIcon width={13} height={13} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
