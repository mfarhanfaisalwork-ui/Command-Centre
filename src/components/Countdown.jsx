import { useEffect, useState } from 'react'

const TARGET_DATE = new Date('2026-12-31T23:59:59')

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

  return (
    <div className="countdown">
      <div className="countdown-number">{days}</div>
      <div className="countdown-label">
        days left to leave the day job
        <span className="countdown-sublabel">Target: December 31, 2026</span>
      </div>
    </div>
  )
}
