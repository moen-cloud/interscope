import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Services from './components/Services'
import Features from './components/Features'
import SystemStatus from './components/SystemStatus'
import ThreatFeed from './components/ThreatFeed'
import GeoThreatMap from './components/GeoThreatMap'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Services />
      <Features />
      <SystemStatus />
      <ThreatFeed />
      <GeoThreatMap />
      <Pricing />
      <CTA />
      <ContactForm />
      <Footer />
    </main>
  )
}
