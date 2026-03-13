import express from 'express'
import prisma from '../prisma/client.js'

const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/leads — capture a lead
router.post('/', async (req, res) => {
  try {
    const { name, email, company, source } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Upsert — update if exists, create if not
    const lead = await prisma.lead.upsert({
      where: { email: email.toLowerCase() },
      update: { name, company: company || '', source: source || 'contact' },
      create: {
        name,
        email: email.toLowerCase(),
        company: company || '',
        source: source || 'contact',
      },
    })

    console.log('[Interscope] ✅ Lead saved:', { name, email, source })
    res.status(201).json({ success: true, message: 'Lead captured', data: lead })
  } catch (error) {
    console.error('[Interscope] ❌ Lead error:', error)
    res.status(500).json({ error: 'Failed to capture lead' })
  }
})

// GET /api/leads — list all leads
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, count: leads.length, data: leads })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

export default router
