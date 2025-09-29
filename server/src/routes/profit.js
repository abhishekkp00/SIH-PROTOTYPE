const router = require('express').Router();
const { getProfitRecommendations } = require('../controllers/profit');

router.get('/', getProfitRecommendations);

module.exports = router;