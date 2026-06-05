'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { IngresosPorCurso } from '@/types/pago'

interface ChartIngresosProps {
  data: IngresosPorCurso[]
}

const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
]

const CustomTooltip = ({
  active, payload, label, total,
}: {
  active?: boolean
  payload?: { value: number; payload: IngresosPorCurso }[]
  label?: string
  total: number
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: item.payload.moneda,
    minimumFractionDigits: 0,
  }).format(item.value)
  const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-800 dark:text-white mb-2 truncate max-w-[180px]">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-base">{formatted}</p>
      <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
        <span>{item.payload.pagos} pago{item.payload.pagos !== 1 ? 's' : ''}</span>
        <span className="font-medium">{pct}% del total</span>
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex items-end gap-3 h-[280px] px-2 pt-2">
      {[65, 90, 45, 78, 55, 88, 40, 72].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <div
            className="w-full rounded-t-md bg-slate-200 dark:bg-slate-800 animate-pulse"
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
    </div>
  )
}

export function ChartIngresos({ data }: ChartIngresosProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Solo marcamos ready cuando el contenedor tiene ancho real
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      if (width > 0) {
        setReady(true)
        observer.disconnect()
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Sin datos para mostrar
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.ingresos, 0)

  return (
    // El div siempre existe en el DOM para que ResizeObserver pueda medirlo
    <div ref={containerRef} className="w-full relative" style={{ minHeight: 280 }}>
      {ready ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="curso"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={48}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                new Intl.NumberFormat('es-CO', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(v)
              }
            />
            <Tooltip
              content={<CustomTooltip total={total} />}
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
            />
            <Bar dataKey="ingresos" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <>
          <ChartSkeleton />
          <div
            aria-hidden={false}
            className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl"
          >
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 animate-spin text-slate-700 dark:text-slate-200" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
                <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="text-slate-700 dark:text-slate-200 font-medium">Cargando gráfica...</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}