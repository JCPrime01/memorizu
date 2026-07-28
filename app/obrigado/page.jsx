'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ObrigadoContent() {
  const params = useSearchParams()
  const pedidoId = params.get('pedido')
  const [status, setStatus] = useState('processando')

  useEffect(() => {
    if (!pedidoId) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/pedido/${pedidoId}`)
      const data = await res.json()
      if (data.status === 'entregue' || data.status === 'erro') {
        setStatus(data.status)
        clearInterval(interval)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [pedidoId])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <Link href="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, textDecoration: 'none', color: '#fff', marginBottom: 60, display: 'block' }}>
        Memori<span style={{ color: '#f5c842' }}>zu</span>
      </Link>

      {status === 'processando' && (
        <div>
          <div style={{ fontSize: 64, marginBottom: 24, animation: 'spin 2s linear infinite' }}>⚙️</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Montando seu vídeo...</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 400 }}>
            Estamos criando sua homenagem com carinho. Você receberá o vídeo no e-mail em até 10 minutos.
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 8, justifyContent: 'center' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%', background: '#f5c842',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {status === 'entregue' && (
        <div>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Vídeo enviado!</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 400 }}>
            Sua homenagem foi enviada para o seu e-mail. Verifique sua caixa de entrada (e o spam, por precaução).
          </p>
          <Link href="/" style={{ display: 'inline-block', marginTop: 32, background: '#f5c842', color: '#000', padding: '14px 32px', borderRadius: 100, fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
            Criar outro vídeo →
          </Link>
        </div>
      )}

      {status === 'erro' && (
        <div>
          <div style={{ fontSize: 64, marginBottom: 24 }}>😕</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Houve um problema</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, maxWidth: 400 }}>
            Não foi possível gerar seu vídeo automaticamente. Nossa equipe já foi notificada e entrará em contato em até 30 minutos.
          </p>
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Pedido: {pedidoId}</p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>}>
      <ObrigadoContent />
    </Suspense>
  )
}
