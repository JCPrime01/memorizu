'use client'
import Link from 'next/link'

const ESTILOS = [
  { id: 'classico',  emoji: '🤍', nome: 'Clássico',  desc: 'Elegante e atemporal' },
  { id: 'moderno',   emoji: '✨', nome: 'Moderno',   desc: 'Dinâmico e vibrante' },
  { id: 'romantico', emoji: '🌹', nome: 'Romântico', desc: 'Suave e emotivo' },
  { id: 'gospel',    emoji: '🙏', nome: 'Gospel',    desc: 'Com fé e gratidão' },
]

const DEPOIMENTOS = [
  { nome: 'Ana Paula', texto: 'Fiz pro meu pai no Dia dos Pais e ele chorou muito. Ficou lindo demais!', estrelas: 5 },
  { nome: 'Carlos Eduardo', texto: 'Comprei pra homenagear minha mãe no aniversário dela. Super fácil de fazer.', estrelas: 5 },
  { nome: 'Fernanda', texto: 'Melhor R$19,99 que gastei na vida. Vídeo ficou profissional.', estrelas: 5 },
]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
          Memori<span style={{ color: '#f5c842' }}>zu</span>
        </div>
        <Link href="/criar" style={{ background: '#f5c842', color: '#000', padding: '10px 24px', borderRadius: 100, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Criar agora →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '80px 24px 60px' }}>
        <div className="fade-up" style={{ display: 'inline-block', background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.3)', borderRadius: 100, padding: '6px 18px', fontSize: 13, color: '#f5c842', fontWeight: 600, marginBottom: 24 }}>
          🎬 Pronto em menos de 5 minutos
        </div>
        <h1 className="fade-up-2" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
          Um vídeo de homenagem<br />
          <span style={{ color: '#f5c842' }}>que ela nunca vai esquecer</span>
        </h1>
        <p className="fade-up-3" style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 40 }}>
          Escolha suas fotos, a música e o estilo.<br />Nós montamos o vídeo. Você emociona quem ama.
        </p>
        <div className="fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/criar" className="btn-gold" style={{ background: '#f5c842', color: '#000', padding: '16px 40px', borderRadius: 100, fontWeight: 800, fontSize: 18, textDecoration: 'none', display: 'inline-block' }}>
            Criar meu vídeo — R$19,99
          </Link>
          <div style={{ padding: '16px 24px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.12)', fontSize: 14, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚡ Entrega em até 10 minutos
          </div>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          <span>⭐⭐⭐⭐⭐</span>
          <span>+1.200 vídeos criados</span>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48, letterSpacing: -1 }}>
          Como funciona
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { n: '1', icon: '📸', titulo: 'Envie as fotos', desc: 'Até 15 fotos do álbum de memórias' },
            { n: '2', icon: '🎵', titulo: 'Escolha a música', desc: 'Diversas opções ou envie a sua' },
            { n: '3', icon: '🎨', titulo: 'Escolha o estilo', desc: 'Clássico, moderno, romântico ou gospel' },
            { n: '4', icon: '💌', titulo: 'Receba por email', desc: 'Vídeo pronto em até 10 minutos' },
          ].map(s => (
            <div key={s.n} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f5c842', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Passo {s.n}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.titulo}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Styles */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: -1 }}>
          Escolha seu estilo
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: 40, fontSize: 15 }}>
          Cada estilo tem transições, cores e ritmo próprios
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {ESTILOS.map(e => (
            <div key={e.id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={el => { el.currentTarget.style.borderColor = '#f5c842'; el.currentTarget.style.background = 'rgba(245,200,66,0.05)' }}
              onMouseLeave={el => { el.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; el.currentTarget.style.background = '#141414' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{e.emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.nome}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48, letterSpacing: -1 }}>
          Quem já usou, amou ❤️
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {DEPOIMENTOS.map((d, i) => (
            <div key={i} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
              <div style={{ fontSize: 16, marginBottom: 10 }}>{'⭐'.repeat(d.estrelas)}</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 16 }}>"{d.texto}"</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>— {d.nome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ textAlign: 'center', padding: '80px 24px', background: 'linear-gradient(to bottom, transparent, rgba(245,200,66,0.05))' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>
          Surpreenda quem você ama
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 36 }}>
          Qualquer ocasião merece uma homenagem especial.
        </p>
        <Link href="/criar" className="btn-gold" style={{ background: '#f5c842', color: '#000', padding: '18px 48px', borderRadius: 100, fontWeight: 800, fontSize: 20, textDecoration: 'none', display: 'inline-block' }}>
          Criar meu vídeo agora →
        </Link>
        <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          R$19,99 · Entrega em até 10 min · Pagamento seguro
        </p>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
        © 2026 Memorizu · Todos os direitos reservados
      </footer>
    </div>
  )
}
