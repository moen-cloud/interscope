import { CheckCircle2 } from 'lucide-react'

const features = [
  {
    category: 'Defensive Capabilities',
    items: [
      'Real-time threat detection and prevention',
      'Advanced firewall and DDoS protection',
      'Vulnerability scanning and patching',
      'Security information and event management (SIEM)',
      'Endpoint detection and response (EDR)',
    ],
  },
  {
    category: 'Offensive Capabilities',
    items: [
      'Penetration testing and red teaming',
      'Social engineering assessments',
      'Web application security testing',
      'Network vulnerability exploitation',
      'Security awareness training',
    ],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-primary">INTERSCOPE</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-leading security solutions with proven results
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">{feature.category}</h3>
              <div className="space-y-4">
                {feature.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent flex-shrink-0 mt-1" size={20} />
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
