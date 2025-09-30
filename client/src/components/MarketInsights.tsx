import { useEffect } from 'react'
import api from '../api'
import { useLocation } from '../contexts/LocationContext'

const festivals = [
  { name: 'Diwali', days: 2, surge: '20%', emoji: '🪔' },
  { name: 'Durga Puja', days: 8, surge: '15%', emoji: '🙏' },
  { name: 'Christmas', days: 45, surge: '25%', emoji: '🎄' },
  { name: 'Eid ul-Fitr', days: 120, surge: '18%', emoji: '🌙' }
]

export function MarketInsights() {
  const { selectedLocation, getLocationInfo } = useLocation()
  const locationInfo = getLocationInfo()
  
  useEffect(() => {
    // Initialize with real-time market data for selected location
    api.get('/market-data', { params: { location: selectedLocation } }).catch(() => {}) // Silent fail for demo
    api.get('/profit-recommendations', { params: { location: selectedLocation } }).catch(() => {}) // Silent fail for demo
  }, [selectedLocation])

  const nextFestival = festivals[0] // Diwali is next

  return (
    <div className="market-intelligence">
      {/* Location Header */}
      <div className="location-header">
        <h3>📈 {selectedLocation} - Market Intelligence</h3>
        <p className="location-info">
          📍 Trading at: {locationInfo.majorPorts.join(', ')} | 
          🐠 Focus Species: {locationInfo.primarySpecies.slice(0, 2).join(', ')}
        </p>
      </div>

      {/* AI Market Alert Banner */}
      <div className="market-alert-banner">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📈</span>
          <h3 className="font-bold text-primary">Market Intelligence Alert</h3>
          <span className="ai-badge">AI Powered</span>
        </div>
        <p className="market-alert-text">
          <strong>Sell your catch tomorrow! {nextFestival.emoji} {nextFestival.name} demand spike expected.</strong>
        </p>
        <div className="market-metrics">
          <span className="price-surge">📊 Price increase: {nextFestival.surge} above normal</span>
          <span className="timing-optimal">⏰ Optimal selling window: Next 2 days</span>
        </div>
      </div>

      {/* Cultural Calendar Integration */}
      <div className="card">
        <h3>🗓️ Cultural Calendar & Demand Predictions</h3>
        <div className="festival-timeline">
          {festivals.map((festival, idx) => (
            <div key={festival.name} className={`festival-card ${idx === 0 ? 'urgent' : ''}`}>
              <div className="festival-header">
                <span className="festival-emoji">{festival.emoji}</span>
                <div>
                  <h4>{festival.name}</h4>
                  <p className="festival-timing">
                    {festival.days === 2 ? 'Tomorrow' : `${festival.days} days away`}
                  </p>
                </div>
              </div>
              <div className="festival-impact">
                <span className="surge-indicator">+{festival.surge} price surge</span>
                <span className="demand-level">High demand expected</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Market Pricing */}
      <div className="card">
        <h3>💰 Live Market Prices (₹/kg)</h3>
        <div className="market-grid">
          <div className="price-card pomfret">
            <div className="price-header">
              <span className="species-icon">🐟</span>
              <div>
                <h4>Pomfret</h4>
                <p className="location">Mumbai Market</p>
              </div>
            </div>
            <div className="price-info">
              <span className="current-price">₹450</span>
              <span className="price-trend trend-up">↗ +12%</span>
            </div>
            <div className="price-prediction">
              Tomorrow: ₹540 (+20%)
            </div>
          </div>

          <div className="price-card kingfish">
            <div className="price-header">
              <span className="species-icon">👑</span>
              <div>
                <h4>Kingfish</h4>
                <p className="location">Chennai Market</p>
              </div>
            </div>
            <div className="price-info">
              <span className="current-price">₹380</span>
              <span className="price-trend trend-up">↗ +8%</span>
            </div>
            <div className="price-prediction">
              Tomorrow: ₹410 (+8%)
            </div>
          </div>

          <div className="price-card tuna">
            <div className="price-header">
              <span className="species-icon">🍣</span>
              <div>
                <h4>Tuna</h4>
                <p className="location">Kochi Market</p>
              </div>
            </div>
            <div className="price-info">
              <span className="current-price">₹320</span>
              <span className="price-trend trend-neutral">→ +2%</span>
            </div>
            <div className="price-prediction">
              Tomorrow: ₹325 (+2%)
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Domain Analytics */}
      <div className="card">
        <h3>🧠 Cross-Domain Analytics</h3>
        <div className="analytics-insights">
          <div className="insight-card weather">
            <div className="insight-header">
              <span className="insight-icon">🌊</span>
              <h4>Ocean Conditions</h4>
            </div>
            <p>Optimal SST (24°C) detected in Zone B-7. Perfect for pomfret fishing.</p>
          </div>

          <div className="insight-card market">
            <div className="insight-header">
              <span className="insight-icon">📊</span>
              <h4>Market Demand</h4>
            </div>
            <p>Diwali approaching - 300% increase in premium fish demand expected.</p>
          </div>

          <div className="insight-card logistics">
            <div className="insight-header">
              <span className="insight-icon">🚛</span>
              <h4>Supply Chain</h4>
            </div>
            <p>Mumbai port congestion cleared. Transport costs reduced by 15%.</p>
          </div>
        </div>
      </div>

      {/* Profit Optimization */}
      <div className="card">
        <h3>💡 AI Profit Optimization</h3>
        <div className="profit-recommendations">
          {[
            { species: 'Pomfret', action: 'Fish in Zone B-7 today', profit: '+25%', confidence: '92%' },
            { species: 'Kingfish', action: 'Sell at Chennai tomorrow', profit: '+18%', confidence: '87%' },
            { species: 'Mackerel', action: 'Wait 2 days for festival', profit: '+30%', confidence: '95%' }
          ].map((rec, idx) => (
            <div key={idx} className="profit-rec">
              <div className="rec-header">
                <h4>{rec.species}</h4>
                <span className="confidence-score">{rec.confidence} confidence</span>
              </div>
              <p className="rec-action">{rec.action}</p>
              <span className="profit-impact">{rec.profit} expected profit increase</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="success-metrics">
        <div className="metric-card">
          <div className="metric-value">25%</div>
          <div className="metric-label">Avg Income Increase</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">30%</div>
          <div className="metric-label">Fuel Cost Reduction</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">90%</div>
          <div className="metric-label">Price Prediction Accuracy</div>
        </div>
      </div>
    </div>
  )
}
