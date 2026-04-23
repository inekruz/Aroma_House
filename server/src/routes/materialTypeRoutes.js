const express = require('express');
const router = express.Router();
const { getAllMaterialTypes } = require('../controllers/materialTypeController');

router.get('/', getAllMaterialTypes);

module.exports = router;