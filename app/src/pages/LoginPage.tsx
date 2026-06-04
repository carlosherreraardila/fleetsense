import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const API_URL = 'http://localhost:3001'

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError('Usuario o contraseña incorrectos')
        return
      }

      const data = await res.json()
      localStorage.setItem('fleetsense_token', data.token)
      localStorage.setItem('fleetsense_role', data.role)
      navigate({ to: '/dashboard' })
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>FleetSense</h1>
      <p>IoT Telemetry Dashboard</p>

      <div className="login-form">
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          data-testid="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          data-testid="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          data-testid="login-submit"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {error && (
          <p data-testid="login-error" style={{ color: 'red' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default LoginPage