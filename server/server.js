import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma/client.js'
import leadsRouter from './routes/leads.js'
import contactRouter from './routes/contact.js'
import trialRouter from './routes/trial.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

// Routes
app.use('/api/leads', leadsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/trial', trialRouter)

// Health check — tests DB connection too
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      database: 'postgresql — connected ✅',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'postgresql — disconnected ❌',
      error: error.message,
    })
  }
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`[Interscope] 🚀 Server running on http://localhost:${PORT}`)
  console.log(`[Interscope] 🗄️  Database: PostgreSQL via Prisma`)
  console.log(`[Interscope] 🔍 Health check: http://localhost:${PORT}/api/health`)
})
