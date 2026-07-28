import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { query } from '@/lib/db'
import { gerarVideo } from '@/lib/creatomate'
import { enviarVideo, notificarErro } from '@/lib/email'

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

export async function POST(req) {
  try {
    const body = await req.json()

    if (body.type !== 'payment') return NextResponse.json({ ok: true })

    const paymentId = body.data?.id
    if (!paymentId) return NextResponse.json({ ok: true })

    const payment = new Payment(mp)
    const pag = await payment.get({ id: paymentId })

    if (pag.status !== 'approved') return NextResponse.json({ ok: true })

    const pedidoId = pag.external_reference
    if (!pedidoId) return NextResponse.json({ ok: true })

    const { rows } = await query('SELECT * FROM pedidos WHERE id = $1', [pedidoId])
    const pedido = rows[0]
    if (!pedido) return NextResponse.json({ ok: true })

    if (pedido.status === 'processando' || pedido.status === 'entregue') {
      return NextResponse.json({ ok: true })
    }

    await query(
      'UPDATE pedidos SET status = $1, mp_payment_id = $2, updated_at = NOW() WHERE id = $3',
      ['processando', String(paymentId), pedidoId]
    )

    try {
      const videoUrl = await gerarVideo({
        estilo: pedido.estilo,
        musicaId: pedido.musica,
        fotosUrls: pedido.fotos_urls,
        nomeHomenageado: pedido.nome_homenageado,
        ocasiao: pedido.ocasiao,
        mensagem: pedido.mensagem,
        seuNome: pedido.seu_nome,
      })

      await enviarVideo({
        email: pedido.email,
        nomeHomenageado: pedido.nome_homenageado,
        ocasiao: pedido.ocasiao,
        seuNome: pedido.seu_nome,
        videoUrl,
      })

      await query(
        'UPDATE pedidos SET status = $1, video_url = $2, updated_at = NOW() WHERE id = $3',
        ['entregue', videoUrl, pedidoId]
      )
    } catch (err) {
      console.error('Erro ao gerar/enviar vídeo:', err)
      await query(
        'UPDATE pedidos SET status = $1, updated_at = NOW() WHERE id = $2',
        ['erro', pedidoId]
      )
      await notificarErro({ email: pedido.email, pedidoId }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Webhook error:', e)
    return NextResponse.json({ ok: true })
  }
}
