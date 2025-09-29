import { useEffect, useMemo, useState } from 'react'
import api from '../api'
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
import dayjs from 'dayjs'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type Market = {
  _id: string
  location: string
  species: string
  current_price: number
  price_trend: string
  demand_level: string
  festival_impact?: { upcoming_festival: string; days_until: number; expected_price_surge: string }
  best_selling_time?: string
}

type ProfitRec = {
  species: string
  location: string
  expected_profit: number
  hotspot: { lat: number; lng: number }
}

export function MarketInsights() {
  const [market, setMarket] = useState<Market[]>([])
  const [top, setTop] = useState<ProfitRec[]>([])

  useEffect(() => {
    api.get<Market[]>('/market-data').then((r) => setMarket(r.data))
    api.get<ProfitRec[]>('/profit-recommendations').then((r) => setTop(r.data))
  }, [])

  const labels = useMemo(() => Array.from({ length: 7 }).map((_, i) => dayjs().subtract(6 - i, 'day').format('DD MMM')), [])
  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Avg Price (₹/kg) est.',
        data: labels.map((_, i) => {
          // Simulate trend using current market avg
          const avg = market.length ? market.reduce((a, b) => a + b.current_price, 0) / market.length : 300
          return Math.round(avg * (0.95 + i * 0.01))
        }),
        tension: 0.3,
        borderColor: '#0a3d62',
      },
    ],
  }), [labels, market])

  return (
    <div className="section">
      <section className="card" style={{ marginBottom: 12 }}>
        <h3>Top Profit Opportunities</h3>
        {top.map((t) => (
          <div key={`${t.species}-${t.location}`} className="card" style={{ marginBottom: 8, padding: 10 }}>
            <b>{t.species}</b> @ {t.location}
            <div style={{ color: 'var(--primary-dk)' }}>Expected Profit: ₹{t.expected_profit}</div>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>Price Trends</h3>
        <div style={{ height: 220 }}>
          <Line data={data} options={{ maintainAspectRatio: false }} height={220} />
        </div>
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h3>Festival Alerts</h3>
        {market.filter(m => m.festival_impact).map((m) => (
          <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: '#fff7e6', borderRadius: 8, marginBottom: 6 }}>
            <span><b>{m.festival_impact!.upcoming_festival}</b> in {m.festival_impact!.days_until} days</span>
            <span style={{ color:'var(--warning)' }}>Surge {m.festival_impact!.expected_price_surge}</span>
          </div>
        ))}
      </section>

      <section className="card" style={{ marginTop: 12 }}>
        <h3>Optimal Sell Window</h3>
        {market.slice(0,3).map((m) => (
          <div key={m._id} className="card" style={{ borderStyle:'dashed', marginBottom: 6 }}>
            <b>{m.species}</b> at {m.location}: {m.best_selling_time || '2-3 days before festival'}
          </div>
        ))}
      </section>
    </div>
  )
}
