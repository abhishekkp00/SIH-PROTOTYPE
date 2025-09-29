const router = require('express').Router();
const { getCulturalEvents } = require('../controllers/cultural');

router.get('/', getCulturalEvents);

module.exports = router;