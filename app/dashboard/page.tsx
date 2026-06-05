 'use client'

// * Componente principal del dashboard (client-side): carga datos y muestra widgets.
// ? Mantener la carga de datos en el cliente para simplicidad y evitar SSR excesivo.
import { useState, useEffect } from 'react'
import type { Pago, KPIs, IngresosPorCurso } from '@/types/pago'
import { KpiCards } from '@/components/ui/KpiCards'
import { SimulatePurchase } from '@/components/ui/SimulatePurchase'
import { AlertList } from '@/components/ui/AlertList'
import { TablaPagos } from '@/components/ui/TablaPagos'
import { ChartIngresos } from '@/components/charts/ChartIngresos'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [pagos, setPagos] = useState<Pago[]>([])
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [ingresosPorCurso, setIngresosPorCurso] = useState<IngresosPorCurso[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Error al cargar datos')
        const data = await response.json()
        setPagos(data.pagos)
        setKpis(data.kpis)
        setIngresosPorCurso(data.ingresosPorCurso)
      } catch (error) {
        // ! Log de error: importante para detectar fallos en la API del dashboard
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
        <div className="flex items-center justify-between gap-4">
          <KpiCards kpis={kpis} isLoading={isLoading} />
          <div className="hidden sm:flex">
            <SimulatePurchase onSuccess={() => {
              // Reload dashboard data after successful purchase
              fetch('/api/dashboard')
                .then(res => res.json())
                .then(data => {
                  setPagos(data.pagos)
                  setKpis(data.kpis)
                  setIngresosPorCurso(data.ingresosPorCurso)
                })
            }} />
          </div>
        </div>

        {kpis && pagos.length > 0 && <AlertList kpis={kpis} pagos={pagos} />}

        {/* Chart */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              Ingresos por curso
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Solo pagos completados</p>
          </div>
          {isLoading ? (
            <div className="h-80 bg-slate-100 dark:bg-slate-800/50 rounded-lg animate-pulse" />
          ) : (
            <ChartIngresos data={ingresosPorCurso} />
          )}
        </section>

        {/* Tabla */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white">
              Todos los pagos
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Filtra, busca y exporta</p>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <TablaPagos pagos={pagos} />
          )}
        </section>

      </div>
    </main>
  )
}