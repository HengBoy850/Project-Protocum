// const express = require('express');
// const router = express.Router();
// const { login, createInvite, acceptInvite } = require('../controllers/authController');
// const { requireAuth, requireRole } = require('../middleware/auth');

// router.post('/login', login);
// router.post('/accept-invite', acceptInvite);
// router.post('/invite', requireAuth, requireRole('super_admin'), createInvite);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register); // public, gated by ADMIN_SIGNUP_CODE inside the controller

module.exports = router;
