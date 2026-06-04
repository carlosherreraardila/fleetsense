import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

test.describe('Autenticación de FleetSense', () => {
  test('admin inicia sesión y ve el dashboard con su rol', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'admin123')

    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(dashboard.role).toHaveText('admin')
  })

  test('viewer inicia sesión y ve el dashboard con su rol', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('viewer', 'viewer123')

    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(dashboard.role).toHaveText('viewer')
  })

  test('credenciales inválidas muestran error y no permiten entrar', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'clave-mala')

    await expect(loginPage.error).toBeVisible()
    await expect(loginPage.error).toHaveText('Usuario o contraseña incorrectos')
    await expect(page).toHaveURL(/.*\/login/)
  })

  test('una ruta protegida redirige al login sin sesión', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*\/login/)
  })

  test('el usuario puede cerrar sesión', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'admin123')
    await expect(dashboard.role).toHaveText('admin')

    await dashboard.logout()
    await expect(page).toHaveURL(/.*\/login/)
  })
})