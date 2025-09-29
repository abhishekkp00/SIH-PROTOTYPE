import { useEffect, useMemo, useState } from 'react'
import api from '../api'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type Hotspot = {
  _id: string
  latitude: number
  longitude: number
  fish_density_score: number
}

type Market = { _id: string; current_price: number }

export function GovDashboard() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [market, setMarket] = useState<Market[]>([])

  useEffect(() => {
    api.get<Hotspot[]>('/hotspots').then((r) => setHotspots(r.data))
    api.get<Market[]>('/market-data').then((r) => setMarket(r.data))
  }, [])

  const stats = useMemo(() => {
    const activeFishers = hotspots.length * 12
    const totalCatch = hotspots.length * 50 // kg est
    const marketValue = market.reduce((a, b) => a + b.current_price * 100, 0)
    return { activeFishers, totalCatch, marketValue }
  }, [hotspots, market])

  const labels = Array.from({ length: 12 }).map((_, i) => `M${i+1}`)
  const densityData = {
    labels,
    datasets: [
      {
        label: 'Catch Trends (est. index) ',
        data: labels.map((_, i) => 50 + (i * 5) + (hotspots.length % 10)),
        borderColor: '#0a3d62',
      },
    ],
  }

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ marginTop: 0 }}>Government Dashboard</h2>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div style={{ background: '#f2f7fb', padding: 10, borderRadius: 8 }}>
          <div>Active Fishers</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.activeFishers}</div>
        </div>
        <div style={{ background: '#f2f7fb', padding: 10, borderRadius: 8 }}>
          <div>Total Catch (kg)</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalCatch}</div>
        </div>
        <div style={{ background: '#f2f7fb', padding: 10, borderRadius: 8 }}>
          <div>Market Value (₹)</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(stats.marketValue)}</div>
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <MapContainer center={[15.3, 74.12]} zoom={5} style={{ height: '40vh', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {hotspots.map((h) => (
            <CircleMarker key={h._id} center={[h.latitude, h.longitude]} radius={8} pathOptions={{ color: '#0a3d62' }} />
          ))}
        </MapContainer>
      </section>

      <section style={{ marginTop: 12 }}>
        <Line data={densityData} height={200} options={{ maintainAspectRatio: false }} />
      </section>
    </div>
  )
}