import { useTranslation } from 'react-i18next'
import { useLocation } from '../contexts/LocationContext'

export function Header() {
  const { i18n, t } = useTranslation()
  const { selectedLocation, setSelectedLocation } = useLocation()

  const handleLocationChange = (newLocation: string) => {
    setSelectedLocation(newLocation)
    console.log(`🌊 Location changed to: ${newLocation}`)
  }

  return (
    <header className="header">
      <div className="flex items-center gap-4 flex-1">
        <div>
          <h1 className="brand">{t('title')}</h1>
          <p className="brand-subtitle">{t('subtitle')}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <select 
          aria-label="Select fishing region" 
          value={selectedLocation} 
          onChange={(e) => handleLocationChange(e.target.value)} 
          className="select location-selector"
          title="Choose your fishing region"
        >
          <option value="Goa Coast">🏖️ Goa Coast</option>
          <option value="Kerala Coast">🌴 Kerala Coast</option>
          <option value="Tamil Nadu Coast">🌊 Tamil Nadu Coast</option>
          <option value="Maharashtra Coast">🏙️ Maharashtra Coast</option>
          <option value="Gujarat Coast">⛵ Gujarat Coast</option>
          <option value="Andhra Pradesh Coast">🐠 Andhra Pradesh Coast</option>
        </select>
        
        <button 
          className="btn"
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
          title={`Switch to ${i18n.language === 'en' ? 'Hindi' : 'English'}`}
          aria-label={`Change language to ${i18n.language === 'en' ? 'Hindi' : 'English'}`}
        >
          <span className="font-semibold">
            {i18n.language === 'en' ? 'हिं' : 'EN'}
          </span>
        </button>
      </div>
    </header>
  )
}