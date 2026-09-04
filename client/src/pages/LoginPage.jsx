import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // ── Client-side validation ────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = 'Please enter a valid email.';
    if (!formData.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(formData);
    if (result.success) {
      toast.success('Welcome back! 👋');
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-600/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to your SecureAuth account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {serverError && (
            <Alert
              type="error"
              message={serverError}
              onDismiss={() => setServerError('')}
            />
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-4">
            <FormInput
              id="login-email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
              autoFocus
            />

            <FormInput
              id="login-password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <Button
              id="login-submit-btn"
              type="submit"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 glass-card p-4">
          <p className="text-xs text-slate-500 text-center font-medium mb-2">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="bg-slate-800/60 rounded-lg p-2.5">
              <p className="font-semibold text-slate-300 mb-1">User</p>
              <p>user@demo.com</p>
              <p>User@12345</p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5">
              <p className="font-semibold text-amber-400 mb-1">Admin</p>
              <p>admin@demo.com</p>
              <p>Admin@12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
