const express = require('express');
const router = express.Router();
const militaryController = require('../controllers/militaryController');
const auth = require('../middleware/auth');


router.post('/create', auth, militaryController.createMilitary);
router.get('/list', auth, militaryController.getMilitaries);

module.exports = router;
