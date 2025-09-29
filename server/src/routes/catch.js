const router = require('express').Router();
const { submitCatchReport } = require('../controllers/catch');

router.post('/', submitCatchReport);

module.exports = router;