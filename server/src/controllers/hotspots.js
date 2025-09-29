const Hotspot = require('../models/Hotspot');
const { runPython } = require('../lib/python');
const path = require('path');

async function getHotspots(req, res) {
  const { species, minDensity } = req.query;
  let q = {};
  if (species) q.species = species;
  if (minDensity) q.fish_density_score = { $gte: Number(minDensity) };
  const hotspots = await Hotspot.find(q).lean();
  res.json(hotspots);
}

async function getHotspotsBySpecies(req, res) {
  const species = req.params.species;
  const hotspots = await Hotspot.find({ species }).lean();
  res.json(hotspots);
}

module.exports = { getHotspots, getHotspotsBySpecies };