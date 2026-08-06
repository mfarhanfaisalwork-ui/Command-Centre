import { getMonday, addDays, todayStr } from './scheduler'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const BUSINESS_LABEL = { nifar: 'NIFAR', nifarise: 'Nifarise', merged: 'Both' }

/**
 * Monday-to-Sunday date strings for a week.
 * @param {number} offset - 0 = this week, -1 = last week
 */
export function getWeekDays(offset = 0) {
  const monday = addDays(getMonday(todayStr()), offset * 7)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/**
 * Firestore gives us a Timestamp for completedAt. Tasks completed before this
 * field existed have nothing at all, so every read has to tolerate undefined.
 * @returns {string|null} YYYY-MM-DD, or null if we don't know when it happened
 */
function completedDate(task) {
  const raw = task.completedAt
  if (!raw) return null
  const date = typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Everything the report page needs for one week, computed in one pass.
 * @param {object[]} allTasks - every weekTask in Firestore
 * @param {number} offset - 0 = this week, -1 = last week
 */
export function buildWeekReport(allTasks, offset = 0) {
  const days = getWeekDays(offset)
  const start = days[0]
  const end = days[6]
  const today = todayStr()

  const tasks = allTasks.filter((t) => t.scheduledDate >= start && t.scheduledDate <= end)
  const done = tasks.filter((t) => t.status === 'done')
  const open = tasks.filter((t) => t.status !== 'done')

  // A task counts as slipped if its deadline has already passed and it still
  // isn't done. Tasks due later in the week are simply "still open".
  const slipped = open.filter((t) => t.deadlineDate && t.deadlineDate < today)

  const totalHours = tasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0)
  const doneHours = done.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0)

  const byBusiness = ['nifar', 'nifarise', 'merged'].map((key) => {
    const all = tasks.filter((t) => t.business === key)
    const finished = all.filter((t) => t.status === 'done')
    return {
      key,
      label: BUSINESS_LABEL[key],
      total: all.length,
      done: finished.length,
      rate: all.length ? Math.round((finished.length / all.length) * 100) : 0,
    }
  })

  // Prefer the real completion date. Fall back to the scheduled date for tasks
  // finished before completedAt was being recorded, so old data still charts.
  const byDay = days.map((date, i) => ({
    date,
    label: DAY_LABELS[i],
    isToday: date === today,
    done: done.filter((t) => (completedDate(t) || t.scheduledDate) === date).length,
    scheduled: tasks.filter((t) => t.scheduledDate === date).length,
  }))

  const rate = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0

  return {
    start,
    end,
    days,
    tasks,
    done,
    open,
    slipped,
    byBusiness: byBusiness.filter((b) => b.total > 0),
    byDay,
    rate,
    totalHours,
    doneHours,
    busiestDay: byDay.reduce((best, d) => (d.done > best.done ? d : best), byDay[0]),
  }
}

/**
 * Flatten the report into plain text so it can be pasted into a chat and turned
 * into next week's plan. Deliberately readable rather than JSON.
 */
export function buildReportText(report, offset) {
  const lines = []
  const which = offset === 0 ? 'This week' : 'Last week'

  lines.push(`WEEKLY REPORT — ${which} (${report.start} to ${report.end})`)
  lines.push('')
  lines.push(`Tasks: ${report.done.length} done out of ${report.tasks.length} (${report.rate}%)`)
  lines.push(`Hours: ${report.doneHours}h done out of ${report.totalHours}h planned`)
  if (report.busiestDay && report.busiestDay.done > 0) {
    lines.push(`Busiest day: ${report.busiestDay.label} (${report.busiestDay.done} tasks)`)
  }
  lines.push('')

  if (report.byBusiness.length) {
    lines.push('BY BUSINESS')
    for (const b of report.byBusiness) {
      lines.push(`- ${b.label}: ${b.done}/${b.total} (${b.rate}%)`)
    }
    lines.push('')
  }

  lines.push('COMPLETED')
  if (report.done.length === 0) {
    lines.push('- nothing completed this week')
  } else {
    for (const t of report.done) {
      const when = completedDate(t) || t.scheduledDate
      lines.push(`- ${t.title} [${BUSINESS_LABEL[t.business] || t.business}] — ${when}`)
    }
  }
  lines.push('')

  lines.push('NOT DONE')
  if (report.open.length === 0) {
    lines.push('- everything got done')
  } else {
    for (const t of report.open) {
      const late = t.deadlineDate && t.deadlineDate < todayStr() ? ' — OVERDUE' : ''
      lines.push(
        `- ${t.title} [${BUSINESS_LABEL[t.business] || t.business}] — due ${t.deadlineDate}${late}`
      )
    }
  }
  lines.push('')

  lines.push('---')
  lines.push('Ye meri is hafte ki report hai. Isay dekh kar batao:')
  lines.push('1. Kya theek chala aur kya nahi')
  lines.push('2. Agle hafte ke tasks — CSV format me, upload ke liye taiyar')

  return lines.join('\n')
}
