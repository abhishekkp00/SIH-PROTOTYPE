import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { 
    translation: { 
      title: 'SeaLens', 
      subtitle: 'AI-Driven Fisheries Intelligence Platform',
      hotspots: 'AI Hotspots', 
      market: 'Market Intel', 
      alerts: 'Safety Alerts',
      dashboard: 'Dashboard',
      welcome: 'Transforming Indian Fisheries with AI',
      tagline: '16M livelihoods • ₹35,000 Cr GDP impact',
      fishingOptimal: 'Optimal Fishing Conditions',
      profitIncrease: 'Expected Profit Increase',
      safetyFirst: 'Weather & Safety Alerts',
      marketDemand: 'Festival Demand Predictions'
    } 
  },
  hi: { 
    translation: { 
      title: 'सीलेंस', 
      subtitle: 'एआई-संचालित मत्स्य बुद्धिमत्ता प्लेटफॉर्म',
      hotspots: 'एआई हॉटस्पॉट', 
      market: 'बाज़ार बुद्धि', 
      alerts: 'सुरक्षा अलर्ट',
      dashboard: 'डैशबोर्ड',
      welcome: 'एआई के साथ भारतीय मत्स्य पालन का रूपांतरण',
      tagline: '1.6 करोड़ आजीविका • ₹35,000 करोड़ जीडीपी प्रभाव',
      fishingOptimal: 'इष्टतम मछली पकड़ने की स्थिति',
      profitIncrease: 'अपेक्षित लाभ वृद्धि',
      safetyFirst: 'मौसम और सुरक्षा अलर्ट',
      marketDemand: 'त्योहारी मांग पूर्वानुमान'
    } 
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n