import TodayTasks from '../components/TodayTasks'
import WeekView from '../components/WeekView'
import Milestones from '../components/Milestones'
import TiltCard from '../components/TiltCard'
import { RocketIcon, SparkleIcon, ListIcon, TargetIcon, CalendarIcon } from '../components/Icons'
import { todayStr } from '../lib/scheduler'

/**
 * @param {string} title - page heading, e.g. "NIFAR"
 * @param {string} tagline - short line under the title
 * @param {string} business - 'nifar' or 'nifarise'
 * @param {string} accentClass - CSS class that sets the accent color for this page
 * @param {object[]} weekTasks - full week-task list (unfiltered)
 * @param {object[]} milestones - full milestone list (unfiltered)
 * @param {boolean} loading
 */
export default function BusinessPage({ title, tagline, business, accentClass, weekTasks, milestones, loading }) {
  const today = todayStr()
  const boardTasks = weekTasks.filter((t) => t.business === business || t.business === 'merged')
  const openTasks = weekTasks.filter((t) => t.status !== 'done')
  const todaysTasks = boardTasks.filter((t) => t.scheduledDate === today && t.status !== 'done')
  const businessMilestones = milestones.filter((m) => m.business === business)
  const HeaderIcon = business === 'nifar' ? RocketIcon : SparkleIcon
  const chipClass = business === 'nifar' ? 'icon-chip-nifar' : 'icon-chip-nifarise'

  return (
    <div className={`page ${accentClass}`}>
      <div className="page-header">
        <span className={`icon-chip icon-chip-lg ${chipClass}`}>
          <HeaderIcon width={24} height={24} />
        </span>
        <div>
          <h1>{title}</h1>
          {tagline && <p className="page-tagline">{tagline}</p>}
        </div>
      </div>

      <div className="section-header">
        <h2>
          <span className={`icon-chip ${chipClass}`}>
            <ListIcon width={15} height={15} />
          </span>
          Today
        </h2>
        <span className="board-count">{todaysTasks.length}</span>
      </div>
      {loading ? <div className="empty-hint">Loading…</div> : <TodayTasks tasks={todaysTasks} allOpenTasks={openTasks} />}

      <div className="section-header">
        <h2>
          <span className={`icon-chip ${chipClass}`}>
            <CalendarIcon width={15} height={15} />
          </span>
          This week
        </h2>
      </div>
      {!loading && <TiltCard><WeekView tasks={boardTasks} /></TiltCard>}

      <div className="section-header">
        <h2>
          <span className={`icon-chip ${chipClass}`}>
            <TargetIcon width={15} height={15} />
          </span>
          Milestones
        </h2>
      </div>
      {!loading && <Milestones entries={businessMilestones} business={business} />}
    </div>
  )
}
