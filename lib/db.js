import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

export async function query(sql, params) {
  const client = await pool.connect()
  try {
    return await client.query(sql, params)
  } finally {
    client.release()
  }
}

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id UUID PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pendente',
      email TEXT NOT NULL,
      nome_homenageado TEXT NOT NULL,
      ocasiao TEXT,
      mensagem TEXT,
      seu_nome TEXT,
      estilo TEXT NOT NULL,
      musica TEXT NOT NULL,
      fotos_urls JSONB NOT NULL DEFAULT '[]',
      mp_preference_id TEXT,
      mp_payment_id TEXT,
      video_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}
