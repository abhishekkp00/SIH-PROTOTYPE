import { useState, type ReactNode } from 'react'

export function TabNavigation({ tabs }: { tabs: { key: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.key)
  return (
    <div>
      <nav className="tabbar">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActive(t.key)} className={`tab ${active === t.key ? 'active' : ''}`}>
            {t.label}
          </button>
        ))}
      </nav>
      <div className="content">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  )
}
