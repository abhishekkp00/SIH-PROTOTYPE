const router = require('express').Router();
const { getActiveAlerts } = require('../controllers/alerts');

router.get('/', getActiveAlerts);

module.exports = router;