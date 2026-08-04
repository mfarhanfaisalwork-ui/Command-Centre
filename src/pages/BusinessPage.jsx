import TaskBoard from '../components/TaskBoard'
import SocialStats from '../components/SocialStats'

/**
 * @param {string} title - page heading, e.g. "NIFAR"
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

  return (
    <div className={`page ${accentClass}`}>
      <div className="page-header">
        <div className="page-header-glyph" aria-hidden="true" />
        <div>
          <h1>{title}</h1>
          {tagline && <p className="page-tagline">{tagline}</p>}
        </div>
      </div>

      <div className="section-header">
        <h2>
          <span className="eyebrow-mark">//</span> Tasks
        </h2>
      </div>
      {loading ? <div className="empty-hint">Loading…</div> : <TaskBoard tasks={boardTasks} business={business} />}

      <SocialStats entries={businessStats} business={business} platforms={platforms} />
    </div>
  )
}
