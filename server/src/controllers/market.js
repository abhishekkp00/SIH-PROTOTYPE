const MarketData = require('../models/MarketData');

async function getMarketData(req, res) {
  const data = await MarketData.find().lean();
  res.json(data);
}

module.exports = { getMarketData };