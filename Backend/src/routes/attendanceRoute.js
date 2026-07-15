

// const express = require('express');
// const router = express.Router();
// const { scan, listAttendance, getStats, getDashboard, getMyAttendance, exportReport } = require('../controllers/attendanceController');
// const { requireAuth } = require('../middleware/auth');

// router.post('/scan', scan);

// router.get('/me', requireAuth, getMyAttendance);

// router.get('/', requireAuth, listAttendance);
// router.get('/stats', requireAuth, getStats);
// router.get('/dashboard', requireAuth, getDashboard);
// router.get('/export', requireAuth, exportReport);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  scan, listAttendance, getStats, getDashboard, getMyAttendance, getMyTodayEvents, exportReport,
} = require('../controllers/attendanceController');
const { requireAuth } = require('../middleware/auth');

router.post('/scan', scan);

// Staff app — before '/me' isn't strictly needed since Express matches exact
// paths first, but keeping specific routes above general ones is good habit.
router.get('/me/today', requireAuth, getMyTodayEvents);
router.get('/me', requireAuth, getMyAttendance);

router.get('/', requireAuth, listAttendance);
router.get('/stats', requireAuth, getStats);
router.get('/dashboard', requireAuth, getDashboard);
router.get('/export', requireAuth, exportReport);

module.exports = router;
