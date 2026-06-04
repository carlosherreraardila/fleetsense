// Generador de datos de telemetría IoT simulados (en memoria).
// Esto alimentará la tabla del dashboard en la Fase 5.

export interface TelemetryReading {
  id: number
  deviceId: string
  deviceName: string
  timestamp: string
  temperature: number
  humidity: number
  status: 'online' | 'offline' | 'degraded'
}

const STATUSES: TelemetryReading['status'][] = ['online', 'offline', 'degraded']

function generateTelemetry(count: number): TelemetryReading[] {
  const readings: TelemetryReading[] = []
  for (let i = 1; i <= count; i++) {
    const deviceNum = ((i - 1) % 12) + 1
    readings.push({
      id: i,
      deviceId: `DEV-${String(deviceNum).padStart(3, '0')}`,
      deviceName: `Sensor ${deviceNum}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      temperature: Math.round((15 + Math.random() * 20) * 100) / 100,
      humidity: Math.round((30 + Math.random() * 50) * 100) / 100,
      status: STATUSES[i % STATUSES.length],
    })
  }
  return readings
}

export const telemetryData = generateTelemetry(237)