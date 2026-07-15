const express = require('express');
const router = express.Router();
const {
  listDepartments, createDepartment, updateDepartment, deleteDepartment,
} = require('../controllers/departmentController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', listDepartments); // public: staff registration form needs this too
router.post('/', requireAuth, requireRole('super_admin', 'manager'), createDepartment);
router.put('/:id', requireAuth, requireRole('super_admin', 'manager'), updateDepartment);
router.delete('/:id', requireAuth, requireRole('super_admin'), deleteDepartment);

module.exports = router;
