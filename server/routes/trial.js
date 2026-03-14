import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/trial
router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const lowerEmail = email.toLowerCase()

    const result = await pool.query(
      `INSERT INTO trials (name, email, company, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, lowerEmail, company || '', phone || '']
    )

    // Also save as lead
    await pool.query(
      `INSERT INTO leads (name, email, company, source)
       VALUES ($1, $2, $3, 'trial')
       ON CONFLICT (email) DO NOTHING`,
      [name, lowerEmail, company || '']
    )

    console.log('[Interscope] ✅ Trial saved:', { name, email: lowerEmail })
    res.status(201).json({ success: true, message: 'Trial request submitted', data: result.rows[0] })
  } catch (err) {
    console.error('[Interscope] ❌ Trial error:', err.message)
    res.status(500).json({ error: 'Failed to process trial request' })
  }
})

export default router
