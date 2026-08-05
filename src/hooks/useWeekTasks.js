import { useEffect, useState } from 'react'
import { subscribeToWeekTasks } from '../lib/weekTasks'

/**
 * Keeps a live, always up-to-date list of every week-task in Firestore.
 * Filtering by business/day happens in the components that consume this data.
 */
export default function useWeekTasks() {
  const [weekTasks, setWeekTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToWeekTasks((data) => {
      setWeekTasks(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { weekTasks, loading }
}
