const express = require('express');
const { getAllUsers, getAdminStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes below require authentication + admin role
router.use(protect);
router.use(requireRole('admin'));

// GET /api/users  — list all users
router.get('/', getAllUsers);

// GET /api/admin/stats  — dashboard statistics
router.get('/stats', getAdminStats);

module.exports = router;
