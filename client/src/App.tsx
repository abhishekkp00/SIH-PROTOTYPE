import './App.css'
import './i18n'
import { Suspense, lazy } from 'react'
import { Header } from './components/Header'
import { TabNavigation } from './components/TabNavigation'

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
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Header />
      <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
        <TabNavigation
          tabs={[
            { key: 'map', label: 'Hotspots', content: <HotspotMap /> },
            { key: 'market', label: 'Market', content: <MarketInsights /> },
            { key: 'alerts', label: 'Alerts', content: <Alerts /> },
          ]}
        />
      </Suspense>
    </div>
  )
}

export default App
