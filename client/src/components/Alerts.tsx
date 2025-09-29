import { useEffect, useState } from 'react'
import api from '../api'
import { socket } from '../socket'

async function showNotification(title: string, body: string) {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      reg.showNotification(title, { body, icon: '/icons/icon-192.png', tag: 'sealens-alert' })
      return
    }
  } catch {}
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192.png' })
  }
}

export function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [perm, setPerm] = useState(Notification?.permission || 'default')

  useEffect(() => {
    api.get('/alerts').then((r) => setAlerts(r.data))
    socket.on('alert:new', (a: any) => {
      setAlerts((prev) => [a, ...prev])
      showNotification(`${a.type} Alert`, a.message)
    })
    return () => { socket.off('alert:new') }
  }, [])

  return (
    <div className="section">
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button className="btn-primary" onClick={async () => { const p = await Notification.requestPermission(); setPerm(p) }}>
          {perm === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
        </button>
        <button className="btn" onClick={() => showNotification('SeaLens', 'This is a test notification')}>Test Notification</button>
      </div>
      {alerts.map((a) => (
        <div key={a._id || Math.random()} className="card" style={{ borderLeft: `6px solid ${a.severity === 'Medium' ? '#f59e0b' : a.severity === 'High' ? '#e11d48' : '#0a84ff'}` }}>
          <b>{a.type}</b>: {a.message}
        </div>
      ))}
    </div>
  )
}
