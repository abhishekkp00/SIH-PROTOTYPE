const { Schema, model } = require('mongoose');

const HotspotSchema = new Schema(
  {
    latitude: Number,
    longitude: Number,
    species: [String],
    sst: Number,
    chlorophyll: Number,
    salinity: Number,
    fish_density_score: Number,
    optimal_time: String,
    last_updated: String
  },
  { timestamps: true }
);

module.exports = model('Hotspot', HotspotSchema);