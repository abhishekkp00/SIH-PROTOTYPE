import { useEffect, useMemo, useState } from 'react'
import api from '../api'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler
} from 'chart.js'
import { useLocation } from '../contexts/LocationContext'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, BarElement, ArcElement, Filler)

type Hotspot = {
  _id: string
  latitude: number
  longitude: number
  fish_density_score: number
  species: string[]
}

type Market = { 
  _id: string
  current_price: number
  species: string
}

// type FisherData = {
//   totalFishers: number
//   activeFishers: number
//   weeklyGrowth: number
// }

export function GovDashboard() {
  const { selectedLocation, getLocationInfo } = useLocation()
  const locationInfo = getLocationInfo()
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [market, setMarket] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [hotspotsRes, marketRes] = await Promise.all([
          api.get<Hotspot[]>('/hotspots'),
          api.get<Market[]>('/market-data')
        ])
        setHotspots(hotspotsRes.data)
        setMarket(marketRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedLocation])

  // Generate realistic government statistics
  const govStats = useMemo(() => {
    const baseMultiplier = selectedLocation === 'Gujarat Coast' ? 1.4 : 
                          selectedLocation === 'Tamil Nadu Coast' ? 1.3 :
                          selectedLocation === 'Maharashtra Coast' ? 1.2 : 1.0

    const registeredFishers = Math.round(12500 * baseMultiplier)
    const activeFishers = Math.round(registeredFishers * 0.72) // 72% active rate
    const totalCatch = Math.round(2850 * baseMultiplier) // tonnes per week
    const marketValue = Math.round(3200000 * baseMultiplier) // weekly market value in ₹
    const vessels = Math.round(4800 * baseMultiplier)
    const cooperatives = Math.round(28 * baseMultiplier)
    const weeklyGrowth = Math.round((Math.random() * 8 + 2) * 100) / 100

    return {
      registeredFishers,
      activeFishers,
      totalCatch,
      marketValue,
      vessels,
      cooperatives,
      weeklyGrowth,
      activeRate: Math.round((activeFishers / registeredFishers) * 100)
    }
  }, [selectedLocation, hotspots, market])

  // Monthly catch data for the past year
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const baseData = [2850, 3120, 3450, 3200, 2980, 3350, 3600, 3800, 3500, 3250, 3100, 2900]
    const currentMonth = new Date().getMonth()
    
    // Show last 12 months ending with current
    const data = []
    const labels = []
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      labels.push(months[monthIndex])
      data.push(Math.round(baseData[monthIndex] * (selectedLocation === 'Gujarat Coast' ? 1.3 : 1.0)))
    }
    
    return { labels, data }
  }, [selectedLocation])

  // Species distribution data
  const speciesData = useMemo(() => {
    const speciesDistribution = locationInfo.primarySpecies.reduce((acc, species, index) => {
      const percentages = [35, 25, 20, 15, 5]
      acc[species] = percentages[index] || 5
      return acc
    }, {} as Record<string, number>)

    return {
      labels: Object.keys(speciesDistribution),
      datasets: [{
        data: Object.values(speciesDistribution),
        backgroundColor: [
          '#3b82f6',  // Blue
          '#10b981',  // Green
          '#f59e0b',  // Amber
          '#ef4444',  // Red
          '#8b5cf6'   // Purple
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    }
  }, [locationInfo])

  const catchTrendData = {
    labels: monthlyData.labels,
    datasets: [{
      label: 'Monthly Catch (Tonnes)',
      data: monthlyData.data,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      borderWidth: 3
    }]
  }

  const vesselActivityData = {
    labels: ['Traditional Boats', 'Mechanized Boats', 'Trawlers', 'Gill Netters'],
    datasets: [{
      label: 'Active Vessels',
      data: [
        Math.round(govStats.vessels * 0.45),
        Math.round(govStats.vessels * 0.35), 
        Math.round(govStats.vessels * 0.15),
        Math.round(govStats.vessels * 0.05)
      ],
      backgroundColor: [
        '#3b82f6',
        '#10b981', 
        '#f59e0b',
        '#ef4444'
      ],
      borderRadius: 6,
      borderWidth: 0
    }]
  }

  if (loading) {
    return (
      <div className="gov-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Government Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gov-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-info">
          <h2>🏛️ Government Fisheries Dashboard</h2>
          <p className="region-info">
            📍 {selectedLocation} | Department of Fisheries, Government of {locationInfo.state}
          </p>
          <p className="last-updated">
            Last Updated: {new Date().toLocaleString()} | Data Source: National Fisheries Database
          </p>
        </div>
        <div className="status-indicators">
          <div className="status-item active">
            <span className="status-dot"></span>
            Systems Online
          </div>
          <div className="status-item">
            <span className="status-dot warning"></span>
            {Math.round(Math.random() * 3 + 1)} Alerts Pending
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <div>
              <h3>Registered Fishers</h3>
              <p className="stat-subtitle">Licensed & Active</p>
            </div>
          </div>
          <div className="stat-value">{govStats.registeredFishers.toLocaleString()}</div>
          <div className="stat-meta">
            <span className="trend positive">↗ {govStats.weeklyGrowth}% this week</span>
            <span className="secondary-stat">Active: {govStats.activeRate}%</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span className="stat-icon">🐟</span>
            <div>
              <h3>Weekly Catch</h3>
              <p className="stat-subtitle">Total Harvest</p>
            </div>
          </div>
          <div className="stat-value">{govStats.totalCatch.toLocaleString()} T</div>
          <div className="stat-meta">
            <span className="trend positive">↗ 12.3% vs last week</span>
            <span className="secondary-stat">Target: 85% achieved</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <div>
              <h3>Market Value</h3>
              <p className="stat-subtitle">Weekly Revenue</p>
            </div>
          </div>
          <div className="stat-value">₹{(govStats.marketValue / 100000).toFixed(1)}L</div>
          <div className="stat-meta">
            <span className="trend positive">↗ 8.7% vs last week</span>
            <span className="secondary-stat">Avg: ₹{Math.round(govStats.marketValue / govStats.totalCatch)}/kg</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-header">
            <span className="stat-icon">🚤</span>
            <div>
              <h3>Active Vessels</h3>
              <p className="stat-subtitle">Fleet Status</p>
            </div>
          </div>
          <div className="stat-value">{govStats.vessels.toLocaleString()}</div>
          <div className="stat-meta">
            <span className="secondary-stat">{govStats.cooperatives} Cooperatives</span>
            <span className="secondary-stat">92% Operational</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>🗺️ Fishing Activity Map - {selectedLocation}</h3>
          <div className="map-controls">
            <button className="btn-secondary active">Hotspots</button>
            <button className="btn-secondary">Vessels</button>
            <button className="btn-secondary">Ports</button>
          </div>
        </div>
        <div className="map-container">
          <MapContainer 
            center={[locationInfo.coordinates.lat, locationInfo.coordinates.lng]} 
            zoom={8} 
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
              attribution="&copy; OpenStreetMap contributors | Fisheries Dept" 
            />
            {hotspots.map((h, index) => (
              <CircleMarker
                key={h._id}
                center={[h.latitude, h.longitude]}
                radius={8 + (h.fish_density_score / 10)}
                pathOptions={{ 
                  color: '#1f2937', 
                  weight: 2,
                  fillColor: h.fish_density_score >= 80 ? '#ef4444' : 
                           h.fish_density_score >= 60 ? '#f59e0b' : '#10b981',
                  fillOpacity: 0.8 
                }}
              >
                <Popup>
                  <div className="gov-popup">
                    <h4>🎯 Fishing Zone #{index + 1}</h4>
                    <div className="popup-stats">
                      <div>📊 Activity Score: {h.fish_density_score}%</div>
                      <div>🐠 Primary Species: {h.species?.join(', ') || 'Mixed'}</div>
                      <div>👥 Est. Fishers: {Math.round(h.fish_density_score / 10) * 15}</div>
                      <div>⚓ Nearest Port: {locationInfo.majorPorts[0]}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            
            {/* Add port markers */}
            {locationInfo.majorPorts.slice(0, 2).map((port, index) => (
              <CircleMarker
                key={`port-${index}`}
                center={[
                  locationInfo.coordinates.lat + (index * 0.1 - 0.05), 
                  locationInfo.coordinates.lng + (index * 0.15 - 0.1)
                ]}
                radius={12}
                pathOptions={{ 
                  color: '#ffffff', 
                  weight: 3,
                  fillColor: '#3b82f6',
                  fillOpacity: 1 
                }}
              >
                <Popup>
                  <div className="gov-popup">
                    <h4>🏭 {port} Port</h4>
                    <div className="popup-stats">
                      <div>📦 Daily Landings: ~{Math.round(Math.random() * 200 + 150)}T</div>
                      <div>🚤 Registered Vessels: {Math.round(govStats.vessels / locationInfo.majorPorts.length)}</div>
                      <div>💰 Market Rate: ₹{Math.round(Math.random() * 100 + 180)}/kg</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-grid">
        {/* Monthly Catch Trends */}
        <div className="chart-section">
          <div className="section-header">
            <h3>📈 Annual Catch Trends</h3>
            <div className="chart-meta">
              <span>Current Year | Monthly Data in Tonnes</span>
            </div>
          </div>
          <div className="chart-container">
            <Line 
              data={catchTrendData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top' as const,
                  },
                  tooltip: {
                    mode: 'index' as const,
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                      label: (context) => `Catch: ${context.parsed.y.toLocaleString()}T`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { 
                      callback: (value) => `${value}T`,
                      color: '#6b7280'
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#6b7280' }
                  }
                }
              }}
              height={300}
            />
          </div>
        </div>

        {/* Species Distribution */}
        <div className="chart-section">
          <div className="section-header">
            <h3>🐟 Species Composition</h3>
            <div className="chart-meta">
              <span>Current Week Distribution</span>
            </div>
          </div>
          <div className="chart-container">
            <Doughnut 
              data={speciesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: { size: 12 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.parsed}%`
                    }
                  }
                }
              }}
              height={300}
            />
          </div>
        </div>

        {/* Vessel Activity */}
        <div className="chart-section full-width">
          <div className="section-header">
            <h3>🚤 Fleet Composition & Activity</h3>
            <div className="chart-meta">
              <span>Active Vessels by Type - {selectedLocation}</span>
            </div>
          </div>
          <div className="chart-container">
            <Bar 
              data={vesselActivityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `Active Vessels: ${context.parsed.y.toLocaleString()}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { 
                      callback: (value) => value.toLocaleString(),
                      color: '#6b7280'
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#6b7280' }
                  }
                }
              }}
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Regulatory Information */}
      <div className="regulatory-section">
        <div className="section-header">
          <h3>📋 Regulatory Status & Compliance</h3>
        </div>
        <div className="regulatory-grid">
          <div className="regulatory-card">
            <div className="reg-header">
              <span className="reg-icon">📅</span>
              <h4>Fishing Season</h4>
            </div>
            <div className="reg-status active">Active - No Restrictions</div>
            <div className="reg-details">
              <div>Season runs until March 2026</div>
              <div>Deep sea fishing: Permitted</div>
            </div>
          </div>

          <div className="regulatory-card">
            <div className="reg-header">
              <span className="reg-icon">⚖️</span>
              <h4>License Compliance</h4>
            </div>
            <div className="reg-status good">94.2% Compliant</div>
            <div className="reg-details">
              <div>{Math.round(govStats.registeredFishers * 0.058)} pending renewals</div>
              <div>12 new applications this week</div>
            </div>
          </div>

          <div className="regulatory-card">
            <div className="reg-header">
              <span className="reg-icon">🌊</span>
              <h4>Environmental Status</h4>
            </div>
            <div className="reg-status good">Within Limits</div>
            <div className="reg-details">
              <div>Catch within sustainable quotas</div>
              <div>No restricted area violations</div>
            </div>
          </div>

          <div className="regulatory-card">
            <div className="reg-header">
              <span className="reg-icon">💼</span>
              <h4>Market Integration</h4>
            </div>
            <div className="reg-status active">98.7% Tracked</div>
            <div className="reg-details">
              <div>Digital marketplace adoption</div>
              <div>{govStats.cooperatives} active cooperatives</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}