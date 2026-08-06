import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, LOGIN_DOMAIN } from '../firebase'

/**
 * Tracks whether someone is signed in.
 *
 * `checking` is true only while Firebase restores the session on page load —
 * without it the login screen flashes for a moment on every refresh.
 */
export default function useAuth() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setChecking(false)
    })
    return unsubscribe
  }, [])

  return { user, checking }
}

/**
 * Signs in with a bare username. "farhan" becomes "farhan@command-centre.local"
 * before it reaches Firebase.
 */
export async function login(username, password) {
  const email = username.trim().toLowerCase() + LOGIN_DOMAIN
  await signInWithEmailAndPassword(auth, email, password)
}

export function logout() {
  return signOut(auth)
}
