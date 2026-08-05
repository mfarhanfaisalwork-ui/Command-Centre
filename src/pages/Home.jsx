import Countdown from '../components/Countdown'
import TodayTasks from '../components/TodayTasks'
import UploadWeekTasks from '../components/UploadWeekTasks'
import TiltCard from '../components/TiltCard'
import { ZapIcon } from '../components/Icons'
import { todayStr } from '../lib/scheduler'

export default function Home({ weekTasks, loading }) {
  const today = todayStr()
  const openTasks = weekTasks.filter((t) => t.status !== 'done')
  const todaysTasks = weekTasks.filter((t) => t.scheduledDate === today && t.status !== 'done')

  return (
    <div className="page">
      <TiltCard>
        <Countdown />
      </TiltCard>

      <div className="section-header">
        <h2>
          <span className="icon-chip icon-chip-mixed">
            <ZapIcon width={15} height={15} />
          </span>
          Today, across both businesses
        </h2>
        <span className="board-count">{todaysTasks.length}</span>
      </div>

      {loading ? (
        <div className="empty-hint">Loading…</div>
      ) : (
        <TodayTasks tasks={todaysTasks} allOpenTasks={openTasks} showBusinessTag />
      )}

      <div className="upload-row">
        <UploadWeekTasks existingOpenTasks={openTasks} />
      </div>
    </div>
  )
}
