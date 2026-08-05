import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// All Firestore access for milestones lives in this file.
const milestonesCollection = collection(db, 'milestones')

/**
 * Subscribe to all milestones in real time, oldest first (a rough roadmap order).
 * @param {(entries: object[]) => void} onChange
 * @returns {() => void} unsubscribe function
 */
export function subscribeToMilestones(onChange) {
  const q = query(milestonesCollection, orderBy('createdAt', 'asc'))
  return onSnapshot(
    q,
    (snapshot) => {
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    },
    (error) => {
      console.error('Failed to load milestones:', error)
      onChange([])
    }
  )
}

/**
 * Add a new milestone.
 * @param {{ title: string, business: 'nifar'|'nifarise', status: 'not_started'|'in_progress'|'done', targetDate?: string }} milestone
 */
export function addMilestone({ title, business, status = 'not_started', targetDate = null }) {
  return addDoc(milestonesCollection, {
    title,
    business,
    status,
    targetDate: targetDate || null,
    createdAt: serverTimestamp(),
  })
}

/** Update any fields on a milestone (status, title, targetDate). */
export function updateMilestone(id, fields) {
  return updateDoc(doc(db, 'milestones', id), fields)
}

/** Delete a milestone permanently. */
export function deleteMilestone(id) {
  return deleteDoc(doc(db, 'milestones', id))
}
