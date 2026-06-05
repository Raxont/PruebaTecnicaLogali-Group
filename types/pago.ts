export type EstadoPago = 'completed' | 'refunded'

export interface Pago {
  id_pago: string
  email: string
  nombre: string
  curso: string
  importe: number
  moneda: string
  estado: EstadoPago
  fecha: string
}

export interface KPIs {
  ingresosTotales: number
  monedaDominante: string
  numPagos: number
  numReembolsos: number
  ticketMedio: number
  ingresosPorMoneda: Record<string, number>
}

export interface IngresosPorCurso {
  curso: string
  ingresos: number
  pagos: number
  moneda: string
}