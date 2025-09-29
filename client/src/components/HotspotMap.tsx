import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'
import api from '../api'

export type Hotspot = {
  _id: string
  latitude: number
  longitude: number
  species: string[]
  sst: number
  chlorophyll: number
  salinity: number
  fish_density_score: number
  optimal_time: string
  last_updated: string
}

function fillByDensity(score: number) {
  if (score >= 80) return '#e11d48' // High - rose
  if (score >= 60) return '#f59e0b' // Medium - amber
  return '#10b981' // Low - emerald
}

export function HotspotMap() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [speciesFilter, setSpecies] = useState<string>('')
  const [minDensity, setMinDensity] = useState<number>(0)

  useEffect(() => {
    const params: any = {}
    if (speciesFilter) params.species = speciesFilter
    if (minDensity) params.minDensity = minDensity
    api.get<Hotspot[]>('/hotspots', { params }).then((r) => setHotspots(r.data))
  }, [speciesFilter, minDensity])

  const speciesSet = useMemo(() => Array.from(new Set(hotspots.flatMap((h) => h.species))).sort(), [hotspots])

  return (
    <div>
      <div className="controls">
        <select value={speciesFilter} onChange={(e) => setSpecies(e.target.value)} style={{ flex: 1 }}>
          <option value="">All species</option>
          {speciesSet.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <input type="number" min={0} max={100} value={minDensity} onChange={(e) => setMinDensity(Number(e.target.value))} placeholder="Min density" style={{ width: 130 }} />
      </div>

      <div style={{ position:'relative' }}>
        <MapContainer center={[15.3, 74.12]} zoom={5} style={{ height: '65vh', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {hotspots.map((h) => (
            <CircleMarker
              key={h._id}
              center={[h.latitude, h.longitude]}
              radius={12}
              pathOptions={{ color: '#1f2937', weight: 2, fillColor: fillByDensity(h.fish_density_score), fillOpacity: 0.9 }}
            >
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <b>{h.species.join(', ')}</b>
                  <div>SST: {h.sst}°C</div>
                  <div>Chl: {h.chlorophyll}</div>
                  <div>Salinity: {h.salinity}</div>
                  <div>Density: {h.fish_density_score}</div>
                  <div>Best: {h.optimal_time}</div>
                  <div>Updated: {new Date(h.last_updated).toLocaleString()}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="legend">
          <div style={{ fontWeight:700, marginBottom:4 }}>Legend</div>
          <div className="legend-row"><span className="dot" style={{ background:'#e11d48' }}></span> High density</div>
          <div className="legend-row"><span className="dot" style={{ background:'#f59e0b' }}></span> Medium</div>
          <div className="legend-row"><span className="dot" style={{ background:'#10b981' }}></span> Low</div>
        </div>
      </div>
    </div>
  )
}
