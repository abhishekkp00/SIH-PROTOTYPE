const Hotspot = require('../models/Hotspot');
const MarketData = require('../models/MarketData');
const CulturalEvent = require('../models/CulturalEvent');
const path = require('path');
const { runPython } = require('../lib/python');

function pctStringToFloat(s) {
  if (!s) return 0;
  const n = parseFloat(String(s).replace('%',''));
  return isNaN(n) ? 0 : n / 100;
}

async function getProfitRecommendations(req, res) {
  // Fetch data
  const [hotspots, markets, events] = await Promise.all([
    Hotspot.find().lean(),
    MarketData.find().lean(),
    CulturalEvent.find().lean()
  ]);

  const now = new Date();
  // Rank combos
  const combos = [];
  for (const h of hotspots) {
    for (const m of markets.filter(x => h.species.includes(x.species))) {
      const event = events.find(e => m.festival_impact && e.event === m.festival_impact.upcoming_festival);
      const daysUntil = m?.festival_impact?.days_until ?? 10;
      const trend = pctStringToFloat(m.price_trend);

      // Use Python scoring (with fallback)
      let marketScore = 0;
      try {
        const pyOut = await runPython(path.resolve(__dirname, '../../ai_bridge/market_timing.py'), {
          current_price: m.current_price,
          festival_days: daysUntil,
          demand_trend: trend
        });
        marketScore = pyOut.score || 0;
      } catch (e) {
        marketScore = daysUntil <= 7 ? (7 - daysUntil) * 5 : 0;
        if (trend > 0.1) marketScore += 20;
      }

      const catchProbability = Math.min(1, (h.fish_density_score || 0) / 100);
      const avgVolume = 50; // kg, placeholder
      const predictedPrice = m.current_price * (1 + trend) * (event ? event.fish_demand_multiplier : 1);
      const expectedProfit = predictedPrice * catchProbability * avgVolume + marketScore;

      combos.push({
        species: m.species,
        location: m.location,
        hotspot: { lat: h.latitude, lng: h.longitude },
        expected_profit: Math.round(expectedProfit),
        details: {
          current_price: m.current_price,
          price_trend: m.price_trend,
          density: h.fish_density_score,
          festival: m.festival_impact?.upcoming_festival || null
        }
      });
    }
  }

  combos.sort((a, b) => b.expected_profit - a.expected_profit);
  res.json(combos.slice(0, 3));
}

module.exports = { getProfitRecommendations };