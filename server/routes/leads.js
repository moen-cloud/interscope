import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const { name, email, company, source } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const lowerEmail = email.toLowerCase()

    // Upsert — update if exists, insert if not
    const result = await pool.query(
      `INSERT INTO leads (name, email, company, source)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           company = EXCLUDED.company,
           source = EXCLUDED.source,
           updated_at = NOW()
       RETURNING *`,
      [name, lowerEmail, company || '', source || 'contact']
    )

    console.log('[Interscope] ✅ Lead saved:', { name, email: lowerEmail, source })
    res.status(201).json({ success: true, message: 'Lead captured', data: result.rows[0] })
  } catch (err) {
    console.error('[Interscope] ❌ Lead error:', err.message)
    res.status(500).json({ error: 'Failed to capture lead' })
  }
})

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC')
    res.json({ success: true, count: result.rows.length, data: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

export default router
