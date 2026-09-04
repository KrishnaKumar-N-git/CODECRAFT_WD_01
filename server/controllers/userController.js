const User = require('../models/User');

// ── GET /api/users ── (admin only) ────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/admin/stats ── (admin only) ──────────────────────────────────────
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const normalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Most recent 5 registrations
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        normalUsers,
        activeUsers,
      },
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getAdminStats };
