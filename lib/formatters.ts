// ? Tipos de moneda aceptados. Se permite `string` para compatibilidad con
// ? entradas externas (APIs, DBs) que puedan contener otras etiquetas.
export type Moneda = 'COP' | 'USD' | 'EUR' | string

// * Formatea un importe simple según la moneda.
// * - `COP` se muestra sin decimales.
// * - `USD` y `EUR` se muestran con 2 decimales.
// TODO: Añadir soporte multi-locale según preferencias del usuario.
export function formatAmount(importe: number, moneda: Moneda): string {
  // * Normalizamos la entrada a mayúsculas y sin espacios.
  let m = (moneda || 'COP').toString().trim().toUpperCase()
  
  // ! Normalización de moneda: cualquier valor distinto a 'USD' o 'EUR'
  // ! se considera 'COP' para evitar formatos inesperados que rompan
  // ! la presentación o validaciones posteriores.
  if (m !== 'USD' && m !== 'EUR') {
    m = 'COP'
  }

  // * Determina la cantidad de decimales según la moneda.
  const decimals = m === 'COP' ? 0 : 2

  // ? Usamos 'es-CO' de forma centralizada para consistencia visual
  // ? en toda la aplicación (decimales, separadores de miles, etc.).
  const numeroFormateado = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(importe)

  // * Para COP no añadimos el sufijo de moneda.
  if (m === 'COP') return `$ ${numeroFormateado}`

  // * Para otras monedas mostramos el código al final.
  return `$ ${numeroFormateado} ${m}`
}

// * Formatea un importe usando las capacidades de `Intl.NumberFormat`
// * y permitiendo sobreescribir el número de decimales mediante `opts`.
// ? Esta función es útil cuando necesitamos el símbolo/código de moneda
// ? en el formato y control fino de fracciones.
export function formatCurrencyLocalized(importe: number, moneda: Moneda, opts?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) {
  // * Normalizamos la moneda como en `formatAmount`.
  let m = (moneda || 'COP').toString().trim().toUpperCase()

  if (m !== 'USD' && m !== 'EUR') {
    m = 'COP'
  }

  // * Permite opciones explícitas o fallback por moneda.
  const minimumFractionDigits = typeof opts?.minimumFractionDigits === 'number' ? opts!.minimumFractionDigits : (m === 'COP' ? 0 : 2)
  const maximumFractionDigits = typeof opts?.maximumFractionDigits === 'number' ? opts!.maximumFractionDigits : (m === 'COP' ? 0 : 2)

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: m,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(importe)
}

// * Formatea exclusivamente a COP sin decimales. Uso recomendado cuando
// * se requiere siempre mostrar el símbolo local con 0 fracciones.
export function formatCurrencyCOP(importe: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(importe)
}

// * Devuelve una fecha en formato corto localizado para Colombia.
// ? Se centraliza 'es-CO' para mantener consistencia con los formatos
// ? monetarios y de fecha en la UI.
export function formatDateShort(fecha: string | Date) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
