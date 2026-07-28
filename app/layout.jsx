import './globals.css'

export const metadata = {
  title: 'Memorizu — Homenagens em vídeo que emocionam',
  description: 'Crie um vídeo de homenagem personalizado com suas fotos e músicas favoritas. Pronto em minutos, por apenas R$19,99.',
  openGraph: {
    title: 'Memorizu — Homenagens em vídeo que emocionam',
    description: 'Crie um vídeo de homenagem personalizado com suas fotos e músicas favoritas.',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "'Inter', -apple-system, sans-serif", background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
