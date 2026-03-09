import express from 'express'
import Lead from '../models/Lead.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const existing = await Lead.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(200).json({ success: true, message: 'Trial request received', data: existing })
    }

    const lead = new Lead({ name, email, company: company || '', source: 'trial' })
    await lead.save()

    console.log('[Interscope] Trial request:', { name, email, company, phone })
    res.status(201).json({ success: true, message: 'Trial request submitted' })
  } catch (error) {
    console.error('[Interscope] Trial error:', error)
    res.status(500).json({ error: 'Failed to process trial request' })
  }
})

export default router
