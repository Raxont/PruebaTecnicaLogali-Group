'use client'

import type { KPIs } from '@/types/pago'

interface KpiCardsProps {
  kpis: KPIs
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount)
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      label: 'Ingresos Totales',
      value: formatCurrency(kpis.ingresosTotales, kpis.monedaDominante),
      sub: Object.entries(kpis.ingresosPorMoneda)
        .filter(([m]) => m !== kpis.monedaDominante)
        .map(([m, v]) => formatCurrency(v, m))
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
      icon: '✅',
      accent: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      label: 'Reembolsos',
      value: kpis.numReembolsos.toString(),
      sub: 'pagos revertidos',
      icon: '↩️',
      accent: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
    },
    {
      label: 'Ticket Medio',
      value: formatCurrency(kpis.ticketMedio, kpis.monedaDominante),
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
            </div>
            <span className="text-2xl ml-3 opacity-80">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}