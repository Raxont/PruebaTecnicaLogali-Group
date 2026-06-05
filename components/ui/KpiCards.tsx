 'use client'

// * Componente que renderiza las tarjetas de KPIs. Recibe `kpis` calculados
// * desde el backend y ofrece un estado skeleton mientras carga.
import type { KPIs } from '@/types/pago'
import { formatCurrencyLocalized, formatAmount } from '@/lib/formatters'

interface KpiCardsProps {
  kpis: KPIs | null
  isLoading?: boolean
}

export function KpiCards({ kpis, isLoading = false }: KpiCardsProps) {
  // Skeletons for loading state
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5"
          >
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600" />

            <div className="space-y-3">
              {/* Label skeleton */}
              <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
              
              {/* Value skeleton */}
              <div className="h-7 w-32 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse" />
              
              {/* Sub skeleton */}
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              
              {/* Extra skeleton */}
              <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const totalTransacciones = kpis.totalAbsoluto
  const reembolsosPct = totalTransacciones > 0 ? (kpis.numReembolsos / totalTransacciones) * 100 : 0
  const conversionPct = totalTransacciones > 0 ? (kpis.numPagos / totalTransacciones) * 100 : 0

  const reembolsosText = `↓ ${reembolsosPct.toFixed(1)}% del total de transacciones.`
  const conversionText = `↑ ${conversionPct.toFixed(1)}% de tasa de conversión.`

  const cards = [
    {
      label: 'Ingresos Totales',
      value: formatCurrencyLocalized(kpis.ingresosTotales, kpis.monedaDominante),
      sub: Object.entries(kpis.ingresosPorMoneda)
        .filter(([m]) => m !== kpis.monedaDominante)
        .map(([m, v]) => formatAmount(v, m))
        .join(' · ') || null,
      icon: '💰',
      accent: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      label: 'Pagos Completados',
      value: kpis.numPagos.toString(),
      sub: 'transacciones exitosas',
      extra: conversionText,
      icon: '✅',
      accent: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Reembolsos',
      value: kpis.numReembolsos.toString(),
      sub: 'pagos revertidos',
      extra: reembolsosText,
      icon: '↩️',
      accent: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
    },
    {
      label: 'Ticket Medio',
      value: formatCurrencyLocalized(kpis.ticketMedio, kpis.monedaDominante),
      sub: 'por pago completado',
      icon: '📊',
      accent: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      border: 'border-violet-200 dark:border-violet-800',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl border ${card.border} ${card.bg} p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
        >
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent}`} />

          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                {card.value}
              </p>
              {card.sub && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                  {card.sub}
                </p>
              )}
              {card.extra && (
                <p className="text-xs mt-1 font-medium text-emerald-600 dark:text-emerald-400 truncate">
                  {card.extra}
                </p>
              )}
            </div>
            <span className="text-2xl ml-3 opacity-80">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}