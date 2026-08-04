import { useEffect, useState } from 'react'
import { subscribeToSocialStats } from '../lib/socialStats'

/**
 * Keeps a live, always up-to-date list of every social stat entry in Firestore.
 * Filtering by business happens in the components that consume this data.
 */
export default function useSocialStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToSocialStats((data) => {
      setStats(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { stats, loading }
}
