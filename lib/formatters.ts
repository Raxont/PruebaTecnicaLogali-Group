export type Moneda = 'COP' | 'USD' | 'EUR' | string

export function formatAmount(importe: number, moneda: Moneda): string {
  let m = (moneda || 'COP').toString().trim().toUpperCase()
  
  // Si escriben cualquier locura (ej: "UDS", "asdasd", "X"), 
  // a menos que sea estrictamente 'USD' o 'EUR', se vuelve 'COP'
  if (m !== 'USD' && m !== 'EUR') {
    m = 'COP'
  }

  const decimals = m === 'COP' ? 0 : 2

  const numeroFormateado = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(importe)

  if (m === 'COP') return `$ ${numeroFormateado}`

  return `$ ${numeroFormateado} ${m}`
}

export function formatCurrencyLocalized(importe: number, moneda: Moneda, opts?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) {
  let m = (moneda || 'COP').toString().trim().toUpperCase()

  if (m !== 'USD' && m !== 'EUR') {
    m = 'COP'
  }

  const minimumFractionDigits = typeof opts?.minimumFractionDigits === 'number' ? opts!.minimumFractionDigits : (m === 'COP' ? 0 : 2)
  const maximumFractionDigits = typeof opts?.maximumFractionDigits === 'number' ? opts!.maximumFractionDigits : (m === 'COP' ? 0 : 2)

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: m,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(importe)
}

export function formatCurrencyCOP(importe: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(importe)
}

export function formatDateShort(fecha: string | Date) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
