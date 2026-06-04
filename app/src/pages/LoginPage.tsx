import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

// Usuarios "de mentira" para el login simulado.
// En la Fase 4 esto lo reemplaza un backend real que emite JWT firmados.
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'viewer', password: 'viewer123', role: 'viewer' },
]

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    )

    if (!user) {
      setError('Usuario o contraseña incorrectos')
      return
    }

    // "Token" simulado por ahora. En Fase 4 será un JWT real del backend.
    localStorage.setItem('fleetsense_token', `mock-token-${user.role}`)
    localStorage.setItem('fleetsense_role', user.role)
    navigate({ to: '/dashboard' })
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
        >
          Ingresar
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