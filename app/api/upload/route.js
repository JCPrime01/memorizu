import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { v4 as uuid } from 'uuid'
import { query, initDb } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req) {
  try {
    await initDb()

    const fd = await req.formData()
    const estilo = fd.get('estilo')
    const musica = fd.get('musica')
    const nomeHomenageado = fd.get('nomeHomenageado')
    const ocasiao = fd.get('ocasiao') || null
    const mensagem = fd.get('mensagem') || null
    const seuNome = fd.get('seuNome') || null
    const email = fd.get('email')

    if (!estilo || !musica || !nomeHomenageado || !email) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const fotoFiles = []
    for (const [key, val] of fd.entries()) {
      if (key.startsWith('foto_') && val instanceof File) fotoFiles.push(val)
    }

    if (fotoFiles.length === 0) {
      return NextResponse.json({ error: 'Nenhuma foto enviada' }, { status: 400 })
    }

    const pedidoId = uuid()

    const fotosUrls = await Promise.all(
      fotoFiles.slice(0, 15).map(async (file, i) => {
        const ext = file.name.split('.').pop() || 'jpg'
        const blob = await put(`pedidos/${pedidoId}/foto_${i}.${ext}`, file, {
          access: 'public',
          contentType: file.type,
        })
        return blob.url
      })
    )

    await query(
      `INSERT INTO pedidos (id, status, email, nome_homenageado, ocasiao, mensagem, seu_nome, estilo, musica, fotos_urls)
       VALUES ($1, 'aguardando_pagamento', $2, $3, $4, $5, $6, $7, $8, $9)`,
      [pedidoId, email, nomeHomenageado, ocasiao, mensagem, seuNome, estilo, musica, JSON.stringify(fotosUrls)]
    )

    return NextResponse.json({ pedidoId })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Erro interno ao processar upload' }, { status: 500 })
  }
}
