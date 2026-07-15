const express = require('express');
const router = express.Router();
const {
  listAdmins, approveAdmin, denyAdmin, revokeAdmin, updateOwnProfile,
} = require('../controllers/adminUserController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, requireRole('super_admin'), listAdmins);
router.post('/:id/approve', requireAuth, requireRole('super_admin'), approveAdmin);
router.post('/:id/deny', requireAuth, requireRole('super_admin'), denyAdmin);
router.delete('/:id', requireAuth, requireRole('super_admin'), revokeAdmin);
router.put('/me', requireAuth, updateOwnProfile);

module.exports = router;

// Then in index.js, add these two lines:
//
//   const adminUserRoutes = require('./routes/adminUsers');
//   app.use('/api/admin-users', adminUserRoutes);
