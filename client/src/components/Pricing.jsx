import { useState } from 'react'
import { Check } from 'lucide-react'
import PaymentModal from './PaymentModal'

const plans = [
  {
    name: 'Starter', price: '$299', description: 'Perfect for small teams and startups',
    features: ['Basic threat detection', 'Up to 5 users', 'Email support', 'Monthly reports', 'Basic firewall protection', '24/7 monitoring'],
  },
  {
    name: 'Professional', price: '$999', description: 'Ideal for growing businesses',
    features: ['Advanced threat detection', 'Up to 25 users', 'Priority support', 'Weekly reports', 'Advanced firewall protection', '24/7 monitoring', 'Penetration testing', 'Custom integrations'],
    highlighted: true,
  },
  {
    name: 'Enterprise', price: 'Custom', description: 'For large-scale operations',
    features: ['Enterprise threat detection', 'Unlimited users', 'Dedicated support', 'Real-time reports', 'Enterprise firewall', '24/7 monitoring', 'Full penetration testing', 'Custom integrations', 'SLA guarantee', 'On-premise deployment'],
  },
]

export default function Pricing() {
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, planName: '', planPrice: '' })

  return (
    <>
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the perfect plan for your security needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border transition-all duration-300 hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-primary/10 border-primary/50 shadow-lg shadow-primary/20 md:scale-105'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-muted-foreground ml-2">/month</span>}
                  </div>
                  <button
                    onClick={() => setPaymentModal({ isOpen: true, planName: plan.name, planPrice: plan.price })}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 mb-8 ${
                      plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-accent hover:shadow-lg hover:shadow-primary/50'
                        : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    Select Plan
                  </button>
                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="text-accent flex-shrink-0 mt-1" size={20} />
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        planName={paymentModal.planName}
        planPrice={paymentModal.planPrice}
      />
    </>
  )
}
