import { Workbox } from 'workbox-window'

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js', { scope: '/' })
  wb.addEventListener('activated', (e) => {
    if (!e.isUpdate) console.log('PWA ready to work offline')
  })
  wb.register()
}