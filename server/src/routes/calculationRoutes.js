const express = require('express');
const router = express.Router();
const { calculateProductsFromRaw } = require('../controllers/calculationController');

router.post('/production-count', calculateProductsFromRaw);

module.exports = router;