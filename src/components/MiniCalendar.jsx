import { useState } from 'react'
import { toDateStr, todayStr } from '../lib/scheduler'
import { ArrowLeftIcon, ArrowRightIcon } from './Icons'

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startDow = (first.getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startDow; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
  return cells
}

/** Month view with a dot on any day that has tasks. */
export default function MiniCalendar({ weekTasks = [] }) {
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const today = todayStr()

  const counts = weekTasks.reduce((acc, t) => {
    if (!t.scheduledDate) return acc
    if (!acc[t.scheduledDate]) acc[t.scheduledDate] = { total: 0, done: 0 }
    acc[t.scheduledDate].total += 1
    if (t.status === 'done') acc[t.scheduledDate].done += 1
    return acc
  }, {})

  const cells = monthGrid(cursor.y, cursor.m)
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  function shift(delta) {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month">
          <ArrowLeftIcon width={15} height={15} />
        </button>
        <span className="cal-month">{monthLabel}</span>
        <button type="button" className="icon-btn" onClick={() => shift(1)} aria-label="Next month">
          <ArrowRightIcon width={15} height={15} />
        </button>
      </div>

      <div className="cal-grid cal-dow">
        {DOW.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((date, i) => {
          if (!date) return <span key={`x${i}`} className="cal-cell cal-cell-empty" />
          const key = toDateStr(date)
          const info = counts[key]
          const allDone = info && info.done === info.total
          return (
            <span
              key={key}
              className={`cal-cell ${key === today ? 'cal-cell-today' : ''}`}
              title={info ? `${info.done}/${info.total} done` : undefined}
            >
              {date.getDate()}
              {info && <i className={`cal-dot ${allDone ? 'cal-dot-done' : ''}`} />}
            </span>
          )
        })}
      </div>
    </div>
  )
}
