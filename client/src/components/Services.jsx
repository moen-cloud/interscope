import { Shield, Zap, Lock, Eye, Cpu, AlertTriangle } from 'lucide-react'

const services = [
  { icon: Shield, title: 'Defensive Security', description: 'Comprehensive protection against threats with real-time monitoring, intrusion detection, and vulnerability management.', color: 'text-primary' },
  { icon: Zap, title: 'Offensive Security', description: 'Proactive penetration testing and red team operations to identify and exploit vulnerabilities before attackers do.', color: 'text-accent' },
  { icon: Lock, title: 'Encryption & Compliance', description: 'Enterprise-grade encryption, data protection, and compliance with GDPR, HIPAA, and SOC 2 standards.', color: 'text-primary' },
  { icon: Eye, title: 'Threat Intelligence', description: 'Advanced threat analysis and intelligence gathering to stay ahead of emerging security threats.', color: 'text-accent' },
  { icon: Cpu, title: 'Infrastructure Security', description: 'Secure your cloud, on-premise, and hybrid infrastructure with advanced security protocols.', color: 'text-primary' },
  { icon: AlertTriangle, title: 'Incident Response', description: '24/7 incident response team ready to handle security breaches and minimize damage.', color: 'text-accent' },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive cybersecurity solutions designed to protect and strengthen your organization
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group p-6 bg-background border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className={`${service.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
