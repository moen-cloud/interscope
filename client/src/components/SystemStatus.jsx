import { useState, useEffect } from 'react'
import { Activity, Shield, Wifi } from 'lucide-react'

export default function SystemStatus() {
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    const mockMetrics = [
      { name: 'Threat Detection', status: 'healthy', percentage: 98, icon: <Shield size={24} /> },
      { name: 'Firewall Status', status: 'healthy', percentage: 100, icon: <Activity size={24} /> },
      { name: 'Network Health', status: 'healthy', percentage: 95, icon: <Wifi size={24} /> },
    ]
    setMetrics(mockMetrics)

    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          percentage: Math.max(85, Math.min(100, metric.percentage + (Math.random() - 0.5) * 5)),
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    if (status === 'healthy') return 'text-green-400'
    if (status === 'warning') return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusBg = (status) => {
    if (status === 'healthy') return 'bg-green-500/10 border-green-500/30'
    if (status === 'warning') return 'bg-yellow-500/10 border-yellow-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  const getBarColor = (status) => {
    if (status === 'healthy') return 'bg-green-500'
    if (status === 'warning') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Active Network Defense</h2>
          <p className="text-muted-foreground text-lg">Real-time monitoring of critical security infrastructure</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div key={metric.name} className={`relative p-6 rounded-lg border backdrop-blur-sm transition-all duration-300 ${getStatusBg(metric.status)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{metric.name}</h3>
                <div className={getStatusColor(metric.status)}>{metric.icon}</div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>{Math.round(metric.percentage)}%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(metric.status)}`}
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
              <p className={`text-sm ${getStatusColor(metric.status)}`}>
                {metric.status === 'healthy' && '✓ All systems operational'}
                {metric.status === 'warning' && '⚠ Attention required'}
                {metric.status === 'critical' && '✕ Immediate action needed'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
