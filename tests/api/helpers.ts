import { type APIRequestContext } from '@playwright/test'

// Helper reutilizable: hace login y devuelve el token JWT.
export async function getAuthToken(
  request: APIRequestContext,
  username = 'admin',
  password = 'admin123',
): Promise<string> {
  const res = await request.post('/api/login', {
    data: { username, password },
  })
  const body = await res.json()
  return body.token
}