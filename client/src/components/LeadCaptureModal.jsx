import { useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'consultation' }),
      })
      setSuccess(true)
      setTimeout(() => {
        window.location.href = `https://calendly.com/interscope-technology?prefill_email=${encodeURIComponent(formData.email)}`
      }, 2000)
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-primary/30 rounded-2xl p-8 w-full max-w-md mx-4 relative glow-cyan">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors">
          <X size={20} className="text-muted-foreground" />
        </button>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary">Success!</h3>
            <p className="text-muted-foreground">Redirecting you to schedule your consultation...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Schedule Consultation</h2>
            <p className="text-muted-foreground mb-6">Let's discuss how we can secure your infrastructure.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', required: true, placeholder: 'John Doe' },
                { label: 'Email Address', name: 'email', type: 'email', required: true, placeholder: 'john@company.com' },
                { label: 'Company Name', name: 'company', type: 'text', required: false, placeholder: 'Your Company' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                    {!field.required && <span className="text-muted-foreground text-xs"> (Optional)</span>}
                  </label>
                  <input
                    type={field.type} name={field.name} value={formData[field.name]}
                    onChange={handleChange} required={field.required} placeholder={field.placeholder}
                    className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors text-foreground ${errors[field.name] ? 'border-red-500' : 'border-primary/30 focus:border-primary'}`}
                  />
                  {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                </div>
              ))}
              {errors.submit && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{errors.submit}</p>}
              <button type="submit" disabled={loading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 size={20} className="animate-spin" /> Submitting...</> : 'Schedule Consultation'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
