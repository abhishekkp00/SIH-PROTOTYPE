import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { i18n, t } = useTranslation()
  const [location, setLocation] = useState('Goa Coast')

  return (
    <header className="header">
      <h1 className="brand">{t('title')}</h1>
      <select aria-label="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="select" style={{ marginLeft: 'auto' }}>
        <option>Goa Coast</option>
        <option>Chennai Coast</option>
        <option>Mumbai Coast</option>
      </select>
      <button className="btn" onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}>
        {i18n.language === 'en' ? 'हिं' : 'EN'}
      </button>
    </header>
  )
}
