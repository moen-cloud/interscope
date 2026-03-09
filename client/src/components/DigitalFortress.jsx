import { useEffect, useRef } from 'react'

export default function DigitalFortress() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const gridSize = 60

      ctx.strokeStyle = `rgba(0, 217, 255, ${0.15 + Math.sin(time) * 0.1})`
      ctx.lineWidth = 1

      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        ctx.moveTo(0, centerY - 150 + i * gridSize)
        ctx.lineTo(canvas.width, centerY - 150 + i * gridSize)
        ctx.stroke()
      }
      for (let i = 0; i < 8; i++) {
        ctx.beginPath()
        ctx.moveTo(centerX - 180 + i * gridSize, centerY - 150)
        ctx.lineTo(centerX - 180 + i * gridSize, centerY + 150)
        ctx.stroke()
      }

      const nodeSize = 4
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 8; j++) {
          const x = centerX - 180 + j * gridSize
          const y = centerY - 150 + i * gridSize
          const pulse = Math.sin(time * 2 + (i + j) * 0.3) * 0.5 + 0.5
          const radius = nodeSize + pulse * 2
          ctx.fillStyle = `rgba(0, 217, 255, ${0.3 * pulse})`
          ctx.beginPath()
          ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#00d9ff'
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const streamCount = 4
      for (let s = 0; s < streamCount; s++) {
        const streamOffset = (time * 100 + s * 50) % 400
        ctx.strokeStyle = `rgba(0, 217, 255, ${0.4 - (streamOffset / 400) * 0.3})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, centerY - 100 + s * 60 - streamOffset)
        ctx.lineTo(canvas.width, centerY - 100 + s * 60 - streamOffset)
        ctx.stroke()
      }

      const coreRadius = 30
      const corePulse = Math.sin(time * 1.5) * 0.3 + 0.7
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * corePulse})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius + 20, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.4 * corePulse})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius + 10, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#00d9ff'
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(0, 217, 255, ${0.5 * corePulse})`
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius * 0.6, 0, Math.PI * 2)
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl border border-primary/30 backdrop-blur-sm glow-cyan-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-auto"
          aria-label="Digital fortress visualization"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Defense Status</p>
          <p className="text-2xl font-bold text-primary">Active</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">Threat Level</p>
          <p className="text-2xl font-bold text-accent">Low</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-xs text-muted-foreground mb-1">System Health</p>
          <p className="text-2xl font-bold text-green-500">Optimal</p>
        </div>
      </div>
    </div>
  )
}
