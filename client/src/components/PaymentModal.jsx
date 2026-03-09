import { useState } from 'react'
import { X, Loader2, CreditCard } from 'lucide-react'

export default function PaymentModal({ isOpen, onClose, planName, planPrice }) {
  const [formData, setFormData] = useState({ name: '', email: '', cardNumber: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Simulate payment processing
      await new Promise(r => setTimeout(r, 1500))
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, company: '', source: `payment-${planName}` }),
      })
      setSuccess(true)
      setTimeout(() => { onClose(); setSuccess(false) }, 3000)
    } catch (err) {
      setError('Payment processing failed. Please try again.')
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
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary">Payment Successful!</h3>
            <p className="text-muted-foreground">Welcome to {planName}. Check your email for onboarding details.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-primary" size={24} />
              <div>
                <h2 className="text-2xl font-bold">{planName} Plan</h2>
                <p className="text-muted-foreground">{planPrice}{planPrice !== 'Custom' ? '/month' : ''}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe"
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@company.com"
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required placeholder="4242 4242 4242 4242" maxLength={19}
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry</label>
                  <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} required placeholder="MM/YY" maxLength={5}
                    className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} required placeholder="123" maxLength={4}
                    className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground font-mono" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : `Pay ${planPrice !== 'Custom' ? planPrice + '/mo' : '— Contact Us'}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
