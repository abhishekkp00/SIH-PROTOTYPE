const router = require('express').Router();
const { getMarketData } = require('../controllers/market');

router.get('/', getMarketData);

module.exports = router;