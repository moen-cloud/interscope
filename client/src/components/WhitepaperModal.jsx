import { useState } from 'react'
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
const API = import.meta.env.VITE_API_URL || ''

export default function WhitepaperModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', consent: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
    if (!formData.consent) newErrors.consent = 'You must agree to receive communications'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('${API}/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name || 'Guest', email: formData.email, company: formData.company, source: 'whitepaper' }),
      })
      setSuccess(true)
      setTimeout(() => { onClose(); setSuccess(false); setFormData({ name: '', email: '', company: '', consent: false }) }, 3000)
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-primary/30 rounded-2xl p-8 w-full max-w-md mx-4 relative glow-cyan max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors">
          <X size={20} className="text-muted-foreground" />
        </button>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary">Download Started!</h3>
            <p className="text-muted-foreground">Your whitepaper is downloading. Check your email for a copy.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Download Whitepaper</h2>
            <p className="text-muted-foreground mb-6">Get our comprehensive guide to modern cybersecurity strategies.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com"
                  className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none text-foreground ${errors.email ? 'border-red-500' : 'border-primary/30 focus:border-primary'}`} />
                {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name <span className="text-muted-foreground text-xs">(Optional)</span></label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company"
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-foreground" />
              </div>
              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <input id="consent" type="checkbox" name="consent" checked={formData.consent} onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-primary/30 cursor-pointer" />
                <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to receive marketing communications from INTERSCOPE TECHNOLOGIES <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.consent && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} />{errors.consent}</p>}
              {errors.submit && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{errors.submit}</p>}
              <button type="submit" disabled={loading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : 'Download Whitepaper'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
