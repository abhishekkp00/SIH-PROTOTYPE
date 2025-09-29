const CulturalEvent = require('../models/CulturalEvent');

async function getCulturalEvents(req, res) {
  const data = await CulturalEvent.find().lean();
  res.json(data);
}

module.exports = { getCulturalEvents };