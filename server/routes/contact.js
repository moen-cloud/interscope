import express from 'express'
import pool from '../db/pool.js'

const router = express.Router()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const lowerEmail = email.toLowerCase()

    // Save contact message
    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, lowerEmail, subject, message]
    )

    // Also save as lead
    await pool.query(
      `INSERT INTO leads (name, email, source)
       VALUES ($1, $2, 'contact')
       ON CONFLICT (email) DO NOTHING`,
      [name, lowerEmail]
    )

    console.log('[Interscope] ✅ Contact saved:', { name, email: lowerEmail })
    res.status(201).json({ success: true, message: 'Message sent successfully', data: result.rows[0] })
  } catch (err) {
    console.error('[Interscope] ❌ Contact error:', err.message)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC')
    res.json({ success: true, count: result.rows.length, data: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

export default router
