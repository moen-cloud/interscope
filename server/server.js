import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db/pool.js'
import leadsRouter from './routes/leads.js'
import contactRouter from './routes/contact.js'
import trialRouter from './routes/trial.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://interscope-app.onrender.com', 'https://interscope.onrender.com']
    : 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/leads', leadsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/trial', trialRouter)

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({
      status: 'ok',
      database: 'connected ✅',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected ❌',
      error: err.message,
    })
  }
})

// Auto-create tables on startup
async function initDB() {
  const client = await pool.connect()
  try {
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
    console.log('[Interscope] ✅ Database tables ready')
  } catch (err) {
    console.error('[Interscope] ❌ DB init error:', err.message)
  } finally {
    client.release()
  }
}

app.listen(PORT, async () => {
  console.log(`[Interscope] 🚀 Server running on http://localhost:${PORT}`)
  await initDB()
})
