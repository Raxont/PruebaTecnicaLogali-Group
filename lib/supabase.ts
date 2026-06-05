import { createClient } from '@supabase/supabase-js'
import type { Pago, KPIs, IngresosPorCurso } from '@/types/pago'

// Solo se usa en Server Components / API Routes — la anon key nunca llega al cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getPagos(): Promise<Pago[]> {
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) {
    console.error('[Supabase] Error al obtener pagos:', error.message)
    return []
  }

  return (data ?? []) as Pago[]
}

export function calcularKPIs(pagos: Pago[]): KPIs {
  const completados = pagos.filter((p) => p.estado === 'completed')
  const reembolsos = pagos.filter((p) => p.estado === 'refunded')

  // Ingresos agrupados por moneda
  const ingresosPorMoneda = completados.reduce<Record<string, number>>((acc, p) => {
    const m = p.moneda.toUpperCase()
    acc[m] = (acc[m] ?? 0) + p.importe
    return acc
  }, {})

  // Moneda dominante (la de mayor volumen)
  const monedaDominante =
    Object.entries(ingresosPorMoneda).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'COP'

  const ingresosTotales = ingresosPorMoneda[monedaDominante] ?? 0
  const ticketMedio = completados.length > 0 ? ingresosTotales / completados.length : 0

  return {
    ingresosTotales,
    monedaDominante,
    numPagos: completados.length,
    numReembolsos: reembolsos.length,
    ticketMedio,
    ingresosPorMoneda,
  }
}

export function calcularIngresosPorCurso(pagos: Pago[]): IngresosPorCurso[] {
  const mapa = new Map<string, IngresosPorCurso>()

  pagos
    .filter((p) => p.estado === 'completed')
    .forEach((p) => {
      const existing = mapa.get(p.curso)
      if (existing) {
        existing.ingresos += p.importe
        existing.pagos += 1
      } else {
        mapa.set(p.curso, {
          curso: p.curso,
          ingresos: p.importe,
          pagos: 1,
          moneda: p.moneda.toUpperCase(),
        })
      }
    })

  return Array.from(mapa.values()).sort((a, b) => b.ingresos - a.ingresos)
}