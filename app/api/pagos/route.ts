import { NextResponse } from 'next/server'
import { getPagos } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const pagos = await getPagos()
  return NextResponse.json(pagos)
}