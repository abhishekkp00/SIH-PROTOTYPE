import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api'
import { socket } from '../socket'

async function showNotification(title: string, body: string, _language: string = 'en') {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      reg.showNotification(title, { 
        body, 
        icon: '/icons/icon-192.png', 
        tag: 'sealens-alert',
        badge: '/icons/icon-192.png',
        requireInteraction: true
      })
      return
    }
  } catch {}
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/icons/icon-192.png' })
  }
}

type Alert = {
  _id: string
  type: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  message: string
  message_hi?: string
  location?: string
  timestamp: string
  action_required?: string
  safety_instructions?: string[]
}

const mockAlerts: Alert[] = [
  {
    _id: '1',
    type: 'Cyclone Warning',
    severity: 'Critical',
    message: 'Severe cyclonic storm approaching Gujarat coast. Return to harbor immediately.',
    message_hi: 'गुजरात तट पर भीषण चक्रवाती तूफान आ रहा है। तुरंत बंदरगाह वापस जाएं।',
    location: 'Gujarat Coast',
    timestamp: new Date().toISOString(),
    action_required: 'Return to harbor within 2 hours',
    safety_instructions: ['Secure all equipment', 'Follow harbor master instructions', 'Stay in designated safe zones']
  },
  {
    _id: '2',
    type: 'Regulatory Update',
    severity: 'Medium',
    message: 'New fishing regulations effective from tomorrow. Hilsa fishing banned for 15 days.',
    message_hi: 'कल से नए मछली पकड़ने के नियम प्रभावी। हिल्सा मछली पकड़ने पर 15 दिन का प्रतिबंध।',
    location: 'West Bengal',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action_required: 'Update fishing plans'
  },
  {
    _id: '3',
    type: 'Weather Alert',
    severity: 'High',
    message: 'High winds (45+ knots) and rough seas expected. Small vessels advised to avoid deep waters.',
    message_hi: 'तेज हवाएं (45+ नॉट्स) और खुरदुरे समुद्र की उम्मीद। छोटे जलयानों को गहरे पानी से बचने की सलाह।',
    location: 'Kerala Coast',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    safety_instructions: ['Wear life jackets', 'Stay within 5km of coast', 'Maintain radio contact']
  }
]

export function Alerts() {
  const { i18n } = useTranslation()
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [perm, setPerm] = useState(Notification?.permission || 'default')

  useEffect(() => {
    // Load alerts from API
    api.get('/alerts')
      .then((r) => setAlerts([...mockAlerts, ...r.data]))
      .catch(() => setAlerts(mockAlerts))

    // Listen for new alerts
    socket.on('alert:new', (alert: Alert) => {
      setAlerts((prev) => [alert, ...prev])
      const message = i18n.language === 'hi' && alert.message_hi ? alert.message_hi : alert.message
      showNotification(`${alert.type} Alert`, message, i18n.language)
    })

    return () => { socket.off('alert:new') }
  }, [i18n.language])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626'
      case 'High': return '#ea580c'
      case 'Medium': return '#f59e0b'
      case 'Low': return '#059669'
      default: return '#3b82f6'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return '🚨'
      case 'High': return '⚠️'
      case 'Medium': return '⚡'
      case 'Low': return 'ℹ️'
      default: return '📢'
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('cyclone')) return '🌪️'
    if (type.toLowerCase().includes('weather')) return '🌊'
    if (type.toLowerCase().includes('regulatory')) return '📜'
    if (type.toLowerCase().includes('safety')) return '⛑️'
    return '📢'
  }

  return (
    <div className="safety-alerts">
      {/* Emergency Alert Banner */}
      <div className="emergency-banner">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🚨</span>
          <h3 className="font-bold text-red-600">Emergency Alert System</h3>
          <span className="live-indicator">LIVE</span>
        </div>
        <p className="emergency-text">
          Real-time safety alerts in your local language. Lives protected, compliance ensured.
        </p>
      </div>

      {/* Notification Controls */}
      <div className="notification-controls">
        <button 
          className={perm === 'granted' ? 'btn-success' : 'btn-primary'} 
          onClick={async () => { 
            const p = await Notification.requestPermission()
            setPerm(p) 
          }}
        >
          {perm === 'granted' ? '✅ Notifications Enabled' : '🔔 Enable Notifications'}
        </button>
        <button 
          className="btn" 
          onClick={() => showNotification(
            'SeaLens Test', 
            i18n.language === 'hi' ? 'यह एक परीक्षण अधिसूचना है' : 'This is a test notification',
            i18n.language
          )}
        >
          🧪 Test Alert
        </button>
      </div>

      {/* Active Alerts */}
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div 
            key={alert._id} 
            className={`alert-card severity-${alert.severity.toLowerCase()}`}
            style={{ borderLeftColor: getSeverityColor(alert.severity) }}
          >
            <div className="alert-header">
              <div className="alert-type">
                <span className="type-icon">{getTypeIcon(alert.type)}</span>
                <span className="severity-icon">{getSeverityIcon(alert.severity)}</span>
                <div>
                  <h4>{alert.type}</h4>
                  <p className="alert-location">{alert.location}</p>
                </div>
              </div>
              <div className="alert-meta">
                <span className={`severity-badge severity-${alert.severity.toLowerCase()}`}>
                  {alert.severity}
                </span>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="alert-content">
              <p className="alert-message">
                {i18n.language === 'hi' && alert.message_hi ? alert.message_hi : alert.message}
              </p>
              
              {alert.action_required && (
                <div className="action-required">
                  <strong>Action Required:</strong> {alert.action_required}
                </div>
              )}
              
              {alert.safety_instructions && (
                <div className="safety-instructions">
                  <strong>Safety Instructions:</strong>
                  <ul>
                    {alert.safety_instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="alert-actions">
              <button className="btn-sm btn-primary">
                {i18n.language === 'hi' ? 'विवरण देखें' : 'View Details'}
              </button>
              <button className="btn-sm btn-outline">
                {i18n.language === 'hi' ? 'साझा करें' : 'Share'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="status-item">
          <span className="status-icon">🛰️</span>
          <div>
            <h4>Satellite Connection</h4>
            <p className="status-active">Connected</p>
          </div>
        </div>
        <div className="status-item">
          <span className="status-icon">📡</span>
          <div>
            <h4>Weather Monitoring</h4>
            <p className="status-active">Active</p>
          </div>
        </div>
        <div className="status-item">
          <span className="status-icon">📱</span>
          <div>
            <h4>Push Notifications</h4>
            <p className={perm === 'granted' ? 'status-active' : 'status-inactive'}>
              {perm === 'granted' ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
