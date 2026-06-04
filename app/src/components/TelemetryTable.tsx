import { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'

const API_URL = 'http://localhost:3001'
const PAGE_SIZE = 10

export interface TelemetryReading {
  id: number
  deviceId: string
  deviceName: string
  timestamp: string
  temperature: number
  humidity: number
  status: 'online' | 'offline' | 'degraded'
}

const columns: ColumnDef<TelemetryReading>[] = [
  { accessorKey: 'deviceId', header: 'Device ID' },
  { accessorKey: 'deviceName', header: 'Device' },
  { accessorKey: 'temperature', header: 'Temp (°C)' },
  { accessorKey: 'humidity', header: 'Humidity (%)' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'timestamp', header: 'Timestamp' },
]

function TelemetryTable() {
  const [data, setData] = useState<TelemetryReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const role = localStorage.getItem('fleetsense_role')

  async function handleExport() {
    const token = localStorage.getItem('fleetsense_token')
    const res = await fetch(`${API_URL}/api/telemetry/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      setError('No se pudo exportar el CSV')
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'telemetry.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('fleetsense_token')
        const res = await fetch(
          `${API_URL}/api/telemetry?page=${page}&pageSize=${PAGE_SIZE}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!res.ok) {
          setError('No se pudieron cargar los datos')
          return
        }
        const body = await res.json()
        setData(body.rows)
        setTotal(body.total)
      } catch {
        setError('Error de conexión con el servidor')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (error)
    return (
      <p data-testid="table-error" style={{ color: 'red' }}>
        {error}
      </p>
    )

  return (
    <div>
      {loading && <p data-testid="table-loading">Cargando telemetría...</p>}

      {role === 'admin' && (
        <button
          data-testid="export-csv"
          type="button"
          onClick={handleExport}
          style={{ marginBottom: '1rem' }}
        >
          Exportar CSV
        </button>
      )}

      <table data-testid="telemetry-table" border={1} cellPadding={6}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} data-testid="telemetry-row">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination" style={{ marginTop: '1rem' }}>
        <button
          data-testid="prev-page"
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
        >
          Anterior
        </button>

        <span data-testid="page-indicator" style={{ margin: '0 1rem' }}>
          Página {page} de {totalPages}
        </span>

        <button
          data-testid="next-page"
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default TelemetryTable