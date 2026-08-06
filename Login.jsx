import { useState } from 'react'
import { login } from '../hooks/useAuth'

// Inline styles on purpose: index.css gets rewritten in the redesign phase, and
// this screen should keep working regardless of what happens to the stylesheet.
const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#07060b',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '340px',
    background: '#16141f',
    border: '1px solid #322f42',
    borderRadius: '14px',
    padding: '32px 28px',
  },
  brand: {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontSize: '12px',
    letterSpacing: '0.08em',
    color: '#a19dae',
    marginBottom: '28px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#a19dae',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    fontSize: '15px',
    color: '#f3f1fa',
    background: '#0c0b13',
    border: '1px solid #322f42',
    borderRadius: '8px',
    marginBottom: '18px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#07060b',
    background: '#9c8fe8',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    fontSize: '13px',
    color: '#f0475b',
    marginTop: '14px',
    textAlign: 'center',
  },
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    setError('')
    setBusy(true)
    try {
      await login(username, password)
      // No redirect needed — useAuth notices the change and App swaps the screen.
    } catch {
      // Firebase returns different codes for wrong-user vs wrong-password, but
      // showing one generic message avoids confirming which usernames exist.
      setError('Username ya password ghalat hai.')
      setBusy(false)
    }
  }

  return (
    <div style={styles.wrap}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.brand}>COMMAND_CENTER</div>

        <label style={styles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
        />

        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" style={styles.button} disabled={busy}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  )
}
