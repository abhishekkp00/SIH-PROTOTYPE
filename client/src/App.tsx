import './App.css'
import './i18n'
import { Suspense, lazy } from 'react'
import { Header } from './components/Header'
import { TabNavigation } from './components/TabNavigation'
import { LocationProvider } from './contexts/LocationContext'

const HotspotMap = lazy(() => import('./components/HotspotMap').then(m => ({ default: m.HotspotMap })))
const MarketInsights = lazy(() => import('./components/MarketInsights').then(m => ({ default: m.MarketInsights })))
const Alerts = lazy(() => import('./components/Alerts').then(m => ({ default: m.Alerts })))
const GovDashboard = lazy(() => import('./components/GovDashboard').then(m => ({ default: m.GovDashboard })))

function App() {
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  if (mode === 'gov') {
    return (
      <Suspense fallback={<div style={{ padding: 16 }}>Loading dashboard...</div>}>
        <GovDashboard />
      </Suspense>
    )
  }

  return (
    <LocationProvider>
      <div className="app-container">
        <Header />
        <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
          <TabNavigation
            tabs={[
              { key: 'hotspots', label: 'AI Hotspots', content: <HotspotMap />, icon: '🎯' },
              { key: 'market', label: 'Market Intel', content: <MarketInsights />, icon: '📈' },
              { key: 'alerts', label: 'Safety Alerts', content: <Alerts />, icon: '⚠️' },
              { key: 'dashboard', label: 'Dashboard', content: <GovDashboard />, icon: '📊' },
            ]}
          />
        </Suspense>
      </div>
    </LocationProvider>
  )
}

export default App
