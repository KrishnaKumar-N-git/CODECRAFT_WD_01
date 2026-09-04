const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: protect routes — requires a valid Bearer JWT.
 * Attaches `req.user` (without password) for downstream handlers.
 */
const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized. No token provided.' });
  }

  try {
    // Verify signature and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data (catches deleted/disabled accounts)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User belonging to this token no longer exists.' });
    }

    if (!user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: 'Your account has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Token has expired. Please log in again.' });
    }
    return res
      .status(401)
      .json({ success: false, message: 'Invalid token. Please log in again.' });
  }
};

module.exports = { protect };
