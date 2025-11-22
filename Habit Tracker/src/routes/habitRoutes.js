const express = require('express');
const router = express.Router();
const {
    getHabits,
    createHabit,
    markComplete,
    deleteHabit,
} = require('../controllers/habitController');

router.route('/').get(getHabits).post(createHabit);
router.route('/:id/complete').patch(markComplete);
router.route('/:id').delete(deleteHabit);

module.exports = router;
