import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { telemetryData } from './data'

const app = express()
const PORT = 3001

// En producción esto vendría de una variable de entorno, NUNCA en el código.
const JWT_SECRET = 'fleetsense-dev-secret-change-me'

app.use(cors())
app.use(express.json())

// "Base de datos" de usuarios simulada.
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'viewer', password: 'viewer123', role: 'viewer' },
]

// Payload que guardamos dentro del JWT.
interface TokenPayload {
  sub: string
  role: string
}

// --- POST /api/login : valida credenciales y emite un JWT firmado ---
app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body ?? {}

  const user = USERS.find(
    (u) => u.username === username && u.password === password,
  )

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { sub: user.username, role: user.role } satisfies TokenPayload,
    JWT_SECRET,
    { expiresIn: '1h' },
  )

  return res.status(200).json({ token, role: user.role })
})

// --- Middleware: exige un Bearer token válido ---
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined

  if (!token) {
    return res.status(401).json({ error: 'Missing token' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    ;(req as Request & { user?: TokenPayload }).user = payload
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// --- GET /api/me : devuelve el usuario del token (ruta protegida) ---
app.get('/api/me', authenticateToken, (req: Request, res: Response) => {
  const user = (req as Request & { user?: TokenPayload }).user
  return res.status(200).json({ username: user?.sub, role: user?.role })
})

// --- GET /api/telemetry : datos paginados (ruta protegida) ---
app.get('/api/telemetry', authenticateToken, (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10))

  const start = (page - 1) * pageSize
  const rows = telemetryData.slice(start, start + pageSize)

  return res.status(200).json({
    rows,
    total: telemetryData.length,
    page,
    pageSize,
  })
})

app.listen(PORT, () => {
  console.log(`FleetSense API listening on http://localhost:${PORT}`)
})