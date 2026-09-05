import Ring from '../components/Ring'
import WeekChart from '../components/WeekChart'
import MiniCalendar from '../components/MiniCalendar'
import TodayTasks from '../components/TodayTasks'
import UploadWeekTasks from '../components/UploadWeekTasks'
import { todayStr } from '../lib/scheduler'
import { buildWeekReport } from '../lib/report'

export default function Home({ weekTasks, loading }) {
  const today = todayStr()
  const report = buildWeekReport(weekTasks, 0)

  const openTasks = weekTasks.filter((t) => t.status !== 'done')
  const todaysAll = weekTasks.filter((t) => t.scheduledDate === today)
  const todaysOpen = todaysAll.filter((t) => t.status !== 'done')
  const todaysDone = todaysAll.length - todaysOpen.length

  const todayPercent = todaysAll.length ? (todaysDone / todaysAll.length) * 100 : 0
  const hoursPercent = report.totalHours ? (report.doneHours / report.totalHours) * 100 : 0

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-tagline">{dateLabel}</p>
        </div>
      </header>

      <div className="grid">
        <section className="card tint-violet">
          <span className="card-label">Today</span>
          <Ring
            percent={todayPercent}
            tone="violet"
            label={`${todaysDone} of ${todaysAll.length} done`}
            sub={todaysOpen.length ? `${todaysOpen.length} left` : 'All clear'}
          />
        </section>

        <section className="card tint-blue">
          <span className="card-label">This week</span>
          <Ring
            percent={report.rate}
            tone="nifarise"
            label={`${report.done.length} of ${report.tasks.length} done`}
            sub={report.slipped.length ? `${report.slipped.length} overdue` : 'On track'}
          />
        </section>

        <section className="card tint-amber">
          <span className="card-label">Hours</span>
          <Ring
            percent={hoursPercent}
            tone="nifar"
            label={`${report.doneHours}h of ${report.totalHours}h`}
            sub="planned this week"
          />
        </section>

        <section className="card span-2">
          <span className="card-label">Tasks per day</span>
          <WeekChart byDay={report.byDay} />
        </section>

        <section className="card">
          <span className="card-label">By business</span>
          {report.byBusiness.length === 0 ? (
            <p className="muted">No tasks this week.</p>
          ) : (
            <div className="split-list">
              {report.byBusiness.map((b) => (
                <div key={b.key} className="split-row">
                  <div className="split-top">
                    <span className={`split-name split-name-${b.key}`}>{b.label}</span>
                    <span className="split-count">
                      {b.done}/{b.total}
                    </span>
                  </div>
                  <div className="split-track">
                    <span className={`split-fill split-fill-${b.key}`} style={{ width: `${b.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <span className="card-label">Calendar</span>
          <MiniCalendar weekTasks={weekTasks} />
        </section>

        <section className="card span-2">
          <div className="card-head">
            <span className="card-label">Today's tasks</span>
            <span className="board-count">{todaysOpen.length}</span>
          </div>
          {loading ? (
            <div className="empty-hint">Loading…</div>
          ) : (
            <TodayTasks tasks={todaysOpen} allOpenTasks={openTasks} showBusinessTag />
          )}
          <div className="upload-row">
            <UploadWeekTasks existingOpenTasks={openTasks} />
          </div>
        </section>
      </div>
    </div>
  )
}
