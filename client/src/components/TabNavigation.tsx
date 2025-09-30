import { useState, type ReactNode } from 'react'

interface Tab {
  key: string
  label: string
  content: ReactNode
  icon?: string
}

export function TabNavigation({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key)
  
  const getTabIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'hotspots': return '🎯'
      case 'market': return '📈'
      case 'alerts': return '🔔'
      case 'dashboard': return '📊'
      case 'government': return '🏛️'
      case 'insights': return '💡'
      default: return '📍'
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="tabbar" role="tablist" aria-label="Navigation tabs">
        {tabs.map((tab) => (
          <button 
            key={tab.key} 
            onClick={() => setActive(tab.key)} 
            className={`tab ${active === tab.key ? 'active' : ''}`}
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`panel-${tab.key}`}
            id={`tab-${tab.key}`}
            title={tab.label}
          >
            <span className="text-lg" aria-hidden="true">
              {tab.icon || getTabIcon(tab.key)}
            </span>
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <main className="content flex-1">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            id={`panel-${tab.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.key}`}
            className={active === tab.key ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </main>
    </div>
  )
}
