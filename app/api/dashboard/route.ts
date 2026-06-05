import { getPagos, calcularKPIs, calcularIngresosPorCurso } from '@/lib/supabase'

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
    console.error('[API Dashboard] Error:', error)
    return Response.json(
      { error: 'Error al cargar datos del dashboard' },
      { status: 500 }
    )
  }
}
