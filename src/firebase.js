import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your Firebase project config
const firebaseConfig = {
  apiKey: 'AIzaSyAGSDoGnpVFzLenrfjv5FIXspfWEao8TZU',
  authDomain: 'farhan-command-center.firebaseapp.com',
  projectId: 'farhan-command-center',
  storageBucket: 'farhan-command-center.firebasestorage.app',
  messagingSenderId: '77481924753',
  appId: '1:77481924753:web:103624247d5ffa7e274730',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// NOTE on future auth:
// Right now every read/write in src/lib/tasks.js and src/lib/socialStats.js
// talks directly to top-level Firestore collections ("tasks", "socialStats").
// If you add Firebase Auth later, the simplest upgrade path is to nest data
// under the signed-in user, e.g. collection(db, `users/${uid}/tasks`) instead
// of collection(db, 'tasks'). Because all Firestore calls are centralized in
// the src/lib/ files (nothing else in the app talks to Firestore directly),
// that's a one-file change per collection, not a rewrite of the app.
