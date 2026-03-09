import { useState } from "react"
import { X, Lock } from "lucide-react"

const API = import.meta.env.VITE_API_URL || ""

export default function PaymentModal({ isOpen, onClose, planName, planPrice }) {
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [step, setStep] = useState("plan")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-primary/30 rounded-xl shadow-2xl shadow-primary/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Secure Payment</h2>
            <p className="text-sm text-muted-foreground mt-1">{planName} Plan - {planPrice}/month</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-4">
            {["Plan", "Payment", "Confirmation"].map((label, index) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  (step === "plan" && index === 0) || (step === "payment" && index === 1) || (step === "confirmation" && index === 2)
                    ? "bg-primary text-primary-foreground"
                    : (step === "payment" && index === 0) || (step === "confirmation" && index <= 1)
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">{label}</span>
                {index < 2 && <div className="flex-1 h-1 bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {step === "plan" && (
            <PlanReview planName={planName} planPrice={planPrice} onProceed={() => setStep("payment")} />
          )}
          {step === "payment" && (
            <PaymentMethodSelection
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
              onBack={() => setStep("plan")}
              loading={loading}
              setLoading={setLoading}
              onSuccess={() => setStep("confirmation")}
              planName={planName}
            />
          )}
          {step === "confirmation" && (
            <ConfirmationScreen planName={planName} planPrice={planPrice} onClose={onClose} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/50 bg-secondary/20 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock size={16} className="text-accent" />
          <span>All transactions are encrypted and secure.</span>
        </div>
      </div>
    </div>
  )
}

function PlanReview({ planName, planPrice, onProceed }) {
  return (
    <div className="space-y-6">
      <div className="bg-secondary/50 border border-primary/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-foreground">
            <span>{planName} Plan</span>
            <span className="font-semibold">{planPrice}/month</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Billing Cycle</span><span>Monthly</span>
          </div>
          <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span className="text-primary">{planPrice}</span>
          </div>
        </div>
      </div>
      <button onClick={onProceed} className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/50">
        Proceed to Payment
      </button>
    </div>
  )
}

function PaymentMethodSelection({ selectedMethod, onSelectMethod, onBack, loading, setLoading, onSuccess, planName }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[{ id: "card", label: "Card" }, { id: "paypal", label: "PayPal" }, { id: "mpesa", label: "M-Pesa" }].map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              selectedMethod === method.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50"
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>

      <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
        {selectedMethod === "card" && <CardPaymentForm loading={loading} setLoading={setLoading} onSuccess={onSuccess} />}
        {selectedMethod === "paypal" && <PayPalPaymentForm loading={loading} setLoading={setLoading} onSuccess={onSuccess} />}
        {selectedMethod === "mpesa" && <MPesaPaymentForm loading={loading} setLoading={setLoading} onSuccess={onSuccess} />}
      </div>

      <button onClick={onBack} className="w-full bg-secondary text-foreground font-semibold py-2 rounded-lg hover:bg-secondary/80 transition-all">
        Back to Review
      </button>
    </div>
  )
}

function CardPaymentForm({ loading, setLoading, onSuccess }) {
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" })
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pay/card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardData),
      })
      if (res.ok) onSuccess()
      else setError("Payment failed. Please try again.")
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
        <input type="text" placeholder="4242 4242 4242 4242" value={cardData.number}
          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Expiry</label>
          <input type="text" placeholder="MM/YY" value={cardData.expiry}
            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">CVC</label>
          <input type="text" placeholder="123" value={cardData.cvc}
            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
            className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition-all disabled:opacity-50">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

function PayPalPaymentForm({ loading, setLoading, onSuccess }) {
  const [error, setError] = useState("")

  const handleCreateOrder = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pay/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (data.approvalUrl) window.open(data.approvalUrl, "_blank")
      else setError("Failed to create PayPal order.")
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">You will be redirected to PayPal to complete your payment securely.</p>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <button onClick={handleCreateOrder} disabled={loading} className="w-full bg-[#0070ba] hover:bg-[#005a94] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50">
        {loading ? "Initializing..." : "Pay with PayPal"}
      </button>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock size={14} className="text-accent" />
        <span>PayPal checkout is handled securely by PayPal</span>
      </div>
    </div>
  )
}

function MPesaPaymentForm({ loading, setLoading, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState("+254")
  const [error, setError] = useState("")
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleMPesaPayment = async (e) => {
    e.preventDefault()
    setError("")
    if (!phoneNumber.match(/^\+254\d{9}$/)) {
      setError("Please enter a valid phone number (+2547XXXXXXXX)")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/pay/mpesa/stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      })
      const data = await res.json()
      if (data.success) {
        showToast("STK Push sent — check your phone to approve.", "success")
        setTimeout(() => onSuccess(), 2000)
      } else {
        const msg = data.error || data.message || "STK push failed. Please try again."
        setError(msg)
        showToast(msg, "error")
      }
    } catch {
      const msg = "An error occurred. Please try again."
      setError(msg)
      showToast(msg, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleMPesaPayment} className="space-y-4">
      <p className="text-sm text-muted-foreground">Enter your M-Pesa registered phone number. You will receive a prompt on your phone.</p>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
        <input type="tel" placeholder="+2547XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">Format: +254 followed by 9 digits</p>
      </div>
      {error && <div className="text-destructive text-sm font-medium">{error}</div>}
      {toast && (
        <div className={`text-sm font-medium p-3 rounded-lg transition-all ${
          toast.type === "success" ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
        }`}>
          {toast.message}
        </div>
      )}
      <button type="submit" disabled={loading} className="w-full bg-[#00953f] hover:bg-[#007a33] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Sending STK Push..." : "Send M-Pesa Prompt"}
      </button>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock size={14} className="text-accent" />
        <span>M-Pesa payment powered by Safaricom Daraja API</span>
      </div>
    </form>
  )
}

function ConfirmationScreen({ planName, planPrice, onClose }) {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
          <span className="text-accent-foreground text-xl">✓</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-foreground">Payment Successful!</h3>
        <p className="text-muted-foreground mt-2">Your {planName} plan is now active.</p>
      </div>
      <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between text-foreground"><span>Plan</span><span className="font-semibold">{planName}</span></div>
        <div className="flex justify-between text-foreground"><span>Amount Charged</span><span className="font-semibold text-accent">{planPrice}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Billing Cycle</span><span>Monthly</span></div>
      </div>
      <p className="text-sm text-muted-foreground">A confirmation email has been sent to your registered email address.</p>
      <button onClick={onClose} className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 rounded-lg transition-all">
        Done
      </button>
    </div>
  )
}