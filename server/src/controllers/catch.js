const CatchReport = require('../models/CatchReport');

async function submitCatchReport(req, res) {
  const report = new CatchReport(req.body);
  await report.save();
  res.status(201).json({ ok: true, id: report._id });
}

module.exports = { submitCatchReport };