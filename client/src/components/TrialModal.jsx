import { useState } from "react"
import { X, Loader2 } from "lucide-react"

const API = import.meta.env.VITE_API_URL || ""

export default function TrialModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API}/api/trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to submit form")

      setSuccess(true)
      setFormData({ name: "", email: "", company: "", phone: "" })
      setTimeout(() => { onClose(); setSuccess(false) }, 3000)
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-primary/30 rounded-2xl p-8 w-full max-w-md mx-4 relative glow-cyan">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary">Success!</h3>
            <p className="text-muted-foreground">Your free trial request has been submitted. Check your email for next steps.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Start Your Free Trial</h2>
            <p className="text-muted-foreground mb-6">Get 30 days of full access to INTERSCOPE TECHNOLOGIES security suite.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text" name="company" value={formData.company} onChange={handleChange} required
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="+254 700 000000"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (<><Loader2 size={20} className="animate-spin" />Submitting...</>) : "Start Free Trial"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}