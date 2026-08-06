import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your Firebase project config.
// This is safe to keep public — Firebase configs are meant to be visible in the
// frontend. Real security comes from Firestore rules + Auth, not from hiding this.
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
export const auth = getAuth(app)

// Firebase's email/password provider requires an email address, but the login
// screen only asks for a username. We append this domain internally so you can
// type "farhan" instead of a full email. The domain never needs to exist.
export const LOGIN_DOMAIN = '@command-centre.local'
