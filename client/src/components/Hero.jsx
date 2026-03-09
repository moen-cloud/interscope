import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import TrialModal from './TrialModal'
import DigitalFortress from './DigitalFortress'

export default function Hero() {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)

  const handleGetStarted = () => {
    const el = document.getElementById('contact-form')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                  <span className="text-primary text-sm font-semibold">🛡️ Advanced Security</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Defend & Attack with <span className="text-primary">Precision</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Enterprise-grade cybersecurity solutions that protect your infrastructure while providing offensive
                  security capabilities for comprehensive threat assessment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 group hover:scale-110 hover:shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-semibold hover:scale-110"
                >
                  Get Started
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <p className="text-3xl font-bold text-primary">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime SLA</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">24/7</p>
                  <p className="text-sm text-muted-foreground">Monitoring</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Clients</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <DigitalFortress />
            </div>
          </div>
        </div>
      </section>

      <TrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} />
    </>
  )
}
