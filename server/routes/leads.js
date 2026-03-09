import express from 'express'
import Lead from '../models/Lead.js'

const router = express.Router()

// POST /api/leads — create a lead
router.post('/', async (req, res) => {
  try {
    const { name, email, company, source } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check for duplicate email
    const existing = await Lead.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(200).json({ success: true, message: 'Lead already exists', data: existing })
    }

    const lead = new Lead({ name, email, company: company || '', source: source || 'contact' })
    await lead.save()

    console.log('[Interscope] New lead:', { name, email, company, source })
    res.status(201).json({ success: true, message: 'Lead captured successfully', data: lead })
  } catch (error) {
    console.error('[Interscope] Lead error:', error)
    res.status(500).json({ error: 'Failed to capture lead' })
  }
})

// GET /api/leads — list all leads (admin use)
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 })
    res.json({ success: true, count: leads.length, data: leads })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

export default router
