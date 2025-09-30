import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface LocationContextType {
  selectedLocation: string
  setSelectedLocation: (location: string) => void
  locationCoordinates: { lat: number; lng: number }
  getLocationInfo: () => LocationInfo
}

interface LocationInfo {
  name: string
  emoji: string
  coordinates: { lat: number; lng: number }
  state: string
  majorPorts: string[]
  primarySpecies: string[]
}

const locationData: Record<string, LocationInfo> = {
  'Goa Coast': {
    name: 'Goa Coast',
    emoji: '🏖️',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    state: 'Goa',
    majorPorts: ['Panaji', 'Vasco da Gama', 'Margao'],
    primarySpecies: ['Kingfish', 'Pomfret', 'Mackerel', 'Tuna']
  },
  'Kerala Coast': {
    name: 'Kerala Coast',
    emoji: '🌴',
    coordinates: { lat: 10.8505, lng: 76.2711 },
    state: 'Kerala',
    majorPorts: ['Kochi', 'Kollam', 'Kozhikode'],
    primarySpecies: ['Sardine', 'Tuna', 'Prawn', 'Crab']
  },
  'Tamil Nadu Coast': {
    name: 'Tamil Nadu Coast',
    emoji: '🌊',
    coordinates: { lat: 11.1271, lng: 78.6569 },
    state: 'Tamil Nadu',
    majorPorts: ['Chennai', 'Tuticorin', 'Cuddalore'],
    primarySpecies: ['Anchovy', 'Flying fish', 'Shark', 'Ray']
  },
  'Maharashtra Coast': {
    name: 'Maharashtra Coast',
    emoji: '🏙️',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    state: 'Maharashtra',
    majorPorts: ['Mumbai', 'Nhava Sheva', 'Ratnagiri'],
    primarySpecies: ['Bombay duck', 'Pomfret', 'Mackerel', 'Prawn']
  },
  'Gujarat Coast': {
    name: 'Gujarat Coast',
    emoji: '⛵',
    coordinates: { lat: 22.2587, lng: 71.1924 },
    state: 'Gujarat',
    majorPorts: ['Kandla', 'Okha', 'Veraval'],
    primarySpecies: ['Hilsa', 'Croaker', 'Catfish', 'Shrimp']
  },
  'Andhra Pradesh Coast': {
    name: 'Andhra Pradesh Coast',
    emoji: '🐠',
    coordinates: { lat: 15.9129, lng: 79.7400 },
    state: 'Andhra Pradesh',
    majorPorts: ['Visakhapatnam', 'Kakinada', 'Machilipatnam'],
    primarySpecies: ['Silver pomfret', 'Seer fish', 'Ribbon fish', 'Prawn']
  }
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState('Goa Coast')

  const locationCoordinates = locationData[selectedLocation]?.coordinates || { lat: 15.3, lng: 74.12 }
  
  const getLocationInfo = () => locationData[selectedLocation] || locationData['Goa Coast']

  return (
    <LocationContext.Provider value={{
      selectedLocation,
      setSelectedLocation,
      locationCoordinates,
      getLocationInfo
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}