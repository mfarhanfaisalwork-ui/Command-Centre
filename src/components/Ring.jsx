/**
 * Donut progress ring with the value in the middle.
 * tone: 'nifar' | 'nifarise' | 'success' | 'violet'
 */
export default function Ring({ percent = 0, tone = 'violet', size = 92, label, sub }) {
  const value = Math.max(0, Math.min(100, Math.round(percent)))
  const r = 40
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - value / 100)

  return (
    <div className="ring">
      <div className="ring-visual" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle className="ring-track" cx="50" cy="50" r={r} fill="none" strokeWidth="9" />
          <circle
            className={`ring-bar ring-bar-${tone}`}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="ring-value">{value}%</span>
      </div>
      {(label || sub) && (
        <div className="ring-text">
          {label && <span className="ring-label">{label}</span>}
          {sub && <span className="ring-sub">{sub}</span>}
        </div>
      )}
    </div>
  )
}
