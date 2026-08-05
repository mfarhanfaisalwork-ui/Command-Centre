import { useEffect, useState } from 'react'
import { ClockIcon } from './Icons'

const TARGET_DATE = new Date('2026-12-31T23:59:59')
const START_DATE = new Date('2026-01-01T00:00:00')
const TOTAL_DAYS = Math.round((TARGET_DATE.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24))

function getDaysRemaining() {
  const now = new Date()
  const msRemaining = TARGET_DATE.getTime() - now.getTime()
  return Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))
}

export default function Countdown() {
  const [days, setDays] = useState(getDaysRemaining())

  useEffect(() => {
    // Recheck once an hour, no need for anything faster
    const interval = setInterval(() => setDays(getDaysRemaining()), 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  const progress = Math.min(1, Math.max(0, 1 - days / TOTAL_DAYS))
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="countdown">
      <div className="countdown-top">
        <span className="icon-chip icon-chip-nifar">
          <ClockIcon width={18} height={18} />
        </span>
        <span className="countdown-eyebrow">Exit clock</span>
      </div>
      <div className="countdown-body">
        <div className="countdown-ring">
          <svg viewBox="0 0 100 100" width="96" height="96">
            <circle cx="50" cy="50" r={radius} className="ring-track" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="ring-progress"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="countdown-number">{String(days).padStart(3, '0')}</div>
        </div>
        <div className="countdown-label">
          days left to leave the day job
          <span className="countdown-sublabel">Target: December 31, 2026</span>
        </div>
      </div>
    </div>
  )
}
