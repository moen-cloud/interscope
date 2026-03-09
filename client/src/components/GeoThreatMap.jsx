import { useState, useEffect, useRef } from 'react'
import { Globe, MapPin } from 'lucide-react'

const mockThreats = [
  { id: '1', lat: 51.5, lon: -0.1, type: 'active', country: 'UK' },
  { id: '2', lat: 40.7, lon: -74.0, type: 'blocked', country: 'USA' },
  { id: '3', lat: 35.7, lon: 139.7, type: 'safe', country: 'Japan' },
  { id: '4', lat: 48.8, lon: 2.3, type: 'active', country: 'France' },
  { id: '5', lat: -1.3, lon: 36.8, type: 'safe', country: 'Kenya' },
  { id: '6', lat: 55.7, lon: 37.6, type: 'blocked', country: 'Russia' },
  { id: '7', lat: 22.3, lon: 114.2, type: 'active', country: 'HK' },
  { id: '8', lat: -33.9, lon: 18.4, type: 'safe', country: 'SA' },
  { id: '9', lat: 52.5, lon: 13.4, type: 'blocked', country: 'Germany' },
  { id: '10', lat: 1.3, lon: 103.8, type: 'safe', country: 'Singapore' },
]

export default function GeoThreatMap() {
  const canvasRef = useRef(null)
  const animationRef = useRef()
  const [stats] = useState({ active: 3, blocked: 3, safe: 4 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    updateSize()

    const toCanvas = (lat, lon) => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      return { x: ((lon + 180) / 360) * w, y: ((90 - lat) / 180) * h }
    }

    const animate = (time) => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)'
      ctx.lineWidth = 1
      for (let lat = -90; lat <= 90; lat += 30) {
        const y = ((90 - lat) / 180) * h
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
      for (let lon = -180; lon <= 180; lon += 30) {
        const x = ((lon + 180) / 360) * w
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }

      mockThreats.forEach(threat => {
        const { x, y } = toCanvas(threat.lat, threat.lon)
        const pulse = Math.sin(time * 0.003) * 0.5 + 0.5

        if (threat.type === 'active') {
          ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.4})`
          ctx.beginPath(); ctx.arc(x, y, 8 + pulse * 4, 0, Math.PI * 2); ctx.fill()
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.5})`
          ctx.lineWidth = 2
          ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke()
        } else if (threat.type === 'blocked') {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.6)'
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill()
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'
          ctx.lineWidth = 2
          ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.stroke()
        } else {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.5)'
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    window.addEventListener('resize', updateSize)
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
            <Globe size={16} className="text-primary" />
            <span className="text-primary text-sm font-semibold">Global Threat Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-Time <span className="text-primary">Threat Map</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor cyber attacks and defense activities across the globe in real-time
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-slate-950 shadow-2xl mb-8">
          <canvas ref={canvasRef} className="w-full h-96 sm:h-[500px] block" aria-label="Global threat map" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Legend</h3>
            {[
              { color: 'bg-red-500', label: 'Active Threats — Detected intrusion attempts' },
              { color: 'bg-blue-500', label: 'Blocked Attacks — Successfully defended' },
              { color: 'bg-green-500', label: 'Safe Zones — Protected infrastructure' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${item.color} shadow-lg`}></div>
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Current Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-2xl font-bold text-red-400">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Threats</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-2xl font-bold text-blue-400">{stats.blocked}</p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-2xl font-bold text-green-400">{stats.safe}</p>
                <p className="text-sm text-muted-foreground">Safe Zones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
