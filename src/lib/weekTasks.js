import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { scheduleWeek, todayStr, addDays, resolveDeadlineDate, getMonday } from './scheduler'

// All Firestore access for the weekly task system lives in this file.
const weekTasksCollection = collection(db, 'weekTasks')

/**
 * Subscribe to every week-task in real time.
 * @param {(tasks: object[]) => void} onChange
 * @returns {() => void} unsubscribe function
 */
export function subscribeToWeekTasks(onChange) {
  const q = query(weekTasksCollection, orderBy('scheduledDate', 'asc'))
  return onSnapshot(
    q,
    (snapshot) => {
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    },
    (error) => {
      console.error('Failed to load week tasks:', error)
      onChange([])
    }
  )
}

/**
 * Take parsed CSV rows for a week, resolve deadlines, run the scheduler,
 * and write them all to Firestore in one batch.
 * @param {{title:string, business:string, estimatedHours:number, deadlineRaw:string, notes:string}[]} rows
 * @param {object[]} existingOpenTasks - currently-scheduled, not-done tasks already in Firestore (so the new week doesn't overload days that are already spoken for)
 */
export async function uploadWeekTasks(rows, existingOpenTasks = []) {
  const today = todayStr()
  const weekStart = getMonday(today)

  const draftTasks = rows.map((row, i) => ({
    id: `draft-${i}`,
    ...row,
    deadlineDate: resolveDeadlineDate(row.deadlineRaw, weekStart),
  }))

  // Schedule the new batch alongside whatever's already sitting open this
  // week, so the new upload doesn't blow past daily capacity.
  const existingAsScheduleInput = existingOpenTasks.map((t) => ({
    id: t.id,
    estimatedHours: t.estimatedHours,
    deadlineDate: t.deadlineDate,
  }))
  const combined = [...existingAsScheduleInput, ...draftTasks]
  const assignments = scheduleWeek(combined, { today })

  const batch = writeBatch(db)
  const newDocRefs = []

  for (const task of draftTasks) {
    const ref = doc(weekTasksCollection)
    const { scheduledDate, order, conflict } = assignments[task.id]
    batch.set(ref, {
      title: task.title,
      business: task.business,
      estimatedHours: task.estimatedHours,
      notes: task.notes || '',
      weekStart,
      deadlineDate: task.deadlineDate,
      scheduledDate,
      order,
      conflict,
      status: 'scheduled',
      createdAt: serverTimestamp(),
    })
    newDocRefs.push(ref)
  }

  // Re-apply any shift to the pre-existing open tasks too (rare, but keeps
  // things honest if the new upload was big).
  for (const t of existingOpenTasks) {
    const a = assignments[t.id]
    if (a && (a.scheduledDate !== t.scheduledDate || a.order !== t.order || a.conflict !== t.conflict)) {
      batch.update(doc(db, 'weekTasks', t.id), {
        scheduledDate: a.scheduledDate,
        order: a.order,
        conflict: a.conflict,
      })
    }
  }

  await batch.commit()
  return newDocRefs.length
}

/**
 * Mark a task done. completedAt is what the weekly report uses to work out
 * which day the work actually landed on, rather than which day it was planned.
 */
export function completeWeekTask(id) {
  return updateDoc(doc(db, 'weekTasks', id), {
    status: 'done',
    completedAt: serverTimestamp(),
  })
}

/** Permanently remove a task. */
export function deleteWeekTask(id) {
  return deleteDoc(doc(db, 'weekTasks', id))
}

/**
 * Skip a task for today and push it to tomorrow, then rebalance every other
 * still-open task from tomorrow onward so the rest of the week resettles
 * around the shift. Any task that now can't fit before its own deadline
 * gets flagged as a conflict (which the UI surfaces as High priority).
 * @param {object} task - the task being pushed
 * @param {object[]} allOpenTasks - every not-done task currently in Firestore
 */
export async function pushTaskToTomorrow(task, allOpenTasks) {
  const today = todayStr()
  const tomorrow = addDays(today, 1)

  const scheduleInput = allOpenTasks.map((t) => ({
    id: t.id,
    estimatedHours: t.estimatedHours,
    deadlineDate: t.deadlineDate,
  }))

  const assignments = scheduleWeek(scheduleInput, {
    today,
    forcedMinDates: { [task.id]: tomorrow },
  })

  const batch = writeBatch(db)
  for (const t of allOpenTasks) {
    const a = assignments[t.id]
    if (a && (a.scheduledDate !== t.scheduledDate || a.order !== t.order || a.conflict !== t.conflict)) {
      batch.update(doc(db, 'weekTasks', t.id), {
        scheduledDate: a.scheduledDate,
        order: a.order,
        conflict: a.conflict,
      })
    }
  }
  await batch.commit()
}
