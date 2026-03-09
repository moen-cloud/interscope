import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import leadsRouter from './routes/leads.js'
import contactRouter from './routes/contact.js'
import trialRouter from './routes/trial.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interscope'

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[Interscope] ✅ MongoDB connected'))
  .catch(err => console.error('[Interscope] ❌ MongoDB connection error:', err))

// Routes
app.use('/api/leads', leadsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/trial', trialRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`[Interscope] 🚀 Server running on http://localhost:${PORT}`)
})
