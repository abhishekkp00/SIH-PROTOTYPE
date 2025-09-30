import { useEffect, useRef, useState } from 'react'

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

interface CustomMapProps {
  hotspots: Hotspot[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (hotspot: Hotspot) => void
}

export function OceanMap({ 
  hotspots, 
  center: _center = { lat: 19.0760, lng: 72.8777 }, 
  zoom: _zoom = 6,
  onMarkerClick 
}: CustomMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null)

  // Convert lat/lng to canvas coordinates using proper mercator projection
  const latLngToCanvas = (lat: number, lng: number, canvasWidth: number, canvasHeight: number) => {
    // Real India bounds
    const minLat = 6, maxLat = 37
    const minLng = 68, maxLng = 97
    
    // Mercator projection
    const latRad = (lat * Math.PI) / 180
    const minLatRad = (minLat * Math.PI) / 180
    const maxLatRad = (maxLat * Math.PI) / 180
    
    const x = ((lng - minLng) / (maxLng - minLng)) * canvasWidth
    const y = ((Math.log(Math.tan(Math.PI/4 + maxLatRad/2)) - Math.log(Math.tan(Math.PI/4 + latRad/2))) / 
               (Math.log(Math.tan(Math.PI/4 + maxLatRad/2)) - Math.log(Math.tan(Math.PI/4 + minLatRad/2)))) * canvasHeight
    
    return { x, y }
  }

  // Draw the ocean map
  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw realistic ocean background with depth variations
    const oceanGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height))
    oceanGradient.addColorStop(0, '#2563EB')    // Deep blue center
    oceanGradient.addColorStop(0.3, '#1E40AF')  // Deeper blue
    oceanGradient.addColorStop(0.6, '#1E3A8A')  // Even deeper
    oceanGradient.addColorStop(1, '#0F172A')    // Very deep at edges
    
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, width, height)
    
    // Add shallow water areas near coastlines
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.beginPath()
    ctx.arc(width * 0.3, height * 0.6, 80, 0, Math.PI * 2) // Arabian Sea shallow
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(width * 0.8, height * 0.7, 60, 0, Math.PI * 2) // Bay of Bengal shallow
    ctx.fill()

    // Draw accurate India map with detailed coastline
    ctx.fillStyle = '#2D5016'
    ctx.strokeStyle = '#1a2e0a'
    ctx.lineWidth = 1.5
    
    // Main India outline with accurate coordinates
    const indiaOutline = [
      [68.1, 23.7], [69.3, 22.8], [70.1, 22.5], [70.8, 22.7], [71.0, 23.0], // Gujarat coast
      [72.8, 19.0], [73.0, 18.5], [73.3, 17.7], [74.2, 15.3], [75.0, 14.5], // Maharashtra-Karnataka coast
      [75.8, 13.0], [76.2, 11.2], [77.0, 10.7], [77.5, 9.9], [77.8, 8.1],   // Karnataka-Kerala coast
      [78.1, 8.9], [79.8, 9.0], [80.2, 10.3], [81.0, 11.5], [82.5, 13.0],   // Tamil Nadu coast
      [83.3, 17.7], [84.7, 19.3], [86.9, 21.5], [88.0, 22.1], [89.7, 22.0], // East coast
      [92.0, 23.8], [94.6, 25.3], [95.1, 27.1], [97.4, 28.2],               // Northeast
      [88.1, 27.2], [85.8, 28.2], [84.3, 27.2], [82.3, 28.8], [80.1, 30.2], // North
      [78.4, 32.5], [76.8, 34.7], [75.8, 34.2], [74.4, 34.1], [73.4, 34.4], // Kashmir
      [71.7, 34.3], [70.2, 33.8], [69.4, 33.1], [68.8, 31.6], [68.1, 29.8], // West border
      [68.1, 23.7] // Close the path
    ]
    
    ctx.beginPath()
    indiaOutline.forEach((point, index) => {
      const { x, y } = latLngToCanvas(point[1], point[0], width, height)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Draw major islands
    // Andaman Islands
    const andaman = [[92.7, 11.7], [92.8, 12.8], [93.0, 13.2], [92.9, 12.0], [92.7, 11.7]]
    ctx.beginPath()
    andaman.forEach((point, index) => {
      const { x, y } = latLngToCanvas(point[1], point[0], width, height)
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    
    // Lakshadweep Islands (small dots)
    const lakshadweep = [[72.2, 10.5], [72.6, 11.2], [73.0, 11.8]]
    lakshadweep.forEach(point => {
      const { x, y } = latLngToCanvas(point[1], point[0], width, height)
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    })
    
    // Draw major rivers (simplified)
    ctx.strokeStyle = '#4A90E2'
    ctx.lineWidth = 2
    
    // Ganges
    const ganges = [[77.5, 29.9], [78.2, 29.0], [79.9, 26.8], [82.5, 25.3], [85.1, 25.2], [88.1, 22.6]]
    ctx.beginPath()
    ganges.forEach((point, index) => {
      const { x, y } = latLngToCanvas(point[1], point[0], width, height)
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
    // Brahmaputra
    const brahmaputra = [[95.0, 27.5], [92.9, 26.7], [91.7, 26.2], [90.7, 25.9], [89.7, 25.5]]
    ctx.beginPath()
    brahmaputra.forEach((point, index) => {
      const { x, y } = latLngToCanvas(point[1], point[0], width, height)
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
    // Add major cities
    const cities = [
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
      { name: 'Kochi', lat: 9.9312, lng: 76.2673 }
    ]
    
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    ctx.font = 'bold 10px Arial'
    ctx.textAlign = 'left'
    
    cities.forEach(city => {
      const { x, y } = latLngToCanvas(city.lat, city.lng, width, height)
      
      // City dot
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      // City name
      ctx.fillStyle = '#FFFFFF'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeText(city.name, x + 6, y - 6)
      ctx.fillText(city.name, x + 6, y - 6)
    })

    // Draw coordinate grid with labels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 0.5
    ctx.font = '9px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.textAlign = 'center'
    
    // Longitude lines (every 5 degrees)
    for (let lng = 70; lng <= 95; lng += 5) {
      const { x } = latLngToCanvas(20, lng, width, height)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
      
      // Label
      ctx.fillText(`${lng}°E`, x, height - 5)
    }
    
    // Latitude lines (every 5 degrees)
    for (let lat = 10; lat <= 35; lat += 5) {
      const { y } = latLngToCanvas(lat, 80, width, height)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
      
      // Label
      ctx.textAlign = 'left'
      ctx.fillText(`${lat}°N`, 5, y - 5)
    }

    // Draw hotspots
    hotspots.forEach((hotspot) => {
      const { x, y } = latLngToCanvas(hotspot.latitude, hotspot.longitude, width, height)
      
      // Skip if coordinates are outside canvas
      if (x < 0 || x > width || y < 0 || y > height) return

      const isHovered = hoveredHotspot?._id === hotspot._id
      const isSelected = selectedHotspot?._id === hotspot._id
      
      // Hotspot size based on density score
      const baseSize = 8
      const size = baseSize + (hotspot.fish_density_score / 100) * 12
      
      // Hotspot color based on density score
      let color = '#10B981' // Green for high density
      if (hotspot.fish_density_score < 50) color = '#F59E0B' // Yellow for medium
      if (hotspot.fish_density_score < 30) color = '#EF4444' // Red for low
      
      // Draw outer glow effect
      const glowSize = isHovered ? size + 8 : size + 4
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize)
      glowGradient.addColorStop(0, color + '80')
      glowGradient.addColorStop(1, color + '00')
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(x, y, glowSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw main hotspot
      ctx.fillStyle = color
      ctx.strokeStyle = isSelected ? '#FFFFFF' : color
      ctx.lineWidth = isSelected ? 3 : 1
      
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      // Draw pulsing effect for high-value hotspots
      if (hotspot.fish_density_score > 80) {
        const pulseSize = size + Math.sin(Date.now() / 300) * 4
        ctx.strokeStyle = color + '60'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      // Draw species indicator
      if (isHovered || isSelected) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${hotspot.species.length} species`, x, y - size - 10)
      }
    })

    // Draw professional compass rose
    const compassX = width - 60
    const compassY = 60
    const compassRadius = 30
    
    // Outer ring
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.strokeStyle = '#2D3748'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Inner ring
    ctx.strokeStyle = '#4A5568'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(compassX, compassY, compassRadius - 5, 0, Math.PI * 2)
    ctx.stroke()
    
    // Cardinal directions
    const directions = [
      { angle: 0, label: 'N', color: '#EF4444' },
      { angle: Math.PI/2, label: 'E', color: '#333' },
      { angle: Math.PI, label: 'S', color: '#333' },
      { angle: -Math.PI/2, label: 'W', color: '#333' }
    ]
    
    directions.forEach(dir => {
      const x = compassX + Math.sin(dir.angle) * (compassRadius - 15)
      const y = compassY - Math.cos(dir.angle) * (compassRadius - 15)
      
      ctx.fillStyle = dir.color
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(dir.label, x, y + 4)
      
      // Direction lines
      ctx.strokeStyle = dir.color === '#EF4444' ? '#EF4444' : '#666'
      ctx.lineWidth = dir.color === '#EF4444' ? 3 : 1
      ctx.beginPath()
      ctx.moveTo(compassX + Math.sin(dir.angle) * 10, compassY - Math.cos(dir.angle) * 10)
      ctx.lineTo(compassX + Math.sin(dir.angle) * (compassRadius - 20), compassY - Math.cos(dir.angle) * (compassRadius - 20))
      ctx.stroke()
    })
    
    // Center dot
    ctx.fillStyle = '#2D3748'
    ctx.beginPath()
    ctx.arc(compassX, compassY, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // Check if mouse is over any hotspot
    let foundHotspot: Hotspot | null = null
    
    hotspots.forEach((hotspot) => {
      const { x, y } = latLngToCanvas(hotspot.latitude, hotspot.longitude, canvas.width, canvas.height)
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2)
      const size = 8 + (hotspot.fish_density_score / 100) * 12
      
      if (distance <= size + 5) {
        foundHotspot = hotspot
      }
    })

    setHoveredHotspot(foundHotspot)
    canvas.style.cursor = foundHotspot ? 'pointer' : 'default'
  }

  const handleClick = (_event: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredHotspot) {
      setSelectedHotspot(hoveredHotspot)
      onMarkerClick?.(hoveredHotspot)
    } else {
      setSelectedHotspot(null)
    }
  }

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawMap()
      requestAnimationFrame(animate)
    }
    animate()
  }, [hotspots, hoveredHotspot, selectedHotspot])

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 400
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      />
      
      {/* Live indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.95)',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#059669',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: '#059669',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        LIVE ({hotspots.length} hotspots)
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255,255,255,0.95)',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Fish Density</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
          <span>High (70-100)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
          <span>Medium (30-70)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
          <span>Low (&lt;30)</span>
        </div>
      </div>

      {/* Hotspot info panel */}
      {selectedHotspot && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(255,255,255,0.98)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          minWidth: '200px',
          maxWidth: '250px'
        }}>
          <button
            onClick={() => setSelectedHotspot(null)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
          
          <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>
            🐟 {selectedHotspot.species.join(', ')}
          </h4>
          
          <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Density Score:</strong> {selectedHotspot.fish_density_score}/100
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Location:</strong> {selectedHotspot.latitude.toFixed(4)}, {selectedHotspot.longitude.toFixed(4)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Best Time:</strong> {selectedHotspot.optimal_time}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Temperature:</strong> {selectedHotspot.sst}°C
            </div>
            <div>
              <strong>Updated:</strong> {new Date(selectedHotspot.last_updated).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}