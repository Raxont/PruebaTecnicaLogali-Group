import { NextResponse } from 'next/server'
import { getPagos } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const pagos = await getPagos()
  return NextResponse.json(pagos)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, curso, importe, moneda } = body

      if (!nombre || !curso || !importe || !moneda) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener último id_pago y generar siguiente
    const { data: lastRow } = await supabase
      .from('pagos')
      .select('id_pago')
      .order('id_pago', { ascending: false })
      .limit(1)

    let nextId = 'PAY-001'
    const lastId = lastRow?.[0]?.id_pago
    if (lastId && typeof lastId === 'string') {
      const m = lastId.match(/(\d+)$/)
      const n = m ? parseInt(m[1], 10) + 1 : 1
      nextId = `PAY-${String(n).padStart(3, '0')}`
    }

      const newPago = {
        id_pago: nextId,
        nombre,
        email: email ?? null,
        curso,
        importe: Number(importe),
        moneda,
        estado: 'completed',
        // Ajuste de zona horaria: restar 5 horas para hora Colombia (UTC-5)
        fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      }

    const { error } = await supabase.from('pagos').insert(newPago)
    if (error) {
      console.error('Supabase insert error', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, pago: newPago })
  } catch (err) {
    console.error('API /pagos POST error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}