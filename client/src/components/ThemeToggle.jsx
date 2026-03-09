import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {isDark
        ? <Sun size={20} className="text-accent" />
        : <Moon size={20} className="text-primary" />
      }
    </button>
  )
}
