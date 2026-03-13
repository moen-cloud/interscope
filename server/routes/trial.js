import express from 'express'
import prisma from '../prisma/client.js'

const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/trial — submit free trial request
router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const trial = await prisma.trial.create({
      data: {
        name,
        email: email.toLowerCase(),
        company: company || '',
        phone: phone || '',
      },
    })

    // Also upsert as lead
    await prisma.lead.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { name, email: email.toLowerCase(), company: company || '', source: 'trial' },
    })

    console.log('[Interscope] ✅ Trial request saved:', { name, email })
    res.status(201).json({ success: true, message: 'Trial request submitted', data: trial })
  } catch (error) {
    console.error('[Interscope] ❌ Trial error:', error)
    res.status(500).json({ error: 'Failed to process trial request' })
  }
})

export default router
