const { Schema, model } = require('mongoose');

const MarketDataSchema = new Schema(
  {
    location: String,
    species: String,
    current_price: Number,
    price_trend: String,
    demand_level: String,
    festival_impact: {
      upcoming_festival: String,
      days_until: Number,
      expected_price_surge: String
    },
    best_selling_time: String
  },
  { timestamps: true }
);

module.exports = model('MarketData', MarketDataSchema);