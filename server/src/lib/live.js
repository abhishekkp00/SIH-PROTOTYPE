const Hotspot = require('../models/Hotspot');
const MarketData = require('../models/MarketData');
const Alert = require('../models/Alert');

function randomDelta(val, delta) {
  const d = (Math.random() * 2 - 1) * delta;
  return Math.max(0, val + d);
}

async function emitLiveUpdates(io) {
  try {
    const hotspot = await Hotspot.findOne().sort({ updatedAt: -1 });
    const market = await MarketData.findOne().sort({ updatedAt: -1 });

    if (hotspot) {
      const update = {
        id: hotspot._id,
        fish_density_score: Math.min(100, Math.round(randomDelta(hotspot.fish_density_score, 3))),
        last_updated: new Date().toISOString()
      };
      io.emit('hotspot:update', update);
    }

    if (market) {
      const update = {
        id: market._id,
        current_price: Math.round(randomDelta(market.current_price, 10)),
        price_trend: `${Math.round(randomDelta(parseFloat(market.price_trend || '0'), 1))}%`,
        ts: new Date().toISOString()
      };
      io.emit('market:update', update);
    }

    // Occasionally send an alert
    if (Math.random() < 0.2) {
      const alert = new Alert({
        type: 'Weather',
        message: 'High winds expected along the coast in next 6 hours',
        severity: 'Medium',
        active: true
      });
      await alert.save();
      io.emit('alert:new', alert);
    }
  } catch (e) {
    console.warn('Live updates error', e.message);
  }
}

module.exports = { emitLiveUpdates };