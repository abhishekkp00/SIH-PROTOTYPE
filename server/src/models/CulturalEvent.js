const { Schema, model } = require('mongoose');

const CulturalEventSchema = new Schema(
  {
    event: String,
    date: String,
    region: String,
    fish_demand_multiplier: Number,
    preferred_species: [String]
  },
  { timestamps: true }
);

module.exports = model('CulturalEvent', CulturalEventSchema);