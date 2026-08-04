import { useEffect, useState } from 'react'
import { subscribeToTasks } from '../lib/tasks'

/**
 * Keeps a live, always up-to-date list of every task in Firestore.
 * Filtering by business happens in the components that consume this data.
 */
export default function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToTasks((data) => {
      setTasks(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { tasks, loading }
}
