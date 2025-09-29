const router = require('express').Router();
const { getHotspots, getHotspotsBySpecies } = require('../controllers/hotspots');

router.get('/', getHotspots);
router.get('/:species', getHotspotsBySpecies);

module.exports = router;