import Countdown from '../components/Countdown'

const BUSINESS_LABEL = { nifar: 'NIFAR', nifarise: 'Nifarise', merged: 'Both' }

export default function Home({ tasks, loading }) {
  const activeTasks = tasks.filter((t) => t.status === 'doing')

  return (
    <div className="page">
      <Countdown />

      <div className="section-header">
        <h2>Active right now</h2>
        <span className="board-count">{activeTasks.length}</span>
      </div>

      {loading ? (
        <div className="empty-hint">Loading…</div>
      ) : activeTasks.length === 0 ? (
        <div className="empty-hint">Nothing marked "Doing" yet in NIFAR or Nifarise</div>
      ) : (
        <div className="active-list">
          {activeTasks.map((task) => (
            <div className="active-item" key={task.id}>
              <span
                className={`active-dot active-dot-${task.business === 'merged' ? 'merged' : task.business}`}
              />
              <span className="active-title">{task.title}</span>
              {task.dueDate && <span className="active-due">Due {task.dueDate}</span>}
              <span className="active-business">{BUSINESS_LABEL[task.business]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
