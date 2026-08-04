import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// All Firestore access for social stats lives in this file. If auth gets
// added later, this is the only place that needs to change (see note in firebase.js).
const statsCollection = collection(db, 'socialStats')

/**
 * Subscribe to all social stat entries in real time, newest first.
 * @param {(entries: object[]) => void} onChange
 * @returns {() => void} unsubscribe function
 */
export function subscribeToSocialStats(onChange) {
  const q = query(statsCollection, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      onChange(entries)
    },
    (error) => {
      console.error('Failed to load social stats:', error)
      onChange([])
    }
  )
}

/**
 * Log a new social post entry.
 * @param {{ business: 'nifar'|'nifarise', platform: string, postName: string, views: number, shares: number }} entry
 */
export function addSocialStat({ business, platform, postName, views, shares }) {
  return addDoc(statsCollection, {
    business,
    platform,
    postName,
    views: Number(views) || 0,
    shares: Number(shares) || 0,
    createdAt: serverTimestamp(),
  })
}

/** Delete a social stat entry permanently. */
export function deleteSocialStat(id) {
  return deleteDoc(doc(db, 'socialStats', id))
}
