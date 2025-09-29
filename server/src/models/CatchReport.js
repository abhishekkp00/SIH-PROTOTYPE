const { Schema, model } = require('mongoose');

const CatchReportSchema = new Schema(
  {
    fisher_id: String,
    location: String,
    species: String,
    volume_kg: Number,
    time: String
  },
  { timestamps: true }
);

module.exports = model('CatchReport', CatchReportSchema);