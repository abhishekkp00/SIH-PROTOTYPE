const router = require('express').Router();

router.use('/hotspots', require('./hotspots'));
router.use('/market-data', require('./market'));
router.use('/profit-recommendations', require('./profit'));
router.use('/cultural-calendar', require('./cultural'));
router.use('/alerts', require('./alerts'));
router.use('/catch-report', require('./catch'));

module.exports = router;