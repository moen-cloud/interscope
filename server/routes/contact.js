import express from 'express'
import Contact from '../models/Contact.js'
import Lead from '../models/Lead.js'

const router = express.Router()

// POST /api/contact — submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Save contact message
    const contact = new Contact({ name, email, subject, message })
    await contact.save()

    // Also save as lead if not already existing
    const existing = await Lead.findOne({ email: email.toLowerCase() })
    if (!existing) {
      await new Lead({ name, email, source: 'contact' }).save()
    }

    console.log('[Interscope] Contact form:', { name, email, subject })
    res.status(201).json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('[Interscope] Contact error:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// GET /api/contact — list all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, count: messages.length, data: messages })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

export default router
