import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import LeadCaptureModal from './LeadCaptureModal'
import WhitepaperModal from './WhitepaperModal'

export default function CTA() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [isWhitepaperModalOpen, setIsWhitepaperModalOpen] = useState(false)

  return (
    <>
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-primary/30 rounded-2xl p-12 text-center glow-cyan">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Secure Your <span className="text-primary">Infrastructure</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ organizations that trust INTERSCOPE TECHNOLOGIES for their cybersecurity needs. Get started with a free security assessment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-semibold flex items-center justify-center gap-2 group text-lg hover:scale-110 hover:shadow-lg"
              >
                Schedule Consultation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setIsWhitepaperModalOpen(true)}
                className="px-8 py-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-semibold text-lg hover:scale-110"
              >
                Download Whitepaper
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-8">No credit card required. Free assessment takes 15 minutes.</p>
          </div>
        </div>
      </section>

      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
      <WhitepaperModal isOpen={isWhitepaperModalOpen} onClose={() => setIsWhitepaperModalOpen(false)} />
    </>
  )
}
