import pool from './pool.js'

async function setup() {
  const client = await pool.connect()
  try {
    console.log('[Interscope] 🔧 Setting up database tables...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        company VARCHAR(255) DEFAULT '',
        source VARCHAR(100) DEFAULT 'contact',
        status VARCHAR(100) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(100) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS trials (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        status VARCHAR(100) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    console.log('[Interscope] ✅ Tables created successfully!')
    console.log('[Interscope] Tables: leads, contacts, trials')
  } catch (err) {
    console.error('[Interscope] ❌ Setup error:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

setup()
