import { test, expect } from '@playwright/test'

test('admin puede iniciar sesión y ver el dashboard', async ({ page }) => {
  // 1. Ir a la página de login
  await page.goto('/login')

  // 2. Llenar credenciales usando los data-testid
  await page.getByTestId('login-username').fill('admin')
  await page.getByTestId('login-password').fill('admin123')

  // 3. Hacer clic en Ingresar
  await page.getByTestId('login-submit').click()

  // 4. Verificar que llegamos al dashboard
  await expect(page).toHaveURL(/.*\/dashboard/)

  // 5. Verificar que el rol mostrado es "admin"
  await expect(page.getByTestId('user-role')).toHaveText('admin')
})