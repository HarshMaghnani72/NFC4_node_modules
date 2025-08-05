const express = require('express');
const router = express.Router();
const { updateSchedule, getSchedule, syncGoogleCalendar } = require('../handlers/schedule.handlers');

router.get('/', getSchedule);
router.put('/', updateSchedule);
router.post('/google-sync', syncGoogleCalendar);

module.exports = router;