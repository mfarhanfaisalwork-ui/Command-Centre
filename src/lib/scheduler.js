// ==========================================================================
// Smart Weekly Task System — pure scheduling logic (no Firestore, no React).
// Kept dependency-free and testable in isolation.
// ==========================================================================

// How many hours of work we'll pack into a single day before overflowing
// to the next one. Tune this if a "day" should hold more/less.
export const DAILY_CAPACITY_HOURS = 4

const DAY_MS = 24 * 60 * 60 * 1000
const WEEKDAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// ---------- date helpers (all dates are 'YYYY-MM-DD' strings, local time) ----------

export function toDateStr(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function todayStr() {
  return toDateStr(new Date())
}

function parseDateStr(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(dateStr, n) {
  const d = parseDateStr(dateStr)
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

export function daysBetween(fromStr, toStr) {
  return Math.round((parseDateStr(toStr).getTime() - parseDateStr(fromStr).getTime()) / DAY_MS)
}

/** Monday of the week containing dateStr (weeks run Mon–Sun). */
export function getMonday(dateStr) {
  const d = parseDateStr(dateStr)
  const day = d.getDay() // 0 = Sun ... 6 = Sat
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toDateStr(d)
}

export function formatDayLabel(dateStr) {
  const d = parseDateStr(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// ---------- CSV parsing ----------

/** Minimal quote-aware CSV line splitter. */
function splitCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  cells.push(current.trim())
  return cells
}

const BUSINESS_ALIASES = { nifar: 'nifar', nifarise: 'nifarise', merged: 'merged', both: 'merged' }

function normalizeBusiness(raw) {
  const key = (raw || '').trim().toLowerCase()
  return BUSINESS_ALIASES[key] || 'nifar'
}

/**
 * Parse the weekly-upload CSV into raw task rows.
 * Expected header: Task Name, Business, Estimated Hours, Deadline, Notes
 * The header row is optional — detected and skipped if present.
 * @returns {{title:string, business:string, estimatedHours:number, deadlineRaw:string, notes:string}[]}
 */
export function parseWeekCsv(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []

  let rows = lines.map(splitCsvLine)
  const firstCell = (rows[0][0] || '').toLowerCase()
  if (firstCell.includes('task')) rows = rows.slice(1) // drop header row

  return rows
    .filter((cells) => cells[0]) // must have a task name
    .map((cells) => ({
      title: cells[0] || '',
      business: normalizeBusiness(cells[1]),
      estimatedHours: Math.max(0.25, parseFloat(cells[2]) || 1),
      deadlineRaw: (cells[3] || '').trim(),
      notes: cells[4] || '',
    }))
}

/**
 * Resolve a "Monday" / "Friday" / "2026-03-05" / blank deadline into a real
 * date string, anchored to the week being uploaded.
 */
export function resolveDeadlineDate(deadlineRaw, weekStart) {
  const weekEnd = addDays(weekStart, 6)
  const raw = (deadlineRaw || '').trim().toLowerCase()

  if (!raw) return weekEnd // "anytime this week" -> due by Sunday

  const dayIndex = WEEKDAY_NAMES.indexOf(raw)
  if (dayIndex !== -1) {
    // WEEKDAY_NAMES is Sun-first; convert to an offset from Monday.
    const offsetFromMonday = dayIndex === 0 ? 6 : dayIndex - 1
    return addDays(weekStart, offsetFromMonday)
  }

  // Try an explicit date (YYYY-MM-DD or anything Date can parse)
  const parsed = new Date(raw)
  if (!isNaN(parsed.getTime())) return toDateStr(parsed)

  return weekEnd // fallback: unrecognized -> end of week
}

// ---------- priority + time slot (derived live, never stored stale) ----------

export function getPriority(deadlineDate, today, conflict) {
  if (conflict) return 'high'
  const diff = daysBetween(today, deadlineDate)
  if (diff <= 1) return 'high'
  if (diff <= 3) return 'medium'
  return 'low'
}

const SLOT_LABELS = ['Morning', 'Midday', 'Afternoon', 'Evening']
export function getTimeSlotLabel(order) {
  return SLOT_LABELS[Math.min(order, SLOT_LABELS.length - 1)]
}

// ---------- the scheduler itself ----------

/**
 * Greedily bin-packs tasks onto days between "today" and each task's
 * deadline, respecting DAILY_CAPACITY_HOURS. Tasks with the nearest
 * deadlines (and the biggest ones among those) get first pick of open days.
 *
 * @param {object[]} tasks - each needs: id, estimatedHours, deadlineDate (YYYY-MM-DD)
 * @param {object} opts
 * @param {string} opts.today - YYYY-MM-DD
 * @param {Object<string,string>} [opts.forcedMinDates] - taskId -> earliest date it may land on (used for "push to tomorrow")
 * @returns {Object<string,{scheduledDate:string, order:number, conflict:boolean}>} keyed by task id
 */
export function scheduleWeek(tasks, { today, forcedMinDates = {} }) {
  const sorted = [...tasks].sort((a, b) => {
    const byDeadline = a.deadlineDate.localeCompare(b.deadlineDate)
    if (byDeadline !== 0) return byDeadline
    return b.estimatedHours - a.estimatedHours
  })

  const dayLoad = {} // dateStr -> hours used
  const dayOrderCount = {} // dateStr -> how many tasks already placed there
  const result = {}

  for (const task of sorted) {
    const minDate = forcedMinDates[task.id] && forcedMinDates[task.id] > today ? forcedMinDates[task.id] : today
    let cursor = minDate < today ? today : minDate
    let placed = false
    let conflict = false

    // Search from the earliest allowed day up to the deadline for room.
    while (true) {
      const used = dayLoad[cursor] || 0
      if (used + task.estimatedHours <= DAILY_CAPACITY_HOURS) {
        placed = true
        break
      }
      if (cursor >= task.deadlineDate) break
      cursor = addDays(cursor, 1)
    }

    if (!placed) {
      // No open capacity before the deadline — drop it on the deadline day
      // anyway and flag the conflict so the UI can call it out.
      cursor = cursor < task.deadlineDate ? task.deadlineDate : cursor
      conflict = true
    }

    dayLoad[cursor] = (dayLoad[cursor] || 0) + task.estimatedHours
    const order = dayOrderCount[cursor] || 0
    dayOrderCount[cursor] = order + 1

    result[task.id] = { scheduledDate: cursor, order, conflict }
  }

  return result
}
