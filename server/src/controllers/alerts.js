const Alert = require('../models/Alert');

async function getActiveAlerts(req, res) {
  const data = await Alert.find({ active: true }).sort({ createdAt: -1 }).lean();
  res.json(data);
}

module.exports = { getActiveAlerts };