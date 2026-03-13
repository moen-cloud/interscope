import express from 'express'
import prisma from '../prisma/client.js'

const router = express.Router()

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/contact — submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Save contact message
    const contact = await prisma.contact.create({
      data: { name, email: email.toLowerCase(), subject, message },
    })

    // Also upsert as lead
    await prisma.lead.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { name, email: email.toLowerCase(), source: 'contact' },
    })

    console.log('[Interscope] ✅ Contact saved:', { name, email, subject })
    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact })
  } catch (error) {
    console.error('[Interscope] ❌ Contact error:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// GET /api/contact — list all messages
router.get('/', async (req, res) => {
  try {
    const messages = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, count: messages.length, data: messages })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

export default router
