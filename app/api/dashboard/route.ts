import { getPagos, calcularKPIs, calcularIngresosPorCurso } from '@/lib/supabase'

// * Ruta que construye el payload completo para el dashboard: pagos, KPIs y datos para gráficas.
export async function GET() {
  try {
    const pagos = await getPagos()
    const kpis = calcularKPIs(pagos)
    const ingresosPorCurso = calcularIngresosPorCurso(pagos)

    return Response.json({
      pagos,
      kpis,
      ingresosPorCurso,
    })
  } catch (error) {
    // ! Error crítico en carga del dashboard: loggear para SRE/ops.
    console.error('[API Dashboard] Error:', error)
    return Response.json(
      { error: 'Error al cargar datos del dashboard' },
      { status: 500 }
    )
  }
}
