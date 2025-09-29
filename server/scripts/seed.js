/* eslint-disable */
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Hotspot = require('../src/models/Hotspot');
const MarketData = require('../src/models/MarketData');
const CulturalEvent = require('../src/models/CulturalEvent');
const Alert = require('../src/models/Alert');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sealens';

async function run() {
  await mongoose.connect(MONGODB_URI);

  const now = new Date().toISOString();

  const fishHotspots = [
    { id: 1, latitude: 15.2993, longitude: 74.1240, species: ["Pomfret", "Mackerel", "Sardine"], sst: 28.5, chlorophyll: 0.8, salinity: 35.2, fish_density_score: 85, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 2, latitude: 11.9416, longitude: 79.8083, species: ["Tuna", "Kingfish", "Snapper"], sst: 29.1, chlorophyll: 0.6, salinity: 35.8, fish_density_score: 92, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 3, latitude: 19.0760, longitude: 72.8777, species: ["Pomfret", "Prawns"], sst: 27.9, chlorophyll: 0.7, salinity: 35.3, fish_density_score: 78, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 4, latitude: 13.0827, longitude: 80.2707, species: ["Tuna", "Sardine"], sst: 29.3, chlorophyll: 0.5, salinity: 35.7, fish_density_score: 74, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 5, latitude: 22.5726, longitude: 88.3639, species: ["Hilsa", "Rohu"], sst: 26.8, chlorophyll: 0.9, salinity: 34.9, fish_density_score: 88, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 6, latitude: 21.1458, longitude: 79.0882, species: ["Catfish", "Carp"], sst: 27.1, chlorophyll: 0.6, salinity: 35.1, fish_density_score: 60, optimal_time: "Evening (5-7 PM)", last_updated: now },
    { id: 7, latitude: 9.9312, longitude: 76.2673, species: ["Mackerel", "Sardine"], sst: 28.7, chlorophyll: 0.7, salinity: 35.0, fish_density_score: 82, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 8, latitude: 8.5241, longitude: 76.9366, species: ["Tuna", "Snapper"], sst: 29.5, chlorophyll: 0.6, salinity: 35.6, fish_density_score: 76, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 9, latitude: 18.5204, longitude: 73.8567, species: ["Pomfret", "Prawns"], sst: 27.5, chlorophyll: 0.8, salinity: 35.4, fish_density_score: 81, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 10, latitude: 12.9716, longitude: 77.5946, species: ["Kingfish", "Mackerel"], sst: 28.9, chlorophyll: 0.6, salinity: 35.7, fish_density_score: 69, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 11, latitude: 16.5062, longitude: 80.6480, species: ["Sardine", "Anchovy"], sst: 28.2, chlorophyll: 0.7, salinity: 35.2, fish_density_score: 73, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 12, latitude: 20.2961, longitude: 85.8245, species: ["Pomfret", "Crab"], sst: 27.2, chlorophyll: 0.8, salinity: 35.1, fish_density_score: 80, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 13, latitude: 17.6868, longitude: 83.2185, species: ["Tuna", "Mackerel"], sst: 29.0, chlorophyll: 0.5, salinity: 35.9, fish_density_score: 77, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 14, latitude: 10.8505, longitude: 76.2711, species: ["Sardine", "Anchovy"], sst: 28.4, chlorophyll: 0.7, salinity: 35.0, fish_density_score: 79, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 15, latitude: 21.1702, longitude: 72.8311, species: ["Pomfret", "Prawns"], sst: 27.8, chlorophyll: 0.6, salinity: 35.3, fish_density_score: 83, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 16, latitude: 22.3072, longitude: 73.1812, species: ["Rohu", "Katla"], sst: 26.9, chlorophyll: 0.8, salinity: 34.8, fish_density_score: 70, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 17, latitude: 9.2876, longitude: 79.3129, species: ["Tuna", "Snapper"], sst: 29.2, chlorophyll: 0.6, salinity: 35.8, fish_density_score: 75, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 18, latitude: 15.4909, longitude: 73.8278, species: ["Pomfret", "Mackerel"], sst: 28.6, chlorophyll: 0.7, salinity: 35.2, fish_density_score: 86, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 19, latitude: 23.0225, longitude: 72.5714, species: ["Pomfret", "Crab"], sst: 27.0, chlorophyll: 0.7, salinity: 35.0, fish_density_score: 72, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 20, latitude: 19.9975, longitude: 73.7898, species: ["Sardine", "Anchovy"], sst: 27.6, chlorophyll: 0.8, salinity: 35.1, fish_density_score: 71, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 21, latitude: 18.5203, longitude: 73.8567, species: ["Kingfish", "Mackerel"], sst: 28.1, chlorophyll: 0.6, salinity: 35.6, fish_density_score: 74, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 22, latitude: 12.9141, longitude: 74.8560, species: ["Pomfret", "Prawns"], sst: 28.3, chlorophyll: 0.7, salinity: 35.3, fish_density_score: 84, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 23, latitude: 20.5937, longitude: 78.9629, species: ["Rohu", "Katla"], sst: 26.7, chlorophyll: 0.85, salinity: 34.7, fish_density_score: 68, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 24, latitude: 16.4330, longitude: 81.6956, species: ["Anchovy", "Sardine"], sst: 28.0, chlorophyll: 0.75, salinity: 35.2, fish_density_score: 79, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 25, latitude: 9.9391, longitude: 78.1217, species: ["Tuna", "Mackerel"], sst: 29.4, chlorophyll: 0.55, salinity: 35.7, fish_density_score: 73, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 26, latitude: 21.2787, longitude: 69.3451, species: ["Pomfret", "Crab"], sst: 27.4, chlorophyll: 0.82, salinity: 35.0, fish_density_score: 87, optimal_time: "Morning (6-9 AM)", last_updated: now },
    { id: 27, latitude: 22.5726, longitude: 88.3639, species: ["Hilsa"], sst: 26.5, chlorophyll: 0.95, salinity: 34.6, fish_density_score: 90, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 28, latitude: 13.3409, longitude: 74.7421, species: ["Kingfish", "Snapper"], sst: 28.8, chlorophyll: 0.6, salinity: 35.5, fish_density_score: 78, optimal_time: "Dawn (4-7 AM)", last_updated: now },
    { id: 29, latitude: 10.0889, longitude: 77.0595, species: ["Mackerel", "Sardine"], sst: 28.1, chlorophyll: 0.7, salinity: 35.2, fish_density_score: 80, optimal_time: "Early morning (5-8 AM)", last_updated: now },
    { id: 30, latitude: 19.2183, longitude: 72.9781, species: ["Pomfret", "Prawns"], sst: 27.7, chlorophyll: 0.72, salinity: 35.3, fish_density_score: 82, optimal_time: "Morning (6-9 AM)", last_updated: now }
  ];

  const marketData = [
    { location: "Mumbai Fish Market", species: "Pomfret", current_price: 450, price_trend: "+15%", demand_level: "High", festival_impact: { upcoming_festival: "Diwali", days_until: 5, expected_price_surge: "+25%" }, best_selling_time: "2-3 days before festival" },
    { location: "Chennai Fish Market", species: "Tuna", current_price: 320, price_trend: "+8%", demand_level: "Medium", festival_impact: { upcoming_festival: "Deepavali", days_until: 5, expected_price_surge: "+20%" } },
    { location: "Kochi Fish Market", species: "Mackerel", current_price: 200, price_trend: "+12%", demand_level: "High", festival_impact: { upcoming_festival: "Onam", days_until: 20, expected_price_surge: "+18%" } },
    { location: "Kolkata Fish Market", species: "Hilsa", current_price: 700, price_trend: "+10%", demand_level: "High", festival_impact: { upcoming_festival: "Durga Puja", days_until: 16, expected_price_surge: "+30%" } },
    { location: "Vishakhapatnam Fish Market", species: "Snapper", current_price: 350, price_trend: "+6%", demand_level: "Medium", festival_impact: { upcoming_festival: "Dussehra", days_until: 10, expected_price_surge: "+15%" } },
    { location: "Puducherry Market", species: "Kingfish", current_price: 380, price_trend: "+7%", demand_level: "Medium", festival_impact: { upcoming_festival: "Deepavali", days_until: 5, expected_price_surge: "+20%" } }
  ];

  const culturalEvents = [
    { event: "Diwali", date: "2025-11-01", region: "Western India", fish_demand_multiplier: 1.25, preferred_species: ["Pomfret", "Prawns", "Crab"] },
    { event: "Durga Puja", date: "2025-10-15", region: "Eastern India", fish_demand_multiplier: 1.30, preferred_species: ["Hilsa", "Rohu", "Katla"] },
    { event: "Onam", date: "2025-08-25", region: "Kerala", fish_demand_multiplier: 1.20, preferred_species: ["Mackerel", "Sardine", "Prawns"] },
    { event: "Eid", date: "2025-04-01", region: "Pan India", fish_demand_multiplier: 1.15, preferred_species: ["Pomfret", "Snapper", "Kingfish"] },
    { event: "Christmas", date: "2025-12-25", region: "Western & Southern India", fish_demand_multiplier: 1.18, preferred_species: ["Prawns", "Crab", "Snapper"] }
  ];

  await Promise.all([
    Hotspot.deleteMany({}),
    MarketData.deleteMany({}),
    CulturalEvent.deleteMany({}),
    Alert.deleteMany({})
  ]);

  await Hotspot.insertMany(fishHotspots.map(({ id, ...rest }) => rest));
  await MarketData.insertMany(marketData);
  await CulturalEvent.insertMany(culturalEvents);
  await Alert.insertMany([{ type: 'Regulatory', message: 'Seasonal ban in Zone 3 lifted', severity: 'Info', active: true }]);

  console.log('Database seeded.');
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });