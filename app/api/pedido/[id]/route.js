import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req, { params }) {
  const { id } = params
  const { rows } = await query('SELECT status, video_url FROM pedidos WHERE id = $1', [id])
  if (!rows[0]) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(rows[0])
}
