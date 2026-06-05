'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; payload: IngresosPorCurso }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: item.payload.moneda,
    minimumFractionDigits: 0,
  }).format(item.value)

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 text-sm">
      <p className="font-semibold text-slate-800 dark:text-white mb-1">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold">{formatted}</p>
      <p className="text-slate-400 text-xs">{item.payload.pagos} pago{item.payload.pagos !== 1 ? 's' : ''}</p>
    </div>
  )
}

export function ChartIngresos({ data }: ChartIngresosProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Sin datos para mostrar
      </div>
    )
  }

  return (
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Bar dataKey="ingresos" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}