import api from './api';

/**
 * Auth service — thin wrappers around the backend auth API.
 */

export const authService = {
  /** Register a new user account */
  register: (data) => api.post('/auth/register', data),

  /** Login and receive JWT */
  login: (data) => api.post('/auth/login', data),

  /** Fetch currently authenticated user */
  getMe: () => api.get('/auth/me'),

  /** Get all users (admin only) */
  getAllUsers: () => api.get('/users'),

  /** Get admin dashboard statistics */
  getAdminStats: () => api.get('/admin/stats'),
};
