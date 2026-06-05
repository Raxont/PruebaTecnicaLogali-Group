// ? Cliente Supabase usado únicamente en rutas server / server components.
// ? El `SUPABASE_SERVICE_ROLE_KEY` se usa para operaciones seguras server-side.
// ! NO exponer esta clave al cliente: crearClient aquí es server-only.
import { createClient } from '@supabase/supabase-js'
import type { Pago, KPIs, IngresosPorCurso, Moneda } from '@/types/pago'

// Solo se usa en Server Components / API Routes — la anon key nunca llega al cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// * Devuelve todos los pagos ordenados por fecha (descendente).
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

// * Calcula KPIs principales a partir de la lista de pagos.
// ? Se unifica todo a COP usando las tasas definidas aquí como referencia.
export function calcularKPIs(pagos: Pago[]): KPIs {
  const completados = pagos.filter((p) => p.estado === 'completed')
  const reembolsos = pagos.filter((p) => p.estado === 'refunded')

  const tasasCambio: Record<Moneda, number> = {
    COP: 1,
    USD: 3600,
    EUR: 4200,
  }

  // Ingresos agrupados por moneda original para el subtexto
  const ingresosPorMoneda = completados.reduce<Record<Moneda, number>>((acc, p) => {
    acc[p.moneda] = (acc[p.moneda] ?? 0) + p.importe
    return acc
  }, {
    COP: 0,
    USD: 0,
    EUR: 0,
  })

  // Total unificado en COP usando la tasa de referencia
  const ingresosTotales = completados.reduce((total, pago) => {
    const tasa = tasasCambio[pago.moneda]
    return total + pago.importe * tasa
  }, 0)

  const ticketMedio = completados.length > 0 ? ingresosTotales / completados.length : 0

  return {
    ingresosTotales,
    monedaDominante: 'COP',
    numPagos: completados.length,
    numReembolsos: reembolsos.length,
    ticketMedio,
    totalAbsoluto: pagos.length,
    ingresosPorMoneda,
  }
}

// * Agrupa ingresos por curso y devuelve los totales en COP.
export function calcularIngresosPorCurso(pagos: Pago[]): IngresosPorCurso[] {
  const mapa = new Map<string, IngresosPorCurso>()

  const tasasCambio: Record<Moneda, number> = {
    COP: 1,
    USD: 3600,
    EUR: 4200,
  }

  pagos
    .filter((p) => p.estado === 'completed')
    .forEach((p) => {
      const ingresoEnCOP = p.importe * tasasCambio[p.moneda]
      const existing = mapa.get(p.curso)
      if (existing) {
        existing.ingresos += ingresoEnCOP
        existing.pagos += 1
      } else {
        mapa.set(p.curso, {
          curso: p.curso,
          ingresos: ingresoEnCOP,
          pagos: 1,
          moneda: 'COP',
        })
      }
    })

  return Array.from(mapa.values()).sort((a, b) => b.ingresos - a.ingresos)
}