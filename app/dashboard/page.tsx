import { getPagos, calcularKPIs, calcularIngresosPorCurso } from '@/lib/supabase'
import { KpiCards } from '@/components/ui/KpiCards'
import { TablaPagos } from '@/components/ui/TablaPagos'
import { ChartIngresos } from '@/components/charts/ChartIngresos'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const pagos = await getPagos()
  const kpis = calcularKPIs(pagos)
  const ingresosPorCurso = calcularIngresosPorCurso(pagos)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              FormaPro Academy
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dashboard de Pagos
            </h1>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1"> Valores principales consolidados en COP basados en la tasa de referencia interna.</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {pagos.length} registro{pagos.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {/* KPIs */}
        <KpiCards kpis={kpis} />

        {kpis.totalAbsoluto > 0 && kpis.numReembolsos / kpis.totalAbsoluto > 0.1 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="leading-tight">
                <p className="font-semibold text-slate-900">Alerta operativa</p>
                <p>
                  La tasa de reembolsos actual ({kpis.numReembolsos}) supera el umbral del 10% establecido por la academia. Monitorear los últimos casos.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Chart */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              Ingresos por curso
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Solo pagos completados</p>
          </div>
          <ChartIngresos data={ingresosPorCurso} />
        </section>

        {/* Tabla */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              Todos los pagos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Filtra, busca y exporta</p>
          </div>
          <TablaPagos pagos={pagos} />
        </section>

      </div>
    </main>
  )
}