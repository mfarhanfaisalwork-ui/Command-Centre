import { useMemo, useState } from 'react'
import { buildWeekReport, buildReportText } from '../lib/report'
import { ListIcon, TargetIcon, CalendarIcon, CheckIcon } from '../components/Icons'

const BUSINESS_LABEL = { nifar: 'NIFAR', nifarise: 'Nifarise', merged: 'Both' }

export default function Report({ weekTasks, loading }) {
  const [offset, setOffset] = useState(0)
  const [copied, setCopied] = useState(false)

  const report = useMemo(() => buildWeekReport(weekTasks, offset), [weekTasks, offset])

  // The tallest bar defines the scale, so a light week still reads clearly
  // instead of showing seven barely-visible stubs.
  const maxDone = Math.max(1, ...report.byDay.map((d) => d.done))

  async function handleCopy() {
    const text = buildReportText(report, offset)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard API needs HTTPS and a user gesture; on failure fall back to
      // a prompt so the text is still selectable and copyable by hand.
      window.prompt('Copy this report:', text)
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function switchWeek(next) {
    setOffset(next)
    setCopied(false)
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <span className="icon-chip icon-chip-lg icon-chip-mixed">
            <TargetIcon width={24} height={24} />
          </span>
          <div>
            <h1>Report</h1>
          </div>
        </div>
        <div className="empty-hint">Loading…</div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <span className="icon-chip icon-chip-lg icon-chip-mixed">
          <TargetIcon width={24} height={24} />
        </span>
        <div>
          <h1>Report</h1>
          <p className="page-tagline">Kya hua, kab hua, kya reh gaya</p>
        </div>
      </div>

      <div className="report-toolbar">
        <span className="report-range">
          {report.start} → {report.end}
        </span>
        <div className="report-week-switch">
          <button
            className={`report-week-btn ${offset === 0 ? 'report-week-btn-active' : ''}`}
            onClick={() => switchWeek(0)}
          >
            This week
          </button>
          <button
            className={`report-week-btn ${offset === -1 ? 'report-week-btn-active' : ''}`}
            onClick={() => switchWeek(-1)}
          >
            Last week
          </button>
        </div>
      </div>

      <div className="report-stats">
        <div className="report-stat">
          <div className="report-stat-value">{report.tasks.length}</div>
          <div className="report-stat-label">Total tasks</div>
        </div>
        <div className="report-stat">
          <div className="report-stat-value report-stat-value-good">{report.done.length}</div>
          <div className="report-stat-label">Completed</div>
        </div>
        <div className="report-stat">
          <div
            className={`report-stat-value ${report.slipped.length > 0 ? 'report-stat-value-warn' : ''}`}
          >
            {report.open.length}
          </div>
          <div className="report-stat-label">
            {report.slipped.length > 0 ? `Open · ${report.slipped.length} overdue` : 'Still open'}
          </div>
        </div>
        <div className="report-stat">
          <div className="report-stat-value">{report.rate}%</div>
          <div className="report-stat-label">
            {report.doneHours}h of {report.totalHours}h
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>
          <span className="icon-chip icon-chip-mixed">
            <CalendarIcon width={15} height={15} />
          </span>
          Kab kaam hua
        </h2>
      </div>
      <div className="report-panel">
        <div className="report-days">
          {report.byDay.map((day) => (
            <div
              className={`report-day ${day.isToday ? 'report-day-today' : ''}`}
              key={day.date}
              title={`${day.date} — ${day.done} done, ${day.scheduled} scheduled`}
            >
              <span className="report-day-count">{day.done}</span>
              <div className="report-day-bar">
                <div
                  className="report-day-fill"
                  style={{ height: `${(day.done / maxDone) * 100}%` }}
                />
              </div>
              <span className="report-day-label">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {report.byBusiness.length > 0 && (
        <>
          <div className="section-header">
            <h2>
              <span className="icon-chip icon-chip-mixed">
                <ListIcon width={15} height={15} />
              </span>
              Business ke hisaab se
            </h2>
          </div>
          <div className="report-panel">
            {report.byBusiness.map((b) => (
              <div className="report-biz-row" key={b.key}>
                <span className={`report-biz-name report-biz-name-${b.key}`}>{b.label}</span>
                <div className="report-bar-track">
                  <div
                    className={`report-bar-fill report-bar-fill-${b.key}`}
                    style={{ width: `${b.rate}%` }}
                  />
                </div>
                <span className="report-biz-count">
                  {b.done}/{b.total} · {b.rate}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-header">
        <h2>
          <span className="icon-chip icon-chip-mixed">
            <CheckIcon width={15} height={15} />
          </span>
          Jo reh gaya
        </h2>
        <span className="board-count">{report.open.length}</span>
      </div>
      {report.open.length === 0 ? (
        <div className="empty-hint">Is hafte ka sab kaam ho gaya.</div>
      ) : (
        <div className="report-list">
          {report.open.map((task) => (
            <div className="report-list-item" key={task.id}>
              <span className="report-list-title">{task.title}</span>
              <span className={`badge badge-biz badge-biz-${task.business}`}>
                {BUSINESS_LABEL[task.business] || task.business}
              </span>
              <span className="report-list-meta">Due {task.deadlineDate}</span>
            </div>
          ))}
        </div>
      )}

      <div className="report-copy-row">
        <button className="btn btn-primary" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy report'}
        </button>
        <span className="report-copy-hint">
          Copy karke Claude me paste karo — agle hafte ka plan mil jayega.
        </span>
      </div>
    </div>
  )
}
