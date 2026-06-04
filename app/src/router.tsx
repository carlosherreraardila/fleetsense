import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

// Ruta raíz: el "marco" común a todas las páginas.
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Ruta /login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Ruta /dashboard (protegida)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  beforeLoad: () => {
    const token = localStorage.getItem('fleetsense_token')
    if (!token) {
      throw redirect({ to: '/login' })
    }
  },
})

// Ruta raíz "/" -> manda a /login
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}