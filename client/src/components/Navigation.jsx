import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (href) => {
    setIsOpen(false)
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
              I
            </div>
            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              INTERSCOPE TECHNOLOGIES
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['#services', '#features', '#pricing', '#contact'].map((href) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className="text-foreground hover:text-primary transition-colors capitalize"
              >
                {href.slice(1)}
              </button>
            ))}
            <ThemeToggle />
            <button
              onClick={() => handleNavClick('#contact')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 hover:scale-110 hover:shadow-lg font-medium"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {['#services', '#features', '#pricing', '#contact'].map((href) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors capitalize py-1"
              >
                {href.slice(1)}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#contact')}
              className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-all duration-300 font-medium"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
