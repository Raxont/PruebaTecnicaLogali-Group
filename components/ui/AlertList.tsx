'use client'

import { useState } from 'react'
import type { KPIs, Pago, Moneda } from '@/types/pago'

const tasasCambio: Record<Moneda, number> = {
  COP: 1,
  USD: 3600,
  EUR: 4200,
}

function formatCurrencyCOP(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface AlertListProps {
  kpis: KPIs
  pagos: Pago[]
}

export function AlertList({ kpis, pagos }: AlertListProps) {
  const [alertaAltoValorCerrada, setAlertaAltoValorCerrada] = useState(false)
  const [alertaA_Cerrada, setAlertaA_Cerrada] = useState(false)

  const totalTransacciones = kpis.totalAbsoluto
  const conversionPct = totalTransacciones > 0 ? (kpis.numPagos / totalTransacciones) * 100 : 0
  const reembolsoPct = totalTransacciones > 0 ? (kpis.numReembolsos / totalTransacciones) * 100 : 0

  const alertaAVisible = reembolsoPct > 20 && !alertaA_Cerrada

  const pagoAltoValor = pagos
    .filter((p) => p.estado === 'completed')
    .map((p) => ({
      pago: p,
      valorCOP: p.importe * tasasCambio[p.moneda],
    }))
    .filter((item) => item.valorCOP > 200_000)
    .sort((a, b) => b.valorCOP - a.valorCOP)[0]

  const alertaBVisible = Boolean(pagoAltoValor) && !alertaAltoValorCerrada

  return (
    <div className="space-y-2">
      {alertaAVisible && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1 leading-tight">
              <p className="font-semibold text-slate-900">Alerta operativa</p>
              <p>
                La tasa de devoluciones ha aumentado, lo que reduce la conversión efectiva (&lt;80%). Monitorear la satisfacción de los usuarios con los cursos o posibles errores en las compras.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAlertaA_Cerrada(true)}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Cerrar alerta operativa"
            >
              X
            </button>
          </div>
        </section>
      )}

      {alertaBVisible && pagoAltoValor && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-slate-900 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1 leading-tight">
              <p className="font-semibold">Notificación</p>
              <p>
                Se detectó una transacción de alto valor ({pagoAltoValor.pago.id_pago}) por un valor equivalente a {formatCurrencyCOP(pagoAltoValor.valorCOP)}. Verificar procedencia en pasarela.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAlertaAltoValorCerrada(true)}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Cerrar alerta de alto valor"
            >
              X
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
