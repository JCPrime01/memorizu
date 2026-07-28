import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
})

export async function enviarVideo({ email, nomeHomenageado, ocasiao, seuNome, videoUrl }) {
  const assunto = ocasiao
    ? `🎬 Seu vídeo de ${ocasiao} está pronto! — Memorizu`
    : `🎬 Seu vídeo de homenagem está pronto! — Memorizu`

  const nome = seuNome || 'você'
  const homenageado = nomeHomenageado || 'seu homenageado'

  await transporter.sendMail({
    from: `"Memorizu" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: assunto,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,sans-serif;color:#fff;">
        <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;font-weight:900;letter-spacing:-0.5px;">Memori<span style="color:#f5c842">zu</span></span>
          </div>

          <div style="background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;margin-bottom:16px;">🎬</div>
            <h1 style="font-size:24px;font-weight:900;margin:0 0 12px;">Sua homenagem ficou incrível!</h1>
            <p style="color:rgba(255,255,255,0.55);font-size:15px;line-height:1.6;margin:0 0 28px;">
              Olá, ${nome}! O vídeo de homenagem para <strong>${homenageado}</strong> está pronto. Clique no botão abaixo para assistir e baixar.
            </p>
            <a href="${videoUrl}" style="display:inline-block;background:#f5c842;color:#000;padding:16px 40px;border-radius:100px;font-weight:800;font-size:16px;text-decoration:none;">
              Assistir meu vídeo →
            </a>
          </div>

          <div style="background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.15);border-radius:12px;padding:20px 24px;margin-bottom:24px;">
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.6);">
              💡 <strong>Dica:</strong> Baixe o vídeo e compartilhe pelo WhatsApp, Instagram ou como presente digital.
            </p>
          </div>

          <p style="text-align:center;font-size:13px;color:rgba(255,255,255,0.25);margin:0;">
            © 2026 Memorizu · Obrigado por usar nosso serviço
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

export async function notificarErro({ email, pedidoId }) {
  await transporter.sendMail({
    from: `"Memorizu" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Memorizu — Precisamos falar sobre seu pedido',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;">
        <h2>Olá!</h2>
        <p>Houve um problema ao gerar seu vídeo. Nossa equipe foi notificada e entrará em contato em até 30 minutos para resolver.</p>
        <p><strong>Número do pedido:</strong> ${pedidoId}</p>
        <p>Pedimos desculpas pelo inconveniente!</p>
        <p>— Equipe Memorizu</p>
      </div>
    `,
  })
}
