import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">I</div>
              <span className="font-bold text-lg">INTERSCOPE</span>
            </div>
            <p className="text-muted-foreground text-sm">Advanced cybersecurity solutions for defending and attacking threats.</p>
          </div>

          {[
            { title: 'Products', links: ['Defensive Suite', 'Offensive Tools', 'Threat Intelligence', 'Compliance'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'] },
          ].map(col => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map(link => (
                  <li key={link}>
                    <button onClick={() => {}} className="text-muted-foreground hover:text-primary transition-colors text-left">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} INTERSCOPE TECHNOLOGIES. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: '#' },
              { icon: Linkedin, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Mail, href: 'mailto:contact@interscope.tech' },
            ].map((item, i) => (
              <a key={i} href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                <item.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
