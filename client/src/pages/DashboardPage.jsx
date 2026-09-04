import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Activity,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/ui/Alert';

// Stat card component
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [forbiddenMsg, setForbiddenMsg] = useState('');

  // Show forbidden alert if redirected from admin route
  useEffect(() => {
    if (location.state?.forbidden) {
      setForbiddenMsg('Access denied. You do not have admin privileges.');
      // Clear the location state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Forbidden access alert */}
        {forbiddenMsg && (
          <div className="mb-6">
            <Alert
              type="error"
              message={forbiddenMsg}
              onDismiss={() => setForbiddenMsg('')}
            />
          </div>
        )}

        {/* Welcome banner */}
        <div className="glass-card p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Here&apos;s your account overview
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={User}
            label="Account Status"
            value="Active"
            color="bg-emerald-600"
          />
          <StatCard
            icon={Shield}
            label="Role"
            value={user?.role === 'admin' ? 'Administrator' : 'Standard User'}
            color={user?.role === 'admin' ? 'bg-amber-600' : 'bg-brand-600'}
          />
          <StatCard
            icon={Calendar}
            label="Member Since"
            value={user?.createdAt ? formatDate(user.createdAt) : '—'}
            color="bg-purple-600"
          />
          <StatCard
            icon={Activity}
            label="Session"
            value="Active"
            color="bg-teal-600"
          />
        </div>

        {/* Profile details */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            Profile Information
          </h2>

          <div className="space-y-4">
            <InfoRow icon={User} label="Full Name" value={user?.name} />
            <InfoRow icon={Mail} label="Email Address" value={user?.email} />
            <InfoRow
              icon={Shield}
              label="Role"
              value={user?.role}
              badge={user?.role === 'admin' ? 'badge-admin' : 'badge-user'}
            />
            <InfoRow
              icon={Calendar}
              label="Account Created"
              value={user?.createdAt ? formatDate(user.createdAt) : '—'}
            />
            <InfoRow icon={Lock} label="Password" value="••••••••" />
          </div>
        </div>

        {/* Security tips */}
        <div className="glass-card p-6 mt-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Security Checklist
          </h2>
          <ul className="space-y-2">
            {[
              'Your password is securely hashed with bcrypt',
              'JWT token expires automatically after 7 days',
              'All API routes are protected by authentication middleware',
              'HTTPS should be enabled in production',
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 text-sm text-slate-400"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, badge }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
    <div className="flex items-center gap-2.5 text-slate-400 text-sm">
      <Icon className="w-4 h-4 text-slate-500" />
      <span>{label}</span>
    </div>
    {badge ? (
      <span className={badge}>{value}</span>
    ) : (
      <span className="text-slate-200 text-sm font-medium">{value}</span>
    )}
  </div>
);

export default DashboardPage;
