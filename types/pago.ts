export type EstadoPago = 'completed' | 'refunded'

export type Moneda = 'COP' | 'USD' | 'EUR'

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

export interface KPIs {
  ingresosTotales: number
  monedaDominante: Moneda
  numPagos: number
  numReembolsos: number
  ticketMedio: number
  totalAbsoluto: number
  ingresosPorMoneda: Record<Moneda, number>
}

export interface IngresosPorCurso {
  curso: string
  ingresos: number
  pagos: number
  moneda: Moneda
}