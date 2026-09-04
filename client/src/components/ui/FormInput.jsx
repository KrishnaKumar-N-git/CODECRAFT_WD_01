import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable form input with optional icon, error display, and password toggle.
 */
const FormInput = forwardRef(
  (
    {
      id,
      label,
      type = 'text',
      icon: Icon,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Left icon */}
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
          )}

          <input
            id={id}
            ref={ref}
            type={inputType}
            className={`form-input ${Icon ? 'pl-10' : ''} ${
              isPassword ? 'pr-12' : ''
            } ${error ? 'error' : ''} ${className}`}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            {...props}
          />

          {/* Password visibility toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-red-400 flex items-center gap-1 mt-1"
          >
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
