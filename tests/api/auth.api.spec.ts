import { test, expect } from '@playwright/test'

test.describe('API — Authentication', () => {
  test('login con credenciales válidas devuelve token y rol (200)', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { username: 'admin', password: 'admin123' },
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.token).toBeTruthy()
    expect(body.role).toBe('admin')
  })

  test('login con credenciales inválidas devuelve 401', async ({ request }) => {
    const res = await request.post('/api/login', {
      data: { username: 'admin', password: 'clave-mala' },
    })
    expect(res.status()).toBe(401)
  })
})