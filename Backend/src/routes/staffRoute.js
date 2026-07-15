


// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/upload');
// const { requireAuth, requireRole } = require('../middleware/auth');
// const {
//   register, listStaff, approveStaff, denyStaff,
//   updateStaff, deactivateStaff, getStaffQr, staffLogin,
//   getMyProfile, getMyQr,
// } = require('../controllers/staffController');

// // Public — staff app
// router.post('/register', upload.single('photo'), register);
// router.post('/login', staffLogin);

// // Staff app, self-service only — put these BEFORE the admin '/:id' routes
// // so '/me' is never accidentally matched as an :id param.
// router.get('/me', requireAuth, getMyProfile);
// router.get('/me/qr', requireAuth, getMyQr);

// // Admin / POS only
// router.get('/', requireAuth, listStaff);
// router.post('/:id/approve', requireAuth, requireRole('super_admin', 'manager', 'hr'), approveStaff);
// router.post('/:id/deny', requireAuth, requireRole('super_admin', 'manager', 'hr'), denyStaff);
// router.put('/:id', requireAuth, requireRole('super_admin', 'manager', 'hr'), updateStaff);
// router.delete('/:id', requireAuth, requireRole('super_admin', 'manager'), deactivateStaff);
// router.get('/:id/qr', requireAuth, requireRole('super_admin', 'manager', 'hr'), getStaffQr);

// module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  register, listStaff, approveStaff, denyStaff,
  updateStaff, deactivateStaff, getStaffQr, staffLogin,
  getMyProfile, getMyQr, updateMyProfile,
} = require('../controllers/staffController');

router.post('/register', upload.single('photo'), register);
router.post('/login', staffLogin);

// Staff app, self-service only
router.get('/me', requireAuth, getMyProfile);
router.get('/me/qr', requireAuth, getMyQr);
router.put('/me', requireAuth, updateMyProfile);

// Admin / POS only
router.get('/', requireAuth, listStaff);
router.post('/:id/approve', requireAuth, requireRole('super_admin', 'manager', 'hr'), approveStaff);
router.post('/:id/deny', requireAuth, requireRole('super_admin', 'manager', 'hr'), denyStaff);
router.put('/:id', requireAuth, requireRole('super_admin', 'manager', 'hr'), updateStaff);
router.delete('/:id', requireAuth, requireRole('super_admin', 'manager'), deactivateStaff);
router.get('/:id/qr', requireAuth, requireRole('super_admin', 'manager', 'hr'), getStaffQr);

module.exports = router;