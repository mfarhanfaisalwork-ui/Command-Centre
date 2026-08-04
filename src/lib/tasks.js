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

// All Firestore access for tasks lives in this file. If auth gets added
// later, this is the only place that needs to change (see note in firebase.js).
const tasksCollection = collection(db, 'tasks')

/**
 * Subscribe to all tasks in real time, newest first.
 * @param {(tasks: object[]) => void} onChange
 * @returns {() => void} unsubscribe function
 */
export function subscribeToTasks(onChange) {
  const q = query(tasksCollection, orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      onChange(tasks)
    },
    (error) => {
      console.error('Failed to load tasks:', error)
      onChange([])
    }
  )
}

/**
 * Add a new task.
 * @param {{ title: string, business: 'nifar'|'nifarise'|'merged', status: 'todo'|'doing'|'done', dueDate?: string }} task
 */
export function addTask({ title, business, status = 'todo', dueDate = null }) {
  return addDoc(tasksCollection, {
    title,
    business,
    status,
    dueDate: dueDate || null,
    createdAt: serverTimestamp(),
  })
}

/** Update any fields on a task (status, title, dueDate, business, etc). */
export function updateTask(id, fields) {
  return updateDoc(doc(db, 'tasks', id), fields)
}

/** Delete a task permanently. */
export function deleteTask(id) {
  return deleteDoc(doc(db, 'tasks', id))
}
