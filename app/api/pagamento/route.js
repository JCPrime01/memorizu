import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { query } from '@/lib/db'

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })

export async function POST(req) {
  try {
    const { pedidoId } = await req.json()
    if (!pedidoId) return NextResponse.json({ error: 'pedidoId obrigatório' }, { status: 400 })

    const { rows } = await query('SELECT * FROM pedidos WHERE id = $1', [pedidoId])
    const pedido = rows[0]
    if (!pedido) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

    const preference = new Preference(mp)
    const result = await preference.create({
      body: {
        items: [{
          id: pedidoId,
          title: `Vídeo de homenagem — ${pedido.nome_homenageado}`,
          quantity: 1,
          unit_price: 19.99,
          currency_id: 'BRL',
        }],
        payer: { email: pedido.email },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/obrigado?pedido=${pedidoId}`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/criar`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/obrigado?pedido=${pedidoId}`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
        external_reference: pedidoId,
        payment_methods: {
          excluded_payment_types: [],
          installments: 1,
        },
      },
    })

    await query(
      'UPDATE pedidos SET mp_preference_id = $1, updated_at = NOW() WHERE id = $2',
      [result.id, pedidoId]
    )

    return NextResponse.json({ checkoutUrl: result.init_point })
  } catch (e) {
    console.error('Pagamento error:', e)
    return NextResponse.json({ error: 'Erro ao criar preferência de pagamento' }, { status: 500 })
  }
}
