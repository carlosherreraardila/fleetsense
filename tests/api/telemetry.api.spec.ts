import { test, expect } from '@playwright/test'
import { getAuthToken } from './helpers'

test.describe('API — Telemetry (ruta protegida)', () => {
  test('sin token devuelve 401', async ({ request }) => {
    const res = await request.get('/api/telemetry')
    expect(res.status()).toBe(401)
  })

  test('con token inválido devuelve 403', async ({ request }) => {
    const res = await request.get('/api/telemetry', {
      headers: { Authorization: 'Bearer token-falso-xyz' },
    })
    expect(res.status()).toBe(403)
  })

  test('con token válido devuelve datos paginados (200)', async ({ request }) => {
    const token = await getAuthToken(request)
    const res = await request.get('/api/telemetry?page=1&pageSize=10', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.total).toBe(237)
    expect(body.rows).toHaveLength(10)
    expect(body.rows[0]).toHaveProperty('deviceId')
    expect(body.rows[0]).toHaveProperty('temperature')
  })
})