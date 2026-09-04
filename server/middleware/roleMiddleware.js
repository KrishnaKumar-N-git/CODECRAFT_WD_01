/**
 * Role-based access control middleware factory.
 * Usage: router.get('/admin', protect, requireRole('admin'), handler)
 *
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'user')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
