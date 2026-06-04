import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

const API_URL = 'http://localhost:3001'

test.describe('Tabla de telemetría', () => {
  test('carga 10 filas en la página 1', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'admin123')

    await expect(dashboard.table).toBeVisible()
    await expect(dashboard.rows).toHaveCount(10)
    await expect(dashboard.pageIndicator).toContainText('Página 1')
  })

  test('la paginación de servidor cambia los datos', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'admin123')

    // Capturamos el primer Device ID de la página 1
    const firstDeviceP1 = await dashboard.rows.first().textContent()

    await dashboard.goToNextPage()
    await expect(dashboard.pageIndicator).toContainText('Página 2')

    // El primer Device ID de la página 2 debe ser distinto
    const firstDeviceP2 = await dashboard.rows.first().textContent()
    expect(firstDeviceP2).not.toBe(firstDeviceP1)
  })

  test('el botón de exportar solo es visible para admin', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'admin123')
    await expect(dashboard.exportButton).toBeVisible()
  })

  test('el viewer NO ve el botón de exportar', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('viewer', 'viewer123')
    await expect(dashboard.table).toBeVisible()
    await expect(dashboard.exportButton).toHaveCount(0)
  })

  test('cross-layer: el CSV descargado coincide con la salida del API', async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page)
    const dashboard = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('admin', 'admin123')

    // 1. Descargar el CSV vía la UI
    const downloadPromise = page.waitForEvent('download')
    await dashboard.exportButton.click()
    const download = await downloadPromise
    const filePath = await download.path()
    const uiCsv = readFileSync(filePath, 'utf-8')

    // 2. Obtener el CSV directamente del API
    const loginRes = await request.post(`${API_URL}/api/login`, {
      data: { username: 'admin', password: 'admin123' },
    })
    const { token } = await loginRes.json()
    const apiRes = await request.get(`${API_URL}/api/telemetry/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const apiCsv = await apiRes.text()

    // 3. Validación cruzada: ambos deben coincidir
    expect(uiCsv).toBe(apiCsv)

    // 4. Validar estructura: header + 237 filas
    const lines = uiCsv.trim().split('\n')
    expect(lines[0]).toBe(
      'id,deviceId,deviceName,timestamp,temperature,humidity,status',
    )
    expect(lines).toHaveLength(238)
  })
})