const BASE = 'https://api.creatomate.com/v1'

const TEMPLATE_IDS = {
  classico:  process.env.CREATOMATE_TEMPLATE_CLASSICO,
  moderno:   process.env.CREATOMATE_TEMPLATE_MODERNO,
  romantico: process.env.CREATOMATE_TEMPLATE_ROMANTICO,
  gospel:    process.env.CREATOMATE_TEMPLATE_GOSPEL,
}

const MUSIC_URLS = {
  m1:  process.env.MUSIC_CLASSICO_1,
  m2:  process.env.MUSIC_CLASSICO_2,
  m3:  process.env.MUSIC_CLASSICO_3,
  m4:  process.env.MUSIC_MODERNO_1,
  m5:  process.env.MUSIC_MODERNO_2,
  m6:  process.env.MUSIC_MODERNO_3,
  m7:  process.env.MUSIC_ROMANTICO_1,
  m8:  process.env.MUSIC_ROMANTICO_2,
  m9:  process.env.MUSIC_ROMANTICO_3,
  m10: process.env.MUSIC_GOSPEL_1,
  m11: process.env.MUSIC_GOSPEL_2,
  m12: process.env.MUSIC_GOSPEL_3,
}

export async function gerarVideo({ estilo, musicaId, fotosUrls, nomeHomenageado, ocasiao, mensagem, seuNome }) {
  const templateId = TEMPLATE_IDS[estilo]
  if (!templateId) throw new Error(`Template não configurado para estilo: ${estilo}`)

  const musicUrl = MUSIC_URLS[musicaId]

  const modifications = {
    'Texto-Nome': nomeHomenageado || '',
    'Texto-Mensagem': mensagem || '',
    'Texto-Ocasiao': ocasiao || '',
    'Texto-Remetente': seuNome ? `Com amor, ${seuNome}` : '',
  }

  if (musicUrl) modifications['Audio'] = musicUrl

  fotosUrls.slice(0, 15).forEach((url, i) => {
    modifications[`Foto-${i + 1}`] = url
  })

  const res = await fetch(`${BASE}/renders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: templateId,
      modifications,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Creatomate error: ${err}`)
  }

  const renders = await res.json()
  const render = Array.isArray(renders) ? renders[0] : renders

  // Poll until done
  let attempts = 0
  while (attempts < 60) {
    await new Promise(r => setTimeout(r, 5000))
    const poll = await fetch(`${BASE}/renders/${render.id}`, {
      headers: { 'Authorization': `Bearer ${process.env.CREATOMATE_API_KEY}` },
    })
    const data = await poll.json()
    if (data.status === 'succeeded') return data.url
    if (data.status === 'failed') throw new Error(`Render falhou: ${data.error_message}`)
    attempts++
  }

  throw new Error('Timeout aguardando render do vídeo')
}
