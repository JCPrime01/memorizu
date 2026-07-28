'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ESTILOS = [
  { id: 'classico',  emoji: '🤍', nome: 'Clássico',  desc: 'Elegante e atemporal' },
  { id: 'moderno',   emoji: '✨', nome: 'Moderno',   desc: 'Dinâmico e vibrante' },
  { id: 'romantico', emoji: '🌹', nome: 'Romântico', desc: 'Suave e emotivo' },
  { id: 'gospel',    emoji: '🙏', nome: 'Gospel',    desc: 'Com fé e gratidão' },
]

const MUSICAS = {
  classico: [
    { id: 'm1', nome: 'Eternal Memories', artista: 'Piano Clássico' },
    { id: 'm2', nome: 'Gentle Waltz', artista: 'Orquestra Suave' },
    { id: 'm3', nome: 'Time Stands Still', artista: 'Cordas Emocionais' },
  ],
  moderno: [
    { id: 'm4', nome: 'Golden Moments', artista: 'Pop Contemporâneo' },
    { id: 'm5', nome: 'Bright Future', artista: 'Indie Emocional' },
    { id: 'm6', nome: 'Alive & Grateful', artista: 'Upbeat Inspiracional' },
  ],
  romantico: [
    { id: 'm7', nome: 'Always In My Heart', artista: 'Balada Romântica' },
    { id: 'm8', nome: 'Forever Together', artista: 'Amor e Emoção' },
    { id: 'm9', nome: 'Tender Moments', artista: 'Soul Suave' },
  ],
  gospel: [
    { id: 'm10', nome: 'Graças a Deus', artista: 'Louvor Contemporâneo' },
    { id: 'm11', nome: 'Bênção Eterna', artista: 'Gospel Emocional' },
    { id: 'm12', nome: 'Fé e Esperança', artista: 'Worship Brasileiro' },
  ],
}

const OCASIOES = [
  'Aniversário', 'Dia das Mães', 'Dia dos Pais', 'Dia dos Avós',
  'Casamento', 'Bodas', 'Formatura', 'Homenagem', 'In Memoriam', 'Outro',
]

const STEPS = ['Fotos', 'Estilo', 'Música', 'Mensagem', 'Pagamento']

export default function CriarPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [fotos, setFotos] = useState([])
  const [estilo, setEstilo] = useState(null)
  const [musica, setMusica] = useState(null)
  const [form, setForm] = useState({ nomeHomenageado: '', ocasiao: '', mensagem: '', seuNome: '', email: '' })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef()

  const adicionarFotos = useCallback((files) => {
    const validas = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!validas.length) return
    const novas = validas.slice(0, 15 - fotos.length).map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      url: URL.createObjectURL(f),
    }))
    setFotos(prev => [...prev, ...novas].slice(0, 15))
  }, [fotos.length])

  const removerFoto = (id) => setFotos(prev => prev.filter(f => f.id !== id))

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    adicionarFotos(e.dataTransfer.files)
  }, [adicionarFotos])

  const avancar = () => {
    setErro('')
    if (step === 0 && fotos.length < 1) return setErro('Adicione pelo menos 1 foto.')
    if (step === 1 && !estilo) return setErro('Escolha um estilo.')
    if (step === 2 && !musica) return setErro('Escolha uma música.')
    if (step === 3) {
      if (!form.nomeHomenageado.trim()) return setErro('Informe o nome do homenageado.')
      if (!form.email.trim() || !form.email.includes('@')) return setErro('Informe um e-mail válido.')
    }
    setStep(s => s + 1)
  }

  const pagar = async () => {
    setCarregando(true)
    setErro('')
    try {
      const fd = new FormData()
      fotos.forEach((f, i) => fd.append(`foto_${i}`, f.file))
      fd.append('estilo', estilo)
      fd.append('musica', musica)
      fd.append('nomeHomenageado', form.nomeHomenageado)
      fd.append('ocasiao', form.ocasiao)
      fd.append('mensagem', form.mensagem)
      fd.append('seuNome', form.seuNome)
      fd.append('email', form.email)

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Erro no upload')

      const pagRes = await fetch('/api/pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId: uploadData.pedidoId }),
      })
      const pagData = await pagRes.json()
      if (!pagRes.ok) throw new Error(pagData.error || 'Erro ao gerar pagamento')

      window.location.href = pagData.checkoutUrl
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  const cardStyle = {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '32px 28px',
  }

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 80px' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', maxWidth: 700, margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, textDecoration: 'none', color: '#fff' }}>
          Memori<span style={{ color: '#f5c842' }}>zu</span>
        </Link>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>R$19,99 · Entrega em 10 min</div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 0' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: 4, borderRadius: 4,
                background: i <= step ? '#f5c842' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.3s',
              }} />
              <span style={{ fontSize: 11, color: i === step ? '#f5c842' : 'rgba(255,255,255,0.25)', fontWeight: i === step ? 700 : 400 }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 0: Fotos */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>📸 Suas fotos</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontSize: 14 }}>
              Adicione até 15 fotos. Quanto mais fotos, mais bonito o vídeo.
            </p>

            <div
              style={{
                ...cardStyle,
                border: `2px dashed ${dragOver ? '#f5c842' : 'rgba(255,255,255,0.12)'}`,
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                background: dragOver ? 'rgba(245,200,66,0.04)' : '#141414',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => adicionarFotos(e.target.files)} />
              <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>Clique ou arraste as fotos aqui</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>JPG, PNG · Até 15 fotos · {fotos.length}/15</p>
            </div>

            {fotos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 16 }}>
                {fotos.map(f => (
                  <div key={f.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={f.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removerFoto(f.id)} style={{
                      position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)',
                      border: 'none', borderRadius: '50%', width: 22, height: 22, color: '#fff',
                      cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                  </div>
                ))}
                {fotos.length < 15 && (
                  <div onClick={() => fileInputRef.current?.click()} style={{
                    aspectRatio: '1', borderRadius: 8, border: '2px dashed rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', fontSize: 24,
                  }}>+</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Estilo */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>🎨 Escolha o estilo</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontSize: 14 }}>
              O estilo define as transições, cores e ritmo do seu vídeo.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {ESTILOS.map(e => (
                <div key={e.id} onClick={() => setEstilo(e.id)} style={{
                  ...cardStyle,
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  border: estilo === e.id ? '2px solid #f5c842' : '1px solid rgba(255,255,255,0.08)',
                  background: estilo === e.id ? 'rgba(245,200,66,0.06)' : '#141414',
                }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{e.emoji}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.nome}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{e.desc}</p>
                  {estilo === e.id && <div style={{ marginTop: 12, fontSize: 12, color: '#f5c842', fontWeight: 700 }}>✓ Selecionado</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Música */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>🎵 Escolha a música</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontSize: 14 }}>
              Trilha sonora para o estilo <strong style={{ color: '#f5c842' }}>{ESTILOS.find(e => e.id === estilo)?.nome}</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(MUSICAS[estilo] || []).map(m => (
                <div key={m.id} onClick={() => setMusica(m.id)} style={{
                  ...cardStyle,
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: musica === m.id ? '2px solid #f5c842' : '1px solid rgba(255,255,255,0.08)',
                  background: musica === m.id ? 'rgba(245,200,66,0.06)' : '#141414',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: musica === m.id ? '#f5c842' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  }}>
                    {musica === m.id ? '♪' : '🎵'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{m.nome}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{m.artista}</div>
                  </div>
                  {musica === m.id && <div style={{ marginLeft: 'auto', color: '#f5c842', fontWeight: 700 }}>✓</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Mensagem */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>💌 Personalize</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontSize: 14 }}>
              Estas informações aparecerão no vídeo.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
                  Nome do homenageado *
                </label>
                <input value={form.nomeHomenageado} onChange={e => setForm(f => ({ ...f, nomeHomenageado: e.target.value }))}
                  placeholder="Ex: Minha mãe Maria" maxLength={50}
                  style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
                  Ocasião
                </label>
                <select value={form.ocasiao} onChange={e => setForm(f => ({ ...f, ocasiao: e.target.value }))}
                  style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', color: form.ocasiao ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 15, outline: 'none', boxSizing: 'border-box', appearance: 'none', cursor: 'pointer' }}>
                  <option value="">Selecione a ocasião</option>
                  {OCASIOES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
                  Mensagem especial <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(aparece no vídeo)</span>
                </label>
                <textarea value={form.mensagem} onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                  placeholder="Ex: Te amo muito, mãe! Obrigada por tudo..." maxLength={200} rows={3}
                  style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', color: '#fff', fontSize: 15, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{form.mensagem.length}/200</div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
                  Seu nome
                </label>
                <input value={form.seuNome} onChange={e => setForm(f => ({ ...f, seuNome: e.target.value }))}
                  placeholder="Quem está presenteando?" maxLength={50}
                  style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
                  Seu e-mail * <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(onde vamos enviar o vídeo)</span>
                </label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com" type="email"
                  style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Resumo + Pagamento */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>✅ Quase lá!</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontSize: 14 }}>
              Confira o resumo e finalize o pagamento para receber seu vídeo.
            </p>

            <div style={{ ...cardStyle, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Resumo do pedido</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Row label="📸 Fotos" value={`${fotos.length} foto${fotos.length > 1 ? 's' : ''}`} />
                <Row label="🎨 Estilo" value={ESTILOS.find(e => e.id === estilo)?.nome} />
                <Row label="🎵 Música" value={(MUSICAS[estilo] || []).find(m => m.id === musica)?.nome} />
                <Row label="👤 Homenageado" value={form.nomeHomenageado} />
                {form.ocasiao && <Row label="🎉 Ocasião" value={form.ocasiao} />}
                <Row label="📧 E-mail" value={form.email} />
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#f5c842' }}>R$19,99</span>
              </div>
            </div>

            <div style={{ ...cardStyle, background: 'rgba(245,200,66,0.04)', border: '1px solid rgba(245,200,66,0.15)', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>Entrega em até 10 minutos</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                    Após o pagamento confirmado, vamos montar seu vídeo e enviar para <strong>{form.email}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button onClick={pagar} disabled={carregando} className="btn-gold" style={{
              width: '100%', background: '#f5c842', color: '#000', border: 'none',
              padding: '18px', borderRadius: 100, fontWeight: 800, fontSize: 18, cursor: carregando ? 'not-allowed' : 'pointer',
              opacity: carregando ? 0.7 : 1, transition: 'all 0.2s',
            }}>
              {carregando ? 'Processando...' : 'Pagar R$19,99 e receber meu vídeo →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>
              🔒 Pagamento 100% seguro via Mercado Pago · PIX e Cartão
            </p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div style={{ marginTop: 20, background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', borderRadius: 12, padding: '14px 18px', color: '#ff6b6b', fontSize: 14 }}>
            {erro}
          </div>
        )}

        {/* Botões navegação */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            {step > 0 && (
              <button onClick={() => { setErro(''); setStep(s => s - 1) }} style={{
                flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 100, padding: '14px', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer',
              }}>
                ← Voltar
              </button>
            )}
            <button onClick={avancar} style={{
              flex: 2, background: '#f5c842', color: '#000', border: 'none',
              borderRadius: 100, padding: '14px', fontWeight: 800, fontSize: 15, cursor: 'pointer',
            }}>
              {step === 3 ? 'Revisar pedido →' : 'Continuar →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}
