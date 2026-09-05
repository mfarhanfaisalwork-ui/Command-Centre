/**
 * Tasks per day for the current week: how many were scheduled, how many done.
 * Data comes from buildWeekReport().byDay so it is always real.
 */
export default function WeekChart({ byDay = [] }) {
  const max = Math.max(1, ...byDay.map((d) => d.scheduled))

  return (
    <div className="wchart">
      <div className="wchart-plot">
        {byDay.map((d) => {
          const total = (d.scheduled / max) * 100
          const done = d.scheduled ? (d.done / d.scheduled) * total : 0
          return (
            <div key={d.date} className={`wchart-col ${d.isToday ? 'wchart-col-today' : ''}`}>
              <span className="wchart-count">{d.scheduled || ''}</span>
              <div className="wchart-bar">
                <span className="wchart-bar-total" style={{ height: `${total}%` }} />
                <span className="wchart-bar-done" style={{ height: `${done}%` }} />
              </div>
              <span className="wchart-label">{d.label}</span>
            </div>
          )
        })}
      </div>
      <div className="wchart-legend">
        <span><i className="swatch swatch-done" /> Done</span>
        <span><i className="swatch swatch-planned" /> Planned</span>
      </div>
    </div>
  )
}
