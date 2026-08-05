import { useEffect, useState } from 'react'
import { subscribeToMilestones } from '../lib/milestones'

/**
 * Keeps a live, always up-to-date list of every milestone in Firestore.
 * Filtering by business happens in the components that consume this data.
 */
export default function useMilestones() {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToMilestones((data) => {
      setMilestones(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { milestones, loading }
}
