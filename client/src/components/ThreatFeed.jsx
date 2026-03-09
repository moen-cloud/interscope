import { useState, useEffect } from 'react'
import { AlertTriangle, ExternalLink } from 'lucide-react'

const mockThreats = [
  { id: 'threat-1', ip: '192.168.1.100', abuseConfidenceScore: 85, totalReports: 234, lastReportedAt: new Date(Date.now() - 2 * 3600000).toISOString(), usageType: 'Malware' },
  { id: 'threat-2', ip: '10.0.0.50', abuseConfidenceScore: 72, totalReports: 156, lastReportedAt: new Date(Date.now() - 5 * 3600000).toISOString(), usageType: 'Spam' },
  { id: 'threat-3', ip: '172.16.0.25', abuseConfidenceScore: 91, totalReports: 412, lastReportedAt: new Date(Date.now() - 1 * 3600000).toISOString(), usageType: 'DDoS' },
  { id: 'threat-4', ip: '203.0.113.45', abuseConfidenceScore: 68, totalReports: 89, lastReportedAt: new Date(Date.now() - 12 * 3600000).toISOString(), usageType: 'Phishing' },
  { id: 'threat-5', ip: '198.51.100.78', abuseConfidenceScore: 79, totalReports: 267, lastReportedAt: new Date(Date.now() - 3 * 86400000).toISOString(), usageType: 'Botnet' },
]

export default function ThreatFeed() {
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => { setThreats(mockThreats); setLoading(false) }, 800)
    const interval = setInterval(() => setThreats([...mockThreats]), 5 * 60000)
    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (score) => score >= 80 ? 'text-red-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400'
  const getRiskBg = (score) => score >= 80 ? 'bg-red-500/10 border-red-500/30' : score >= 60 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-orange-500/10 border-orange-500/30'

  const formatDate = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime()
    const mins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMs / 3600000)
    const days = Math.floor(diffMs / 86400000)
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Live Threat Feed</h2>
          <p className="text-muted-foreground text-lg">Real-time cybersecurity threat intelligence from global sources</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin"><AlertTriangle className="text-primary" size={32} /></div>
            <p className="text-muted-foreground mt-4">Loading threat data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {threats.map((threat) => (
              <div key={threat.id} className={`p-6 rounded-lg border ${getRiskBg(threat.abuseConfidenceScore)} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className={getRiskColor(threat.abuseConfidenceScore)} size={20} />
                      <h3 className="text-lg font-semibold text-foreground font-mono">{threat.ip}</h3>
                      <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium text-accent">{threat.usageType}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Risk Score</p>
                        <p className={`text-lg font-bold ${getRiskColor(threat.abuseConfidenceScore)}`}>{threat.abuseConfidenceScore}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Reports</p>
                        <p className="text-lg font-bold text-foreground">{threat.totalReports}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Seen</p>
                        <p className="text-lg font-bold text-foreground">{formatDate(threat.lastReportedAt)}</p>
                      </div>
                      <div className="flex items-end">
                        <a href={`https://www.abuseipdb.com/check/${threat.ip}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors">
                          View Details <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
