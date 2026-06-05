'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COURSES = ['Excel Avanzado', 'Power BI','SQL', 'Java']
const MONEDAS = ['COP', 'USD', 'EUR']

export function SimulatePurchase() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [curso, setCurso] = useState(COURSES[0])
  const [importe, setImporte] = useState('')
  const [moneda, setMoneda] = useState(MONEDAS[0])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const body = { nombre, email, curso, importe: Number(importe), moneda }
      const res = await fetch('/api/pagos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (res.ok) {
        setOpen(false)
        setNombre('')
        setEmail('')
        setCurso(COURSES[0])
        setImporte('')
        setMoneda(MONEDAS[0])
        router.refresh()
      } else {
        alert(json.error || 'Error al guardar')
      }
    } catch (err) {
      console.error(err)
      alert('Error de red')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-amber-100 border border-amber-200 px-3 py-2 text-sm font-medium text-amber-900 hover:bg-amber-200"
        >
          ✨ Simular Compra
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Simular Compra</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Nombre</label>
                <input className="w-full rounded-md border px-3 py-2" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm block mb-1">Email (opcional)</label>
                <input type="email" className="w-full rounded-md border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-sm block mb-1">Curso</label>
                <select className="w-full rounded-md border px-3 py-2" value={curso} onChange={(e) => setCurso(e.target.value)}>
                  {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Importe</label>
                <input type="number" step="0.01" className="w-full rounded-md border px-3 py-2" value={importe} onChange={(e) => setImporte(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm block mb-1">Moneda</label>
                <select className="w-full rounded-md border px-3 py-2" value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                  {MONEDAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 border">Cancelar</button>
                <button type="submit" disabled={loading} className="rounded-md bg-emerald-600 text-white px-3 py-2 disabled:opacity-60">{loading ? 'Guardando...' : 'Guardar'} </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
