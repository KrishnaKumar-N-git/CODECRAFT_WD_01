import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import toast from 'react-hot-toast';

// Password strength helper
const getPasswordStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
  if (score === 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
  if (score === 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' };
  if (score === 4) return { label: 'Strong', color: 'bg-emerald-500', width: '80%' };
  return { label: 'Very Strong', color: 'bg-emerald-400', width: '100%' };
};

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const strength = formData.password ? getPasswordStrength(formData.password) : null;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';

    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Enter a valid email address.';

    if (!formData.password) errs.password = 'Password is required.';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(formData.password)) errs.password = 'Must contain at least one uppercase letter.';
    else if (!/[a-z]/.test(formData.password)) errs.password = 'Must contain at least one lowercase letter.';
    else if (!/\d/.test(formData.password)) errs.password = 'Must contain at least one number.';

    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (formData.confirmPassword !== formData.password)
      errs.confirmPassword = 'Passwords do not match.';

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const result = await register(formData);
    if (result.success) {
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-600/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-slate-400">Join SecureAuth in seconds</p>
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

          <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-4">
            <FormInput
              id="register-name"
              name="name"
              type="text"
              label="Full name"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
              autoFocus
            />

            <FormInput
              id="register-email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <div className="space-y-2">
              <FormInput
                id="register-password"
                name="password"
                type="password"
                label="Password"
                placeholder="Min. 8 characters"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />
              {/* Password strength bar */}
              {strength && (
                <div className="space-y-1">
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength:{' '}
                    <span className="font-medium text-slate-300">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            <FormInput
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="Repeat your password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              id="register-submit-btn"
              type="submit"
              isLoading={isLoading}
              className="mt-2"
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
