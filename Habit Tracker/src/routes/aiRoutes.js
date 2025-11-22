const express = require('express');
const router = express.Router();
const { getSuggestions } = require('../controllers/aiController');

router.post('/', getSuggestions);

module.exports = router;
