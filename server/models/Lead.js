import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
  },
  company: { type: String, trim: true, default: '' },
  source: {
    type: String,
    enum: ['consultation', 'whitepaper', 'trial', 'contact', 'payment-Starter', 'payment-Professional', 'payment-Enterprise'],
    default: 'contact',
  },
  status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Lead', leadSchema)
