import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Shield,
  Activity,
  UserCheck,
  Calendar,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/ui/Alert';

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// ── User row ──────────────────────────────────────────────────────────────────
const UserRow = ({ user }) => {
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-200">{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-400 hidden sm:table-cell">
        {user.email}
      </td>
      <td className="px-4 py-3.5">
        <span
          className={
            user.role === 'admin' ? 'badge-admin' : 'badge-user'
          }
        >
          {user.role === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
      </td>
      <td className="px-4 py-3.5 hidden md:table-cell">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            user.isActive
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-500 hidden lg:table-cell">
        {joinDate}
      </td>
    </tr>
  );
};

// ── Admin Page ────────────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        authService.getAdminStats(),
        authService.getAllUsers(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load admin data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" />
              Admin Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Logged in as{' '}
              <span className="text-amber-400 font-medium">{currentUser?.name}</span>
            </p>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="btn-secondary flex items-center gap-2 text-sm"
            id="admin-refresh-btn"
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.totalUsers}
                  color="bg-brand-600"
                />
                <StatCard
                  icon={Shield}
                  label="Admins"
                  value={stats.adminUsers}
                  color="bg-amber-600"
                />
                <StatCard
                  icon={UserCheck}
                  label="Regular Users"
                  value={stats.normalUsers}
                  color="bg-purple-600"
                />
                <StatCard
                  icon={Activity}
                  label="Active"
                  value={stats.activeUsers}
                  color="bg-emerald-600"
                />
              </div>
            )}

            {/* Recent signups */}
            {stats?.recentUsers?.length > 0 && (
              <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-400" />
                  Recent Registrations
                </h2>
                <div className="space-y-3">
                  {stats.recentUsers.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between py-2 border-b border-slate-700/40 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <span className={u.role === 'admin' ? 'badge-admin' : 'badge-user'}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users table */}
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-400" />
                  All Users
                  <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                    {users.length}
                  </span>
                </h2>
              </div>

              {users.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-700/50">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                          Email
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                          Status
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <UserRow key={u._id} user={u} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
