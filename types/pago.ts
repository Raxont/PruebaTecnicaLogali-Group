// ? Modelos y tipos usados por la app para representar pagos y métricas.
// * `EstadoPago`: estados posibles en la tabla `pagos`.
export type EstadoPago = 'completed' | 'refunded'

// * `Moneda`: enumeración reducida de monedas soportadas en la UI.
export type Moneda = 'COP' | 'USD' | 'EUR'

// * `Pago`: estructura que representa una fila en la tabla `pagos`.
export interface Pago {
  id_pago: string
  email: string
  nombre: string
  curso: string
  importe: number
  moneda: Moneda
  estado: EstadoPago
  fecha: string
}

// * `KPIs`: payload simplificado con métricas calculadas para el dashboard.
export interface KPIs {
  ingresosTotales: number
  monedaDominante: Moneda
  numPagos: number
  numReembolsos: number
  ticketMedio: number
  totalAbsoluto: number
  ingresosPorMoneda: Record<Moneda, number>
}

// * `IngresosPorCurso`: estructura usada por la gráfica de ingresos.
export interface IngresosPorCurso {
  curso: string
  ingresos: number
  pagos: number
  moneda: Moneda
}