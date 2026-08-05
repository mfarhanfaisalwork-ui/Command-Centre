import TaskBoard from '../components/TaskBoard'
import SocialStats from '../components/SocialStats'
import { RocketIcon, SparkleIcon, ListIcon, ChartIcon } from '../components/Icons'

/**
 * @param {string} title - page heading, e.g. "NIFAR"
 * @param {string} tagline - short line under the title
 * @param {string} business - 'nifar' or 'nifarise'
 * @param {string} accentClass - CSS class that sets the accent color for this page
 * @param {string[]} platforms - platform dropdown options for social stats
 * @param {object[]} tasks - full task list (unfiltered)
 * @param {object[]} stats - full social stats list (unfiltered)
 * @param {boolean} loading
 */
export default function BusinessPage({ title, tagline, business, accentClass, platforms, tasks, stats, loading }) {
  const boardTasks = tasks.filter((t) => t.business === business || t.business === 'merged')
  const businessStats = stats.filter((s) => s.business === business)
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
          Tasks
        </h2>
      </div>
      {loading ? <div className="empty-hint">Loading…</div> : <TaskBoard tasks={boardTasks} business={business} />}

      <div className="section-header">
        <h2>
          <span className={`icon-chip ${chipClass}`}>
            <ChartIcon width={15} height={15} />
          </span>
          Social stats
        </h2>
      </div>
      <SocialStats entries={businessStats} business={business} platforms={platforms} />
    </div>
  )
}
