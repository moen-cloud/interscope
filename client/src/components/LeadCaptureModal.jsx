import { useState } from "react"
import { X, Loader2, CheckCircle } from "lucide-react"

const API = import.meta.env.VITE_API_URL || ""

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", company: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const response = await fetch(`${API}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "consultation" }),
      })

      if (!response.ok) throw new Error("Failed to submit")

      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 30)
      document.cookie = `lead_email=${encodeURIComponent(formData.email)}; expires=${expiry.toUTCString()}; path=/`
      document.cookie = `lead_name=${encodeURIComponent(formData.name)}; expires=${expiry.toUTCString()}; path=/`

      setSuccess(true)
      setTimeout(() => {
        window.location.href = `https://calendly.com/interscope-technology?prefill_email=${encodeURIComponent(formData.email)}`
      }, 2000)
    } catch (err) {
      setErrors({ submit: err.message || "An error occurred. Please try again." })
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
          aria-label="Close modal"
        >
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
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors text-foreground ${
                    errors.name ? "border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none transition-colors text-foreground ${
                    errors.email ? "border-red-500" : "border-primary/30 focus:border-primary"
                  }`}
                  placeholder="john@company.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Company Name <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="Your Company"
                />
              </div>

              {errors.submit && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">{errors.submit}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Schedule Consultation"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}