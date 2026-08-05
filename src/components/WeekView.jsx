import { addDays, formatDayLabel, getMonday, todayStr } from '../lib/scheduler'
import { deleteWeekTask } from '../lib/weekTasks'

/**
 * @param {object[]} tasks - weekTasks already filtered to one business (+ merged)
 */
export default function WeekView({ tasks }) {
  const today = todayStr()
  const weekStart = getMonday(today)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  async function handleDelete(t) {
    if (confirm(`Delete "${t.title}"? This can't be undone.`)) {
      await deleteWeekTask(t.id)
    }
  }

  return (
    <div className="week-view">
      {days.map((day) => {
        const dayTasks = tasks
          .filter((t) => t.scheduledDate === day)
          .sort((a, b) => a.order - b.order)
        const isToday = day === today
        return (
          <div className={`week-day ${isToday ? 'week-day-today' : ''}`} key={day}>
            <div className="week-day-label">{formatDayLabel(day)}</div>
            {dayTasks.length === 0 ? (
              <div className="week-day-empty">—</div>
            ) : (
              <div className="week-day-tasks">
                {dayTasks.map((t) => (
                  <div
                    className={`week-task ${t.status === 'done' ? 'week-task-done' : ''}`}
                    key={t.id}
                    onClick={() => handleDelete(t)}
                    title="Click to delete"
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
