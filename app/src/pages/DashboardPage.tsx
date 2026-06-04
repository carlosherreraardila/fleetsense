import { useNavigate } from '@tanstack/react-router'

function DashboardPage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('fleetsense_role') ?? 'desconocido'

  function handleLogout() {
    localStorage.removeItem('fleetsense_token')
    localStorage.removeItem('fleetsense_role')
    navigate({ to: '/login' })
  }

  return (
    <div>
      <header>
        <h1>FleetSense — Dashboard</h1>
        <p>
          Rol actual: <strong data-testid="user-role">{role}</strong>
        </p>
        <button data-testid="logout-button" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <p>Aquí irá la tabla de telemetría.</p>
    </div>
  )
}

export default DashboardPage