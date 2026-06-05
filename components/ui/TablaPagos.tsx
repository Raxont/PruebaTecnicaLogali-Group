'use client'

import { useState, useMemo } from 'react'
import type { Pago, EstadoPago } from '@/types/pago'

interface TablaPagosProps {
  pagos: Pago[]
}

const ESTADO_CONFIG: Record<EstadoPago, { label: string; classes: string }> = {
  completed: {
    label: 'Completado',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  refunded: {
    label: 'Reembolsado',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  }
}

function formatImporte(importe: number, moneda: string): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda.toUpperCase(),
    minimumFractionDigits: moneda.toUpperCase() === 'USD' ? 2 : 0,
    maximumFractionDigits: moneda.toUpperCase() === 'USD' ? 2 : 0,
  }).format(importe)
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function exportToCSV(pagos: Pago[]): void {
  const headers = ['ID Pago', 'Nombre', 'Email', 'Curso', 'Importe', 'Moneda', 'Estado', 'Fecha']
  const rows = pagos.map((p) => [
    p.id_pago,
    p.nombre,
    p.email,
    p.curso,
    p.importe.toString(),
    p.moneda,
    p.estado,
    p.fecha,
  ])
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `formapro-pagos-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function TablaPagos({ pagos }: TablaPagosProps) {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPago | 'todos'>('todos')

  const pagosFiltrados = useMemo(() => {
    return pagos.filter((p) => {
      const matchBusqueda =
        busqueda === '' ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.curso.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.email.toLowerCase().includes(busqueda.toLowerCase())

      const matchEstado = estadoFiltro === 'todos' || p.estado === estadoFiltro

      return matchBusqueda && matchEstado
    })
  }, [pagos, busqueda, estadoFiltro])

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, curso o email…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoPago | 'todos')}
          className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="todos">Todos los estados</option>
          <option value="completed">Completados</option>
          <option value="refunded">Reembolsados</option>
        </select>

        <button
          onClick={() => exportToCSV(pagosFiltrados)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 transition-all duration-150 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Contador */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {pagosFiltrados.length} resultado{pagosFiltrados.length !== 1 ? 's' : ''}
        {estadoFiltro !== 'todos' || busqueda ? ' (filtrado)' : ''}
      </p>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              {['ID Pago', 'Cliente', 'Curso', 'Importe', 'Estado', 'Fecha'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                  No se encontraron pagos con los filtros aplicados
                </td>
              </tr>
            ) : (
              pagosFiltrados.map((pago, i) => {
                const estado = ESTADO_CONFIG[pago.estado] ?? {
                  label: pago.estado,
                  classes: 'bg-slate-100 text-slate-600',
                }
                return (
                  <tr
                    key={pago.id_pago}
                    className={`border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                      i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {pago.id_pago}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{pago.nombre || '—'}</p>
                      <p className="text-xs text-slate-400">{pago.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{pago.curso}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatImporte(pago.importe, pago.moneda)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${estado.classes}`}>
                        {estado.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatFecha(pago.fecha)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}